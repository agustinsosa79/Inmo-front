import { useForm } from "react-hook-form"
import { useLogin } from "../../hooks/useLogin"
import { type LoginInput, loginSchema } from "../../types/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router"
import logo from "../../../../assets/logo_black.webp"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"



export const FormLogin = () => {

    const { error, loading, loginUser, clearError } = useLogin()

    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = (data: LoginInput) => {
      try {
        loginUser(data)
      } catch (error) {
        console.log(error)
    }
    }
    



    return (
    <div className="min-h-dvh relative overflow-hidden  ">
  {/* Fondo */}

  {/* Contenido */}
  <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-10">
    <div className="w-full max-w-md rounded-[28px]   p-8 ">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <img
          loading="lazy"
          src={logo}
          alt="Logo Inmobiliaria"
          className=" absolute top-0 h-55 w-auto object-cover drop-shadow-2xl  "
        />

        <div className="text-center drop-shadow-2xl drop-shadow-black">
          <h2 className="text-sm font-bold uppercase tracking-[0.35em] text-white">
            Ingresar
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.28em] text-white/80">
            Panel de control inmobiliario
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-medium tracking-wide text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className="border-b-[1.9px]  px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-red-900   drop-shadow-2xl"
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-300">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
  <label className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
    Contraseña
  </label>

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
      className="w-full border-b-[1.9px] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/50 focus:border-red-900 drop-shadow-2xl"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-red-300"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full cursor-pointer rounded bg-linear-to-r from-red-950 to-red-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-lg  transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Autenticando..." : "Entrar"}
        </button>

        <p className="pt-2 text-center text-xs text-white/45">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-white hover:text-red-300"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  </div>
</div>
  );
}