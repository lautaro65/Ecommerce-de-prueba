"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import ProductImageSlider from "@/app/components/SwiperProduct";

import AddToCartButton from "@/app/components/addToCardButton";

export default function ProductDetailPage() {
  const [product, setProduct]: any = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // Cambia a true o false según tu lógica
  const [isLoading, setIsLoading] = useState(false); // Cambia a true o false según tu lógica
  const [isReadyToAddToCart, setIsReadyToAddToCart] = useState(false);

  const colorOptions: any = {
    Blanco: "bg-white border-gray-300",
    Negro: "bg-black border-gray-800",
    Rojo: "bg-red-500 border-red-600",
    Azul: "bg-blue-500 border-blue-600",
    Verde: "bg-green-500 border-green-600",
    Amarillo: "bg-yellow-500 border-yellow-600",
    Gris: "bg-gray-500 border-gray-600",
    Naranja: "bg-orange-500 border-orange-600",
    Rosa: "bg-pink-500 border-pink-600",
    Morado: "bg-purple-500 border-purple-600",
    Marrón: "bg-brown-500 border-brown-600",
    Beige: "bg-beige-500 border-beige-600",
    Turquesa: "bg-teal-500 border-teal-600",
    Aqua: "bg-cyan-500 border-cyan-600",
    Vino: "bg-red-700 border-red-800",
    Lavanda: "bg-purple-300 border-purple-400",
  };
  const [selectedColor, setSelectedColor] = useState("");

  const handleColorChange = (event: any) => {
    setSelectedColor(event.target.value);
  };
  const [selectedSize, setSelectedSize] = useState("");

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  // Efecto que verifica si se puede agregar al carrito cada vez que cambian selectedSize o selectedColor
  useEffect(() => {
    if (selectedSize !== "" && selectedColor !== "") {
      setIsReadyToAddToCart(true);
      product.stock.map((stock: any) => {
        if (stock.color === selectedColor) {
          const sizeIndex = product.size.indexOf(selectedSize);
          if (stock.quantity[sizeIndex] > 0) {
            setIsDisabled(false);
            setValue(1);

            setMaxValue(stock.quantity[sizeIndex]);
          } else {
            setIsDisabled(true);
            setMaxValue(0);
            setValue(0);
          }
        }
      });
    } else {
      setIsReadyToAddToCart(false);
    }
  }, [selectedSize, selectedColor]); // Dependencias para que el efecto se ejecute al cambiar estos valores

  const name = usePathname();
  const extractLastSegment = (url: any) => {
    // Dividir la cadena en segmentos por el carácter '/'
    const segments = url.split("/");
    // Devolver el último segmento
    return segments.pop() || "";
  };
  const ID = extractLastSegment(name);
  useEffect(() => {
    if (name) {
      fetchProduct();
    }
  }, [name]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${ID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProduct(data); // Asumimos que el producto se busca por nombre único
      setIsLoading(true);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  };
  const [value, setValue] = useState(1);
  const [maxValue, setMaxValue] = useState(1);

  // Función para manejar el cambio en el input
  const handleChange = (event: any) => {
    const newValue = Number(event.target.value);
    // Asegúrate de que el valor no supere el máximo permitido
    if (newValue <= maxValue) {
      setValue(newValue);
    }
  };

  return (
    <div className="min-h-[80vh] bg-white text-black p-6 py-20">
      <div className="grid grid-cols-1 xl:grid-cols-2    gap-x-10 mt-10 ">
        {!product ? (
          <div className="h-full flex items-center justify-center xl:hidden">
            <p className="text-gray-500">Cargando titulo...</p>
          </div>
        ) : (
          <div className="xl:hidden flex justify-center">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          </div>
        )}
        {!product ? (
          <div className="h-full flex items-center justify-center xl:hidden">
            <p className="text-gray-500">Cargando Categoria...</p>
          </div>
        ) : (
          <div className="xl:hidden flex justify-center">
            <p className="text-sm text-gray-500 mb-2">
              Categoría: {product.category}
            </p>
          </div>
        )}
        <div className="flex xl:justify-end justify-center ">
          <div className="lg:w-2/4 md:w-2/4 w-3/4  bg-gray-100 h-fit rounded-md overflow-hidden">
            {!product ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Cargando imagen...</p>
              </div>
            ) : (
              <ProductImageSlider images={product.imageUrl} />
            )}
          </div>
        </div>

        <div className="mt-4 flex-1 max-w">
          <div className="xl:mr-auto xl:ml-0 mx-auto md:w-2/4 ">
            {!product ? (
              <>
                <h1 className="text-3xl font-bold mb-4 hidden xl:flex">
                  Cargando nombre...
                </h1>
                <p className="text-sm text-gray-500 mb-2 hidden xl:flex">
                  Cargando categoría...
                </p>
                <p className="text-2xl font-bold text-gray-800 mb-4">
                  Cargando precio...
                </p>
                <p className="text-red-500 text-lg font-medium mb-4">
                  Cargando descuento...
                </p>
                <p className="text-gray-700 mb-4">Cargando descripción...</p>
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selecciona un color:
                  </h3>
                  <p className="text-gray-500">Cargando opciones de color...</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selecciona un Size:
                  </h3>
                  <p className="text-gray-500">
                    Cargando opciones de tamaño...
                  </p>
                </div>
                <div className="mb-4">
                  <button
                    className="p-3 rounded-full w-full font-bold bg-gray-300 text-gray-800 cursor-not-allowed"
                    disabled
                  >
                    Cargando botón...
                  </button>
                </div>
                <div>
                  <p className="text-gray-500">Cargando etiquetas...</p>
                </div>
              </>
            ) : (
              <div className="">
                <h1 className="text-3xl font-bold mb-4 hidden xl:flex">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mb-2 hidden xl:flex">
                  Categoría: {product.category}
                </p>
                <p className="text-2xl font-bold w-full text-gray-800 mb-4  ">
                  ${product.price}
                </p>
                {product.discount > 0 && (
                  <p className="text-red-500 text-lg font-medium mb-4">
                    Descuento: {product.discount}%
                  </p>
                )}
                <p className="text-gray-700 mb-4 hidden xl:flex ">
                  {product.description}
                </p>
                <textarea
                id="textarea-description"
                  value={product.description}
                  className="flex xl:hidden w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 "
                  placeholder="Ingrese una descripción"
                  rows={4}
                  disabled
                />
                <div className="flex items-center mb-4">
                  <div className="product-color-selector">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Selecciona un color:
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {product.color.map((color: any, index: any) => (
                        <label
                          key={color}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="color"
                            value={color}
                            checked={selectedColor === color}
                            onChange={handleColorChange}
                            className="sr-only"
                          />
                          <span
                            className={`w-6 h-6 rounded-full border ${
                              colorOptions[color]
                            } ${
                              selectedColor === color
                                ? "ring-2 ring-offset-2 ring-blue-500"
                                : ""
                            }`}
                            style={{ backgroundColor: colorOptions[color] }}
                          ></span>
                          <span className="text-gray-700">{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Selecciona un Size:
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.size.map((size: any) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-full border focus:outline-none ${
                          selectedSize === size
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-white text-gray-800 border-gray-300"
                        }`}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start p-4">
                  <label
                    htmlFor="numberInput"
                    className="text-lg font-medium mb-2"
                  >
                    Cantidad:
                  </label>
                  <div className="relative">
                    <input
                      id="numberInput"
                      type="number"
                      value={value}
                      onChange={handleChange}
                      min={1}
                      max={maxValue}
                      disabled={isDisabled}
                      className={`w-32 h-10 pl-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500  ${
                        isDisabled ? " cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                  <p className="mt-2 text-gray-500 text-sm">
                   Cantidad de Stock del producto:  
                    <span className="font-semibold">{maxValue}</span>
                  </p>
                </div>
                <div className="mb-4">
                  {isReadyToAddToCart ? (
                    <AddToCartButton
                      product={{
                        _id: product._id,
                        name: product.name,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        size: selectedSize,
                        color: selectedColor,
                        cantidad:value,
                        maxquantity:maxValue,
                        // Solo las propiedades necesarias
                      }}
                      isDisabled={isDisabled} // Pasa el estado de deshabilitación al componente
                    />
                  ) : (
                    <button
                      className="p-3 rounded-full w-full font-bold bg-gray-300 text-gray-800 cursor-not-allowed"
                      disabled
                    >
                      Selecciona el color y el tamaño
                    </button>
                  )}
                </div>
                <div>
                  {product.tags?.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full mr-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
