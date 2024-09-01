"use client";
import { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState([{ color: "", size: [], quantity: [""] }]);
  const [discount, setDiscount] = useState(0);
  const [color, setColor] = useState([]);
  const [weight, setWeight] = useState(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [size, setSize]: any = useState([]);
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("activo");
  const [swiperInicio, setSwiperInicio] = useState("false");
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resVerificacion, setResVerificacion] = useState(false);

  const categorias = [
    "Remeras",
    "Camperas",
    "Buzos",
    "Camisas",
    "Pantalones",
    "Gorras",
    "Accesorios",
    "Shorts",
    "Calzado",
  ];
  const router = useRouter();

  const eliminarElemento = (index: number) => {
    if (index >= 0 && index < stock.length) {
      const nuevoArray = [...stock];
      nuevoArray.splice(index, 1);
      setStock(nuevoArray);
    } else {
      console.log("Índice fuera de rango");
    }
  };
  const handleDeleteImage = (indexToRemove: any) => {
    handleDeleteImageCloudinary(indexToRemove);

    const newImageUrls = imageUrl.filter((_, index) => index !== indexToRemove);
    setImageUrl(newImageUrls);
  };
  function extractPublicId(secureUrl: any) {
    const parts = secureUrl.split("/");
    const fileWithExtension = parts[parts.length - 1]; // "sample.jpg"
    const [publicId] = fileWithExtension.split("."); // ["sample", "jpg"]
    return publicId;
  }

  const handleDeleteImageCloudinary = async (index: any) => {
    const publicId = extractPublicId(imageUrl[index]);
    setImageUrl((prevImageUrls) => prevImageUrls.filter((_, i) => i !== index));
    try {
      const response = await fetch("/api/cloudinary/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });
      console.log("Solicitud enviada, esperando respuesta");

      const data = await response.json();

      if (response.ok) {
        alert("Imagen eliminada correctamente");
      } else {
        console.error("Error eliminando la imagen:", data);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const verificacion = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }

    if (
      products.some(
        (product: any) => product.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert("El nombre ya existe");
      setResVerificacion(false);
      return;
    }
    if (price === 0) {
      alert("El precio del producto no puede ser 0");
      setResVerificacion(false);
      return;
    }
    // Paso 1: Eliminar los espacios en blanco de cada elemento
    const trimmedArray = imageUrl.map((item: any) => item.trim());
    // Paso 2: Filtrar los elementos vacíos
    const nonEmptyArray = trimmedArray.filter((item) => item !== "");
    // Paso 3: Comprobar si el array resultante tiene algún contenido
    if (nonEmptyArray.length === 0) {
      alert("El Producto no tiene ninguna imagen");
      setResVerificacion(false);
      return;
    }
    if (category === "") {
      alert("Seleccione una categoria para el producto");
      setResVerificacion(false);
      return;
    }
    if (
      products.some(
        (product: any) => product.sku.toLowerCase() === sku.toLowerCase()
      )
    ) {
      alert("Ya existe otro producto con el mismo SKU");
      setResVerificacion(false);
      return;
    }
    if (size.length === 0) {
      alert("Ingrese el/los size del producto");
      setResVerificacion(false);
      return;
    }
    if (weight === 0) {
      alert("El peso del producto no puede ser 0");
      setResVerificacion(false);
      return;
    }
    if (dimensions.height === 0) {
      alert("La altura del producto no puede ser 0");
      setResVerificacion(false);
      return;
    }
    if (dimensions.length === 0) {
      alert("El largo del producto no puede ser 0");
      setResVerificacion(false);
      return;
    }
    if (dimensions.width === 0) {
      alert("El ancho del producto no puede ser 0");
      setResVerificacion(false);
      return;
    }

    for (let i = 0; i < stock.length; i++) {
      if (stock[i].color === "vacio" || stock[i].color === "") {
        alert("No ha elejido un color para alguna variacion del producto");
        setResVerificacion(false);
        return;
      }
      if (stock[i].size.length === 0) {
        alert("No ha elejido un size para alguna variacion del producto");
        setResVerificacion(false);
        return;
      }
      if (stock[i].quantity.length === 0) {
        alert(
          "No ha elejido una cantidad de stock para alguna variacion del producto"
        );
        setResVerificacion(false);
        return;
      }
    }
    setResVerificacion(true);
    return;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleCheckboxChangeSize = (sizes: any) => {
    if (size.includes(sizes)) {
      setSize(size.filter((item: any) => item !== sizes));
    } else {
      setSize([...size, sizes]);
    }
  };

  const handleCheckboxChange = (option: any, index: any, field: any) => {
    const newStock: any = [...stock];
    if (newStock[index][field].includes(option)) {
      const posicionValor = newStock[index][field].indexOf(option);
      if (typeof newStock[index].quantity[posicionValor] === "string") {
        const parsedQuantity = parseInt(
          newStock[index].quantity[posicionValor],
          10
        );
        if (parsedQuantity >= 0) {
          newStock[index].quantity.splice(posicionValor, 1);
          // Elimina elementos vacíos
          newStock[index].quantity.filter((item: any) => item.trim() !== "");
        }
      } else if (typeof newStock[index].quantity[posicionValor] === "number") {
        if (newStock[index].quantity[posicionValor] >= 0) {
          newStock[index].quantity.splice(posicionValor, 1);
        }
      }
      // Eliminar la opción del array
      newStock[index][field] = newStock[index][field].filter(
        (item: any) => item !== option
      );
    } else {
      // Agregar la opción al array
      newStock[index][field] = [...newStock[index][field], option];
    }
    setStock(newStock);
  };

  const handleSizeQuantityChange = (
    stockIndex: any,
    sizeIndex: any,
    value: string
  ) => {
    if (value === "") {
      alert("Agregar un valor al stcok de la variacion, que sea mayor a 0 ");
      return;
    }
    const updatedStock: any = [...stock];
    updatedStock[stockIndex].quantity[sizeIndex] = parseInt(value, 10);
    setStock(updatedStock);
  };

  const handleStockChange = (index: any, field: any, value: any) => {
    const newStock: any = [...stock];
    newStock[index][field] = value;
    setStock(newStock);
  };

  const addStockRow = () => {
    setStock([...stock, { color: "", size: [], quantity: [] }]);
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === "true";
    setSwiperInicio("value");
  };

  const obtenerlink = (result: any) => {
    const imageUrl = result.info.secure_url;

    // Usamos una función de actualización para asegurar que imageUrl sea siempre un array
    setImageUrl((prevUrls): any => [...prevUrls, imageUrl]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Procesa el array `stock`

    // Actualiza el estado con el stock procesado
    console.log(stock)
    verificacion();
    if (resVerificacion === true) {
      const res = await fetch("/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          category,
          sku,
          stock,
          imageUrl,
          discount,
          color,
          weight,
          dimensions,
          size,
          tags,
          status,
          swiperInicio,
        }),
      });

      if (res.ok) {
        console.log("Producto agregado exitosamente");
        setName("");
        setPrice(0);
        setDescription("");
        setImageUrl([]);
        setCategory("");
        setSku("");
        setStatus("");
        setStock([{ color: "", size: [], quantity: [] }]);
        setDiscount(0);
        setColor([]);
        setWeight(0);
        setDimensions({ length: 0, width: 0, height: 0 });
        setSize([]);
        setTags([]);
        setStatus("activo");
        setSwiperInicio("false");
        router.push("/admin/");
      } else {
        console.error("Error al agregar producto");
      }
    } else {
      return;
    }
  };

  return (
    <div className=" py-32 text-black  bg-gray-100">
      <div className="flex justify-center">
        <Link href="/admin">
          <h1 className="text-2xl font-bold mb-4  ">BIENVENIDO ADMIN</h1>
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-8/12  mx-auto border border-black p-5 rounded-lg bg-white  shadow-md"
      >
        <div className="flex justify-start">
          <h2 className="text-2xl font-bold mb-4  ">Agregar Producto</h2>
        </div>
        <div>
          <label className="block text-xl font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Ingrese el nombre del producto"
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium">Precio</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-xl font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Ingrese una descripción"
            rows={4}
            required
          />
        </div>
        <div className="flex gap-3  items-center text-xl ">
          <p>Cargar imagen del producto:</p>
          <CldUploadButton
            className="rounded-md border border-gray-500 hover:outline-none hover:ring hover:ring-blue-200 p-2"
            onSuccess={obtenerlink}
            uploadPreset="EcommercePrueba"
          />
        </div>
        {imageUrl.length > 0 && (
          <div className="flex gap-3  items-center text-xl ">
            <p>Ver imagenes cargadas</p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-md border border-gray-500 hover:outline-none hover:ring hover:ring-blue-200 p-2"
            >
              Ver imágenes
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative w-11/12 max-w-5xl h-5/6 bg-white p-5 rounded-md shadow-md overflow-y-auto">
              <div className="grid grid-cols-2">
                <div className="flex items-center">
                  <h2 className="text-2xl font-semibold mb-4">Imágenes</h2>
                </div>

                <div className="w-full flex justify-end items-center ">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageUrl.map((url, index) => (
                  <div
                    key={index}
                    className="relative bg-white p-2 rounded-md shadow-lg"
                  >
                    <img
                      src={url}
                      alt={`Imagen ${index}`}
                      className="rounded-md w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="block text-xl font-medium">Categoría</label>
          <select
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>
              Seleccionar Categoría
            </option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xl font-medium">SKU</label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Ingrese el SKU del producto"
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium">
            Porcentaje del descuento al producto
          </label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-xl font-medium">
            Colores disponibles
          </label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Escribir los colores separados por coma, ej. Rojo, Verde, Azul o Rojo,Verde,Azul"
            value={color.join(", ")}
            onChange={(e: any) => {
              // Utiliza una expresión regular para dividir el texto por comas, opcionalmente seguidas de espacios
              setColor(e.target.value.split(/\s*,\s*/));
            }}
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium">Sizes</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200">
            {["XS", "S", "M", "L", "XL", "XXL"].map((sizes) => (
              <div key={sizes} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`size-${sizes}`}
                  value={sizes}
                  checked={size.includes(sizes)}
                  onChange={() => handleCheckboxChangeSize(sizes)}
                  className="mr-2 form-checkbox h-5 w-5"
                />
                <label htmlFor={`size-${sizes}`}>{sizes}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xl font-medium">Etiquetas</label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="text"
            placeholder="Escribir las palabras calves del producto separados por , ej Nombre, Marca, Estilo  "
            value={tags.join(", ")}
            onChange={(e: any) => {
              // Utiliza una expresión regular para dividir el texto por comas, opcionalmente seguidas de espacios
              setTags(e.target.value.split(/\s*,\s*/));
            }}
            required
          />
        </div>
        <div>
          <label className="block text-xl font-medium">
            Peso del producto embalado
          </label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-xl font-medium">
            Dimensiones del producto:
          </label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="number"
            placeholder="Longitud"
            value={dimensions.length}
            onChange={(e: any) =>
              setDimensions({ ...dimensions, length: e.target.value })
            }
            required
            min={0}
          />
          <label className="block text-xl font-medium">length</label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="number"
            placeholder="Ancho"
            value={dimensions.width}
            onChange={(e: any) =>
              setDimensions({ ...dimensions, width: e.target.value })
            }
            required
            min={0}
          />
          <label className="block text-xl font-medium">width</label>
          <input
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
            type="number"
            placeholder="Altura"
            value={dimensions.height}
            onChange={(e: any) =>
              setDimensions({ ...dimensions, height: e.target.value })
            }
            required
            min={0}
          />
          <label className="block text-xl font-medium">height</label>
        </div>
        <div>
          <label className="block text-xl font-medium">
            Stock del producto:
          </label>
          {stock.map((item, index) => (
            <div key={index}>
              <div className="w-full flex justify-end">
                <p className=" font-semibold">Variacion numero: {index + 1} </p>
              </div>
              <select
                value={item.color}
                onChange={(e) =>
                  handleStockChange(index, "color", e.target.value)
                }
                className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 mb-3"
                required
              >
                <option value={"vacio"}>Primero ingresar los colores</option>
                {color.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 mb-3">
                {["XS", "S", "M", "L", "XL", "XXL"].map((option: any) => (
                  <div key={option} className="flex items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckboxChange(option, index, "size")
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 mb-3">
                {stock[index].size.length === 0 && (
                  <p className=" font-semibold">
                    Seleccionar los size de la variacion
                  </p>
                )}
                {stock[index].size.map((size: string, sizeIndex: number) => (
                  <div key={sizeIndex} className="mb-2">
                    <label className="flex items-center space-x-2">
                      <span>{size}</span>
                      <input
                        type="number"
                        className="form-input border border-black bg-white max-w-20"
                        value={stock[index].quantity[sizeIndex] || 0} // Suponiendo que tienes una cantidad por cada talla
                        onChange={(e) =>
                          handleSizeQuantityChange(
                            index,
                            sizeIndex,
                            e.target.value
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
              {index > 0 && (
                <div className="flex justify-end w-full">
                  <button
                    type="button"
                    onClick={() => eliminarElemento(index)}
                    className=" border border-white p-2 bg-red-500 rounded-xl text-white"
                  >
                    Eliminar variacion
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="w-full justify-center flex">
            <button
              type="button"
              onClick={addStockRow}
              className=" px-4 py-2 rounded-md border border-gray-400 hover:outline-none hover:ring hover:ring-blue-200"
            >
              Agregar Variación de Stock
            </button>
          </div>
        </div>
        <div>
          <label
            className="block text-xl font-medium"
            htmlFor="swiperInicioSelect"
          >
            Mostrar en pagina de inicio:
          </label>
          <select
            id="swiperInicioSelect"
            value={swiperInicio}
            onChange={(e) => setSwiperInicio(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 "
            required
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select
            className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Agregar Producto
          </button>
        </div>
      </form>
    </div>
  );
}
