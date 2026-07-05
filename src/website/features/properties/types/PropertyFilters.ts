import type { PropertyType, TransactionType } from "../../../../features/dashboard/types/property/property.interface"

export interface IPropertyFilters {
    propertyType: PropertyType | "",
    transactionType: TransactionType | ""
    zoneId: number | ""
    search: string | ""
}