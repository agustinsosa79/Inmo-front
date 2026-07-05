import type { Category } from "../types/category.types";

import houseSale from "../../../assets/cards-category/house-sale.webp";
import apartmentSale from "../../../assets/cards-category/apartment-sale.webp";
import houseRent from "../../../assets/cards-category/house-rent.webp"
import apartmentRent from "../../../assets/cards-category/apartment-rent.webp";

export const categories: Category[] = [
    {
        title: "Casas en venta",
        subtitle: "Encontrá la casa ideal para vos.",
        propertyType: "HOUSE",
        operation: "SALE",
        image: houseSale,
    },
    {
        title: "Departamentos en venta",
        subtitle: "Opciones para vivir o invertir.",
        propertyType: "APARTMENT",
        operation: "SALE",
        image: apartmentSale,
    },
    {
        title: "Casas en alquiler",
        subtitle: "Mudate con la comodidad que buscás.",
        propertyType: "HOUSE",
        operation: "RENT",
        image: houseRent,
    },
    {
        title: "Departamentos en alquiler",
        subtitle: "Espacios modernos para cada estilo de vida.",
        propertyType: "APARTMENT",
        operation: "RENT",
        image: apartmentRent,
    },
];