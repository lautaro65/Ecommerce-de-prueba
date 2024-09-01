"use client";

import React, { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

interface PaymentPageProps {
  totalAmount: number;
  cartItems: Array<{ _id: string; quantity: number; color: string; size: string }>;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ totalAmount, cartItems }) => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Inicializar Mercado Pago
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY as string);
  }, []);

  // Crear preferencia y obtener preferenceId
  useEffect(() => {
    const createPreference = async () => {
      try {
        const response = await fetch("/api/mp/preference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                title: "Carrito total, Nike",
                quantity: 1,
                unit_price: totalAmount,
              },
            ],
            back_urls: {
              success: "https://yourdomain.com/success",
              failure: "https://yourdomain.com/failure",
              pending: "https://yourdomain.com/pending",
            },
            auto_return: "approved",
            notification_url: "http://localhost:3000/api/mp/notifications",
          }),
        });

        const data = await response.json();
        setPreferenceId(data.preferenceId);
      } catch (error) {
        console.error("Error creating preference:", error);
      }
    };

    createPreference();
  }, [totalAmount]);

  return (
    <>
      {preferenceId ? (
        <Wallet
          initialization={{ preferenceId, redirectMode: "modal" }}
          customization={{
            texts: {
              valueProp: "payment_methods_logos",
            },
            visual: {
                buttonBackground: 'black',
                borderRadius: '16px',
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default PaymentPage;
