import { Console } from "console";
import mongoose from "mongoose";

const connection: { isConnected?: number } = {};

async function dbConnect() {
  try {
    if (connection.isConnected) {
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URL!);
    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.log("error de conectar db" + err);
  }
}
export default dbConnect;
