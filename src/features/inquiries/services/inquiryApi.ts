import { apiClient } from "../../../api/apiClient"

export type CreateInquiryInput = {
    name: string,
    email: string,
    phone: string,
    message: string,
    propertyId: number
}


export type Inquiry= {
    id: number
    name: string
    email:string
    phone:string | null
    message: string
    address: string
    isRead: boolean
    isContacted: boolean
    propertyId:number
    createdAt: string
    property: {
        id: number,
        title: string,
        address: string
        zone: {
            id: number,
            name: string
        }
        slug:string
    }
}

export const InquiryApi =  {
    create: async (data: CreateInquiryInput): Promise<Inquiry> => {
        const response = await apiClient.post("/inquiries", data)
        return response.data
    },

    getAll: async (propertyId: number): Promise<Inquiry[]>  => {
        const response = await apiClient.get("/inquiries", {
            params: propertyId ? { propertyId } : undefined
        })
        return response.data
    },

    markAsRead: async (id: number, isRead: boolean): Promise<Inquiry> => {
        const response = await apiClient.patch(`/inquiries/${id}/read`, { isRead })
        return response.data
    },

    markAsContacted: async (id: number, isContacted: boolean): Promise<Inquiry> => {
        const response = await apiClient.patch(`/inquiries/${id}/contacted`, { isContacted })

        return response.data
    },

    deleteInquiry: async (id: number) => {
        const response = await apiClient.delete(`/inquiries/${id}/delete`)
        return response.data
    }
}