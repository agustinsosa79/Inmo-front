import * as Switch from "@radix-ui/react-switch";

type PropertyFiltersProps = {
search: string
onSearchChange: (value: string) => void
operationType: string
onOperationTypeChange: (value: string) => void
propertyType: string
onPropertyTypeChange: (value: string) => void
status: string
onStatusChange: (value: string) => void
featured: boolean;
  onFeaturedChange: (value: boolean) => void;
}

export const PropertyFilters = ({ search, onSearchChange, operationType, onOperationTypeChange, propertyType, onPropertyTypeChange, status, onStatusChange, featured, onFeaturedChange  }: PropertyFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-5 lg:rounded-full lg:shadow-lg bg-white py-4">
      <input
        id="search-input"
        name="search"
        type="text"
        placeholder="Buscar"
        className=" lg:w-[20%] w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select name="operationType" value={operationType} onChange={(e) => onOperationTypeChange(e.target.value)} className="rounded-full border border-neutral-300 bg-white lg:w-[20%] w-full px-2 lg:px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        <option value="">Todas las operaciones</option>
        <option value="SALE">Venta</option>
        <option value="RENT">Alquiler</option>
      </select>

      <select name="propertyType" value={propertyType} onChange={(e) => onPropertyTypeChange(e.target.value)} className="rounded-full border border-neutral-300 bg-white lg:w-[20%] lg:px-4 w-full px-2 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        <option value="">Todos los tipos</option>
        <option value="APARTMENT">Departamento</option>
        <option value="HOUSE">Casa</option>
        <option value="FARM">Campo</option>
      </select>

      <select name="status" value={status} onChange={(e) => onStatusChange(e.target.value)} className="rounded-full border border-neutral-300 bg-white lg:w-[20%] w-full px-2 lg:px-4 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        <option value="">Todos los estados</option>
        <option value="AVAILABLE">Disponible</option>
        <option value="SOLD">Vendido</option>
        <option value="RESERVED">Reservado</option>
      </select>

      <label className="flex items-center gap-3 cursor-pointer">
  <span className="lg:text-xs text-xs text-neutral-700">
    Mostrar destacadas
  </span>

  <Switch.Root
    name="featured"
    checked={featured}
    onCheckedChange={onFeaturedChange}
    className="w-11 h-6 bg-zinc-300 rounded-full relative outline-none cursor-pointer transition-colors data-[state=checked]:bg-red-800"
  >
    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-6" />
  </Switch.Root>
</label>
    </div>
  )
}
