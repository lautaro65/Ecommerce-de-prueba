import React from "react";
import Link from "next/link";
function page() {
  return (
    <main className="content text-black pt-20">
      <div className=" flex justify-center ">
        <div>
          <h1 className=" text-4xl font-bold">
            Bienvenido al Panel de Administración
          </h1>
          <p className=" text-xl font-medium">
            Selecciona una opción del menú para empezar
          </p>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className=" bg-slate-200 border border-black rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Agregar producto</h2>
          <Link href="/admin/NuevoProducto" className="text-gray-700">
            Click aca para ir a agregar un nuevo producto
          </Link>
        </div>
        <div className=" bg-slate-200 border border-black rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Editar producto</h2>
          <Link href="/admin/editarProducto" className="text-gray-700">
            Click aca para editar un  producto
          </Link>
        </div>
      </div>
    </main>
  );
}

export default page;
