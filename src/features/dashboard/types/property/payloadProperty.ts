import type { CreatePropertyInput } from "./CreatePropertyInput";

const statusToApi = {
  DISPONIBLE: "AVAILABLE",
  VENDIDO: "SOLD",
  ALQUILADO: "RENTED",
  RESERVADO: "RESERVED",
} as const;

type ApiCreatePropertyInput = {
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'ARS' | 'EUR';
  address: string;
  locationDescription: string;
  status: 'AVAILABLE' | 'SOLD' | 'RENTED' | 'RESERVED';
  type:
  | 'SALE'
  | 'RENT'
  | 'TEMPORARY_RENT'
  | 'EXCHANGE'
  | 'COMMERCIAL_TRANSFER'
  | 'DEVELOPMENT';
  propertyType?:
  | 'HOUSE'
  | 'APARTMENT'
  | 'PH'
  | 'DUPLEX'
  | 'TRIPLEX'
  | 'LAND'
  | 'LOT'
  | 'QUINTA'
  | 'CHACRA'
  | 'FARM'
  | 'LOCAL'
  | 'OFFICE'
  | 'CONSULTING_ROOM'
  | 'WAREHOUSE'
  | 'STORAGE'
  | 'GARAGE'
  | 'BUILDING';
  zoneId: number;
  totalArea?: number;
  coveredArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  latitude?: number;
  longitude?: number;
  images?: Array<{
    url: string,
    sortOrder: number,
  }>;
  isFeatured: boolean
};

type BuildPayloadProps = {
  formData: CreatePropertyInput;
};

export const buildPayload = ({
  formData,
}: BuildPayloadProps): ApiCreatePropertyInput => {
  return {
    title: formData.title,
    description: formData.description,
    price: formData.price,
    currency: formData.currency,
    address: formData.address,
    locationDescription: formData.locationDescription,

    status:
      statusToApi[
        formData.status as keyof typeof statusToApi
      ] ?? "AVAILABLE",

    type: formData.type,

    propertyType: formData.propertyType,

    zoneId: formData.zoneId,
    totalArea: formData.totalArea,
    coveredArea: formData.coveredArea,
    rooms: formData.rooms,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    parkingSpaces: formData.parkingSpaces,
    yearBuilt: formData.yearBuilt,
    latitude: formData.latitude,
    longitude: formData.longitude,
    isFeatured: formData.isFeatured
  };
};