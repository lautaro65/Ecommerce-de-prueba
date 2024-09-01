"use client";
import Image from "next/image";
import SwiperComponent from "./components/SwiperComponents";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between text-black overflow-x-hidden">
      <section className="relative w-full h-screen bg-gray-800">
        <Image
          src="/img/Section.png"
          fill
          alt="Hero Image"
          className="opacity-75 object-cover object-center"
          priority={true} // Añadido priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl text-white font-bold mb-4 backdrop-blur">
              Bienvenidos a Nike
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 backdrop-blur">
              Tu tienda de ropa más confiable y mejor calidad
            </p>
            <button className="px-6 py-3 bg-white border border-black text-black rounded-md transition backdrop-blur">
              Comprar Ahora
            </button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {['Niños', 'Hombres', 'Mujeres'].map((category, index) => (
            <div key={index} className="col-span-1">
              <Image
                src={`/img/${category}.png`}
                alt={category}
                width={500}
                height={500}
                className="object-cover object-center max-h-[671px]"
              />
              <div className="flex w-full justify-center text-black text-4xl pt-2">
                <h3>{category}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative w-full h-screen bg-gray-800">
        <Image
          src="/img/Section2.png"
          fill
          alt="Hero Image2"
          className="opacity-75 object-cover object-center"
          priority={true} // Añadido priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl text-white font-bold mb-4 backdrop-blur">
              Nike vomero 17
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 backdrop-blur">
              YA DISPONIBLE
            </p>
          </div>
        </div>
      </section>

      <section className="xs:min-h-[80vh] min-h-[70vh] md:min-h-[70vh] lg:min-h-[60vh] xl:min-h-[60vh] w-full p-10">
        <SwiperComponent product={products} />
      </section>
    </main>
  );
}
