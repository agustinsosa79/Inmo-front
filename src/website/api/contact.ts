import { apiClient } from "../../api/apiClient"



export const ContactService = {
    sendContact: async (data:{
        name: string,
        email: string,
        phone: string,
        message: string
    }) => {
        const res = await apiClient.post("/contact", data)
        return res.data
    },

    sendAdvisor: async (data: {
        name: string,
        email: string,
        phone: string,
        message: string
    }) => {
        const res = await apiClient.post("/contact/advisor", data)

        return res.data
    }
}