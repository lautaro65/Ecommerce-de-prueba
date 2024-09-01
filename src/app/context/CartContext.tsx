"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
// Definir los tipos
interface Product {
  _id: string; // Usar un nombre consistente con la base de datos puede ser útil
  name: string;
  imageUrl?: string[]; // Opcional si no siempre lo usas
  price: number;
  size?: string; // Opcional si es necesario para algunos productos
  color?: string; // Opcional si es necesario para algunos productos
  cantidad: number;
  maxquantity:number,
  // Agrega otras propiedades si son necesarias en el carrito
}
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  updateQuantity: (product: Product, quantity: number) => void;
}

// Crear el contexto con un valor predeterminado
export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cart, setCart] = useState<Product[]>([]);

    useEffect(() => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }, []);
    
    useEffect(() => {
      // Solo guardar en localStorage cuando el carrito tenga contenido
      if (cart.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (p) =>
          p._id === product._id &&
          p.size === product.size &&
          p.color === product.color
      );
  
      if (existingProductIndex > -1) {
        const updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, cantidad: product.cantidad }
            : item
        );
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  const updateQuantity:any = (productId: string, newQuantity: number, color: string, size: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.color === color && item.size === size
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };
  
  const removeFromCart = (product: Product) => {
    setCart((prevCart) =>
      prevCart.filter(
        (p) =>
          !(p._id === product._id && p.size === product.size && p.color === product.color)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  return (
    <CartContext.Provider
      value={{ cart, addToCart,updateQuantity, removeFromCart, clearCart, }}
    >
      {children}
    </CartContext.Provider>
  );
};
