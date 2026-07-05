import type { Property } from "../../../../features/dashboard/types/property/property.interface"

const PRICE_RANGE = 0.2

// Puntos por criterio cumplido. Zona pesa más que tipo, que pesa más que
// precio — así una propiedad que comparte zona queda mejor rankeada que
// una que solo coincide en precio, aunque ambas "entren" igual al filtro.
const SCORE_ZONE = 3
const SCORE_TYPE = 2
const SCORE_PRICE = 1

type ScoredProperty = {
  property: Property
  score: number
}

export const getAllRelatedProperties = (currentProperty: Property, allProperties: Property[]) => {

  const minPrice = currentProperty.price - (currentProperty.price * PRICE_RANGE)
  const maxPrice = currentProperty.price + (currentProperty.price * PRICE_RANGE)

  // Paso 1: calculamos el puntaje de relación para cada propiedad candidata
  // (excluyendo la actual). Una propiedad que no cumple NINGÚN criterio
  // queda con score 0, y la descartamos más abajo.
  const scored: ScoredProperty[] = allProperties
    .filter((p) => p.id !== currentProperty.id)
    .map((p) => {
      let score = 0

      const sameZone = p.zone.id === currentProperty.zone.id
      const sameType = p.propertyType === currentProperty.propertyType
      const similarPrice = p.price >= minPrice && p.price <= maxPrice

      if (sameZone) score += SCORE_ZONE
      if (sameType) score += SCORE_TYPE
      if (similarPrice) score += SCORE_PRICE

      return { property: p, score }
    })
    .filter((entry) => entry.score > 0)

  // Paso 2: ordenamos de mayor a menor puntaje — las más relacionadas primero.
  scored.sort((a, b) => b.score - a.score)

  const related = scored.map((entry) => entry.property)

  if (related.length >= 8) {
    return related.slice(0, 8)
  }

  // Paso 3: completamos con destacadas si faltan, evitando duplicados.
  const missingCount = 8 - related.length

  const featuredToFill = allProperties.filter((p) => {
    const itsNotCurrent = p.id !== currentProperty.id
    const isFeatured = p.isFeatured
    const alreadyIncluded = related.some((r) => r.id === p.id)
    return itsNotCurrent && isFeatured && !alreadyIncluded
  }).slice(0, missingCount)

  return [...related, ...featuredToFill]
}