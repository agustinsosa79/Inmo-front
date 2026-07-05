import type { CreatePropertyInput } from "./CreatePropertyInput";

export const initialData: CreatePropertyInput = {
  title: "",
  description: "",
  price: 0,
  currency: "USD",
  type: "RENT",
  status: "DISPONIBLE",
  address: "",
  locationDescription: "",
  propertyType: "APARTMENT",
  totalArea: undefined,
  coveredArea: undefined,
  rooms: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  latitude: undefined,
  longitude: undefined,
  parkingSpaces: undefined,
  yearBuilt: undefined,
  zoneId: 0,
  isFeatured: false
};