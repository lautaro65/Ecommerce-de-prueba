import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/products";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const notification = req.body;

  try {
    // Verificar el estado del pago (ejemplo: 'approved')
    if (notification.action === "payment.created" || notification.action === "payment.updated") {
      const paymentId = notification.data.id;

      // Realiza una solicitud a la API de Mercado Pago para obtener detalles del pago
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );
      const paymentData = await paymentResponse.json();

      if (paymentData.status === "approved") {
        const { items } = paymentData.additional_info;

        // Actualizar el stock de cada producto
        for (const item of items) {
          const product = await Product.findById(item.id);

          if (product) {
            const stockColor = product.stock.find(
              (s: any) => s.color === item.color
            );

            if (stockColor) {
              const stockSizeIndex = stockColor.size.indexOf(item.size);

              if (stockSizeIndex !== -1) {
                // Restar la cantidad comprada del stock disponible
                stockColor.quantity[stockSizeIndex] -= item.quantity;
              }
            }

            // Guardar el producto actualizado en la base de datos
            await product.save();
          }
        }

        return res.status(200).json({ message: "Stock actualizado con éxito" });
      }
    }

    res.status(200).json({ message: "Notificación recibida" });
  } catch (error) {
    console.error("Error procesando la notificación:", error);
    res.status(500).json({ message: "Error al procesar la notificación" });
  }
}
