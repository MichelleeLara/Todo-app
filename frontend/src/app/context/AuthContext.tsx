"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import API from "@/app/api/api";
import { useRouter } from "next/navigation";


interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    register: (data: User) => Promise<{ success: boolean; message: string }>;
    login: (data: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // 🔹 Cargar usuario y token desde localStorage al inicio
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
    
        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch (error) {
                console.error("Error al parsear datos de usuario:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);
    

    const register = async (formData: User) => {
        try {
            const { data } = await API.post("/auth/register", formData);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            return { success: true, message: "Cuenta creada exitosamente." };
        } catch (error: unknown) {  // ✅ Reemplazar `any` por `unknown`
            if (error instanceof Error) { // 🔹 Verificar que es una instancia de Error
                return {
                    success: false,
                    message: (error as any).response?.data?.message || "Error desconocido al registrar el usuario.",
                };
            }
            return { success: false, message: "Ocurrió un error inesperado." };
        }
    };
    

    const login = async (formData: { email: string; password: string }) => {
        try {
            const { data } = await API.post("/auth/login", formData);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setToken(data.token);
            router.push("/dashboard"); // 🔹 Redirigir a página protegida tras login
            return { success: true, message: "Inicio de sesión exitoso." };
        } catch (error: unknown) { // ✅ Reemplazar `any` por `unknown`
            if (error instanceof Error) { // 🔹 Verificar que es una instancia de Error
                return {
                    success: false,
                    message: (error as any).response?.data?.message || "Credenciales incorrectas.",
                };
            }
            return { success: false, message: "Ocurrió un error inesperado." };
        }
    };
    
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        router.push("/"); // 🔹 Redirigir al login tras cerrar sesión
    };

    return <AuthContext.Provider value={{ user, token, register, login, logout }}>{children}</AuthContext.Provider>;
};
