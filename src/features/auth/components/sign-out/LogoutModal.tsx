import { LogOut } from "lucide-react";

interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ onClose, onConfirm }: LogoutModalProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md m-5 lg:m-0 rounded-2xl bg-[#F4F1EA] shadow-xl backdrop-blur-3xl">
        <div className=" flex items-center px-5 py-1 rounded-t-3xl">
        <LogOut size={25} className="text-red-900" />
        <h2 className="text-xl z-10 font-semibold libre-baskerville-hero p-2 rounded-t-md  text-zinc-800">
          Salir
        </h2>
        </div>

    <div className="p-6">
        <p className=" text-xs lg:text-sm text-zinc-700">
          ¿Estás seguro de que quieres cerrar sesión?
        </p>

        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full  shadow-sm w-full py-2 font-semibold text-red-950 lg:text-sm text-xs        transition bg-white hover:bg-slate-100"
            >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-red-800 w-full shadow-sm lg:text-sm text-xs py-2 text-white transition hover:bg-red-900"
            >
            Cerrar sesión
          </button>
    </div>

        </div>
      </div>
    </div>
  );
};

export default LogoutModal;