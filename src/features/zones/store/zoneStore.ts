import { create } from "zustand";
import type { Zone } from "../../dashboard/types/zones/Zone.interface";
import { apiClient } from "../../../api/apiClient";



interface ZoneStore {
    zones: Zone[];
    loading: boolean;
    error: string | null;
loaded: boolean;
    fetchZones: () => Promise<void>
    createZone: (name: string) => Promise<Zone>
    deleteZone: (id: number) => Promise<void>
    updateZone: (id: number, name: string) => Promise<Zone>
}


export const useZoneStore = create<ZoneStore>((set, get) => ({
    zones: [],
    loading: false,
    error: null,
    loaded: false,



    fetchZones: async () => {
        const { loaded } = get();

        if (loaded) {
            console.log("CACHE HIT - ZONES");
            return;
        }
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get<Zone[]>("/zone");
            set({ zones: response.data, loaded: true });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "Error al cargar las zonas" });
        } finally {
            set({ loading: false });
        }},
        
        createZone: async (name: string) => {
            try {
                const response = await apiClient.post<Zone>('/zone/create', { name });
                set((state) => ({ zones: [...state.zones, response.data], loaded: true }));
                return response.data;
            } catch (error) {
                console.error("Error creating zone:", error);
                throw error;
            }
        },


        updateZone: async (id: number, name: string) => {
            try {
                const response = await apiClient.put<Zone>(`/zone/${id}`, { name });
                set((state) => ({
                    zones: state.zones.map((zone) =>
                        zone.id === id ? response.data : zone
                    )
                }));
                return response.data;
            } catch (error) {
                console.error("Error updating zone:", error);
                throw error;
            }
        },


        deleteZone: async (id: number) => {
    try {
        const response = await apiClient.delete(`/zone/${id}`);
        if (response.data && response.data.error) {
            throw new Error(response.data.error);
        }

        set((state) => ({
            zones: state.zones.filter((zone) => zone.id !== id)
        }));

    } catch (error) {
        console.error("Error deleting zone:", error);
        throw error; // 👈 CLAVE: re-lanzar
    }
}

}))