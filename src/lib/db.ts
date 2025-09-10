import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

let globalWithMongoose = global as GlobalWithMongoose;

export function connectDB() {
  if (!globalWithMongoose._mongooseConn) {
    globalWithMongoose._mongooseConn = mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    });
  }
  return globalWithMongoose._mongooseConn;
}
