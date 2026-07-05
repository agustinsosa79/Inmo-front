import { apiClient } from "../../../api/apiClient";

type uploadResponse = {
    url: string, 
    publicId: string
}


export const uploadImage = async (file: File): Promise<uploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } =  await  apiClient.post('/upload', formData, { 
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return data
}