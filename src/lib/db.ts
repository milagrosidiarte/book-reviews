// src/lib/db.ts
import "server-only";
import mongoose from "mongoose";

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

const globalWithMongoose = global as GlobalWithMongoose;

export function connectDB() {
  if (!globalWithMongoose._mongooseConn) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Falta MONGODB_URI en variables de entorno");
    }

    globalWithMongoose._mongooseConn = mongoose.connect(uri, {
      maxPoolSize: 10,
      dbName: "bookreviews", // opcional
    });
  }
  return globalWithMongoose._mongooseConn;
}
