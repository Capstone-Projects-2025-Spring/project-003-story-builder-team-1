import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URI);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("author_context");
    console.log("Connected to MongoDB");
  }
  return db;
}

export async function getAuthorContext(author) {
  const database = await connectDB();
  return await database.collection("samples").findOne({ author });
}
