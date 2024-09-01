import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import Product from "@/app/models/products";
import dbConnect from "@/app/lib/dbConnect";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    } = await request.json();

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
    if (typeof swiperInicio != "string") {
      const swiperInicioString = String(swiperInicio);
    }
    const swiperInicioString = swiperInicio;


    const products = new Product({
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
      swiperInicioString,
    });
    console.log(products);
    await products.save();
    return NextResponse.json(products, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
