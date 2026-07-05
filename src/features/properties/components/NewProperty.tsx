import { useEffect, useState } from "react";
import usePropertyForm from "../hooks/usePropertyForm";
import useChangeImages from "../hooks/useChangeImages";
import { ArrowLeft, HousePlus } from "lucide-react";
import { MoonLoader } from "react-spinners";

import * as Switch from "@radix-ui/react-switch";
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
import { useNavigate } from "react-router";
import { usePropertyStore } from "../store/propertyStore";
import { useZoneStore } from "../../zones/store/zoneStore";
import MapPicker from "./MapPicker";
import { capitalizar } from "../../dashboard/components/utils/Capitalizar";
import { initialData } from "../../dashboard/types/property/initialData";
import useHandleSubmit from "../hooks/useHandleSubmit";


function SortableImageItem({
  id,
  image,
  index,
  onOpen,
  onRemove,
}: {
  id: string;
  image: string;
  index: number;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group rounded-2xl overflow-hidden border bg-white transition-shadow ${
        isDragging
          ? "shadow-2xl ring-2 ring-slate-900 z-50 cursor-grabbing"
          : "border-slate-200 cursor-grab"
      }`}
    >
      <img
        loading="lazy"
        src={image}
        onClick={onOpen}
        alt={`preview-${index}`}
        className="aspect-square w-full h-auto object-cover select-none"
      />

      {index === 0 ? (
        <span className="absolute left-2 top-2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
          Portada
        </span>
      ) : (
        <span className="absolute left-2 top-2 rounded-lg bg-black/40 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur-xs">
          Posición {index + 1}
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute cursor-pointer right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white transition hover:bg-red-600 z-10"
      >
        ✕
      </button>
    </div>
  );
}

const NewProperty = () => {
  const { zones, fetchZones } = useZoneStore();
  const { formData, handleChange, setFormData } = usePropertyForm(initialData);
  const { properties, loadProperties, loaded } = usePropertyStore()
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const navigate = useNavigate()

  const formatNumber= (value: number | string) => {
    if (value === null || value === undefined || value === "") return "";
    const number = Number(value.toString().replace(/\D/g, ""));
    if (isNaN(number)) return "";
    return number.toLocaleString("es-AR");
  };

  const {
    images,
    previewImages,
    clearImage,
    clearAllImages,
    setImages,
    setPreviewImages,
    handleImageChange
  } = useChangeImages();

  const { handleSubmit, loading, submitting } = useHandleSubmit({
    formData,
    images,
    zones,
    setFormData,
    clearAllImages,
  });

  const currencies = ["USD", "ARS", "EUR"];

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);

    const reorderedImages = arrayMove(images, oldIndex, newIndex);
    const reorderedPreviews = arrayMove(previewImages, oldIndex, newIndex);

    setImages(reorderedImages);
    setPreviewImages(reorderedPreviews);

    if (currentImage === oldIndex) {
      setCurrentImage(newIndex);
    }
  };

  useEffect(() => {
    if (!loaded) loadProperties();
  }, [loadProperties, loaded]);

  const featuredCount = properties.filter(p => p.isFeatured).length;

  const featuredLimitReached = featuredCount >= 10 && !formData.isFeatured;

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="pt-5 lg:overflow-hidden min-h-screen lg:h-dvh flex flex-col bg-neutral-100/90">
      {zones.length === 0 && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl w-full">
            <h2 className="text-xl font-bold text-slate-900">
              No hay zonas disponibles
            </h2>
            <p className="mt-3 text-slate-500">
              Debes crear al menos una zona antes de cargar una propiedad.
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-white cursor-pointer"
              onClick={() => navigate('/dashboard/nueva-zona')}
            >
              Crear zona
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white z-60">
            {currentImage + 1} / {images.length}
          </span>
          <div
            className="relative max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              loading="lazy"
              src={
                images[currentImage] instanceof File
                  ? URL.createObjectURL(images[currentImage])
                  : images[currentImage]
              }
              alt=""
              className="max-h-[80vh] w-auto max-w-full mx-auto rounded-lg object-contain"
            />
            <button
              onClick={prevImage}
              className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-60 text-black p-3 md:p-10 bg-white rounded-full hover:bg-white/40 transition cursor-pointer"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={nextImage}
              className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-60 text-black p-3 md:p-10 bg-white rounded-full hover:bg-white/40 transition cursor-pointer"
            >
              <ArrowLeft className="rotate-180" />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-black bg-white/70 px-3 py-1 rounded-full text-sm z-60">
              {currentImage + 1} / {images.length}
            </span>
          </div>
        </div>
      )}

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-xl w-full max-w-sm">
            <MoonLoader color="#0f172a"/>
            <div className="text-center">
              <h3 className="font-semibold text-slate-900">Creando propiedad</h3>
              <p className="text-sm text-slate-500">Subiendo imágenes y guardando información...</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 w-full lg:overflow-hidden flex flex-col">
        <fieldset disabled={submitting} className="flex-1 flex flex-col min-h-0">
          <div className="mx-auto flex h-full max-w-7xl flex-col w-full">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4 gap-4">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">Panel Administrativo</p>
                <div className="flex items-start gap-3 mt-2">
                  <div className="h-6 sm:h-8 w-1 bg-red-950 rounded-full" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-red-950 libre-baskerville-hero">Crear Propiedad</h2>
                </div>

                <div className="flex items-center justify-start gap-3 pt-3">
                  <Switch.Root
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured ?? false}
                    disabled={featuredLimitReached}
                    onCheckedChange={(checked) =>
                      handleChange({
                        target: { name: "isFeatured", type: "checkbox", checked },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    className={`w-11 h-6 ${featuredLimitReached ? "bg-slate-700/50 opacity-10": "cursor-pointer bg-slate-800"} rounded-full relative data-[state=checked]:bg-red-900 outline-none transition-colors`}
                  >
                    <Switch.Thumb className={`block w-4 h-4 ${featuredLimitReached ? "bg-white/80": "bg-white"} rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-6`} />
                  </Switch.Root>
                  <label htmlFor="isFeatured" className={`text-xs sm:text-sm font-medium text-slate-700 ${featuredLimitReached ? "text-slate-700/50" : "cursor-pointer"}`}>
                    {formData.isFeatured ? "Destacada" : "Mostrar en propiedad destacadas"}
                  </label>
                  {featuredLimitReached && (
                    <p className="text-[10px] sm:text-xs text-red-600 text-center ">
                      Máximo 10 propiedades destacadas.
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full sm:w-auto justify-center items-center whitespace-nowrap gap-2 cursor-pointer rounded-2xl bg-red-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-950 disabled:opacity-60"
              >
                <HousePlus size={18} />
                {submitting ? "Subiendo..." : "Subir Propiedad"}
              </button>
            </div>

            {/* BODY */}
            <div className="grid flex-1 gap-4 px-4 sm:px-6 py-5 grid-cols-1 lg:grid-cols-2 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-5">
              {/* COLUMNA IZQUIERDA: FORMULARIO POR SECCIONES */}
              <div className="flex flex-col gap-5 lg:gap-6 lg:overflow-y-auto pr-0 lg:pr-2 lg:max-h-[calc(100vh-180px)]">

                {/* SECCIÓN 1 — INFORMACIÓN GENERAL */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                    Información general
                  </h3>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="title" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Título</label>
                      <input
                        id="title"
                        placeholder="Nombre de la propiedad"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Tipo</label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        <option value="SALE">Venta</option>
                        <option value="RENT">Alquiler</option>
                        <option value="TEMPORARY_RENT">Alquiler temporal</option>
                        <option value="EXCHANGE">Permuta</option>
                        <option value="COMMERCIAL_TRANSFER">Fondo de comercio</option>
                        <option value="DEVELOPMENT">Emprendimiento</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="propertyType" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Tipo de Propiedad</label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        <optgroup label="Residencial">
                          <option value="HOUSE">Casa</option>
                          <option value="APARTMENT">Departamento</option>
                          <option value="PH">PH</option>
                          <option value="DUPLEX">Dúplex</option>
                          <option value="TRIPLEX">Tríplex</option>
                        </optgroup>
                        <optgroup label="Terrenos">
                          <option value="LAND">Terreno</option>
                          <option value="LOT">Lote</option>
                        </optgroup>
                        <optgroup label="Rural">
                          <option value="QUINTA">Quinta</option>
                          <option value="CHACRA">Chacra</option>
                          <option value="FARM">Campo</option>
                        </optgroup>
                        <optgroup label="Comercial">
                          <option value="LOCAL">Local</option>
                          <option value="OFFICE">Oficina</option>
                          <option value="CONSULTING_ROOM">Consultorio</option>
                          <option value="WAREHOUSE">Galpón</option>
                          <option value="STORAGE">Depósito</option>
                        </optgroup>
                        <optgroup label="Otros">
                          <option value="GARAGE">Garaje</option>
                          <option value="BUILDING">Edificio</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="zoneId" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Localidad</label>
                      <select
                        id="zoneId"
                        name="zoneId"
                        value={formData.zoneId}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        <option value={0}>Selecciona una localidad</option>
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {capitalizar(zone.name ?? `Zona ${zone.id}`)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Estado</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        <option value="AVAILABLE">Disponible</option>
                        <option value="SOLD">Vendida</option>
                        <option value="RENTED">Alquilada</option>
                        <option value="RESERVED">Reservada</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="price" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500 ">Precio</label>
                      <input
                        type="text"
                        id="price"
                        value={formatNumber(price)}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const numeric = raw === "" ? 0 : Number(raw);
                          setPrice(numeric);
                          setFormData(prev => ({
                            ...prev,
                            price: numeric,
                          }));
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="currency" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Moneda</label>
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      >
                        {currencies.map((c, index) => (
                          <option key={index}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {/* SECCIÓN 2 — UBICACIÓN */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                    Ubicación
                  </h3>

                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="locationDescription" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Zona/Barrio</label>
                      <input
                        id="locationDescription"
                        type="text"
                        name="locationDescription"
                        value={formData.locationDescription}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                        placeholder="Ej: San Telmo, Puerto madero"
                      />
                    </div>

                    <div>
                      <label htmlFor="address-prop" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Dirección</label>
                      <input
                        id="address-prop"
                        placeholder="Ej. Av. 7 555"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="relative z-0 mt-4 sm:mt-6">
                    <MapPicker
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      onChange={(lat, lng) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng,
                        }))
                      }
                    />
                  </div>
                </section>

                {/* SECCIÓN 3 — CARACTERÍSTICAS */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                    Características
                  </h3>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
                    <div>
                      <label htmlFor="bedrooms" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Habitaciones</label>
                      <input
                        id="bedrooms"
                        placeholder="Ej: 2"
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Baños</label>
                      <input
                        id="bathrooms"
                        placeholder="Ej: 1"
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="totalArea" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">m² Totales</label>
                      <input
                        id="totalArea"
                        placeholder="Ej: 200"
                        type="number"
                        name="totalArea"
                        value={formData.totalArea ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label htmlFor="parkingSpaces" className="mb-1.5 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Cochera</label>
                      <input
                        id="parkingSpaces"
                        placeholder="Ej: 1"
                        type="number"
                        name="parkingSpaces"
                        value={formData.parkingSpaces ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </div>
                  </div>
                </section>

                {/* SECCIÓN 4 — DESCRIPCIÓN */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] libre-baskerville-hero text-red-950">
                    Descripción
                  </h3>

                  <textarea 
                    id="description"
                    placeholder="Ej: Hermosa propiedad desarrollada en dos plantas sobre un lote de... "
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-slate-400"
                  />
                </section>
              </div>

              {/* COLUMNA DERECHA: IMÁGENES CON DRAG AND DROP */}
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 flex flex-col h-auto lg:h-full lg:overflow-hidden mt-4 lg:mt-0">
                <h3 className="text-sm font-semibold text-slate-900">Imágenes de la propiedad</h3>

                <label
                  htmlFor="file-upload"
                  className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm transition hover:border-slate-400"
                >
                  <span className="text-slate-500 truncate mr-2">
                    {images.length > 0
                      ? `${images.length} ${images.length === 1 ? 'archivo' : 'archivos'}`
                      : "Elegir archivos..."}
                  </span>
                  <span className="font-semibold text-slate-900">Buscar</span>
                </label>

                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="mt-4 sm:mt-6 flex-1 lg:overflow-y-auto lg:max-h-[calc(100vh-280px)] pr-1 lg:pr-2">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                  >
                    <SortableContext
                      items={previewImages.map((_, index) => index.toString())}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                        {previewImages.map((image, index) => (
                          <SortableImageItem
                            key={`${image}-${index}`}
                            id={index.toString()}
                            image={image}
                            index={index}
                            onOpen={() => {
                              setSelectedImage(image);
                              setCurrentImage(index);
                            }}
                            onRemove={() => clearImage(index)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </div>

          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default NewProperty;