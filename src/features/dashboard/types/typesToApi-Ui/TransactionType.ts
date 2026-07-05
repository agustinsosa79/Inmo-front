export const transactionTypeToApi = {
  VENTA: "SALE",
  ALQUILER: "RENT",
  ALQUILER_TEMPORAL: "TEMPORARY_RENT",

  PERMUTA: "EXCHANGE",
  FONDO_DE_COMERCIO: "COMMERCIAL_TRANSFER",
  EMPRENDIMIENTO: "DEVELOPMENT",
} as const;

export const transactionTypeToUI = {
  SALE: "Venta",
  RENT: "Alquiler",
  TEMPORARY_RENT: "Temporal",

  EXCHANGE: "Permuta",
  COMMERCIAL_TRANSFER: "Fondo de comercio",
  DEVELOPMENT: "Emprendimiento",
} as const;