import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuración de Mercado Pago
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export async function POST(req: NextRequest) {
  try {
    const body: any = await req.json();

    // Crear una instancia de Preference utilizando MercadoPagoConfig
    const preference = new Preference(mp);

    // Crear la preferencia utilizando los datos enviados en el body
    const response = await preference.create({
      body: {
        items: body.items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: 1,
          currency_id: "ARS", // Asegúrate de especificar la moneda
        })),
        back_urls: body.back_urls,
        auto_return: body.auto_return,
        notification_url: body.notification_url,
      },
    });
    const preferenceId = response.id;
    // Verificar la estructura de la respuesta
    console.log("Response from MercadoPago:", response.id);

    // Devolver el preferenceId como respuesta
    return NextResponse.json({ preferenceId });
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Failed to create preference" },
      { status: 500 }
    );
  }
}
