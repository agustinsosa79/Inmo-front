import type { Image } from "../image/image.interface";
import type { Zone } from "../zones/Zone.interface";

export type Currency = 'USD' | 'ARS' | 'EUR';

export type PropertyStatus = 'DISPONIBLE' | 'VENDIDO' | 'ALQUILADO' | 'RESERVADO';

export type TransactionType =
  | 'SALE'
  | 'RENT'
  | 'TEMPORARY_RENT'
  | 'EXCHANGE'
  | 'COMMERCIAL_TRANSFER'
  | 'DEVELOPMENT';

export type PropertyType =
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


export interface Property {
  id: number;

  title: string;
  description: string;
  slug: string;

  price: number;
  currency: Currency;

  status: PropertyStatus;
  type: TransactionType;

  address: string;
  locationDescription: string;

  latitude: number;
  longitude: number;

  propertyType?: PropertyType;

  totalArea?: number;
  coveredArea?: number;

  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;

  parkingSpaces?: number;

  yearBuilt?: number;

  images: Image[];

  zoneId: number;
  zone: Zone;

  createdAt?: string;
  updatedAt?: string;
  isFeatured: boolean
}