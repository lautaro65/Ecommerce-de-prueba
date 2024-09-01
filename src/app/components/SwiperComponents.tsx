// components/SwiperComponent.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/swiper-bundle.css";
import Image from "next/image";
import Link from "next/link";
const SwiperComponent = ({ product }: any) => {
  const filteredProducts = product.filter(
    (product: any) => product.swiperInicioString === "false"
  );
  const slidesPerView = 4;
  let displayedProducts = [...filteredProducts];

  // Duplicar slides hasta que el número total de slides sea un múltiplo de slidesPerView
  while (displayedProducts.length % slidesPerView !== 0) {
    displayedProducts = [...displayedProducts, ...filteredProducts];
  }

  return (
    <div className=" p-6 bg-white text-black container mx-auto ">
      <div className="flex items-center justify-center xl:justify-between  lg:justify-between  mb-10">
        <Link href={"/shop"} className=" hidden xl:block lg:block ">
          <button className=" px-4 py-2 rounded-md border border-gray-400 hover:outline-none hover:ring hover:ring-blue-200">
            Ver más
          </button>
        </Link>

        <h2 className="text-4xl font-bold text-gray-800 text-center">
          Productos Más Vendidos
        </h2>
        <div className=" space-x-2 hidden xl:flex lg:flex">
          <div
            id="swiper-button-prev-more-Sell"
            className="swiper-button-prev text-black bg-gray-200 rounded-full p-5 cursor-pointer "
          ></div>
          <div
            id="swiper-button-next-more-Sell"
            className="swiper-button-next text-black bg-gray-200 rounded-full p-5 cursor-pointer"
          ></div>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        loop={displayedProducts.length > 1}
        centeredSlides={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="h-40 !overflow-visible"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
      >
        {displayedProducts.map((product: any, index: any) => (
          <SwiperSlide key={index} className="text-center text-black">
            <Link href={`/shop/${product._id}`}>
              <div className="relative w-full h-64">
                <Image
                  src={product.imageUrl[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33.33vw, 25vw"
                  className="object-contain"
                  priority={true}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-lg font-semibold">Precio: {product.price}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
