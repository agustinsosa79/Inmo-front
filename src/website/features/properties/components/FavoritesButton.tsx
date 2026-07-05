import { useState } from "react";
import { Star } from "lucide-react";
import FavoritesPanel from "./FavoritesPanel";
import { useFavoritesStore } from "../store/useFavoritesStore";

const FavoritesButton = () => {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavoritesStore();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 cursor-pointer"
        title="Mis favoritos"
      >
        <Star
          size={20}
          className={favorites.length > 0 ? "fill-amber-400 text-amber-400" : "text-white"}
        />
        {favorites.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-800 text-[9px] font-bold text-white">
            {favorites.length}
          </span>
        )}
      </button>

      {open && <FavoritesPanel onClose={() => setOpen(false)} />}
    </div>
  );
};

export default FavoritesButton;