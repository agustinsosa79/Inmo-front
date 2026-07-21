import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { getCardImageUrl } from "../utils/getCardImagesUrl";
import {
  Bath,
  Bed,
  MapPin,
  RulerDimensionLine,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { getAllRelatedProperties } from "../utils/getAllRelatedProperties";
import PropertyCard from "./PropertyCard";
import useEmblaCarousel from "embla-carousel-react";
import { InquiryApi } from "../../../../features/inquiries/services/inquiryApi";
import { usePropertyStore } from "../../../../features/properties/store/propertyStore";
import { transactionTypeLabels } from "../../../../features/dashboard/components/utils/translatorTypes";
import { propertyTypeLabels } from "../constants/PropertyLabels";
import { defaultIcon } from "../utils/leafletIcon";
const WHATSAPP_NUMBER = "5492216946073"; // TODO: reemplazar por el número real de la inmobiliaria

const PropertyDetails = () => {
  const { slug } = useParams();
  const { properties, loaded, loadProperties } = usePropertyStore();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [ emblaRef, emblaApi ] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1280px)": { slidesToScroll: 1 },
    },
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  


  const onSelect = useCallback(() => {
    if(!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

useEffect(() => {
  if (!emblaApi) return


  emblaApi.on("select", onSelect)
  emblaApi.on("reInit", onSelect)
  emblaApi.on("init", onSelect)

  return () => {
    emblaApi.off("select", onSelect)
    emblaApi.off("reInit", onSelect)
    emblaApi.off("init", onSelect)
  }
}, [emblaApi, onSelect])

  useEffect(() => {
    if (!loaded) {
      loadProperties();
    }
  }, [loaded, loadProperties]);

  const property = properties.find((p) => p.slug === slug);

  if (!loaded) {
    return (
      <div className="flex flex-col gap-2 h-dvh items-center pb-40 justify-center bg-[#F4F1EA]">
        <div className="h-10 w-10 rounded-full border-5 border-red-800/30 border-t-red-800 animate-spin" />
        <p className="libre-baskerville-hero">Cargando propiedad</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#F4F1EA]">
        <p className="text-xl text-zinc-500">Propiedad no encontrada.</p>
      </div>
    );
  }

  const propertiesRelated = getAllRelatedProperties(property, properties)
console.log("relacionadas:", propertiesRelated)
  const images = property.images?.length ? property.images : [];

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en la propiedad "${property.title}" (${window.location.href}). ¿Podrían darme más información?`
  );

  const position: [number, number] | null =
  property?.latitude != null && property?.longitude != null
    ? [property.latitude, property.longitude]
    : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    await InquiryApi.create({
      ...form,
      propertyId: property.id,
    });
    setForm({ name: "", email: "", phone: "", message: "" });
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 4000)
  } catch (error) {
    console.error("Error al enviar la consulta:", error);
  } finally {
    setSubmitting(false);
  }
};



const handleShare = async () => {
  const shareData = {
    title: property.title,
    text: `Mirá esta propiedad: ${property.title}`,
    url: window.location.href,
  };

  // Si el navegador soporta compartir de forma nativa (Celulares)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.log("Error al compartir:", error);
    }
  } else {
    // Fallback para PC: Copiar al portapapeles
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500); // Se borra a los 2.5 segundos
    } catch (error) {
      console.error("No se pudo copiar el link:", error);
    }
  }
};


  return (
    <div className="bg-[#F4F1EA] min-h-dvh pt-10 pb-20">
      <div className="mx-auto max-w-7xl my-auto px-2 lg:px-8">
        <div className="mb-8 px-4 flex items-center gap-2 lg:text-sm text-xs text-zinc-500 uppercase  lg:tracking-widest">
          <Link to="/" className="hover:text-red-800 transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <Link to="/propiedades" className="hover:text-red-800 transition-colors">
            Propiedades
          </Link>
          <span>/</span>
          <span className="text-red-800">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] items-start">
          {/* ===== COLUMNA IZQUIERDA ===== */}
          <div className="min-w-0">
            {/* GALERÍA PRINCIPAL */}
            {images.length > 0 ? (
              <div className="relative rounded-3xl overflow-hidden h-full lg:h-120">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  navigation={{
                    nextEl: ".gallery-next",
                    prevEl: ".gallery-prev",
                  }}
                  thumbs={{ swiper: thumbsSwiper }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  className="lg:h-120 w-full"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={img.id ?? idx}>
                      <img
                        loading="lazy"
                        src={getCardImageUrl(img.url)}
                        alt={`${property.title} - foto ${idx + 1}`}
                        className="lg:h-120 h-70 w-full object-cover "
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      disabled={!canScrollPrev}
                      className="gallery-prev absolute disabled:opacity-30 disabled:cursor-not-allowed left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-900 shadow-md hover:bg-white transition cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      disabled={!canScrollNext}
                      className="gallery-next absolute right-4 top-1/2 disabled:opacity-30 disabled:cursor-not-allowed  -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-red-900 shadow-md hover:bg-white transition cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-800 libre-baskerville-hero">
                  {transactionTypeLabels[property.type]}
                </span>
              </div>
            ) : (
              <div className="flex h-120 items-center justify-center rounded-3xl bg-zinc-200 text-zinc-500">
                Sin imágenes disponibles
              </div>
            )}

            {/* MINIATURAS */}
            {images.length > 1 && (
              <div className="mt-4 w-full px-1 overflow-hidden">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  slidesPerView={5}
                  spaceBetween={12}
                  watchSlidesProgress
                  
                  className="lg:h-24 h-20 w-full  "
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={img.id ?? idx} className="cursor-pointer">
                      <img
                        loading="lazy"
                        src={getCardImageUrl(img.url)}
                        alt={`Miniatura ${idx + 1}`}
                        className={`h-full w-full rounded-xl object-cover p-0 transition ${
                          idx === activeIndex
                            ? "opacity-100 border-2 border-red-800"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* DESCRIPCIÓN */}
            <div className="mt-12 bg-white lg:p-10 p-6 rounded-2xl shadow-sm">

            <div>
  <div className="flex items-start justify-between gap-4">
    <h1 className="lg:text-4xl text-3xl font-light text-zinc-800 libre-baskerville-hero playfair-display-hero">
      {property.title}
    </h1>
    
    {/* BOTÓN DE COMPARTIR */}
    <div className="relative shrink-0 mt-1">
      <button
        type="button"
        onClick={handleShare}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700  transition hover:bg-zinc-50 hover:text-red-900 cursor-pointer"
        title="Compartir propiedad"
      >
        <Share2 size={18} />
      </button>

      {/* Cartelito flotante de "Copiado" exclusivo para PC */}
      {copied && (
        <span className="absolute right-0 -bottom-8 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-md animate-fade-in">
          ¡Link copiado!
        </span>
      )}
    </div>
  </div>
              <p className="mt-3 flex lg:text-md text-sm items-center gap-2 text-zinc-500">
                <MapPin size={16} className="text-red-900" />
                {property.address}
                {property.locationDescription && ` · ${property.locationDescription}`}
                {property.zone?.name && ` · ${property.zone.name}`}
              </p>

              <div className="lg:mt-6 flex flex-wrap gap-6  mt-3 py-3 lg:py-6 lg:text-sm text-xs text-zinc-700">
                <span className="flex items-center gap-2">
                  <Bed size={20} className="text-red-900" />
                  {property.bedrooms} Hab.
                </span>
                <span className="flex items-center gap-2">
                  <Bath size={20} className="text-red-900" />
                  {property.bathrooms === 1
                    ? `${property.bathrooms} Baño`
                    : `${property.bathrooms} Baños`}
                </span>
                <span className="flex items-center gap-2">
                  <RulerDimensionLine size={20} className="text-red-900" />
                  {property.totalArea} m²
                </span>
                {property.propertyType && (
                  <span className="flex items-center gap-2">
                    {propertyTypeLabels[property.propertyType]}
                  </span>
                )}
              </div>

              <h2 className="mt-8 text-xl font-semibold text-zinc-900 libre-baskerville-hero">
                Descripción
              </h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-zinc-600">
                {property.description}
              </p>
            </div>
            
            {position && (
  <div className="mt-10">
    <h2 className="mb-4 text-xl font-semibold text-zinc-900 libre-baskerville-hero">
      Ubicación
    </h2>
    <div className="relative z-0 h-100">
    <MapContainer
      center={position}
      zoom={15}
      className="h-100 w-full rounded-2xl overflow-hidden"
      >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}  icon={defaultIcon}  />
    </MapContainer>
    </div>
    <a
      href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-800 hover:text-red-900 underline"
      >
      Ir a Google Maps
    </a>

    <div className="mt-8 border-t border-neutral-800 pt-6 text-xs text-neutral-500 leading-relaxed">
              <p>
                La información publicada es orientativa y puede estar sujeta a modificaciones sin previo aviso.{" "}
                Las medidas, superficies y/o expensas son aproximadas.{" "}
                Las imágenes son ilustrativas.{" "}
                La operación queda sujeta a aprobación del propietario.
              </p>
            </div>
  </div>
)}
      </div>

          </div>

          {/* ===== COLUMNA DERECHA ===== */}
          <div className="min-w-0 rounded-3xl bg-white p-8 shadow-md sticky top-32">
            <span className="text-3xl font-bold text-zinc-900 libre-baskerville-hero">
              {property.currency} {property.price.toLocaleString()}
            </span>

            <hr className="my-5 border-zinc-200" />

            <h3 className="text-lg font-semibold text-zinc-900 libre-baskerville-hero">
              ¿Te interesa esta propiedad?
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Completá el formulario y un agente se va a contactar con vos.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
  <label htmlFor="name" className="sr-only">Nombre y apellido</label>
  <input
    id="name"
    type="text"
    name="name"
    placeholder="Nombre y apellido"
    value={form.name}
    onChange={handleChange}
    required
    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-800"
  />
</div>
              <div className="flex flex-col gap-1">
  <label htmlFor="email" className="sr-only">Correo electrónico</label>
  <input
    id="email"
    type="email"
    name="email"
    placeholder="Correo electrónico"
    value={form.email}
    onChange={handleChange}
    required
    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-800"
  />
</div>
              <div className="flex flex-col gap-1">
  <label htmlFor="phone" className="sr-only">Teléfono</label>
  <input
    id="phone"
    type="tel"
    name="phone"
    placeholder="Teléfono"
    value={form.phone}
    onChange={handleChange}
    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-800"
  />
</div>
              <div className="flex flex-col gap-1">
  <label htmlFor="message" className="sr-only">Mensaje</label>
  <textarea
    id="message"
    name="message"
    placeholder="Mensaje"
    rows={4}
    value={form.message}
    onChange={handleChange}
    required
    className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-800"
  />
</div>

              {submitted && (
  <p className="text-sm text-green-700 transition-all duration-150">
    ¡Tu consulta fue enviada! Un agente se va a contactar con vos pronto.
    Mps estaremos contacvtandopo con vod ptontamente
  </p>
   
)}

<button
  type="submit"
  disabled={submitting}
  className="mt-2 rounded-xl bg-red-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-900 cursor-pointer disabled:opacity-60"
>
  {submitting ? "Enviando..." : "Enviar consulta"}
</button>
            </form>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-green-700 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              <FaWhatsapp size={18} />
              Consultar por WhatsApp
            </a>
          </div>

          
        </div>

        <div className="relative mt-10">
  <h4 className="lg:pl-10 lg:pt-10 pt-10 pl-5 text-red-950 libre-baskerville-hero text-xl uppercase italic">
    Te podría interesar
  </h4>

  <button
    type="button"
    onClick={scrollPrev}
    disabled={!canScrollPrev}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 transition cursor-pointer"
  >
    <ChevronLeft size={20} />
  </button>

  <div className="overflow-hidden mt-6" ref={emblaRef}>
    <div className="flex gap-6 lg:gap-8 px-5 lg:px-10">
      {propertiesRelated.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_80%] xl:flex-[0_0_30%]"
        />
      ))}
    </div>
  </div>

  <button
    type="button"
    onClick={scrollNext}
    disabled={!canScrollNext}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 transition cursor-pointer"
  >
    <ChevronRight size={20} />
  </button>
</div>


      </div>
    </div>
  );
};

export default PropertyDetails;