import { apiClient } from "../../../api/apiClient";
import type { Zone } from "../../dashboard/types/zones/Zone.interface";



export const ZoneService = {
  async getZones(): Promise<Zone[]> {
    try {
      const response = await apiClient.get<Zone[]>("/zone");
      return response.data;
    } catch (error) {
      console.error("Error fetching zones:", error);
      throw error;
    }
  },

    async createZone(name: string): Promise<Zone> {
        try {
            const response = await apiClient.post<Zone>('/zone', { name });
            return response.data;
        } catch (error) {
            console.error("Error creating zone:", error);
            throw error;
        }},


    async deleteZone(id: number): Promise<void> {
        try {
            await apiClient.delete(`/zone/${id}`);
        } catch (error) {
            console.error("Error deleting zone:", error);
            throw error;
        }},


        async updateZone(id: number, name: string): Promise<Zone> {
            try {
                const response = await apiClient.put<Zone>(`/zone/${id}`, { name });
                return response.data;
            } catch (error) {
                console.error("Error updating zone:", error);
                throw error;
            }
        }

};