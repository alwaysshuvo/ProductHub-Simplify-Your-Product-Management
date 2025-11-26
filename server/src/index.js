import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ---------------- DATABASE CONNECTION ----------------
const uri = process.env.MONGO_URI;
let db, Users, Products, Stores, Ratings;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    db = client.db("ProductHub"); 

    // 👉 Collections
    Users = db.collection("users");
    Products = db.collection("products");
    Stores = db.collection("stores");
    Ratings = db.collection("ratings");

    console.log("🚀 MongoDB Connected Successfully!");
  } catch (error) {
    console.log("❌ DB Connection Error:", error);
  }
}
connectDB();



// Root
app.get("/", (req, res) => {
  res.send("🔥 ProductHub Server is Running!");
});


app.get("/products", async (req, res) => {
  const products = await Products.find().toArray();
  res.send(products);
});


app.post("/user", async (req, res) => {
  const user = req.body;
  const result = await Users.insertOne(user);
  res.send(result);
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});
