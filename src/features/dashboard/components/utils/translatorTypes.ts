export const statusLabels = {
  AVAILABLE: "Disponible",
  SOLD: "Vendido",
  RENTED: "Alquilado",
  RESERVED: "Reservado",
} as const;

export const transactionTypeLabels = {
  SALE: "Venta",
  RENT: "Alquiler",
  TEMPORARY_RENT: "Alquiler temporal",

  EXCHANGE: "Permuta",
  COMMERCIAL_TRANSFER: "Fondo de comercio",
  DEVELOPMENT: "Emprendimiento en pozo",
} as const;

export const propertyTypeLabels = {
  HOUSE: "Casa",
  APARTMENT: "Departamento",
  PH: "PH",

  DUPLEX: "Dúplex",
  TRIPLEX: "Tríplex",

  LAND: "Terreno",
  LOT: "Lote",

  QUINTA: "Quinta",
  CHACRA: "Chacra",
  FARM: "Campo",

  LOCAL: "Local",
  OFFICE: "Oficina",
  CONSULTING_ROOM: "Consultorio",

  WAREHOUSE: "Galpón",
  STORAGE: "Depósito",

  GARAGE: "Garaje",

  BUILDING: "Edificio",
} as const;