import { Building2, Home, KeyRound, Tag } from "lucide-react";
import { categories } from "../constants/categories";
import CategoryCard from "./CategoryCard";

// Mapeo de ícono por categoría — ajustá las keys según los títulos/ids reales
// que tengas en tu archivo categories.ts
const iconsByTitle: Record<string, typeof Home> = {
  "Casas en venta": Home,
  "Departamentos en venta": Building2,
  "Casas en alquiler": KeyRound,
  "Departamentos en alquiler": Tag,
};

const QuickCategories = () => {
  const [first, second, third, fourth] = categories;

  return (
    <section className="bg-[#F4F1EA] py-28">
      <div className="mx-[10%] max-w-8xl lg:px-10">
        <div className="lg:text-start text-start">
          <p className="text-red-800 lg:text-sm text-xs uppercase tracking-[0.35em]">
            Explorá
          </p>

          <h2 className="mt-4 lg:text-5xl text-4xl libre-baskerville-hero text-slate-900">
            Encontrá la propiedad ideal
          </h2>

          <p className=" mt-5  lg:text-lg text-xs leading-relaxed text-slate-500">
            Elegí una categoría y descubrí todas las propiedades disponibles
            según el tipo de operación.
          </p>
        </div>

        {/* BENTO GRID — una card grande + tres más chicas */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {first && (
            <CategoryCard
              category={first}
              icon={iconsByTitle[first.title]}
              className="h-105 md:col-span-2 md:row-span-2 lg:col-span-1 lg:row-span-2 lg:h-160"
            />
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2 lg:grid-rows-2">
            {second && (
              <CategoryCard
                category={second}
                icon={iconsByTitle[second.title]}
                className="h-75 lg:h-76.75"
              />
            )}
            {third && (
              <CategoryCard
                category={third}
                icon={iconsByTitle[third.title]}
                className="h-75 lg:h-76.75"
              />
            )}
            {fourth && (
              <CategoryCard
                category={fourth}
                icon={iconsByTitle[fourth.title]}
                className="h-75 sm:col-span-2 lg:h-76.75"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;