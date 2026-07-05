import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../hooks/useRegister";
import { type RegisterInput, registerSchema } from "../../types/auth";
import { Link } from "react-router";
import logo from "../../../../assets/logo_black.webp";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAsync } from "../../../../hooks/useAsync";

export const FormRegister = () => {
  const { loading, error, registerUser } = useRegister();
  const [showPassword, setShowPassword] = useState(false)
  const { clearError } = useAsync()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
    clearError()
  };

  return (
    <div className="relative z-10 flex min-h-dvh items-center justify-center px-10 py-10">
      <div className="w-md  rounded-[28px] p-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <img
            loading="lazy"
            src={logo}
            alt="Logo Inmobiliaria"
            className="absolute top-0 h-60 w-auto object-cover drop-shadow-2xl drop-shadow-black"
          />

          <div className="text-center drop-shadow-2xl drop-shadow-black">
            <h2 className="text-sm font-bold uppercase tracking-[0.35em] text-white">
              Registro
            </h2>

            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/80">
              Crear cuenta inmobiliaria
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium tracking-wide text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              Nombre completo
            </label>

            <input
              type="text"
              disabled={loading}
              {...register("name")}
              onChange={(e) => {
              clearError()
              register("name").onChange?.(e)
              }}
              placeholder="Juan Pérez"
              className="border-b-[1.9px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-red-900"
            />

            {errors.name && (
              <p className="text-xs font-medium text-red-300">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              Email
            </label>

            <input
              type="email"
              disabled={loading}
              {...register("email")}
              onChange={(e) => {
              clearError()
              register("email").onChange?.(e)
              }}
              placeholder="nombre@inmobiliaria.com"
              className="border-b-[1.9px] px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-red-900"
            />

            {errors.email && (
              <p className="text-xs font-medium text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              Contraseña
            </label>

            <div className="flex flex-col gap-2">
  

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      disabled={loading}
      {...register("password")}
      onChange={(e) => {
      clearError()
      register("password").onChange?.(e)
      }}
      placeholder="••••••••"
      className="w-full border-b-[1.9px] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/50 focus:border-red-900"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-red-300"
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  </div>

  {errors.password && (
    <p className="text-xs font-medium text-red-300">
      {errors.password.message}
    </p>
  )}
</div>

            {errors.password && (
              <p className="text-xs font-medium text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full cursor-pointer rounded-2xl bg-linear-to-r from-red-950 to-red-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-lg  transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="pt-2 text-center text-xs text-white/45">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-white hover:text-red-300"
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};