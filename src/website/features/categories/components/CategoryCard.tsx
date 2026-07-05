import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import type { Category } from "../types/category.types";

interface Props {
  category: Category;
  className?: string;
  icon?: LucideIcon;
}

const CategoryCard = ({ category, className = "", icon: Icon }: Props) => {
  return (
    <Link
      to={`/propiedades?propertyType=${category.propertyType}&transactionType=${category.operation}`}
      className={`group relative overflow-hidden rounded-3xl ${className}`} 
    >
      <img
        loading="lazy"
        fetchPriority="high"
        srcSet={category.image}
        src={category.image}
        alt={category.title}
        className="absolute inset-0 aspect-square transform-gpu will-change-transform  h-full w-full object-cover duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-black/5 duration-500 group-hover:from-black/80" />

      {Icon && (
        <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition duration-300 group-hover:bg-red-800">
          <Icon size={20} className="text-white" />
        </div>
      )}

      <div className="absolute bottom-0 flex w-full flex-col p-7">
        <span className="h-px w-10 bg-red-700 transition-all duration-300 group-hover:w-16" />
        <h3 className="mt-4 text-2xl libre-baskerville-hero text-white">
          {category.title}
        </h3>
        <p className="mt-1 text-sm text-white/75">{category.subtitle}</p>

        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white opacity-0 duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          <span className="uppercase tracking-wider">Explorar</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;