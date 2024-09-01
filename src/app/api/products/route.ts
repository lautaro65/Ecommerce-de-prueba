import { NextResponse, NextRequest } from "next/server";
import Product from "@/app/models/products";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req: NextRequest) {
  console.log('Starting GET request');
  await dbConnect();
  try {
    console.log('Database connected');
    const products = await Product.find({});
    console.log('Products fetched');
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    // Convertir cantidades de stock a números
    for (let i = 0; i < stock.length; i++) {
      for (let j = 0; j < stock[i].quantity.length; j++) {
        if (typeof stock[i].quantity[j] === "string") {
          stock[i].quantity[j] = parseInt(stock[i].quantity[j], 10);
        }
      }
    }

    // Convertir dimensiones a números si no lo son
    dimensions.height = parseInt(dimensions.height, 10);
    dimensions.width = parseInt(dimensions.width, 10);
    dimensions.length = parseInt(dimensions.length, 10);

    // Convertir swiperInicio a string si no lo es
    const swiperInicioString = String(swiperInicio);

    const product = new Product({
      name,
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
      swiperInicio: swiperInicioString,
    });

    console.log(product);
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
