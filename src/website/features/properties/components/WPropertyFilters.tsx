import { useEffect, useState } from "react"
import type { IPropertyFilters } from "../types/PropertyFilters"
import { Search, ChevronDown, MapPin, Building, Handshake } from "lucide-react";
import { propertyTypeLabels, transactionTypeLabels } from "../constants/PropertyLabels"
import { useZoneStore } from "../../../../features/zones/store/zoneStore";



interface PropertFiltersProps {
    onSearch: (filters: IPropertyFilters) => void
}

const PropertyFilters = ({ onSearch }: PropertFiltersProps) => {
    const { zones, fetchZones, loaded,  }= useZoneStore()
    
    useEffect(() => {
      
        if(!loaded){
            fetchZones()
        }
    }, [loaded, fetchZones])


    


    const [filters, setFilters ] = useState<IPropertyFilters>({
        transactionType: "",
        propertyType: "",
        zoneId: "",
        search: ""
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setFilters((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    

  return (
    <div className="w-full  rounded-4xl border lg:drop-shadow-sm drop-shadow-xs drop-shadow-black lg:drop-shadow-black border-white/10 border-t-white/40 border-l-white/30 bg-linear-to-br from-black/10 to-transparent backdrop-blur-sm bg-black/10 lg:p-3 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.1fr_1.4fr_auto]">
        <Field id="transaction-type" label="Operación">
          <div className="relative">
            <Handshake size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white" />
            <select
            id="transaction-type"
    name="transactionType"
    value={filters.transactionType}
    onChange={handleChange}
    className="w-full appearance-none rounded-full border border-white/15 bg-black/30   text-white px-10 lg:py-4 lg:pr-10 lg:text-sm text-xs py-3  font-medium  outline-none transition focus:border-red-800/40 focus:ring-2 focus:ring-red-800/15"
  >
              <option value="" className="bg-white text-black">Todas</option>
               {Object.entries(transactionTypeLabels).map(([value, label]) => (
                 <option key={value} value={value} className="bg-white text-black">
                  {capitalize(label)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
          </div>
        </Field>

        <Field id="property-type" label="Tipo de propiedad">
          <div className="relative">

            <Building
    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white"
    size={18}
  />
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full appearance-none rounded-full border border-white/15 bg-black/30 px-10 py-3 lg:py-4 pr-10 text-white text-xs lg:text-sm font-medium outline-none transition focus:border-red-800/40 focus:ring-2 focus:ring-red-800/15"
            >
              <option value="" className="text-black bg-white">Todas</option>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value} className="text-black bg-white">
                  {label}
                </option>
                    ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </div>
        </Field>

        <Field id="zone" label="Localidad">
          <div className="relative">

            <MapPin
    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white"
    size={18}
  />
            <select
              name="zoneId"
              value={filters.zoneId}
              onChange={handleChange}
              className="w-full appearance-none rounded-full border border-white/15 bg-black/30 px-10 lg:py-4 pr-10 lg:text-sm py-3 text-xs font-medium text-white outline-none transition focus:border-red-800/40 focus:ring-2 focus:ring-red-800/15"
            >
              <option value="" className="text-black bg-white">Todas</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id} className="text-black bg-white">
                  {z.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white" />
          </div>
        </Field>

        <Field id="search" label="Buscar">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Barrio, calle, ambiente..."
              className="w-full rounded-full border border-white/15 bg-black/30 px-10 lg:py-4 lg:text-sm text-xs py-3 font-medium text-white outline-none transition placeholder:text-zinc-400 focus:border-red-800/40 focus:ring-2 focus:ring-red-800/15"
            />
          </div>
        </Field>

        <button
          onClick={() => onSearch(filters)}
          className="mt-auto col-span-2 lg:col-span-1 flex lg:py-4 py-3 text-xs rounded-full items-center justify-center gap-2 bg-red-800 px-10 lg:text-sm font-semibold tracking-wide text-white transition duration-300 hover:bg-red-900  active:scale-[0.98] cursor-pointer"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>
      </div>
    </div>
  )
}
const Field = ({
  label,
  children,
  id
}: {
  label: string;
  children: React.ReactNode;
  id: string;
}) => {
  return (
    <label id={id} className="block">
      <span className="mb-2 block lg:text-[11px] text-[9px] font-semibold uppercase ml-2 tracking-[0.22em] text-white/85">
        {label}
      </span>
      {children}
    </label>
  );
};

export default PropertyFilters