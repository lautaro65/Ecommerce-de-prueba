import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Product from "@/app/models/products";
import dbConnect from "@/app/lib/dbConnect";

cloudinary.config({
  cloud_name: "djnpyyl6b",
  api_key: "534692822719348",
  api_secret: "8Jm2Yg-_3WyEQ0WHFroDWP8DhmE",
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extraer el ID de la URL
  await dbConnect();

  try {
    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    } else {
      const products = await Product.find({});
      return NextResponse.json(products);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extraer el ID de la URL
  await dbConnect();
  try {
    const {
      name,
      price,
      description,
      imageUrl,
      category,
      sku,
      stock,
      discount,
      color,
      weight,
      dimensions,
      size,
      tags,
      status,
      swiperInicio,
    } = await req.json();
    for (let i = 0; i < stock.length; i++) {
      for (let j = 0; j < stock[i].quantity.length; j++) {
        if (typeof stock[i].quantity[j] === "string") {
          stock[i].quantity[j] = parseInt(stock[i].quantity[j], 10);
        }
      }
    }

    if (typeof dimensions.height != "number") {
      dimensions.height = parseInt(dimensions.height, 10);
    }

    if (typeof dimensions.width != "number") {
      dimensions.width = parseInt(dimensions.width, 10);
    }

    if (typeof dimensions.length != "number") {
      dimensions.length = parseInt(dimensions.length, 10);
    }
    const swiperInicioString = String(swiperInicio);
    const product = await Product.findByIdAndUpdate(
      id,
      {  name,
        description,
        price,
        category,
        sku,
        stock,
        imageUrl,
        discount,
        color,
        weight,
        dimensions,
        size,
        tags,
        status,
        swiperInicioString, },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" });
    }
    return NextResponse.json({ message: "Producto actualizado", product });
  } catch (error) {
    return NextResponse.json({ error: "Error actualizando el producto" });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extraer el ID de la URL
  await dbConnect();
  try {
    // Encuentra el producto
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" });
    }

    // Elimina las imágenes de Cloudinary
    if (product.imageUrl) {
      // Convertir el string en un array

      if (product.imageUrl.length > 0) {
        for (const imageUrl of product.imageUrl) {
          const parts = imageUrl.split("/");
          const fileWithExtension = parts[parts.length - 1]; // "sample.jpg"
          const [publicId] = fileWithExtension.split("."); // ["sample", "jpg"]
          console.log(imageUrl);

          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Elimina el producto de la base de datos
    await product.deleteOne({ _id: id });
    return NextResponse.json({ message: "Producto eliminado", product });
  } catch (error) {
    return NextResponse.json({ error: "Error eliminando el producto" });
  }
}
