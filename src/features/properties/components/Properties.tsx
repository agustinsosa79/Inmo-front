import { useEffect, useState } from "react";
import DetailsProperty from "./DetailsProperty";
import { PencilLine, Trash, FileSearchCorner, User, LogOut, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import { PropertyFilters } from "./PropertyFilters";
import { usePropertyStore } from "../store/propertyStore";
import PropertyModal from "./PropertyModal";
import { capitalizar } from "../../dashboard/components/utils/Capitalizar";
import ConfirmModal from "../../dashboard/components/utils/ConfirmModal";
import { getThumbnailUrl } from "../../dashboard/components/utils/getThumbnailUrl";
import { statusLabels, transactionTypeLabels } from "../../dashboard/components/utils/translatorTypes";
import { useAuthStore } from "../../../store/useAuthStore";
import LogoutModal from "../../auth/components/sign-out/LogoutModal";

const Properties = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [modalType, setModalType] = useState<'view' | 'edit' | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<typeof properties[number] | null>(null);
  const { properties, loadProperties, deleteProperty, updateProperty } = usePropertyStore();
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectProperty, setSelectProperty] = useState<{ id: number; title: string | null } | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [operationType, setOperation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(search.toLowerCase()) ||
      property.address?.toLowerCase().includes(search.toLowerCase()) ||
      property.zone?.name.toLowerCase().includes(search.toLowerCase());
    const matchesOperationType = operationType ? property.type === operationType : true;
    const matchesPropertyType = propertyType ? property.propertyType === propertyType : true;
    const matchesStatus = status ? property.status === status : true;
    const matchesFeatured = isFeatured ? property.isFeatured === isFeatured : true;
    return matchesSearch && matchesOperationType && matchesPropertyType && matchesStatus && matchesFeatured;
  });

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const handleOpenDelete = (property: { id: number; title: string | null }) => {
    setSelectProperty(property);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectProperty) return;
    await deleteProperty(selectProperty.id);
    toast.success(`La Propiedad (${selectProperty.title}) ha sido eliminada`);
    setOpen(false);
  };

  const filterProps = {
    search, onSearchChange: setSearch,
    status, onStatusChange: setStatus,
    operationType, onOperationTypeChange: setOperation,
    propertyType, onPropertyTypeChange: setPropertyType,
    featured: isFeatured, onFeaturedChange: setIsFeatured,
  };

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-[#F4F1EA] lg:min-h-screen">

      {/* ===== HEADER ===== */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-[#F4F1EA] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-red-950" />
          <div>
            <h2 className="libre-baskerville-hero text-xl font-bold text-red-950 tracking-tight sm:text-2xl">
              Propiedades
            </h2>
            <p className="hidden text-[11px] font-medium text-slate-400 tracking-tight sm:block">
              Administración y gestión de catálogo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Usuario — se oculta en mobile muy chico */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
              <User size={16} />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {user?.name || "Agente"}
              </p>
              <p className="text-[11px] font-medium text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="hidden h-5 w-px bg-slate-200 sm:block" />

          <button
            onClick={() => setOpenLogout(true)}
            className="flex items-center gap-2 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-red-900"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {openLogout && <LogoutModal onClose={() => setOpenLogout(false)} onConfirm={logout} />}

      {/* ===== FILTROS — desktop inline, mobile drawer ===== */}

      {/* Botón "Filtros" visible solo en mobile */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-800 hover:text-red-800 cursor-pointer"
        >
          <SlidersHorizontal size={13} />
          Filtros
        </button>
      </div>

      {/* Filtros inline — solo desktop */}
      <div className="hidden shrink-0 px-6 pb-3 lg:block">
        <PropertyFilters {...filterProps} />
      </div>

      {/* Drawer de filtros — solo mobile */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 flex flex-col h-full w-80 max-w-[90vw] overflow-y-auto bg-white px-5 pb-8 pt-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="libre-baskerville-hero text-sm font-bold uppercase tracking-widest text-zinc-900">Filtros</span>
              <button type="button" onClick={() => setFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <PropertyFilters {...filterProps} />
            <button type="button" onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-red-800 py-3 text-sm font-semibold text-white cursor-pointer"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}

      {/* ===== TABLA / CARDS ===== */}
      <div className="flex-1 h-full lg:overflow-hidden overflow-y-auto px-4 pb-8 sm:px-6">
        <div className="flex flex-col rounded-3xl h-full border border-neutral-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-y-auto">

          {/* Header tabla */}
          <div className="flex items-center justify-between border-b  border-neutral-100 bg-white px-6 py-4">
            <h3 className="libre-baskerville-hero text-xs uppercase tracking-[0.25em] text-red-900">
              Inventario de Propiedades
            </h3>
            <div className="hidden rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-400 tracking-wide sm:block">
              {filteredProperties.length} resultados
            </div>
          </div>

          {/* Filas */}
          {filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <p className="text-sm font-medium text-neutral-400">No se encontraron propiedades...</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y overflow-auto divide-neutral-100">
              {filteredProperties.map((p) => (
                <div key={p.id} className="flex flex-col gap-4 px-4 py-5 transition hover:bg-neutral-50/60 sm:px-6 lg:flex-row lg:items-center lg:gap-6">

                  {/* Bloque imagen + datos */}
                  <div className="flex flex-1 items-start gap-4 min-w-0 lg:items-center">
                    <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-100 shadow-sm sm:h-28 sm:w-36">
                      <img
                        loading="lazy"
                        src={getThumbnailUrl(p.images?.[0]?.url)}
                        alt={p.title ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                          {transactionTypeLabels[p.type as keyof typeof transactionTypeLabels] ?? p.type}
                        </span>
                        <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                          {statusLabels[p.status as keyof typeof statusLabels] ?? p.status}
                        </span>
                      </div>

                      <h2 className="libre-baskerville-hero truncate lg:text-base text-sm font-bold text-neutral-900 sm:text-lg">
                        {p.title}
                      </h2>
                      <p className="mt-0.5 truncate lg:text-sm text-xs font-medium text-neutral-500">
                        {p.address} · {capitalizar(p.zone?.name || `Zona ${p.zoneId}`)}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 lg:text-[11px] text-[9px] font-semibold text-neutral-500">
                        <span className="rounded-lg border border-neutral-200 bg-white px-2 py-1">{p.bedrooms ?? 0} Hab</span>
                        <span className="rounded-lg border border-neutral-200 bg-white px-2 py-1">{p.bathrooms ?? 0} Baño</span>
                        <span className="rounded-lg border border-neutral-200 bg-white px-2 py-1">{p.totalArea ?? 0} m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end lg:px-6">
                    <span className="libre-baskerville-hero text-sm font-semibold tracking-[0.2em] text-neutral-600">
                      Valor
                    </span>
                    <span className="libre-baskerville-hero text-base font-semibold text-red-900 sm:text-lg">
                      {p.currency} {p.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 border-t border-neutral-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <button
                      onClick={() => { setSelectedProperty(p); setModalType('view'); }}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-red-800 hover:text-red-800"
                      title="Ver propiedad"
                    >
                      <FileSearchCorner size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => { setSelectedProperty(p); setModalType('edit'); }}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-red-800 hover:text-red-800"
                      title="Editar propiedad"
                    >
                      <PencilLine size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(p)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full bg-red-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                      <Trash size={14} strokeWidth={2} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODALES ===== */}
      {modalType === 'edit' && selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => { setModalType(null); setSelectedProperty(null); }}
          onUpdate={updateProperty}
        />
      )}

      {modalType === 'view' && selectedProperty && (
        <DetailsProperty
          property={selectedProperty}
          onClose={() => { setModalType(null); setSelectedProperty(null); }}
        />
      )}

      <ConfirmModal
        open={open}
        title={`¿Estás seguro que querés eliminar esta propiedad? (${capitalizar(selectProperty?.title ?? "")})`}
        description="Esta acción no se puede deshacer."
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Properties;