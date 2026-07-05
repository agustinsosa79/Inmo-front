import { ArrowRight } from "lucide-react";
import Foto from "../../../assets/keys-on-hand.webp";
import { Link } from "react-router";

const stats = [
  { value: "250+", label: "Propiedades publicadas" },
  { value: "18", label: "Años en el mercado" },
  { value: "700+", label: "Clientes asesorados" },
];

const AboutSection = () => {
  return (
    <section className="relative bg-neutral-950 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">

        {/* Encabezado editorial */}
        <div className="grid gap-10 lg:grid-cols-[12fr_auto] lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-red-800">
              Quiénes somos — desde 1998
            </span>

            <h2 className="mt-6 text-4xl leading-[1.05] text-white libre-baskerville-hero lg:text-5xl">
              Construimos
              <br />
              relaciones,
              <br />
              <span className="text-red-900">no operaciones.</span>
            </h2>
          </div>

          <p className="max-w-sm lg:text-sm text-xs leading-8 text-white/60 lg:pb-2">
  Sabemos que detrás de cada consulta hay una decisión importante. Por eso
  preferimos acompañarte durante todo el proceso, responder cada duda y ayudarte
  a encontrar una propiedad que realmente se adapte a lo que buscás.
</p>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />

        {/* Cuerpo: imagen + números editoriales */}
        <div className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          <div className="relative">
            <img
              loading="lazy"
              src={Foto}
              alt="Arquitectura residencial"
              className="h-120 w-full rounded-2xl object-cover"
            />
            <span className="absolute -bottom-5 -right-5 hidden h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-neutral-950 text-center text-xs font-semibold uppercase tracking-wider text-white/70 sm:flex">
              Trato
              <br />
              directo
            </span>
          </div>

          <div>
            <p className="lg:text-sm text-xs leading-8 text-white/70">
  Somos un equipo que trabaja el mercado inmobiliario de forma directa y con criterio propio. No publicamos propiedades sin conocerlas primero: las visitamos, verificamos su estado y revisamos la documentación antes de ofrecerlas. Hablamos con propietarios y entendemos el contexto real de cada inmueble antes de moverlo al mercado.

  Nos enfocamos en acompañar cada operación de principio a fin, con un trato cercano y transparente. Para nosotros no se trata solo de vender o alquilar, sino de asegurarnos de que cada decisión tenga sentido para quien confía en nosotros.
</p>

            <dl className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-light text-white libre-baskerville-hero lg:text-5xl">
                    {stat.value}
                  </dd>
                  <p className="mt-2 text-xs  tracking-wider text-white/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>

            <Link to="/contacto" className="group mt-12 flex cursor-pointer items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:text-red-900">
              Contáctanos
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;