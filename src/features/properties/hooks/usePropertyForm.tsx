import { useState } from "react";
import type { CreatePropertyInput } from "../../dashboard/types/property/CreatePropertyInput";

const numberFields = [
  "price",
  "totalArea",
  "coveredArea",
  "rooms",
  "bedrooms",
  "bathrooms",
  "parkingSpaces",
  "yearBuilt",
  "zoneId",
];

const usePropertyForm = (initialData: CreatePropertyInput) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
    const { checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    return;
  }
 
    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name)
        ? value === ""
          ? undefined
          : Number(value)
        : value,
    }));
  };

  return {
    formData,
    handleChange,
    setFormData
  };
};

export default usePropertyForm;