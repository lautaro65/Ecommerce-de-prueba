"use client";
import { FC, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import RemoveFromCartButton from "./RemoveFromCartButton";
import PaymentPage from "./PaymentPage";
import { useRouter } from "next/navigation";
const CartMenu = ({ isOpen, onClose }: any) => {
  const { cart, removeFromCart, updateQuantity }: any = useContext(CartContext);

  const [showPayment, setShowPayment] = useState(false);
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [showBeforePayment, setShowBeforePayment] = useState(false);

  const [isStockCheckInProgress, setIsStockCheckInProgress] = useState(false);
  const [stockError, setStockError] = useState("");
  const router = useRouter();

  // Calcula el total del carrito
  const cartTotal = cart.reduce(
    (total: number, product: any) => total + product.price * product.cantidad,
    0
  );

  // Función para verificar el stock
  const verifyStock = async (cartItems: any) => {
    try {
      const stockChecks = await Promise.all(
        cartItems.map(async (item: any) => {
          const response = await fetch(`/api/products/${item._id}`);
          const product = await response.json();

          if (!product) {
            return {
              success: false,
              message: `Producto no encontrado para ID ${item._id}`,
            };
          }

          // Busca el stock específico por color y tamaño usando un bucle for
          // Buscar el índice del stock por color
          let colorIndex = -1;
          for (let i = 0; i < product.stock.length; i++) {
            if (product.stock[i].color === item.color) {
              colorIndex = i;
              break; // Salir del bucle una vez encontrado el color
            }
          }

          if (colorIndex === -1) {
            return {
              success: false,
              message: `No se encontró stock para color ${item.color} del producto ${product.name}`,
            };
          }

          // Buscar el índice del tamaño dentro del stock encontrado
          const stockItem = product.stock[colorIndex];
          // Buscar el índice del tamaño dentro del stock encontrado
          let sizeIndex = -1;
          for (let i = 0; i < stockItem.size.length; i++) {
            if (stockItem.size[i] === item.size) {
              sizeIndex = i;

              break; // Salir del bucle una vez encontrado el tamaño
            }
          }

          if (sizeIndex === -1) {
            return {
              success: false,
              message: `No se encontró tamaño ${item.size} para color ${item.color} del producto ${product.name}`,
            };
          }

          // Verificar la cantidad disponible en el tamaño encontrado
          const sizeItem = stockItem.quantity[sizeIndex];
          if (!stockItem) {
            return {
              success: false,
              message: `No se encontró stock para color ${item.color} y tamaño ${item.size} del producto ${product.name}`,
            };
          }
          if (sizeItem < item.cantidad) {
            const errorMessage = `El producto ${product.name} en color ${item.color} y tamaño ${item.size} ha cambiado su cantidad de stock. Actualmente no hay suficiente cantidad para esta compra.`;
            alert(errorMessage); // Muestra el mensaje de alerta
            return { success: false, message: errorMessage };
          }

          return { success: true };
        })
      );

      // Verifica si algún stock es insuficiente
      const insufficientStock = stockChecks.find((check) => !check.success);
      if (insufficientStock) {
        setStockError(insufficientStock.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error verifying stock:", error);
      setStockError("Error al verificar el stock.");
      return false;
    }
  };

  // Función para proceder al pago
  const handleProceedToCheckout = async () => {
    setIsStockCheckInProgress(true);
    const isStockAvailable = await verifyStock(cart);

    if (isStockAvailable) {
      setTotalCarrito(cartTotal);
      setShowPayment(true);
      setShowBeforePayment(false);
    } else {
      setIsStockCheckInProgress(false);
      setShowPayment(false);
      setShowBeforePayment(true);
    }
  };

  // useEffect para actualizar totalCarrito y ocultar el botón de pago cuando cambie el carrito
  useEffect(() => {
    setTotalCarrito(cartTotal);
    setShowPayment(false); // Oculta el botón de pago
    setShowBeforePayment(true);
  }, [cart]);

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "90vw", maxWidth: "500px" }} // Ocupa hasta el 90% de la pantalla o un máximo de 500px
    >
      <div className="w-full p-4 border-b border-gray-300 relative">
        <h2 className="text-lg font-semibold">Carrito</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay productos en el carrito
          </p>
        ) : (
          <ul>
            {cart.map((product: any) => (
              <li
                key={`${product._id}-${product.size}-${product.color}`}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center mb-4 p-4 border border-gray-200 rounded-lg shadow-sm"
              >
                <img
                  src={
                    product.imageUrl ? product.imageUrl[0] : "/placeholder.png"
                  }
                  alt={product.name}
                  className=" w-full h-auto object-cover rounded col-span-1"
                />
                <div className="flex flex-col col-span-1 gap-y-1">
                  <span className="font-semibold text-md">{product.name}</span>
                  <span className="text-gray-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Color: {product.color}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Size: {product.size}
                  </span>
                  <span className="text-gray-500 text-sm hidden sm:block">
                    Cantidad: {product.cantidad}
                  </span>
                  <div className="w-full block sm:hidden">
                    <label htmlFor={`quantity-${product._id}`} className="mr-2">
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      id={`quantity-${product._id}`}
                      className="w-16 p-1 border border-gray-300 rounded text-gray-500 text-sm"
                      min="1"
                      max={product.stock}
                      value={product.cantidad}
                      onChange={(e) =>
                        updateQuantity(product._id, parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="w-full block sm:hidden">
                    <RemoveFromCartButton
                      product={product}
                      onRemove={() => removeFromCart(product)}
                    />
                  </div>
                </div>
                <div className="hidden flex-col justify-between col-span-1 h-full sm:flex">
                  <div className="flex justify-end">
                    <RemoveFromCartButton
                      product={product}
                      onRemove={() => removeFromCart(product)}
                    />
                  </div>
                  <div className="flex justify-end items-end mt-auto">
                    <label
                      htmlFor={`quantity-${product._id}-${product.size}-${product.color}`}
                      className="mr-2"
                    >
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      id={`quantity-${product._id}-${product.size}-${product.color}`}
                      className="w-16 p-1 border border-gray-300 rounded text-gray-500 text-sm"
                      min="1"
                      max={product.maxquantity}
                      value={product.cantidad}
                      onChange={(e) =>
                        updateQuantity(
                          product._id,
                          parseInt(e.target.value),
                          product.color,
                          product.size
                        )
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full p-4 border-t border-gray-300">
        <div className="mb-4 text-lg font-bold text-right">
          Total: ${cartTotal.toFixed(2)}
        </div>
        {showBeforePayment && (
          <button
            className="w-full py-2 bg-black text-white font-bold rounded-md shadow-md hover:bg-gray-800 transition duration-300"
            onClick={handleProceedToCheckout}
          >
            Proceder al pago
          </button>
        )}

        {showPayment && totalCarrito !== 0 && (
          <PaymentPage totalAmount={totalCarrito} cartItems={cart} />
        )}
      </div>
    </div>
  );
};

export default CartMenu;
