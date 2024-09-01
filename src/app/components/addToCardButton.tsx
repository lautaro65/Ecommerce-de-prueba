// components/AddToCartButton.tsx
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

interface AddToCartButtonProps {
  product: {
    _id: string; // Usar un nombre consistente con la base de datos puede ser útil
    name: string;
    imageUrl?: string[]; // Opcional si no siempre lo usas
    price: number;
    size?: string; // Opcional si es necesario para algunos productos
    color?: string; // Opcional si es necesario para algunos productos
    cantidad:number,
    maxquantity:number,
    // Agrega otras propiedades si son necesarias en el carrito
  };
  isDisabled?: boolean; // Propiedad opcional para deshabilitar el botón
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, isDisabled = false }:any) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('useContext(CartContext) must be used within a CartProvider');
  }

  const { addToCart } = cartContext;

  const handleAddToCart = () => {
    if (!isDisabled) {
      console.log(product)
      addToCart(product);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`p-3 rounded-full w-full font-bold ${
        isDisabled
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-black text-white'
      }`}
    >
      {isDisabled ? 'Agotado' : 'Agregar al carrito'}
    </button>
  );
};

export default AddToCartButton;
