export interface Category {
    title: string;
    subtitle: string;
    propertyType: "HOUSE" | "APARTMENT";
    operation: "SALE" | "RENT";
    image: string;
}