import { apiClient } from "../../../api/apiClient"
import type { CreatePropertyInput } from "../../dashboard/types/property/CreatePropertyInput"
import type { Property } from "../../dashboard/types/property/property.interface"



export const PropertyService = {
    getProperties: async (): Promise<Property[]> => {
            const response = await apiClient.get('/property')
            return response.data
    },

    

    createProperty: async (data: CreatePropertyInput): Promise<Property> => {
        const response = await apiClient.post('/property/create', data)
        return response.data
    },

    deleteProperty: async (id: number): Promise<void> => {
        const response = await apiClient.delete(`/property/${id}`)
        return response.data
    },

    updateProperty: async (id: number, data: CreatePropertyInput): Promise<Property> => {
        const response = await apiClient.put(`/property/${id}`, data)
        return response.data
    }
}