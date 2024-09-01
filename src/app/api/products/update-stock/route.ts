import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/products";
import dbConnect from "@/app/lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { cartItems } = await req.json();

  try {
    for (const item of cartItems) {
      const product = await Product.findById(item._id);

      if (!product) {
        return NextResponse.json(
          { message: `Producto no encontrado para ID ${item._id}` },
          { status: 404 }
        );
      }

      // Encontrar el color y tamaño correctos en el stock del producto
      const stockColor = product.stock.find((s: any) => s.color === item.color);

      if (!stockColor) {
        return NextResponse.json(
          { message: `No se encontró stock para color ${item.color}` },
          { status: 400 }
        );
      }

      const stockSizeIndex = stockColor.size.indexOf(item.size);

      if (stockSizeIndex === -1) {
        return NextResponse.json(
          {
            message: `No se encontró tamaño ${item.size} para el color ${item.color}`,
          },
          { status: 400 }
        );
      }

      // Restar la cantidad comprada del stock disponible
      stockColor.quantity[stockSizeIndex] -= item.quantity;

      // Guardar el producto actualizado en la base de datos
      await product.save();
    }

    return NextResponse.json({ message: "Stock actualizado con éxito" });
  } catch (error) {
    console.error("Error actualizando el stock:", error);
    return NextResponse.json(
      { message: "Error al actualizar el stock" },
      { status: 500 }
    );
  }
}
