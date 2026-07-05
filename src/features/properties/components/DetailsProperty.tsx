import { type JSX, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, Bed, Car, DoorOpen, MapPin, X } from "lucide-react";
import type { Property } from "../../dashboard/types/property/property.interface";
import { propertyTypeLabels, statusLabels, transactionTypeLabels } from "../../dashboard/components/utils/translatorTypes";
import { capitalizar } from "../../dashboard/components/utils/Capitalizar";

interface DetailsPropertyProps {
  property: Property;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  SOLD: "bg-red-100 text-red-800",
  RENTED: "bg-blue-100 text-blue-800",
  RESERVED: "bg-amber-100 text-amber-800",
};

const DetailsProperty = ({ property, onClose }: DetailsPropertyProps): JSX.Element => {
  const statusLabel = statusLabels[property.status as keyof typeof statusLabels] ?? property.status;
  const transactionLabel = transactionTypeLabels[property.type as keyof typeof transactionTypeLabels] ?? property.type;
  const propertyTypeLabel = propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels] ?? property.propertyType;

  const [currentImage, setCurrentImage] = useState(0);
  const images = property.images ?? [];
  const mainImage = images[currentImage]?.url;

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <article className="relative flex h-[90vh] w-full max-w-9/12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-700 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* COLUMNA IZQUIERDA — Imagen */}
        <div className="relative hidden w-[45%] shrink-0 lg:block">
          {mainImage ? (
            <img
              loading="lazy"
              src={mainImage}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
              Sin imágenes
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70 cursor-pointer"
              >
                <ArrowRight size={18} />
              </button>
              <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                {currentImage + 1} / {images.length}
              </span>
            </>
          )}

          {/* Badge de tipo de operación sobre la imagen */}
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-red-800 shadow-sm">
            {transactionLabel}
          </span>
        </div>

        {/* COLUMNA DERECHA — Info */}
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

          {/* HEADER INFO */}
          <div className="border-b border-slate-100 px-7 py-6 pr-14">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${statusColors[property.status] ?? "bg-slate-100 text-slate-700"}`}>
                {statusLabel}
              </span>
              {propertyTypeLabel && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  {propertyTypeLabel}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-light text-slate-900 libre-baskerville-hero">
              {property.title}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={14} className="shrink-0 text-red-800" />
              {property.address}
              {property.locationDescription && ` · ${property.locationDescription}`}
              {property.zone?.name && ` · ${capitalizar(property.zone.name)}`}
            </p>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Precio</p>
              <p className="mt-1 text-3xl font-light text-slate-900 libre-baskerville-hero">
                {property.currency} {property.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* CARACTERÍSTICAS EN UNA SOLA FILA */}
          <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            {[
              { icon: Bed, label: "Hab.", value: property.bedrooms ?? 0 },
              { icon: Bath, label: "Baños", value: property.bathrooms ?? 0 },
              { icon: DoorOpen, label: "Amb.", value: property.rooms ?? 0 },
              { icon: Car, label: "Cochera", value: property.parkingSpaces ?? 0 },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1">
                <Icon size={16} className="text-red-800" />
                <span className="text-lg font-semibold text-slate-900">{value}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">{label}</span>
              </div>
            ))}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="px-7 py-5 border-b border-slate-100">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-950 libre-baskerville-hero">
              Descripción
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              {property.description || "Sin descripción"}
            </p>
          </div>

          {/* INFORMACIÓN GENERAL — grid 2 columnas */}
          <div className="px-7 py-5 border-b border-slate-100">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-red-950 libre-baskerville-hero">
              Información general
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoItem label="Estado" value={statusLabel} />
              <InfoItem label="Operación" value={transactionLabel} />
              <InfoItem label="Tipo" value={propertyTypeLabel ?? "—"} />
              <InfoItem label="Zona" value={capitalizar(property.zone?.name ?? `Zona ${property.zoneId}`)} />
              <InfoItem label="Ciudad" value={property.locationDescription ?? "—"} />
              {property.totalArea && <InfoItem label="m² Totales" value={`${property.totalArea} m²`} />}
            </div>
          </div>

          {/* DATOS ADICIONALES */}
          <div className="px-7 py-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-red-950 libre-baskerville-hero">
              Datos adicionales
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoItem label="ID" value={property.id} />
              <InfoItem label="Slug" value={property.slug} />
              <InfoItem label="Fotos" value={property.images?.length ?? 0} />
              {property.latitude && <InfoItem label="Latitud" value={property.latitude} />}
              {property.longitude && <InfoItem label="Longitud" value={property.longitude} />}
              {property.yearBuilt && <InfoItem label="Año" value={property.yearBuilt} />}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
    <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-900 break-all">{value}</p>
  </div>
);

export default DetailsProperty;