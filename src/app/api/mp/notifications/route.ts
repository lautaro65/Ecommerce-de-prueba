import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/models/products";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const notification = await req.json();

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

        return NextResponse.json({ message: "Stock actualizado con éxito" });
      }
    }

    return NextResponse.json({ message: "Notificación recibida" });
  } catch (error) {
    console.error("Error procesando la notificación:", error);
    return NextResponse.json({ message: "Error al procesar la notificación" }, { status: 500 });
  }
}
