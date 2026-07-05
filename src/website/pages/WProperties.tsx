import { Link, useSearchParams } from "react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { transactionTypeLabels, propertyTypeLabels } from "../features/properties/constants/PropertyLabels";
import { capitalizar } from "../../features/dashboard/components/utils/Capitalizar";
import FilterAccordion from "../components/ui/FilterAccordion";
import { Rows2, Columns2, SlidersHorizontal, X } from "lucide-react";
import type { Property } from "../../features/dashboard/types/property/property.interface";
import { usePropertyStore } from "../../features/properties/store/propertyStore";
import { useZoneStore } from "../../features/zones/store/zoneStore";
import PropertyCard from "../features/properties/components/PropertyCard";

const transactionTypeEntries = Object.entries(transactionTypeLabels);
const propertyTypeEntries = Object.entries(propertyTypeLabels);

function applyFilters(
  properties: Property[],
  params: URLSearchParams,
  except?: string
) {
  const get = (key: string) => (except === key ? null : params.get(key));

  const transactionType = get("transactionType");
  const propertyType = get("propertyType");
  const zoneId = get("zoneId");
  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const bedrooms = get("bedrooms");
  const bathrooms = get("bathrooms");
  const parkingSpaces = get("parkingSpaces");
  const search = get("search");

  return properties.filter((property) => {
    const matchesTransaction = !transactionType || property.type === transactionType;
    const matchesPropertyType = !propertyType || property.propertyType === propertyType;
    const matchesZone = !zoneId || property.zoneId === Number(zoneId);
    const matchesMinPrice = !minPrice || property.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || property.price <= Number(maxPrice);
    const matchesBedrooms = !bedrooms || (property.bedrooms ?? 0) === Number(bedrooms);
    const matchesBathrooms = !bathrooms || (property.bathrooms ?? 0) === Number(bathrooms);
    const matchesParking = !parkingSpaces || (property.parkingSpaces ?? 0) === Number(parkingSpaces);

    const matchesSearch = (() => {
      if (!search) return true;
      const term = search.toLowerCase();

      const haystack = [
        property.title,
        property.address,
        property.zone?.name,
        property.locationDescription,
        transactionTypeLabels[property.type],
        property.propertyType ? propertyTypeLabels[property.propertyType] : null,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    })();
      
    return (
      matchesTransaction &&
      matchesPropertyType &&
      matchesZone &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesParking &&
      matchesSearch
    );
  });
}

const WProperties = () => {
  const { loadProperties, loaded, properties } = usePropertyStore();
  const { zones, fetchZones } = useZoneStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [columns, setColumns] = useState<1 | 2>(2);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [priceDraft, setPriceDraft] = useState({
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  });

  useEffect(() => {
    if (!loaded) loadProperties();
  }, [loaded, loadProperties]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (priceDraft.minPrice) params.set("minPrice", priceDraft.minPrice);
    else params.delete("minPrice");
    if (priceDraft.maxPrice) params.set("maxPrice", priceDraft.maxPrice);
    else params.delete("maxPrice");
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setPriceDraft({ minPrice: "", maxPrice: "" });
    setSearchParams(new URLSearchParams());
  };

  const buildOptions = useCallback(
    (
      key: string,
      valueGetter: (p: Property) => string | number | null | undefined
    ) => {
      const base = applyFilters(properties, searchParams, key);
      const counts = new Map<string, number>();

      base.forEach((p) => {
        const v = valueGetter(p);
        if (v === null || v === undefined) return;
        const k = String(v);
        counts.set(k, (counts.get(k) ?? 0) + 1);
      });

      return counts;
    },
    [properties, searchParams]
  );

  const transactionCounts = useMemo(() => buildOptions("transactionType", (p) => p.type), [buildOptions]);
  const propertyTypeCounts = useMemo(() => buildOptions("propertyType", (p) => p.propertyType), [buildOptions]);
  const zoneCounts = useMemo(() => buildOptions("zoneId", (p) => p.zoneId), [buildOptions]);
  const bedroomCounts = useMemo(() => buildOptions("bedrooms", (p) => p.bedrooms), [buildOptions]);
  const bathroomCounts = useMemo(() => buildOptions("bathrooms", (p) => p.bathrooms), [buildOptions]);
  const parkingCounts = useMemo(() => buildOptions("parkingSpaces", (p) => p.parkingSpaces), [buildOptions]);

  const filteredProperties = useMemo(() => applyFilters(properties, searchParams), [properties, searchParams]);
  const sort = searchParams.get("sort");
  
  const sortedProperties = useMemo(() => {
    const sort = searchParams.get("sort");
    const base = [...filteredProperties];
    
    if (sort === "price_asc") return base.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return base.sort((a, b) => b.price - a.price);
    if (sort === "featured") return base.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    return base;
  }, [filteredProperties, searchParams]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage) || 1;
  
  useEffect(() => {
    return () => setCurrentPage(1);
  }, [searchParams]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProperties, currentPage]);

  const currentTransaction = searchParams.get("transactionType");
  const collectionTitle = currentTransaction 
    ? `${transactionTypeLabels[currentTransaction as keyof typeof transactionTypeLabels].toLocaleLowerCase()} de Inmuebles`
    : "Catálogo General";

  // Renderizador unificado para evitar duplicación de código de filtros
  const renderFilterList = () => (
    <>
      <FilterAccordion
        title="Tipo"
        selectedValue={searchParams.get("transactionType") ?? ""}
        onSelect={(v) => setFilter("transactionType", v)}
        defaultOpen
        options={transactionTypeEntries.map(([value, label]) => ({
          value,
          label,
          count: transactionCounts.get(value) ?? 0,
        }))}
      />

      <FilterAccordion
        title="Tipo de propiedad"
        selectedValue={searchParams.get("propertyType") ?? ""}
        onSelect={(v) => setFilter("propertyType", v)}
        options={propertyTypeEntries.map(([value, label]) => ({
          value,
          label,
          count: propertyTypeCounts.get(value) ?? 0,
        }))}
      />

      <FilterAccordion
        title="Localidad"
        selectedValue={searchParams.get("zoneId") ?? ""}
        onSelect={(v) => setFilter("zoneId", v)}
        options={zones.map((zone) => ({
          value: String(zone.id),
          label: capitalizar(zone.name ?? `Zona ${zone.id}`),
          count: zoneCounts.get(String(zone.id)) ?? 0,
        }))}
      />

      <FilterAccordion
        title="Dormitorios"
        selectedValue={searchParams.get("bedrooms") ?? ""}
        onSelect={(v) => setFilter("bedrooms", v)}
        options={[1, 2, 3, 4, 5].map((n) => ({
          value: String(n),
          label: n === 5 ? "5 o más" : `${n} dormitorio${n > 1 ? "s" : ""}`,
          count: bedroomCounts.get(String(n)) ?? 0,
        }))}
      />

      <FilterAccordion
        title="Baños"
        selectedValue={searchParams.get("bathrooms") ?? ""}
        onSelect={(v) => setFilter("bathrooms", v)}
        options={[1, 2, 3, 4].map((n) => ({
          value: String(n),
          label: n === 4 ? "4 o más" : `${n} baño${n > 1 ? "s" : ""}`,
          count: bathroomCounts.get(String(n)) ?? 0,
        }))}
      />

      <FilterAccordion
        title="Cocheras"
        selectedValue={searchParams.get("parkingSpaces") ?? ""}
        onSelect={(v) => setFilter("parkingSpaces", v)}
        options={[1, 2, 3].map((n) => ({
          value: String(n),
          label: n === 3 ? "3 o más" : `${n} cochera${n > 1 ? "s" : ""}`,
          count: parkingCounts.get(String(n)) ?? 0,
        }))}
      />

      <div className="py-4">
        <span className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
          Precio (USD)
        </span>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={priceDraft.minPrice}
            onChange={(e) => setPriceDraft((prev) => ({ ...prev, minPrice: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-800"
          />
          <input
            type="number"
            placeholder="Máx"
            value={priceDraft.maxPrice}
            onChange={(e) => setPriceDraft((prev) => ({ ...prev, maxPrice: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-800"
          />
        </div>
        <button
          type="button"
          onClick={() => { applyPriceFilter(); setIsMobileFiltersOpen(false); }}
          className="mt-3 w-full rounded-lg bg-red-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-950 cursor-pointer"
        >
          Aplicar precio
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-center px-2 md:px-10 max-w-8xl py-11 h-full bg-[#F4F1EA]">
      {/* Breadcrumbs */}
      <div className="lg:mb-10 ml-5 mb-5 flex w-full max-w-7xl items-center gap-2 lg:text-sm text-xs text-zinc-500 uppercase lg:tracking-widest">
        <Link to="/" className="hover:text-red-800 transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/propiedades" className="hover:text-red-800 text-red-800 transition-colors">Propiedades</Link>
      </div>

      <div className="flex gap-8 items-start justify-center max-w-7xl w-full">
        
        {/* ===== SIDEBAR ESCRITORIO ===== */}
        <aside className="hidden lg:block w-72 shrink-0 rounded-2xl bg-white px-6 shadow-sm sticky top-6">
          <div className="flex items-center justify-between py-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 libre-baskerville-hero">
              Filtros
            </h3>
            {searchParams.size > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-medium text-red-800 hover:underline cursor-pointer"
              >
                Limpiar todo
              </button>
            )}
          </div>
          {renderFilterList()}
        </aside>

        {/* ===== MODAL / DRAWER MÓVIL ===== */}
        {isMobileFiltersOpen && (
  <div className="fixed inset-0 z-50 flex lg:hidden">
    {/* Backdrop */}
    <div 
      className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity"
      onClick={() => setIsMobileFiltersOpen(false)}
    />
    {/* Contenedor del Drawer */}
    <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-xl overflow-y-auto h-full mr-auto">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-2">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 libre-baskerville-hero">
            Filtros
          </h3>
          {/* AGREGAMOS EL BOTÓN ACÁ TAMBIÉN */}
          {searchParams.size > 0 && (
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setIsMobileFiltersOpen(false); // Cerramos el modal al limpiar para mejorar UX
              }}
              className="text-xs font-medium text-red-800 hover:underline cursor-pointer"
            >
              Limpiar todo
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(false)}
          className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
      {renderFilterList()}
    </div>
  </div>
)}

        {/* ===== CONTENIDO PRINCIPAL ===== */}
        <main className="flex-1 min-w-0 flex flex-col gap-8 w-full">
          
          {/* Header de Resultados */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm border border-zinc-100">
            <div className="flex flex-col gap-0.5 text-left">
              <h2 className="text-red-950 text-xl font-bold libre-baskerville-hero tracking-tight capitalize">
                {collectionTitle}
              </h2>
              <p className="text-[10px]  tracking-[0.15em] font-bold text-zinc-400">
                Inmuebles Destacados • Buenos Aires, ARG
              </p>
            </div>
            
            {/* Controles: Filtros Móvil, Orden y Grilla */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {/* Botón Gatillo Filtros Móvil */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm text-zinc-900 font-medium transition-colors hover:bg-zinc-100/70 cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Filtros</span>
                {searchParams.size > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-800 text-[10px] font-bold text-white">
                    {searchParams.size}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <select
                  value={sort ?? ""}
                  onChange={(e) => setFilter("sort", e.target.value)}
                  className="rounded-full border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-900 font-medium outline-none focus:border-red-800 cursor-pointer transition-colors hover:bg-zinc-100/70"
                >
                  <option value="">Ordenar por</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="featured">Destacadas primero</option>
                </select>

                <div className="hidden sm:flex items-center gap-1 rounded-xl border border-zinc-200 p-1 bg-zinc-50/30">
                  <button
                    type="button"
                    onClick={() => setColumns(1)}
                    aria-label="Ver en una columna"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                      columns === 1 ? "bg-red-800 text-white shadow-xs" : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    <Rows2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setColumns(2)}
                    aria-label="Ver en dos columnas"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                      columns === 2 ? "bg-red-800 text-white shadow-xs" : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    <Columns2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de Vacío */}
          {paginatedProperties.length === 0 && (
            <div className="flex h-96 items-center justify-center rounded-2xl bg-white shadow-sm">
              <p className="text-xl text-zinc-500">No se encontraron propiedades.</p>
            </div>
          )}

          {/* Grilla de Tarjetas */}
          <div className={`grid grid-cols-1 lg:gap-8 gap-4 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"} w-full`}>
            {paginatedProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm border border-zinc-100 w-fit mx-auto">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 transition border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-8 w-8 rounded-lg text-xs font-bold font-mono transition cursor-pointer flex items-center justify-center ${
                      currentPage === page
                        ? "bg-red-800 text-white shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100 border border-transparent"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 transition border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WProperties;