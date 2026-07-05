import { Star, X, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { getCardImageUrl } from "../utils/getCardImagesUrl";
import { transactionTypeLabels } from "../constants/PropertyLabels";

interface FavoritesPanelProps {
  onClose: () => void;
}

const FavoritesPanel = ({ onClose }: FavoritesPanelProps) => {
  const { favorites, removeFavorite } = useFavoritesStore();

  return (
    <>
      {/* Overlay invisible que cierra el panel al clickear afuera */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-zinc-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-zinc-900">
              Favoritos
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
              {favorites.length}/10
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Lista de favoritos */}
        <div className="max-h-160 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Star size={28} className="text-zinc-200" />
              <p className="text-sm text-zinc-400">
                Todavía no guardaste propiedades
              </p>
              <p className="text-xs text-zinc-300">
                Presioná la estrella en cualquier propiedad
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-50">
              {favorites.map((property) => {
                const slug = property.slug ?? String(property.id);
                return (
                  <li key={property.id} className="flex items-center gap-3 p-3 transition hover:bg-zinc-50">
                    {/* Imagen miniatura */}
                    <Link
                      to={`/propiedad/${slug}`}
                      onClick={onClose}
                      className="shrink-0"
                    >
                      <img
                        loading="lazy"
                        src={getCardImageUrl(property.images?.[0]?.url)}
                        alt={property.title}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Info */}
                    <Link
                      to={`/propiedad/${slug}`}
                      onClick={onClose}
                      className="min-w-0 flex-1 group"
                    >
                      <p className="truncate text-sm font-semibold text-zinc-900 group-hover:text-red-800 transition-colors">
                        {property.title}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {transactionTypeLabels[property.type]} ·{" "}
                        {property.currency} {property.price.toLocaleString()}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-red-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver propiedad <ArrowRight size={10} />
                      </span>
                    </Link>

                    {/* Botón quitar */}
                    <button
                      type="button"
                      onClick={() => removeFavorite(property.id)}
                      className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      title="Quitar de favoritos"
                    >
                      <X size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer con hint de máximo */}
        {favorites.length >= 10 && (
          <div className="border-t border-zinc-100 px-4 py-2.5">
            <p className="text-center text-xs text-amber-600">
              Límite de 10 favoritos alcanzado. Quitá uno para agregar otro.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritesPanel;