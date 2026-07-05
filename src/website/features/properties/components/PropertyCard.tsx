import { Link } from "react-router";
import { Bath, Bed, MapPin, RulerDimensionLine, Star } from "lucide-react";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { getCardImageUrl } from "../utils/getCardImagesUrl";
import type { Property } from "../../../../features/dashboard/types/property/property.interface";
import { transactionTypeLabels } from "../constants/PropertyLabels";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const PropertyCard = ({ property, className = "" }: PropertyCardProps) => {
  const slug = property.slug ?? String(property.id);
  const { isFavorite, toggleFavorite, favorites } = useFavoritesStore();
  const favorited = isFavorite(property.id);
  const limitReached = favorites.length >= 5 && !favorited;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // evita que el Link navegue al clickear la estrella
    e.stopPropagation();
    if (limitReached) return;
    toggleFavorite(property);
  };

  return (
    <Link
      to={`/propiedad/${slug}`}
      className={`bg-white shadow p-2 rounded-2xl relative hover:scale-101 hover:shadow-xl transition-all duration-300 min-w-0 ${className}`}
    >
      <div className="lg:h-80 h-50 overflow-hidden relative">
        <img
          loading="lazy"
          src={getCardImageUrl(property.images?.[0]?.url)}
          alt={property.title}
          className="h-full  w-full object-cover rounded-xl aspect-square transform-gpu will-change-transform"
        />

        {/* Botón estrella */}
        <button
          type="button"
          onClick={handleFavorite}
          title={
            limitReached
              ? "Límite de 5 favoritos alcanzado"
              : favorited
              ? "Quitar de favoritos"
              : "Agregar a favoritos"
          }
          className={`absolute right-3 top-3 flex lg:h-9 lg:w-9 h-6 w-6 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition cursor-pointer ${
            favorited
              ? "bg-amber-400 text-white hover:bg-amber-500"
              : limitReached
              ? "bg-white/70 text-zinc-300 cursor-not-allowed"
              : "bg-white/80 text-zinc-400 hover:bg-white hover:text-amber-400"
          }`}
        >
          <Star
            size={16}
            className={favorited ? "fill-white" : ""}
          />
        </button>
      </div>

      <div className="p-2 lg:p-5">
        <span className="lg:text-xs text-xs absolute top-0 p-2 left-0 px-5 font-semibold rounded-br-2xl rounded-tl-2xl libre-baskerville-hero lg:tracking-widest text-red-800 bg-white">
          {transactionTypeLabels[property.type].charAt(0).toUpperCase() + transactionTypeLabels[property.type].slice(1)}
        </span>

        {/* ===== CAMBIO CLAVE: FLUJO EN LÍNEA PARA MÓVIL ===== */}
        <div className="mt-2 block text-left">
          <h2 className="lg:text-xl text-sm font-bold text-red-950 libre-baskerville-hero inline mr-2 break-normal">
            {property.title}
          </h2>
          {/* Precio exclusivo para móvil integrado en el flujo de texto */}
          <span className="lg:hidden text-sm font-bold text-zinc-900 libre-baskerville-hero whitespace-nowrap inline-block bg-zinc-100 px-2 py-0.5 rounded-md align-middle">
            USD {property.price.toLocaleString()}
          </span>
        </div>

        <p className="mt-2 lg:text-sm text-xs text-zinc-500 flex gap-1 items-center">
          <MapPin size={15} className="mb-1 text-red-950" />
          {property.zone?.name}
        </p>

        {/* Precio exclusivo para escritorio (se mantiene abajo rígido) */}
        <div className="mt-4 hidden lg:flex items-center justify-between">
          <span className="lg:text-2xl text-lg font-bold text-zinc-900 libre-baskerville-hero">
            USD {property.price.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:flex lg:flex-row w-full max-w-4xl lg:gap-4 gap-2 lg:pt-4 pt-2 lg:text-sm text-xs text-zinc-600">
          <span className="flex gap-2 items-center py-1 rounded-full text-zinc-900 text-balance">
            <Bed size={20} className="text-red-900 mb-1" />
            {property.bedrooms} Hab.
          </span>
          <span className="flex gap-2 items-center py-1 rounded-full text-zinc-900">
            <Bath size={20} className="text-red-900 mb-1" />
            {property.bathrooms === 1
              ? `${property.bathrooms} Baño`
              : `${property.bathrooms} Baños`}
          </span>
          <span className="flex flex-row items-center gap-2 backdrop-blur-lg py-1 rounded-full text-zinc-900">
            <RulerDimensionLine size={20} className="text-red-900 mb-1" />
            {property.totalArea} m²
          </span>
        </div>

        <div className="mt-5 flex items-center justify-start">
          <span className="lg:text-sm text-xs font-semibold py-2 px-4 rounded-full bg-red-800 text-white hover:bg-red-950 transition-all duration-200">
            Ver detalle →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;