import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CirclePlus, PencilLine, Trash2 } from "lucide-react";
import type { Zone } from "../../dashboard/types/zones/Zone.interface";
import EditZone from "./EditZone";
import ConfirmModal from "../../dashboard/components/utils/ConfirmModal";
import { capitalizar } from "../../dashboard/components/utils/Capitalizar";
import { useZoneStore } from "../store/zoneStore";

const NewZone: React.FC = () => {
  const [name, setName] = useState("");
  const createZone = useZoneStore((s) => s.createZone);
  const fetchZones = useZoneStore((s) => s.fetchZones);
  const { deleteZone } = useZoneStore();
  const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null);
  const [zoneToEdit, setZoneToEdit] = useState<Zone | null>(null);
  const [edit, setEdit] = useState(false);
  const { zones, updateZone } = useZoneStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenDelete = (zone: Zone) => {
    setZoneToDelete(zone);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!zoneToDelete) return;

    try {
      await deleteZone(zoneToDelete.id);
      toast.success("Zona eliminada");
      setOpen(false);
      setZoneToDelete(null);
    } catch (err: unknown) {
      const hasResponse = (e: unknown): e is { response?: { data?: { message?: string } } } =>
        typeof e === "object" && e !== null && "response" in e;

      const message =
        hasResponse(err) && err.response?.data?.message
          ? err.response.data.message
          : "No se puede eliminar la zona porque tiene propiedades asociadas";

      toast.error(message);
      setOpen(false);
      setZoneToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const zoneExists = zones.some(
      (z) => z.name.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (zoneExists) {
      toast.error("La zona ya existe");
      return;
    }

    if (!name.trim()) {
      setTimeout(() => {
        toast.error("El nombre es requerido", {
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }, 0.4);
      return;
    }

    setLoading(true);
    try {
      await createZone(name.trim());
      toast.success("Zona creada", {
        duration: 4000,
      });
      setName("");
      await fetchZones();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear la zona");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (zone: Zone) => {
    setZoneToEdit(zone);
    setEdit(true);
  };

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return (
    // CAMBIO: min-h-screen en lugar de h-dvh para asegurar el scroll natural
    <div className="min-h-screen bg-neutral-100/90 flex flex-col items-center pb-10">
      {edit && zoneToEdit && (
        <EditZone
          zone={zoneToEdit}
          onClose={() => setEdit(false)}
          onUpdate={updateZone}
          zones={zones}
        />
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-4">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500">
                Panel Administrativo
              </p>
              <div className="flex items-start gap-3 mt-2">
                <div className="h-6 sm:h-8 w-1 bg-red-950 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-semibold text-red-950 libre-baskerville-hero">
                  Crear Localidad
                </h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col p-4 sm:p-6">
            <label
              htmlFor="zone-name"
              className="mb-2 block text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-500"
            >
              Nombre de la Localidad
            </label>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                id="zone-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Centro, La Plata, Barrio Norte..."
                className="flex-1 w-full rounded-xl sm:rounded-l-xl sm:rounded-r-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex w-full sm:w-auto justify-center whitespace-nowrap items-center gap-2 rounded-xl sm:rounded-r-xl sm:rounded-l-none cursor-pointer bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                <CirclePlus size={18} />
                {loading ? "Añadiendo..." : "Añadir"}
              </button>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-500">
              Ingresa el nombre y presiona Añadir
            </p>
          </div>
        </div>
      </form>

      {/* Grilla de Zonas */}
      <div className="grid w-full max-w-5xl gap-4 sm:gap-6 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Localidad
              </p>
              <h3 className="mt-1 text-base sm:text-lg font-semibold text-slate-800">
                {capitalizar(zone.name ?? `Zona ${zone.id}`)}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleOpenDelete(zone)}
                className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-xl border cursor-pointer border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={15} />
                Eliminar
              </button>
              <button
                type="button"
                onClick={() => handleEdit(zone)}
                className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-xl border cursor-pointer border-slate-900 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <PencilLine size={15} />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={open}
        title={`¿Estás seguro que querés eliminar (${capitalizar(
          zoneToDelete?.name ?? ""
        )})?`}
        description="Esta acción no se puede deshacer."
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NewZone;