import mongoose, { Document, Schema } from "mongoose";

interface IDimensions {
  length: number;
  width: number;
  height: number;
}

// Definición de la interfaz para el stock del producto
interface IStock {
  color: string;
  size: string[];
  quantity: number[];
}

// Definición de la interfaz para el producto
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: IStock[];
  imageUrl: string[];
  discount?: number;
  color?: string[];
  weight?: number;
  dimensions?: IDimensions;
  size?: string[];
  tags?: string[];
  status: 'activo' | 'inactivo';
  swiperInicioString: 'true' | 'false';
}
const StockSchema: Schema = new Schema({
  color: { type: String, required: true },
  size: { type: [String], required: true },
  quantity: { type: [Number], required: true },
});

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true }, // Nombre del Producto
  description: { type: String, required: true }, // Descripción
  price: { type: Number, required: true }, // Precio
  category: { type: String, required: true }, // Categoría
  sku: { type: String, required: true, unique: true }, // SKU (Stock Keeping Unit)
  stock: { type: [StockSchema], required: true }, // Stock según color y tamaño
   imageUrl: { type: [String], required: true }, 
  discount: { type: Number, default: 0 }, // Descuento (porcentaje)
  color: { type: [String] }, // Colores disponibles
  weight: { type: Number }, // Peso
  dimensions: {
    // Dimensiones
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  size: { type: [String] }, // Tamaños disponibles
  tags: { type: [String] }, // Etiquetas
  status: { type: String, enum: ["activo", "inactivo"], default: "activo" }, // Estado del producto */
  swiperInicioString:{  type: String, enum: ["false", "true"], default: "false"  }, //Swiper
});
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
