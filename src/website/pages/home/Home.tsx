
import "swiper/css";
import "swiper/css/effect-fade";
import FadeImages from "../../components/ui/FadeImages";
import type { IPropertyFilters } from "../../features/properties/types/PropertyFilters";
import { useNavigate } from "react-router";
import PropertyFilters from "../../features/properties/components/WPropertyFilters";
import FeaturedProperties from "../../features/properties/components/FeaturedProperties";
import AboutSection from "./components/AboutSection";
import QuickCategories from "../../features/categories/components/QuickCategories";



const Home = () => {
    const navigate = useNavigate()
  
    const handleSearch = (filters: IPropertyFilters) => {
        const params = new URLSearchParams()

        if(filters.transactionType){
            params.set("transactionType", filters.transactionType)
        }

        if(filters.propertyType){
            params.set("propertyType", filters.propertyType)
        }

        if(filters.zoneId){
            params.set("zoneId", filters.zoneId.toString())
        }
        if(filters.search){
            params.set("search", filters.search)
        }
        if(filters.transactionType){
            params.set("transactionType", filters.transactionType)
        }


        navigate(`/propiedades?${params.toString()}`);
    }

    return (
    <>
   <div className="absolute h-dvh inset-0 overflow-hidden">
        <FadeImages />
</div>

 <div className="absolute inset-0 bg-black/50 z-10" />

    <div className=" flex lg:items-center items-center justify-start h-dvh w-full ">
        <div className="flex flex-col z-10 lg:max-w-[70%] w-auto h-auto lg:m-50 ml-4  ">
            <h1 className=" libre-baskerville-hero italic lg:text-7xl text-[40px] text-start lg:space-y-2 lg:tracking-widest lg:[word-spacing:5px] lg:leading-23 lg:lining-nums uppercase mb-15 lg:mb-25 text-white drop-shadow-[2px_2px_1px_rgba(0,0,0,2)] lg:drop-shadow-[4px_4px_1px_rgba(0,0,0)]">
            Encontrá 
            <span className="block  text-red-800 text-start">
                la propiedad
            </span>
            que buscás
            </h1>
            <div className="absolute lg:bottom-50 bottom-5 lg:left-50 left-0 w-full lg:w-auto px-4 lg:px-0">
                <PropertyFilters onSearch={handleSearch} />
            </div>
        </div>

    </div>

    <section>
        <QuickCategories />
        <FeaturedProperties/>
        <AboutSection />
    </section>
    </>
  )
}

export default Home