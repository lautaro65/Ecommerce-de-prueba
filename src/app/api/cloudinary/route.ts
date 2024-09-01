import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { resourceUsage } from "process";

cloudinary.config({
  cloud_name: 'djnpyyl6b',
  api_key: '534692822719348',
  api_secret: '8Jm2Yg-_3WyEQ0WHFroDWP8DhmE'
});

export async function DELETE(req: NextRequest, res: NextApiResponse) {
  const { publicId } = await req.json(); // Lee el cuerpo de la solicitud
  console.log(publicId);
  if (!publicId) {
    return NextResponse.json({ error: "El public_id es requerido" });
  }

  try {
    const result= await cloudinary.uploader.destroy(publicId)
    if (result.result !== "ok") {
      return NextResponse.json({ error: "Error eliminando la imagen" });
    }

    return NextResponse.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error eliminando la imagen" });
  }
}
