"use client";
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "@/app/context/AuthContext";


const authSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
  name: yup.string().when('$isRegister', {
    is: true,
    then: (schema) => schema.required("El nombre es obligatorio"),
    otherwise: (schema) => schema
  }),
  isRegister: yup.boolean()
});

export default function AuthPage() {
  const { register: registerUser, login, user } = useContext(AuthContext)!;
  const [isLogin, setIsLogin] = useState(true);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [manualInput, setManualInput] = useState(user ? false : true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(authSchema),
  });

  // 🔹 Precargar email si el usuario ya está registrado
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const onSubmit = async (data: any) => {
    setServerMessage(null);
    const response = isLogin ? await login(data) : await registerUser(data);
    setServerMessage(response.message);
    setIsError(!response.success);
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="text-center mx-6 w-full max-w-[410px] flex flex-col gap-3">
        {/* 🔹 Header */}
        <h1 className="text-3xl font-medium">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
        <p className="text-[#9c9c9c] text-sm mb-3 mt-1">
          {isLogin ? "Ingresa tu correo y contraseña" : "Crea tu cuenta con tus datos"}
        </p>

        {/* 🔹 Selector con animación */}
        <div className="relative flex bg-[#1a1a1a] rounded-xl p-[3px] text-sm w-full">
          {["Iniciar Sesión", "Registrarse"].map((label, index) => {
            const active = isLogin === (index === 0);
            return (
              <button
                key={label}
                onClick={() => setIsLogin(index === 0)}
                className="relative w-2/4 py-4 text-center text-white font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute inset-0 z-10 bg-[#0a0a0a] rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-20">{label}</span>
              </button>
            );
          })}
        </div>

        {/* 🔹 Contenedor de Formularios */}
        <div className="relative h-96">
          <AnimatePresence mode="wait">
            {!isLogin ? (
              <RegisterForm
                key="register"
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                errors={errors}
                serverMessage={serverMessage}
                isError={isError}
                isSubmitting={isSubmitting}
              />
            ) : (
              <LoginForm
                key="login"
                register={register}
                errors={errors}
                manualInput={manualInput}
                setManualInput={setManualInput}
                email={email}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                serverMessage={serverMessage}
                isError={isError}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// 📌 Componente para el formulario de Registro
function RegisterForm({
  handleSubmit,
  onSubmit,
  register,
  errors,
  serverMessage,
  isError,
  isSubmitting,
}: any) {
  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 mt-10 absolute w-full pb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField label="Nombre" type="text" name="name" register={register} error={errors.name} />
      <InputField label="Email" type="email" name="email" register={register} error={errors.email} />
      <InputField label="Contraseña" type="password" name="password" register={register} error={errors.password} />

      {serverMessage && <MessageBox message={serverMessage} isError={isError} />}
      <button className="bg-white font-medium text-black py-3 rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "Registrando..." : "Continuar"}
      </button>
    </motion.form>
  );
}

// 📌 Componente para el formulario de Login
function LoginForm({
  register,
  errors,
  manualInput,
  setManualInput,
  email,
  showPassword,
  setShowPassword,
  handleSubmit,
  onSubmit,
  isSubmitting,
  serverMessage,
  isError,
}: any) {
  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 mt-10 absolute w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {!manualInput ? (
        <>
        
          <div className="flex w-full border-2 border-[#1a1a1a] py-3 rounded-xl justify-around items-center px-6 gap-2">
            <input type="text" value={email} readOnly className="bg-transparent text-white outline-none cursor-default" />
          </div>
          <button type="button" onClick={() => setShowPassword(true)} className="bg-white font-medium text-black px-4 py-2 rounded-xl">
            Continuar
          </button>
          <p className="text-xs text-[#9c9c9c] text-center underline cursor-pointer" onClick={() => setManualInput(true)}>
            Agregar información manual.sasas
          </p>
        </>
      ) : (
        <>
          <InputField label="Correo" type="email" name="email" register={register} error={errors.email} />
          <InputField label="Contraseña" type="password" name="password" register={register} error={errors.password} />
        </>
      )}
      {serverMessage && <MessageBox message={serverMessage} isError={isError} />}
      <button type="submit" className="bg-white font-medium text-black py-3 rounded-xl" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </motion.form>
  );
}

// 📌 Componente para Inputs
function InputField({ label, type, name, register, error }: any) {
  return (
    <div className="flex flex-col items-start gap-2">
      <label className="text-sm font-medium">{label}</label>
      <input type={type} {...register(name)} className="py-3 w-full px-4 rounded-xl bg-[#1a1a1a] text-white outline-none" />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}

// 📌 Componente para mensajes de error o éxito
function MessageBox({ message, isError }: any) {
  return <p className={`text-sm text-center ${isError ? "text-red-500" : "text-green-500"}`}>{message}</p>;
}
