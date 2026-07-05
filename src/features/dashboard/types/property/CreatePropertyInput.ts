import type { Currency, PropertyStatus, PropertyType, TransactionType } from "./property.interface";

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: number;
  currency: Currency;
  type: TransactionType;
  status: PropertyStatus;
  address: string;
  locationDescription: string;
  propertyType?: PropertyType;
  totalArea?: number;
  coveredArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  latitude?: number;
  longitude?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  zoneId: number;
    images?: {
    url: string;
    sortOrder: number;
  }[];
  isFeatured: boolean
}