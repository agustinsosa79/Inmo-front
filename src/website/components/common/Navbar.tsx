import { useState } from "react";
import logo_alberto from "../../assets/logo_propiedades.webp";
import { NavLink, useLocation } from "react-router";
import { Building, Home, Key, Mail, Menu, Tag, X } from "lucide-react";
import FavoritesButton from "../../features/properties/components/FavoritesButton";

const navLinks = [
  { to: "/", label: "Inicio", icon: <Home size={18} /> },
  { to: "/propiedades", label: "Propiedades", icon: <Building size={18} /> },
  { to: "/propiedades?transactionType=SALE", label: "Venta", icon: <Tag size={18} /> },
  { to: "/propiedades?transactionType=RENT", label: "Alquiler", icon: <Key size={18} /> },
  { to: "/contacto", label: "Contacto", icon: <Mail size={18} /> },
];

// Delays escalonados para la entrada del menú móvil —
// cada link entra 80ms después del anterior, dando sensación de
// secuencia mecánica en vez de aparición en bloque.
const staggerDelays = ["delay-[0ms]", "delay-[80ms]", "delay-[160ms]", "delay-[240ms]", "delay-[320ms]"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav
      className={`libre-baskerville-hero z-50 flex w-full items-center justify-between px-6 md:px-10 transition-all duration-500 ease-in-out ${
        isHome
          ? "absolute left-0 top-0 py-0"
          : "sticky top-0 bg-neutral-950 shadow-md"
      } ${isOpen ? "bg-neutral-950 fixed" : ""}`}
    >
      {/* LOGO */}
      <NavLink to="/" className="z-50 shrink-0">
        <img
          loading="lazy"
          src={logo_alberto}
          alt="Logo Alberto"
          className={`object-contain transition-all duration-300 w-auto  ${
            isHome ? "h-30 md:h-45" : "h-20 md:h-25"
          }`}
        />
      </NavLink>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex items-center gap-8 ">
        <ul className="flex items-center gap-8 uppercase tracking-widest text-white text-sm">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className="group relative pb-1 transition-colors duration-200 hover:text-red-700 text-white"
              >
                    {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divisor vertical + favoritos */}
        <div className="flex items-center gap-4 border-l border-white/20 pl-6">
          <FavoritesButton />
        </div>
      </div>

      {/* ===== MOBILE: botones de control ===== */}
      <div className="md:hidden flex items-center gap-3 z-50">
        <FavoritesButton />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </div>
        </button>
      </div>

      {/* ===== MENÚ MÓVIL — layout editorial con índices ===== */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-neutral-950 px-8 pt-40 pb-12 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        {/* Links con número de índice editorial */}
        <ul className="flex flex-col gap-0">
          {navLinks.map((link, idx) => (
            <li
              key={link.label}
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${staggerDelays[idx]} ${
                isOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <NavLink
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="group flex items-end gap-4 border-b border-white/10 py-5 transition-colors duration-200 text-white hover:text-red-700"
              >

                {/* Label grande */}
                <span className="text-3xl font-light uppercase tracking-[0.15em] leading-none">
                  {link.label}
                </span>

                {/* Ícono que aparece en hover */}
                <span className="mb-1 ml-auto opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 text-red-700">
                  {link.icon}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer del menú móvil — detalle de marca */}
        <div
          className={`transition-all duration-500 delay-400 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-4 h-px w-12 bg-red-800" />
          <p className="text-xs uppercase tracking-[0.35em] text-white/30">
            Propiedades
          </p>
          <p className="mt-1 text-xs text-white/20">
            CABA, Buenos Aires
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;