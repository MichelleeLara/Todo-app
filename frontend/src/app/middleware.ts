import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // 🔹 Extraer el token desde cookies correctamente
    const token = req.cookies.get("token")?.value; 

    // 🔹 Redirigir al login si no hay token y se intenta acceder al dashboard
    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth", req.url));
    }

    return NextResponse.next();
}

// 🔹 Configurar el middleware para que proteja las rutas dentro de /dashboard
export const config = {
    matcher: ["/dashboard/:path*"],
};
