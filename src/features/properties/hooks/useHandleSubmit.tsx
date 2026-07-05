// useHandleSubmit.ts
import { toast } from "react-hot-toast";
import { useState } from "react";
import type { CreatePropertyInput } from "../../dashboard/types/property/CreatePropertyInput";
import { usePropertyStore } from "../store/propertyStore";
import { buildPayload } from "../../dashboard/types/property/payloadProperty";
import { uploadImage } from "../services/uploadApi";
import { initialData } from "../../dashboard/types/property/initialData";

type Props = {
  formData: CreatePropertyInput;
  images: File[];
  zones: { id: number }[];
  setFormData: React.Dispatch<React.SetStateAction<CreatePropertyInput>>;
  clearAllImages: () => void;
};



const useHandleSubmit = ({
  formData,
  images,
  zones,
  setFormData,
  clearAllImages,
}: Props) => {
  const createProperty = usePropertyStore((s) => s.createProperty);
  const loading = usePropertyStore((s) => s.loading);
  const [submitting, setSubmitting] = useState(false);
  const {properties} = usePropertyStore()
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    

    const payload = buildPayload({
      formData
    });
    
    if(payload.isFeatured) {
      const featuredCount = properties.filter(p => p.isFeatured).length;

      if(featuredCount >= 10)  {
        return toast.error("Ya existen 6 propiedades destacadas.")
      }
    }


    if (!payload.title.trim()) {
      return toast.error("Título requerido");
    }

    if (!payload.locationDescription.trim()) {
      return toast.error("Ubicación requerida");
    }
    
        if (!payload.zoneId || payload.zoneId === 0) {
          if (zones.length > 0) {
            payload.zoneId = zones[0].id;
          } else {
            toast.error("Selecciona una zona");
            return;
          }
        }

    if (!payload.price || payload.price === 0) {
      return toast.error("Precio requerido");
    }

    if(payload.price <= 0) {
      return toast.error("El precio debe ser mayor a 0")
    }

    if(!payload.address || payload.address === "") {
      return toast.error("Direccion requerida")
    }

    if (payload.bedrooms === undefined || payload.bedrooms < 0 ) {
      return toast.error("Habitaciones requerida/s");
    }

    if (payload.bathrooms === undefined || payload.bathrooms < 0 ) {
      return toast.error("Baños requerido/s");
    }

    if (images.length === 0) {
  return toast.error("Debes subir al menos una imagen");
}

if(!payload.latitude || payload.latitude === null && !payload.longitude || payload.longitude === null){
  return toast.error("Debes agregar una ubicacion en el mapa")
}


    if (
  payload.totalArea === undefined ||
  payload.totalArea < 0
) {
  return toast.error("Metros cuadrados requeridos");
}

if (
  payload.parkingSpaces === undefined ||
  payload.parkingSpaces < 0
) {
  return toast.error("Cochera requerida");
}


    if (!payload.description.trim()) {
     return toast.error("Descripción requerida/s");
    }
    

    

    try {
      setSubmitting(true);
      const uploadedImages = [];
      for (const image of images) {
        const res = await uploadImage(image);
        uploadedImages.push(res);
      }

      const finalPayload = {
        ...payload,
        images: uploadedImages.map((uploadedImage, index) => ({
          url: uploadedImage.url,
          sortOrder: index,
        })),
      }


      await createProperty(finalPayload as unknown as CreatePropertyInput);

      console.log("Payload enviado:", finalPayload);
      toast.success("Propiedad creada correctamente");
      
      setFormData(initialData);
      clearAllImages();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      return toast.error("Error al crear la propiedad");
    }
  };

  return {
    handleSubmit,
    loading,
    submitting,
  };
};

export default useHandleSubmit;