import { create } from "zustand";
import type { Property } from "../../dashboard/types/property/property.interface";
import type { CreatePropertyInput } from "../../dashboard/types/property/CreatePropertyInput";
import { PropertyService } from "../services/PropertyService";


interface PropertyStore {
    properties: Property[];
    loading: boolean;
    loaded: boolean;
    error: string | null;
    loadProperties: () => Promise<void>;
    createProperty: (data: CreatePropertyInput) => Promise<void>;
    deleteProperty: (id: number) => Promise<void>;
    updateProperty: (id: number, data: CreatePropertyInput) => Promise<void>;
    clearError: () => void;
}



export const usePropertyStore = create<PropertyStore>((set, get) => ({
    properties: [],
    loading: false,
    loaded: false,
    error: null,

  loadProperties: async () => {
  const { loaded } = get();

  if (loaded) {
    return;
  }

  set({
    loading: true,
    error: null,
  });

  try {
    const properties = await PropertyService.getProperties();

    set({
      properties,
      loaded: true,
    });
  } catch (err) {
    set({
      error:
        err instanceof Error
          ? err.message
          : "Error al cargar las propiedades",
    });
  } finally {
    set({
      loading: false,
    });
  }
},

   createProperty: async (data: CreatePropertyInput) => {
        set({ loading: true, error: null });

        try {
            const newProperty = await PropertyService.createProperty(data);
            set((state) => ({ properties: [...state.properties, newProperty] }));
            console.log("Nueva propiedad creada:", newProperty);
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error al crear la propiedad" });
        } finally {
            set({ loading: false })
        }
   },

   deleteProperty: async (id: number) => {
        set({ loading: true, error: null });

        try {
            await PropertyService.deleteProperty(id);
            set((state) => ({ properties: state.properties.filter(p => p.id !== id) }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error al eliminar la propiedad" });
        } finally {
            set({ loading: false })
        }
   },

   updateProperty: async (id: number, data: CreatePropertyInput) => {
        set({ loading: true, error: null });

        try {
            const updatedProperty = await PropertyService.updateProperty(id, data);
            set((state) => ({ properties: state.properties.map(p => p.id === id ? updatedProperty : p) }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : "Error al actualizar la propiedad" });
        } finally {
            set({ loading: false })
        }
   },

    clearError: () => set({ error: null })
}))