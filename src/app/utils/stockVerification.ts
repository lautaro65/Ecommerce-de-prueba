// utils/stockVerification.ts

import dbConnect from "../lib/dbConnect";
export const verifyStock = async (cartItems: any) => {
  try {
    const { db }: any = await dbConnect();

    const stockChecks = await Promise.all(
      cartItems.map(async (item: any) => {
        const product = await db
          .collection("products")
          .findOne({ _id: item._id });

        if (!product) {
          return {
            success: false,
            message: `Producto no encontrado para ID ${item._id}`,
          };
        }

        const colorIndex = product.stock.findIndex(
          (s: any) => s.color === item.color
        );

        if (colorIndex === -1) {
          return {
            success: false,
            message: `No se encontró stock para color ${item.color} del producto ${product.name}`,
          };
        }

        const stockItem = product.stock[colorIndex];
        const sizeIndex = stockItem.size.findIndex(
          (s: any) => s.size === item.size
        );

        if (sizeIndex === -1) {
          return {
            success: false,
            message: `No se encontró tamaño ${item.size} para color ${item.color} del producto ${product.name}`,
          };
        }

        const sizeItem = stockItem.size[sizeIndex];
        if (sizeItem.quantity < item.cantidad) {
          const errorMessage = `El producto ${product.name} en color ${item.color} y tamaño ${item.size} ha cambiado su cantidad de stock. Actualmente no hay suficiente cantidad para esta compra.`;
          return { success: false, message: errorMessage };
        }

        return { success: true };
      })
    );

    const insufficientStock = stockChecks.find((check) => !check.success);
    if (insufficientStock) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying stock:", error);
    return false;
  }
};
