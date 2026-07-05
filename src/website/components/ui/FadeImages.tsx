import bg_alberto from "../../assets/bg_alberto.webp"
import bg_alberto_campo from "../../assets/bg_alberto-campo.webp"
import bg_alberto_campo2 from "../../assets/bg_alberto-campo2.webp"
import bg_alberto_barrio from "../../assets/bg_alberto-barrio.webp"
import bg_alberto_mono from "../../assets/bg_alberto-mono.webp"
import bg_alberto_campo3 from "../../assets/bg_alberto-campo3.webp"
import bg_alberto_ciudad from "../../assets/bg_alberto-ciudad.webp"
import bg_alberto_mono2 from "../../assets/bg_alberto-mono2.webp"


import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


const FadeImages = () => {
    const images = [bg_alberto_campo, bg_alberto, bg_alberto_mono2, bg_alberto_ciudad, bg_alberto_barrio, bg_alberto_campo3,  bg_alberto_mono, bg_alberto_campo2];
  return (
    <div className=" h-dvh">

    <Swiper
  modules={[Autoplay, EffectFade]}
  effect="fade"
  autoplay={{
      delay: 5000,
    }}
    loop
>
  {images.map((image, idx) => (
  <SwiperSlide key={image}>
    <img
      // Solo la primera carga inmediatamente, las demás esperan
      loading={idx === 0 ? "eager" : "lazy"}
      srcSet={`${image} 1x, ${image} 2x`}
      alt={`Imagen de fondo ${idx + 1}`}
      // Prioridad de carga alta para la primera imagen, baja para las demás
      fetchPriority={idx === 0 ? "high" : "low"}
      src={image}
      className="h-dvh w-full object-cover"
    />
  </SwiperSlide>
))}
</Swiper>
</div>

  )
}

export default FadeImages