"use client";
import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProductPage() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [product, setProduct] = useState([]);
  const [products, setProducts] = useState(null);
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
  const [resVerificacion, setResVerificacion] = useState(false);
  const router = useRouter();
  const [nameOriginal, setNameOriginal] = useState("");
  const [skuOriginal, setSkuOriginal] = useState("");


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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  const obtenerlink = (result: any) => {
    const imageUrl = result.info.secure_url;

    // Usamos una función de actualización para asegurar que imageUrl sea siempre un array
    setImageUrl((prevUrls): any => [...prevUrls, imageUrl]);
  };


  
  const handleSave = async () => {

    console.log(stock)
    verificacion();
    if (resVerificacion === true) {

       const res = await fetch(`/api/products/${selectedProductId}`, {
        method: "PUT",
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
      console.log("no entro")
      return;
    }
  };
  
  const verificacion = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    if (
      product.some(
        (p: any) =>
          p.name.toLowerCase() === name.toLowerCase() && 
          p.name !== nameOriginal
      )
    ) {
      console.log(product)
      console.log(nameOriginal)
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
      product.some(
        (p: any) =>
          p.sku.toLowerCase() === sku.toLowerCase() && 
          p.sku.toLowerCase() !== skuOriginal
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

  const handleCheckboxChangeSize = (sizes: any) => {
    if (size.includes(sizes)) {
      setSize(size.filter((item: any) => item !== sizes));
    } else {
      setSize([...size, sizes]);
    }
  };

  const handleStockChange = (index: any, field: any, value: any) => {
    const newStock: any = [...stock];
    newStock[index][field] = value;
    setStock(newStock);
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
  const addStockRow = () => {
    setStock([...stock, { color: "", size: [], quantity: [] }]);
  };
  const eliminarElemento = (index: number) => {
    if (index >= 0 && index < stock.length) {
      const nuevoArray = [...stock];
      nuevoArray.splice(index, 1);
      setStock(nuevoArray);
    } else {
      console.log("Índice fuera de rango");
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  function extractPublicId(secureUrl: any) {
    const parts = secureUrl.split("/");
    const fileWithExtension = parts[parts.length - 1]; // "sample.jpg"
    const [publicId] = fileWithExtension.split("."); // ["sample", "jpg"]
    return publicId;
  }

  const handleDeleteImage = async (index: any) => {
    const publicId = extractPublicId(imageUrl[index]);
    setImageUrl((prevImageUrl) => prevImageUrl.filter((_, i) => i !== index));
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

  const search = async () => {
    if (selectedProductId) {
      const response = await fetch(`/api/products/${selectedProductId}`);
      const data = await response.json();
      setProducts(data);
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setCategory(data.category);
      setSku(data.sku);
      setStock(data.stock);
      setImageUrl(data.imageUrl); // Divide la cadena de URLs en un array si se usó '&&' al guardar
      setColor(data.color);
      setWeight(data.weight);
      setDimensions(data.dimensions);
      setSize(data.size);
      setTags(data.tags);
      setStatus(data.status);
      setSwiperInicio(data.swiperInicioString);
      setNameOriginal(data.name)
      setSkuOriginal(data.sku)
    }
  };

  const handleUpload = async (result: any) => {
    const imageUrl = result.info.secure_url;
    setImageUrl((prevUrls): any => [...prevUrls, imageUrl]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch(`/api/products/${selectedProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        description,
        imageUrl: imageUrl, // Send image URLs as an array
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Producto actualizado correctamente");
    } else {
      console.error("Error actualizando el producto:", data);
    }
  };

  return (
    <div className="p-20 min-h-screen">
      <div className="flex justify-center text-4xl text-black">
        <Link href={"/admin"}>
          <h1>Bienvenido admin</h1>
        </Link>
      </div>
      <div className=" flex justify-center mb-10">
        <div className="w-10/12 mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mt-10 border border-black">
          <h1 className="text-2xl font-semibold text-black mb-4">
            Editar Producto
          </h1>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 md:w-1/2 text-black"
              >
                <option value="">Selecciona un producto</option>
                {product.map((product: any) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <button
                onClick={search}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-blue-600 transition"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
      {products && (
        <div className="text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
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
            <div>
              <label className="block text-xl font-medium text-black">
                Categoría
              </label>
              <select
                className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200 text-black"
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
              <div className="flex items-center gap-2">
                <label className="block text-xl font-medium">Length</label>
                <input
                  className="block w-20 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                  type="number"
                  placeholder="Longitud"
                  value={dimensions.length}
                  onChange={(e: any) =>
                    setDimensions({ ...dimensions, length: e.target.value })
                  }
                  required
                  min={0}
                />
                <label className="block text-xl font-medium">Width</label>
                <input
                  className="block w-20  px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                  type="number"
                  placeholder="Ancho"
                  value={dimensions.width}
                  onChange={(e: any) =>
                    setDimensions({ ...dimensions, width: e.target.value })
                  }
                  required
                  min={0}
                />
                <label className="block text-xl font-medium">Height</label>

                <input
                  className="block w-20 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                  type="number"
                  placeholder="Altura"
                  value={dimensions.height}
                  onChange={(e: any) =>
                    setDimensions({ ...dimensions, height: e.target.value })
                  }
                  required
                  min={0}
                />
              </div>
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
                type="text"
                placeholder="Etiquetas"
                value={tags.join(",")}
                onChange={(e: any) => setTags(e.target.value.split(","))}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xl font-medium">Estado</label>
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
          </div>
          <div>
            <div className="flex justify-center w-full mt-5">
              <label className="block text-xl font-medium">
                Stock del producto:
              </label>
            </div>

            {stock.map((item, index) => (
              <div key={index}>
                <div className="w-full flex justify-end">
                  <p className=" font-semibold">
                    Variacion numero: {index + 1}{" "}
                  </p>
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
                          checked={(stock[index].size as string[]).includes(
                            option
                          )}
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
          <div className="flex gap-3  items-center text-xl ">
          <p>Cargar imagen del producto:</p>
          <CldUploadButton
            className="rounded-md border border-gray-500 hover:outline-none hover:ring hover:ring-blue-200 p-2"
            onSuccess={obtenerlink}
            uploadPreset="EcommercePrueba"
          />
        </div>
          {imageUrl && imageUrl.length > 0 && (
            <div className="flex justify-start w-full mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <p className="text-lg font-bold mb-2">Imágenes subidas:</p>
                {imageUrl.map((url, index) => (
                  <div
                    key={index}
                    className="max-w-sm rounded overflow-hidden shadow-lg bg-slate-200 relative"
                  >
                    <div className="p-4">
                      <img
                        className="w-full mt-2 mb-4"
                        src={url}
                        alt={`Imagen ${index + 1}`}
                      />
                      <h2 className="text-xl font-semibold text-black">
                        Imagen numero: {index + 1}
                      </h2>
                    </div>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute bottom-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
               onClick={handleSave} 
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
