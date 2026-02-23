import mongoose from "mongoose";

/**
 * Interface for the cached mongoose connection.
 * Helps avoid 'any' types and provides better IDE support.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes or returns a cached MongoDB connection using Mongoose.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose connection instance.
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If a connection already exists, return it immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection is in progress, start a new one.
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local",
      );
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("🔥 Connected to MongoDB successfully");
      return m;
    });
  }

  try {
    // Wait for the connection to be established.
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, clear the promise to allow a retry on next call.
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
