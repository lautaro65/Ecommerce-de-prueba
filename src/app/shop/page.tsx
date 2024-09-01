"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function ProductsPage() {
  const [products, setProducts]: any = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    color: "",
    size: "",
    discount: "",
    status: "",
    swiperInicioString: "",
  });
  const clearFilters = () => {
    setFilters({
      category: "",
      priceRange: "",
      color: "",
      size: "",
      discount: "",
      status: "",
      swiperInicioString: "",
    });
    setSelectedPriceRange("");
    setSelectedCategory("");
    setSelectedDiscount("");
    setSelectedSize("");
  };
  const [isOpen, setIsOpen] = useState(false);

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
  const [params, setParams] = useState({ myParam: "", anotherParam: "" });

  useEffect(() => {
    // Obtén la cadena de consulta de la URL
    const { search } = window.location;
    const query = new URLSearchParams(search);

    // Extrae el parámetro de la consulta
    const myParam: any = query.get("myParam");
    if (myParam) {
      handleCategoryChange(myParam);
    }
  }, [router]);

  const [isOpenPrice, setIsOpenPrice] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");

  const togglePriceDropdown = () => {
    setIsOpenPrice(!isOpenPrice);
  };

  const handlePriceRangeChange = (e: any) => {
    setSelectedPriceRange(e.target.value);
    handleFilterChange(e);
    setIsOpenPrice(false); // Cierra el dropdown después de seleccionar una opción
  };

  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const toggleDropdown = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  const handleCategoryChange = (e: any) => {
    if (categorias.includes(e)) {
      setSelectedCategory(e);
      setFilters({
        ...filters,
        ["category"]: e,
      });
      setIsOpenCategory(false); // Cierra el dropdown después de seleccionar una opción
    } else {
      setSelectedCategory(e.target.value);
      handleFilterChange(e);
      setIsOpenCategory(false); // Cierra el dropdown después de seleccionar una opción;
    }
  };

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const toggleSizeDropdown = () => {
    setIsOpenSize(!isOpenSize);
  };

  const handleSizeChange = (e: any) => {
    setSelectedSize(e.target.value);
    handleFilterChange(e);
    setIsOpenSize(false); // Cierra el dropdown después de seleccionar una opción
  };
  const [isOpenDiscount, setIsOpenDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState("");

  const toggleDiscountDropdown = () => {
    setIsOpenDiscount(!isOpenDiscount);
  };

  const handleDiscountChange = (e: any) => {
    setSelectedDiscount(e.target.value);
    handleFilterChange(e);
    setIsOpenDiscount(false); // Cierra el dropdown después de seleccionar una opción
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      filterProducts();
    }
  }, [filters, products]);

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Inicializar los productos filtrados
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    filtered = filtered.filter((product: any) => product.status === "activo");

    if (filters.category) {
      if (filters.category === "Todas") {
      } else {
        filtered = filtered.filter(
          (product: any) => product.category === filters.category
        );
      }
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product: any) => product.price >= min && product.price <= max
      );
    }

    if (filters.color) {
      filtered = filtered.filter((product: any) =>
        product.color.includes(filters.color)
      );
    }

    if (filters.size) {
      if (filters.size === "Todos") {
      } else {
        filtered = filtered.filter((product: any) =>
          product.size.includes(filters.size)
        );
      }
    }

    if (filters.discount) {
      const [min, max] = filters.discount.split("-").map(Number);
      filtered = filtered.filter(
        (product: any) => product.discount >= min && product.discount <= max
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen text-black mt-20">
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-white p-4 md:block hidden shadow-md">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="w-full border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">
              Categoría del producto
            </p>
            <button
              onClick={toggleDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedCategory ? selectedCategory : "Elije una categoría"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenCategory
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Todas"
                      checked={filters.category === "Todas"}
                      onChange={handleCategoryChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todas</span>
                  </label>
                </li>
                {categorias.map((categoria, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={categoria}
                        checked={filters.category === categoria}
                        onChange={handleCategoryChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">{categoria}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">
              Rango de precios
            </p>
            <button
              onClick={togglePriceDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedPriceRange
                ? selectedPriceRange
                : "Selecciona un rango de precios"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenPrice
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value=""
                      checked={filters.priceRange === ""}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todos</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="0-50"
                      checked={filters.priceRange === "0-50"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$0 - $50</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="51-100"
                      checked={filters.priceRange === "51-100"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$51 - $100</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="101-200"
                      checked={filters.priceRange === "101-200"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$101 - $200</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">Tamaño</p>
            <button
              onClick={toggleSizeDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedSize ? selectedSize : "Elije una opción"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenSize
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                {["Todos", "XS", "S", "M", "L", "XL", "XXL"].map(
                  (size, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={filters.size === size}
                          onChange={handleSizeChange}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">{size}</span>
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">Descuento</p>
            <button
              onClick={toggleDiscountDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedDiscount
                ? selectedDiscount
                : "Elije un rango de descuento"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenDiscount
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value=""
                      checked={filters.discount === ""}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todos</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="0-10"
                      checked={filters.discount === "0-10"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">0% - 10%</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="11-20"
                      checked={filters.discount === "11-20"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">11% - 20%</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="21-30"
                      checked={filters.discount === "21-30"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">21% - 30%</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <aside
          className={`fixed top-0 z-50 p-3 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ width: "90vw", maxWidth: "500px" }}
        >
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="w-full border-b-2 py-1 ">
            <p className="block text-base font-bold text-gray-700">
              Categoría del producto
            </p>
            <button
              onClick={toggleDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedCategory ? selectedCategory : "Elije una categoría"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenCategory
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="Todas"
                      checked={filters.category === "Todas"}
                      onChange={handleCategoryChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todas</span>
                  </label>
                </li>
                {categorias.map((categoria, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={categoria}
                        checked={filters.category === categoria}
                        onChange={handleCategoryChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">{categoria}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">
              Rango de precios
            </p>
            <button
              onClick={togglePriceDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedPriceRange
                ? selectedPriceRange
                : "Selecciona un rango de precios"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenPrice
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value=""
                      checked={filters.priceRange === ""}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todos</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="0-50"
                      checked={filters.priceRange === "0-50"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$0 - $50</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="51-100"
                      checked={filters.priceRange === "51-100"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$51 - $100</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value="101-200"
                      checked={filters.priceRange === "101-200"}
                      onChange={handlePriceRangeChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">$101 - $200</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">Tamaño</p>
            <button
              onClick={toggleSizeDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedSize ? selectedSize : "Elije una opción"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenSize
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                {["Todos", "XS", "S", "M", "L", "XL", "XXL"].map(
                  (size, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="size"
                          value={size}
                          checked={filters.size === size}
                          onChange={handleSizeChange}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">{size}</span>
                      </label>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className=" border-b-2 py-1">
            <p className="block text-base font-bold text-gray-700">Descuento</p>
            <button
              onClick={toggleDiscountDropdown}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {selectedDiscount
                ? selectedDiscount
                : "Elije un rango de descuento"}
            </button>

            <div
              className={`w-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 transform transition-all duration-300 ease-in-out ${
                isOpenDiscount
                  ? "max-h-60 opacity-100 scale-y-100 overflow-y-auto"
                  : "max-h-0 opacity-0 scale-y-0 overflow-hidden"
              }`}
            >
              <ul className="p-2">
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value=""
                      checked={filters.discount === ""}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Todos</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="0-10"
                      checked={filters.discount === "0-10"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">0% - 10%</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="11-20"
                      checked={filters.discount === "11-20"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">11% - 20%</span>
                  </label>
                </li>
                <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discount"
                      value="21-30"
                      checked={filters.discount === "21-30"}
                      onChange={handleDiscountChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">21% - 30%</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Cerrar
              </button>
            </div>
            <div>
              <button
                onClick={() => clearFilters()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-6 bg-white">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <h1 className="text-xl md:text-3xl font-bold  text-gray-800">
                Nuestros Productos
              </h1>
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                Filtros
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <p className="text-lg text-gray-600">
                Actualmente no hay productos con esos filtros.
              </p>
            ) : (
              <>
                {filteredProducts.map((product: any) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product._id}`} // Ruta dinámica basada en el ID del producto
                    passHref
                  >
                    <div
                      key={product._id}
                      className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="w-full bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={product.imageUrl[0]}
                          alt={product.name}
                          width={500} // Set your desired width
                          height={300} // Set your desired height
                          className="object-cover rounded-md"
                          priority={true}
                        />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.category}
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          ${product.price}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-red-500 text-sm font-medium">
                            Descuento: {product.discount}%
                          </p>
                        )}
                        <div className="flex items-center mt-3">
                          {product.color && (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-600">
                                Color: {product.color.join(", ")}
                              </span>
                              <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: product.color[0] }}
                              ></span>
                            </div>
                          )}
                          {product.size && (
                            <p className="text-gray-600 ml-4">
                              <span className="font-medium">Tamaño:</span>{" "}
                              {product.size.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="mt-4">
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
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
