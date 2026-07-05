import { AlertTriangle } from "lucide-react";

const DeleteInquiryModal = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {


    
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20">
          <AlertTriangle size={22} className="text-red-600" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-white">
          Eliminar mensaje
        </h2>

        <p className="mt-2 text-sm text-neutral-400">
          Esta acción no se puede deshacer. El mensaje se va a eliminar de
          forma permanente.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:border-white hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-900 cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInquiryModal;