import { useState } from "react";
import { Outlet} from "react-router";
import { Sidebar } from "../../components/ui/Sidebar";
import { Menu } from "lucide-react";

export const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="flex h-screen w-full bg-[#F4F1EA] overflow-hidden">
      
      {/* Pasamos el estado al Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenedor principal de la derecha */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Header Móvil (Oculto en PC) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-zinc-950 text-white shrink-0 border-b border-neutral-800">
          <span className="font-bold tracking-widest text-xs uppercase libre-baskerville-hero">Panel de Gestión</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:text-red-500 transition-colors">
            <Menu size={24} />
          </button>
        </header>

        {/* Contenido principal */}
<main className="w-full flex-1 flex flex-col min-h-0 overflow-y-auto lg:p-5 p-1 lg:overflow-hidden">
  <Outlet />
</main>
      </div> 
    </div>
  );
};