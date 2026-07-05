import { useEffect } from "react";
import { Link } from "react-router";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import logo_alberto from "../../assets/logo_propiedades.webp";
import { capitalizar } from "../../../features/dashboard/components/utils/Capitalizar";
import { useZoneStore } from "../../../features/zones/store/zoneStore";

const WHATSAPP_NUMBER = "5492211234567"; // TODO: reemplazar por el número real de la inmobiliaria

const Footer = () => {
  const { zones, fetchZones } = useZoneStore();

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return (
    <footer className="bg-[#1c1917] text-white">
      {/* FRANJA CTA — SUMATE COMO ASESOR */}
      <div className="border-b border-white/10 px-10 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-red-700">
              Trabajá con nosotros
            </p>
            <h3 className="mt-2 text-2xl font-light text-white libre-baskerville-hero playfair-display-hero">
              ¿Querés sumarte como asesor inmobiliario?
            </h3>
          </div>

          <Link
            to="/sumate"
            className="group flex shrink-0 items-center gap-2 rounded-full bg-red-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-950"
          >
            Quiero ser asesor
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* CUERPO PRINCIPAL */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* MARCA + CONTACTO */}
        <div>
          <img
            loading="lazy"
            src={logo_alberto}
            alt="Logo Alberto Propiedades"
            className="h-20 object-contain w-full object-left aspect-square transform-gpu will-change-transform "
          />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
            Más de [X] años acompañando a familias e inversores a encontrar la
            propiedad correcta en La Plata y la región.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/80">
            <a
              href="mailto:info@albertopropiedades.com"
              className="flex items-center gap-3 transition hover:text-red-500"
            >
              <Mail size={16} className="text-red-700" />
              info@albertopropiedades.com
            </a>
            <a
              href="tel:+542211234567"
              className="flex items-center gap-3 transition hover:text-red-500"
            >
              <Phone size={16} className="text-red-700" />
              (0221) 123-4567
            </a>
            <span className="flex items-center gap-3">
              <MapPin size={16} className="text-red-700" />
              Calle 7 N° 555, La Plata
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-green-600 hover:bg-green-700 hover:text-white"
            >
              <FaWhatsapp size={17} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-red-700 hover:bg-red-800 hover:text-white"
            >
              <FaInstagram size={17} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-red-700 hover:bg-red-800 hover:text-white"
            >
              <FaFacebook size={17} />
            </a>
          </div>
        </div>

        {/* NAVEGÁ */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/40">
            Navegá
          </h4>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-white/80">
            <li>
              <Link to="/" className="transition hover:text-red-500">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/propiedades"
                className="transition hover:text-red-500"
              >
                Propiedades
              </Link>
            </li>
            <li>
              <Link
                to="/propiedades?transactionType=SALE"
                className="transition hover:text-red-500"
              >
                Venta
              </Link>
            </li>
            <li>
              <Link
                to="/propiedades?transactionType=RENT"
                className="transition hover:text-red-500"
              >
                Alquiler
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="transition hover:text-red-500">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* ZONAS */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/40">
            Zonas
          </h4>
          <ul className="mt-5 flex flex-col gap-3 text-sm text-white/80">
            {zones.length === 0 && (
              <li className="text-white/40">Próximamente</li>
            )}
            {zones.slice(0, 6).map((zone) => (
              <li key={zone.id}>
                <Link
                  to={`/propiedades?zoneId=${zone.id}`}
                  className="transition hover:text-red-500"
                >
                  {capitalizar(zone.name ?? `Zona ${zone.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONSULTA RÁPIDA */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-white/40">
            ¿Buscás vender o alquilar?
          </h4>
          <p className="mt-5 text-sm leading-6 text-white/60">
            Contanos sobre tu propiedad y te ayudamos a encontrar el
            comprador o inquilino correcto.
          </p>
          <Link
            to="/contacto"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-500 transition hover:text-red-400"
          >
            Hablar con un asesor
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* LÍNEA LEGAL */}
      <div className="border-t border-white/10 px-10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Alberto Propiedades. Todos los derechos reservados.</p>
          <p>Matrícula CMCPSI N° [XXXX]</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
