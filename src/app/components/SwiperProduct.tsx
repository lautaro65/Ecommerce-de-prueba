import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const ProductImageSlider = ({ images }: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Duplicar imágenes si es necesario
  const duplicatedImages = [...images];
  if (images.length === 2) {
    duplicatedImages.push(...images);
  } else if (images.length === 3) {
    duplicatedImages.push(images[0]);
  }

  return (
    <>
      <Swiper
        loop={images.length > 1} // Solo habilitar loop si hay más de un slide
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images.map((image: any, index: any) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Product Image ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={false} // No es necesario habilitar loop para las miniaturas
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
        >
          {duplicatedImages.map((image: any, index: any) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default ProductImageSlider;
