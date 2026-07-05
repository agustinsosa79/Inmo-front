import { useLocation } from "react-router";
import { type ContactFormType } from "../config/contactFormConfig"
import ContactForm from "../config/ContactForm";

function resolveContactFormType(pathname: string): ContactFormType {
  if (pathname === "/sumate") {
    return "sumate";
  }
  return "contact";
}
export default function ContactPage() {
  const { pathname } = useLocation();
  const formType = resolveContactFormType(pathname);

  const coverImage =
    formType === "sumate"
      ? "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="h-full overflow-hidden bg-neutral-950 px-6 pt-10 pb-30 lg:px-8">
      <div className="mx-auto flex h-full max-w-7xl flex-col">

        {/* ENCABEZADO */}
        <div className="shrink-0 m-10 text-center">
          <span className="mt-2 text-3xl libre-baskerville-hero font-semibold uppercase tracking-[0.35em] text-red-900">
            {formType === "sumate" ? "Trabajá con nosotros" : "Contacto"}
          </span>
        </div>

        {/* FRANJA DE CONTACTO DIRECTO */}


        {/* BLOQUE PRINCIPAL: imagen + form — ocupa el resto del alto disponible */}
        <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 lg:grid-cols-2">

          {/* Columna Izquierda: Imagen */}
          <div className="relative hidden lg:block">
            <img
              loading="lazy"
              src={coverImage}
              alt="Contacto"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-8 bottom-8 text-white">
              <span className="text-xs uppercase tracking-[0.3em] text-red-300">
                {formType === "sumate" ? "Equipo" : "Atención personalizada"}
              </span>
              <p className="mt-2 text-xl leading-snug libre-baskerville-hero">
                {formType === "sumate"
                  ? "Si conocés el mercado inmobiliario de tu zona, nos gustaría conocerte."
                  : "Nos comunicaremos con vos apenas revisemos tu consulta."}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario, con scroll propio si no entra */}
          <div className="min-h-0 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8">
            <ContactForm type={formType} />
          </div>
        </div>
      </div>
    </div>
  );
}