// components/RemoveFromCartButton.tsx

import { FC, useContext } from 'react';
import { CartContext } from '../context/CartContext';


const RemoveFromCartButton = ({ product,onRemove  }:any) => {
  const { removeFromCart }:any = useContext(CartContext);
  return (
    <button
      onClick={onRemove}
      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full"
    >
      <svg
        className="w-5 h-5 inline"
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
  );
};

export default RemoveFromCartButton;
