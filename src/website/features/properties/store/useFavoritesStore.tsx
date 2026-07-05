import { create } from "zustand";
import type { Property } from "../../../../features/dashboard/types/property/property.interface";

const MAX_FAVORITES = 10



export interface FavoritesStore {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (property: Property) => void;
}


export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
    favorites: [],
    addFavorite: (property) => {
        const { favorites } = get();
        if (favorites.length < MAX_FAVORITES) {
            set({ favorites: [...favorites, property] });
        } else {
            console.warn(`You can only have up to ${MAX_FAVORITES} favorite properties.`);
        }
    },
    removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((p) => p.id !== id) });
    },
    isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some((p) => p.id === id);
    },
    toggleFavorite: (property) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(property.id)) {
            removeFavorite(property.id);
        } else {
            addFavorite(property);
        }
    }
}))