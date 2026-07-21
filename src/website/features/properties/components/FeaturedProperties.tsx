import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {  ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import PropertyCard from "./PropertyCard"
import { usePropertyStore } from "../../../../features/properties/store/propertyStore"

const FeaturedProperties = () => {
  const { loadProperties, loaded, properties } = usePropertyStore()

  useEffect(() => {
    if (!loaded) {
      loadProperties()
    }
  }, [loadProperties, loaded])

  const featuredProperties = properties.filter((p) => p.isFeatured).slice(0,10)

  const [emblaRef, emblaApi] = useEmblaCarousel({
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
    if (!emblaApi) return
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

  return (
    <div className="text-start lg:px-50 px-6 py-10 lg:py-30 bg-[#F4F1EA]">
        <div className="flex flex-col lg:flex-row lg:gap-127">

        <div className="flex flex-col px-5 lg:px-0 max-w-2xl">
      <span className="lg:text-sm text-xs uppercase tracking-[0.35em] text-red-800">
        Selección exclusiva
      </span>

      <h2 className="mt-4 libre-baskerville-hero lg:text-5xl text-4xl font-light text-zinc-900 playfair-display-hero">
        Propiedades destacadas
      </h2>

      <p className="text-start mt-6 max-w-2xl lg:text-lg text-sm leading-8 text-zinc-600">
        Descubrí viviendas y oportunidades de inversión seleccionadas por nuestro
        equipo, respaldadas por años de experiencia y un profundo conocimiento del
        mercado local.
      </p>
    </div>

      <div className="mt-8 ml-4 flex lg:items-end lg:justify-end">
  <Link
    to="/propiedades"
    className="lg:text-sm relative flex font-semibold uppercase items-center gap-2 tracking-widest overflow-hidden text-xs py-2 px-5 lg:py-3 lg:px-6 rounded-full border-2 border-red-800 text-red-800 hover:bg-red-800 hover:text-white transition-all duration-300"
  >
    <ArrowUpRight size={17}  />
    Ver todas las propiedades
  </Link>
</div>
        </div>


      <div className="relative mt-10  rounded-4xl">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8 p-5">
            {featuredProperties.map((p) => (
  <PropertyCard
    key={p.id}
    property={p}
    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_0%] xl:flex-[0_0_25%]"
  />
))}
          </div>
        </div>

          <div
    className={`pointer-events-none absolute hidden lg:block left-0 top-0 lg:h-full w-16 bg-linear-to-r from-zinc-900/50   to-transparent transition-opacity duration-300 ${
      canScrollPrev ? "opacity-100" : "opacity-0"
    }`}
  />

    <div
    className={`pointer-events-none absolute right-0 top-0 lg:h-full w-10 bg-linear-to-l from-zinc-900/50 to-transparent transition-opacity duration-300 ${
      canScrollNext ? "opacity-100" : "opacity-0"
    }`}
  />

        {/* Flechas */}
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 transition cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-red-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 transition cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default FeaturedProperties