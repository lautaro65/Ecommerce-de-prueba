import React from 'react'
import { SiInstagram } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaEnvelope  } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-10">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div>
        <h2 className="text-xl font-bold mb-4">TuMarca</h2>
        <p className="text-sm">TuMarca ofrece lo mejor en moda y estilo. Explora nuestra colección y encuentra las últimas tendencias para cada ocasión.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Enlaces útiles</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-gray-500">Inicio</a></li>
          <li><a href="#" className="hover:text-gray-500">Tienda</a></li>
          <li><a href="#" className="hover:text-gray-500">Sobre nosotros</a></li>
          <li><a href="#" className="hover:text-gray-500">Contacto</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
        <div className="">
        <a href="#" className=" hover:text-gray-500 flex gap-3 items-center">
          Mail <FaEnvelope  />
          </a>
          <a href="#" className=" hover:text-gray-500 flex gap-3 items-center">
          whatsapp <FaWhatsapp />
          </a>
          <a href="#" className=" hover:text-gray-500 flex gap-3 items-center">
          Instagram <SiInstagram />
          </a>
          <a href="#" className=" hover:text-gray-500 flex gap-3 items-center">
          Facebook <FaFacebookSquare />
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm">
      <p>&copy; 2024 TuMarca. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>
  )
}

export default Footer