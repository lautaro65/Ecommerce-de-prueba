"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { FaShoppingCart, FaArrowDown } from "react-icons/fa";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartMenu from "./CartMenu";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const router = useRouter();

  const navigateWithParams = (param: any) => {
    const query = new URLSearchParams({ myParam: `${param}` }).toString();
    router.push(`/shop?${query}`);
  };
  const { cart }: any = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para el menú del carrito
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  useEffect(() => {
    // Llamar a la API para obtener los productos
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const toggleCartMenu = () => {
    setIsCartOpen(!isCartOpen); // Alterna la visibilidad del menú del carrito
  };
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered: any = products.filter((product: any) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
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
  const handleSelect = (productName: any) => {
    setSearchTerm(productName);
    setIsDropdownVisible(false);
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [products, setProducts] = useState([]);

  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const toggleDropdown = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  return (
    <nav className="bg-white text-black p-4 fixed top-0 left-0 w-full shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-full">
          <Link href="/" className="text-lg font-semibold">
            Nike
          </Link>
        </div>
        <div className="md:hidden flex gap-x-5">
          <div>
            <button
              onClick={toggleCartMenu}
              className="flex items-center bg-gray-200 rounded-full px-4 py-2 focus:outline-none justify-center"
            >
              <FaShoppingCart className="text-black" />
            </button>
          </div>

          <div>
            <button
              onClick={toggleMenu}
              className="border border-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:flex hidden  md:justify-center space-x-4 w-full items-center `}
        >
          <Link href="/" className="">
            Home
          </Link>
          <Link href="/shop" className="">
            Shop
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex gap-2 items-center  p-2 bg-white rounded-md "
            >
              Categorías
              <FaArrowDown
                className={`transition-transform ${
                  isOpenCategory ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`absolute left-0 bg-white border border-gray-200 shadow-lg rounded-md py-2
          transition-all duration-300 ease-out
          ${
            isOpenCategory
              ? "max-h-36 opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }
        `}
            >
              {categorias.map((categoria, index) => (
                <button
                  key={index}
                  onClick={() => navigateWithParams(categoria)}
                  className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100"
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`md:flex hidden md:justify-end space-x-4 w-full `}>
          <div className="relative ">
            <input
              id="searchInput"
              type="text"
              value={searchTerm}
              onChange={handleChange}
              onFocus={() => setIsDropdownVisible(true)}
              placeholder="Buscar productos"
              className="bg-gray-200 rounded-full w-full focus:outline-none pl-4 py-2 shadow-md"
            />
            {isDropdownVisible && filteredProducts.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg mt-2 w-full max-h-60 overflow-y-auto z-10">
                {filteredProducts.map((product: any) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect(product.name)}
                  >
                    <Link href={"/shop/" + product._id}>{product.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={toggleCartMenu}
            className="flex items-center bg-gray-200 rounded-full px-4 py-2 focus:outline-none justify-center"
          >
            <FaShoppingCart className="text-black" />
          </button>
        </div>
        <div className="relative">
          <div
            className={`fixed top-0 right-0 h-full p-2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "70vw" }} // Ocupa la mitad de la pantalla
          >
            <div className="w-full grid-cols-2 grid p-3 ">
              <div className="w-full flex justify-center items-center">
                <p>Nike</p>
              </div>

              <div>
                <div className="w-full flex justify-end  items-center">
                  <button
                    onClick={toggleMenu}
                    className="border border-black focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isOpen ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16m-7 6h7"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div className=" col-span-2 border border-black mt-2"></div>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop</h2>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block px-4 py-2 text-base text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  Home
                </Link>
                <div className="relative w-full">
                  <button
                    onClick={toggleDropdown}
                    className="flex gap-2 items-center  p-2 bg-white rounded-md  w-full"
                  >
                    Categorías
                    <FaArrowDown
                      className={`transition-transform ${
                        isOpenCategory ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute left-0 bg-white border border-gray-200 shadow-lg rounded-md py-2
          transition-all duration-300 ease-out w-full
          ${
            isOpenCategory
              ? "max-h-36 opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }
        `}
                  >
                    {categorias.map((categoria, index) => (
                      <button
                        key={index}
                        onClick={() => navigateWithParams(categoria)}
                        className="block px-4 py-2 text-sm w-full text-gray-700 hover:bg-gray-100"
                      >
                        {categoria}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartMenu isOpen={isCartOpen} onClose={toggleCartMenu} />
    </nav>
  );
};
export default Navbar;
