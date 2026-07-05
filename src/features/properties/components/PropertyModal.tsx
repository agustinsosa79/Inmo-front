import { memo, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { MoonLoader } from "react-spinners";

import * as Switch from "@radix-ui/react-switch";
import { useNavigate } from "react-router";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CreatePropertyInput } from "../../dashboard/types/property/CreatePropertyInput";
import { useZoneStore } from "../../zones/store/zoneStore";
import usePropertyForm from "../hooks/usePropertyForm";
import { uploadImage } from "../services/uploadApi";
import { capitalizar } from "../../dashboard/components/utils/Capitalizar";
import type { Property as Iproperty } from "../../dashboard/types/property/property.interface";

// Una imagen en la grilla puede ser "existente" (ya está en el backend, tiene
// id real) o "nueva" (un File recién elegido, todavía no subido). Unificamos
// ambas en un solo tipo para poder mezclarlas en una sola lista ordenable.
type GridImage =
  | { kind: "existing"; id: number; url: string }
  | { kind: "new"; id: string; file: File; previewUrl: string };

const SortableImageItem = memo(
  function SortableImageItem({
    image,
    index,
    onRemove,
  }: {
    image: GridImage;
    index: number;
    onRemove: () => void;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: image.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const previewUrl =
      image.kind === "existing" ? image.url : image.previewUrl;

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`relative aspect-4/3 overflow-hidden rounded-2xl border bg-white transition-shadow ${
          isDragging
            ? "shadow-2xl ring-2 ring-slate-900 z-50 cursor-grabbing"
            : "border-slate-200 cursor-grab"
        }`}
      >
        <img
          loading="lazy"
          src={previewUrl}
          alt=""
          className="h-full w-full object-cover select-none transition-transform duration-300 hover:scale-105"
        />

        {index === 0 ? (
          <div className="absolute left-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            ⭐ Portada
          </div>
        ) : (
          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xs">
            Posición {index + 1}
          </div>
        )}

        {image.kind === "new" && (
          <div className="absolute bottom-2 left-2 rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
            Nueva
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-red-600 z-10 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    );
  },
  (prev, next) => prev.image === next.image && prev.index === next.index
);

const PropertyModal = ({ property, onClose, onUpdate }: { property: Iproperty; onClose: () => void; onUpdate: (id: number, updatedProperty: CreatePropertyInput) => void }) => {
    const { formData, handleChange } = usePropertyForm(property);
    const { zones, fetchZones } = useZoneStore()
    const [loading, setLoading] = useState<boolean>(false)

    const [allImages, setAllImages] = useState<GridImage[]>(
      (property.images ?? []).map((img) => ({
        kind: "existing" as const,
        id: img.id,
        url: img.url,
      }))
    );

    const navigate = useNavigate()

    useEffect(() => {
        fetchZones();
    }, [fetchZones])

    const propertyTypeOptions = [
      { value: "HOUSE", label: "Casa" },
      { value: "APARTMENT", label: "Departamento" },
      { value: "PH", label: "PH" },
      { value: "DUPLEX", label: "Dúplex" },
      { value: "TRIPLEX", label: "Tríplex" },
      { value: "LAND", label: "Terreno" },
      { value: "LOT", label: "Lote" },
      { value: "QUINTA", label: "Quinta" },
      { value: "CHACRA", label: "Chacra" },
      { value: "FARM", label: "Campo" },
      { value: "LOCAL", label: "Local Comercial" },
      { value: "OFFICE", label: "Oficina" },
      { value: "CONSULTING_ROOM", label: "Consultorio" },
      { value: "WAREHOUSE", label: "Galpón" },
      { value: "STORAGE", label: "Depósito" },
      { value: "GARAGE", label: "Garage" },
      { value: "BUILDING", label: "Edificio" },
    ] as const;

    const transactionTypeLabels = {
      SALE: "Venta",
      RENT: "Alquiler",
      TEMPORARY_RENT: "Alquiler Temporal",
      EXCHANGE: "Permuta",
      COMMERCIAL_TRANSFER: "Fondo de Comercio",
      DEVELOPMENT: "Emprendimiento",
    } as const;

    const sensors = useSensors(
      useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
      useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
    );

    const onDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setAllImages((prev) => {
        const oldIndex = prev.findIndex((img) => img.id === active.id);
        const newIndex = prev.findIndex((img) => img.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    };

    const previewUrlsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
      const current = previewUrlsRef.current;

      return () => {
        current.forEach((url) => URL.revokeObjectURL(url));
        current.clear();
      };
    }, []);

    const handleRemoveImage = useCallback((id: number | string) => {
      setAllImages((prev) => {
        const existingCount = prev.filter((img) => img.kind === "existing").length;
        const newCount = prev.filter((img) => img.kind === "new").length;

        if (existingCount + newCount <= 1) {
          toast.error("La propiedad debe tener al menos una imagen");
          return prev;
        }

        return prev.filter((img) => {
          if (img.id === id) {
            if (img.kind === "new") {
              URL.revokeObjectURL(img.previewUrl);
              previewUrlsRef.current.delete(img.previewUrl);
            }
            return false;
          }
          return true;
        });
      });
    }, []);

    const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const newGridImages: GridImage[] = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.add(previewUrl);

        return {
          kind: "new" as const,
          id: `new-${Date.now()}-${file.name}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl,
        };
      });
      setAllImages((prev) => [...prev, ...newGridImages]);
      e.target.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true)

      const payload: CreatePropertyInput = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        address: formData.address,
        locationDescription: formData.locationDescription,
        status: formData.status,
        type: formData.type,
        propertyType: formData.propertyType,
        zoneId: formData.zoneId,
        latitude: formData.latitude,
        longitude: formData.longitude,
        totalArea: formData.totalArea,
        coveredArea: formData.coveredArea,
        rooms: formData.rooms,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        parkingSpaces: formData.parkingSpaces,
        isFeatured: formData.isFeatured
      };

      const finalImages: { url: string; sortOrder: number }[] = [];

      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        if (img.kind === "existing") {
          finalImages.push({ url: img.url, sortOrder: i });
        } else {
          const res = await uploadImage(img.file);
          finalImages.push({ url: res.url, sortOrder: i });
        }
      }

      const finalPayload = {
        ...payload,
        images: finalImages,
      }

      await onUpdate(property.id, finalPayload);
      setLoading(false)
      toast.success("Tus cambios se han guardado correctamente")
      onClose();
    };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-xl">
            <MoonLoader color="#0f172a" />
            <div className="text-center">
              <p className="text-sm text-slate-500">Guardando información y subiendo los cambios...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[90vh] w-full max-w-6xl flex-col rounded-3xl border border-slate-200 bg-neutral-100/90 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-white rounded-t-3xl">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Panel Administrativo</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Editar Propiedad</h2>

            <div className="flex items-center gap-3 pt-3">
              <Switch.Root
                id="isFeatured"
                checked={formData.isFeatured ?? false}
                onCheckedChange={(checked) =>
                  handleChange({
                    target: { name: "isFeatured", type: "checkbox", checked },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="w-11 h-6 bg-slate-300 rounded-full relative data-[state=checked]:bg-red-900 outline-none cursor-pointer transition-colors"
              >
                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-6" />
              </Switch.Root>

              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 cursor-pointer">
                {formData.isFeatured ? "Destacada" : "Mostrar en propiedades destacadas"}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/mensajes?propertyId=${property.id}&title=${encodeURIComponent(property.title)}`)}
              className="rounded-2xl bg-red-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-900 cursor-pointer"
            >
              Ver mensajes
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm text-slate-600 transition hover:border-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-6">

            {/* SECCIÓN — FOTOGRAFÍAS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                Fotografías
              </h3>
              <p className="mb-4 text-sm text-slate-500">
                Arrastrá las imágenes para reordenarlas. La primera es la portada.
              </p>

              <label
                htmlFor="property-images"
                className="
                  flex h-32 w-full cursor-pointer flex-col items-center justify-center
                  rounded-2xl border-2 border-dashed border-slate-300
                  bg-slate-50
                  transition
                  hover:border-slate-400
                  hover:bg-slate-100
                  mb-6
                "
              >
                <span className="text-base font-medium text-slate-700">
                  + Agregar imágenes
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG o WEBP
                </span>
              </label>

              <input
                id="property-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImages}
                className="hidden"
              />

              {allImages.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={allImages.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {allImages.map((image, index) => (
                        <SortableImageItem
                          key={image.id}
                          image={image}
                          index={index}
                          onRemove={() => handleRemoveImage(image.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </section>

            {/* SECCIÓN — INFORMACIÓN GENERAL */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                Información general
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Título</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    {Object.entries(transactionTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Tipo de propiedad</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    {propertyTypeOptions.map((pty) => (
                      <option key={pty.value} value={pty.value}>{pty.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Localidad</label>
                  <select
                    name="zoneId"
                    value={formData.zoneId}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name ? capitalizar(zone.name) : `Zona ${zone.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="SOLD">Vendida</option>
                    <option value="RENTED">Alquilada</option>
                    <option value="RESERVED">Reservada</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Precio</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Moneda</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN — UBICACIÓN */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                Ubicación
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* SECCIÓN — CARACTERÍSTICAS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                Características
              </h3>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Habitaciones</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Baños</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">m² Totales</label>
                  <input
                    type="number"
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Cochera</label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>
            </section>

            {/* SECCIÓN — DESCRIPCIÓN */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                Descripción
              </h3>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
              />
            </section>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PropertyModal