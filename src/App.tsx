import { BrowserRouter, Outlet, Route, Routes } from "react-router"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { FormRegister } from "./features/auth/components/form/FormRegister"
import { FormLogin } from "./features/auth/components/form/FormLogin"
import { DashboardPage} from "./pages/dashboard/Dashboard"
import logo_bg from "./assets/bg-toto-login.jpg"
import  Home  from "./website/pages/home/Home"
import WProperties from "./website/pages/WProperties"
import WebLayout from "./website/layout/WebLayout"
import PropertyDetails from "./website/features/properties/components/WPropertyDetails"
import ScrollToTop from "./website/components/ui/ScrollToTop"
import MessagesPage from "./features/inquiries/components/MessagesPages"
import ContactPage from "./website/pages/ContactPage"
import NewProperty from "./features/properties/components/NewProperty"
import NewZone from "./features/zones/components/NewZone"
import Properties from "./features/properties/components/Properties"

function App() {



  return (
    <BrowserRouter>
     <ScrollToTop />
    
      <Routes>

        
        <Route element={<WebLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/propiedades" element={<WProperties />} />
          <Route path="/propiedad/:slug" element={<PropertyDetails />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/sumate" element={<ContactPage />} />
        </Route>



        <Route
  element={
    <div className="relative h-dvh w-full overflow-hidden">
      <img
        loading="lazy"
        srcSet={`${logo_bg} 1x, ${logo_bg} 2x`}
        fetchPriority="high"
        src={logo_bg}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay oscuro + blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-none" />

      {/* Formulario */}
      <div className="relative z-10 flex h-full items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  }
>
  <Route path="/login" element={<FormLogin />} />
  <Route path="/register" element={<FormRegister />} />
</Route>


        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<Properties />} /> 
            <Route path="nueva-zona" element={<NewZone />} />
            <Route path="nuevo-inmueble" element={<NewProperty />} />
            <Route path="mensajes" element={<MessagesPage />} />
          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  
    )  
}

export default App
