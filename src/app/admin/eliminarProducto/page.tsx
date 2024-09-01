"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProductPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const search = async () => {
    setProductoSeleccionado(true);
    if (selectedProductId) {
      const response = await fetch(`/api/products/${selectedProductId}`);
      const data = await response.json();
      setNameProduct(data.name);
    }
    
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/products/${selectedProductId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Producto eliminado correctamente");

      } else {
        alert(`Error eliminando el producto: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error en la solicitud: ${error.message}`);
    }
  };
  return (
    <div className="p-20">
      <div className="flex justify-center text-4xl text-black">
        <Link href={"/admin"}>
          <h1>Bienvenido admin</h1>
        </Link>
      </div>
      <div className=" flex justify-center">
        <div className="w-10/12 mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mt-10 border border-black">
          <h1 className="text-2xl font-semibold text-black mb-4">
            Eliminar Producto
          </h1>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 md:w-1/2 text-black"
              >
                <option value="">Selecciona un producto</option>
                {products.map((product: any) => (
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

      {productoSeleccionado && (
        <div className="w-10/12 mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mt-10 border border-black text-black flex  items-center">
          <div className="grid grid-cols-2">
            <div className="text-center">
              <p>
                El producto que ha sido seleccionado es:{" "}
                <span className=" font-bold">{nameProduct} </span> y el id es:{" "}
                <span className=" font-bold">{selectedProductId} </span>{" "}
              </p>
            </div>
            <button
              onClick={handleDelete}
              value={selectedProductId}
              className=" bg-red-900 text-white px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-red-800 transition"
            >
              {" "}
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
