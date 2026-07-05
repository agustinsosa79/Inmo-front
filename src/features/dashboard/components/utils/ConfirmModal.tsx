// components/ConfirmModal.tsx

import { CircleAlert } from "lucide-react";


type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const ConfirmModal = ({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-black/20 backdrop-blur">
      <div
  className="
    relative
    w-full
    max-w-lg
    overflow-hidden
    rounded-sm
    border
    border-white/20
    bg-black/90
    p-6
    backdrop-blur-2xl
    backdrop-saturate-150
  "
>
  <div
    className="
      pointer-events-none
      absolute
      inset-0
      from-white/20
      via-transparent
      to-transparent
    "
  />
        <h2 className="text-xl font-semibold text-balance text-start text-slate-50">
          {title}
        </h2>
        


        <div className="flex items-center text-neutral-400 justify-start whitespace-nowrap gap-1">
        <CircleAlert size={20} />
        {description && (
                
                <p className="mt-2 text-sm tex-center mb-2 ">{description}</p>
        )}
        </div>

        <div className="mt-6 flex justify-center w-full gap-3">
          <button
            onClick={onClose}
            className="border cursor-pointer w-full border-slate-200 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className=" bg-red-600 cursor-pointer w-full px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;