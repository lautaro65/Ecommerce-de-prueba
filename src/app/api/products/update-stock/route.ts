import { NextApiRequest, NextApiResponse } from "next";
import Product from "@/app/models/products";
import dbConnect from "@/app/lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    const { cartItems } = req.body;

    try {
      for (const item of cartItems) {
        const product = await Product.findById(item._id);

        if (!product) {
          return res
            .status(404)
            .json({ message: `Producto no encontrado para ID ${item._id}` });
        }

        // Encontrar el color y tamaño correctos en el stock del producto
        const stockColor = product.stock.find(
          (s: any) => s.color === item.color
        );

        if (!stockColor) {
          return res
            .status(400)
            .json({ message: `No se encontró stock para color ${item.color}` });
        }

        const stockSizeIndex = stockColor.size.indexOf(item.size);

        if (stockSizeIndex === -1) {
          return res
            .status(400)
            .json({
              message: `No se encontró tamaño ${item.size} para el color ${item.color}`,
            });
        }

        // Restar la cantidad comprada del stock disponible
        stockColor.quantity[stockSizeIndex] -= item.quantity;

        // Guardar el producto actualizado en la base de datos
        await product.save();
      }

      res.status(200).json({ message: "Stock actualizado con éxito" });
    } catch (error) {
      console.error("Error actualizando el stock:", error);
      res.status(500).json({ message: "Error al actualizar el stock" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
