import toast from "react-hot-toast";
import { useState } from "react";
import type { Zone } from "../../dashboard/types/zones/Zone.interface";





const EditZone = ({zone, onUpdate, onClose, zones}: { zone: Zone; onUpdate: (id: number,  name: string) => Promise<Zone>; onClose: ()=> void; zones: Zone[] } ) => {

    const [formData, setFormData] = useState(zone.name)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()


        const zoneExists = zones.some((z) => z.id !== zone.id && z.name.toLowerCase().trim() === formData.toLocaleLowerCase().trim())


        if(zoneExists) {
          toast.error("La zona ya existe")
          onClose()
          return
        }


        try {
          
          await onUpdate(zone.id, formData)
          onClose()
          toast.success(`Se cambio el nombre ${zone.name} por ${formData}`)
        } catch (error) {
          setFormData(zone.name)
          toast.error("Esta zona está asignada a una o más propiedades. Para editarla, primero debes eliminar o reasignar esas propiedades.", {duration: 2500})
          onClose()
          console.log(error)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setFormData(e.target.value)
    }


    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
  >
    <h2 className="mb-4 text-xl font-semibold text-slate-800">
      Editar zona
    </h2>

    <input
      type="text"
      value={formData}
      onChange={handleChange}
      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-800 outline-none focus:border-slate-500"
      placeholder="Nombre de la zona"
    />

    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg cursor-pointer border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
      >
        Cancelar
      </button>

      <button
        type="submit"
        className="rounded-lg  cursor-pointer bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
      >
        Guardar cambios
      </button>
    </div>
  </form>
</div>
    )

}

export default EditZone