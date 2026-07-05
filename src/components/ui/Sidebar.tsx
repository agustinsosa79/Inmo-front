import { NavLink } from 'react-router';
import { Home, Plus, Map, MessageSquare, X, Building2 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Fondo oscuro para móvil (Overlay) - Más suave y premium */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Principal - 100% Blanco, estructura rígida y limpia */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 min-h-screen bg-white shrink-0 border-r border-neutral-200 flex flex-col py-8
          transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full relative">
          
          {/* Botón de cerrar (Solo móvil) */}
          <button 
            onClick={onClose} 
            className="absolute -top-6 right-1 md:hidden text-neutral-400 hover:text-red-900 transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          {/* Bloque de Marca Tipográfico (Industrial y Minimalista) */}
          <div className="px-8 mb-12 flex flex-col gap-1 cursor-default">
            <div className="flex items-center gap-3 text-neutral-900">
              <Building2 size={26} strokeWidth={1.5} />
              <h1 className="text-2xl font-bold tracking-tight libre-baskerville-hero">
                PROPIEDADES
              </h1>
            </div>
            <p className="text-[12px] font-bold  tracking-widest text-neutral-400 ml-9">
              Panel de Gestión
            </p>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col space-y-2 w-full pr-6">

            <NavLink
              to="/dashboard"
              end
              onClick={onClose}
              className={({ isActive }) => `
                relative flex items-center gap-4 w-full rounded-r-full px-8 py-3.5
                transition-all duration-200 border-l-4
                ${isActive 
                  ? "bg-red-50/50 text-red-900 border-red-900 shadow-sm" 
                  : "text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-900"
                }
              `}
            >
              <Home size={18} strokeWidth={1.5} />
              <span className={`text-xs tracking-widest uppercase`}>
                Propiedades
              </span>
            </NavLink>

            <NavLink 
              to="nuevo-inmueble" 
              onClick={onClose}
              className={({ isActive }) => `
                relative flex items-center gap-4 w-full rounded-r-full px-8 py-3.5
                transition-all duration-200 border-l-4
                ${isActive 
                  ? "bg-red-50/50 text-red-900 border-red-900 shadow-sm" 
                  : "text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-900"
                }
              `}
            >
              <Plus size={18} strokeWidth={1.5} />
              <span className={`text-xs tracking-widest uppercase`}>
                Nuevo Inmueble
              </span>
            </NavLink>

            <NavLink 
              to="nueva-zona" 
              onClick={onClose}
              className={({ isActive }) => `
                relative flex items-center gap-4 w-full rounded-r-full px-8 py-3.5
                transition-all duration-200 border-l-4
                ${isActive 
                  ? "bg-red-50/50 text-red-900 border-red-900 shadow-sm" 
                  : "text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-900"
                }
              `}
            >
              <Map size={18} strokeWidth={1.5} />
              <span className={`text-xs tracking-widest uppercase`}>
                Localidades
              </span>
            </NavLink>

            <NavLink 
              to="mensajes" 
              onClick={onClose}
              className={({ isActive }) => `
                relative flex items-center gap-4 w-full rounded-r-full px-8 py-3.5
                transition-all duration-200 border-l-4
                ${isActive 
                  ? "bg-red-50/50 text-red-900 border-red-900 shadow-sm" 
                  : "text-neutral-500 border-transparent hover:bg-neutral-50 hover:text-neutral-900"
                }
              `}
            >
              <MessageSquare size={18} strokeWidth={1.5} />
              <span className={`text-xs tracking-widest uppercase`}>
                Mensajes
              </span>
            </NavLink>

          </nav>

          {/* Footer del Sidebar (Opcional, da un toque muy pro) */}
          <div className="mt-auto px-8 pt-8 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-600">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">Admin</span>
                <span className="text-[10px] text-neutral-400">Panel seguro</span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};