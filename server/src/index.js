import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= DATABASE CONNECTION ==================

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

    // database name must match your MongoDB database name
    db = client.db("Producthub");

    // collections
    Users = db.collection("users");
    Products = db.collection("products");
    Stores = db.collection("stores");
    Ratings = db.collection("ratings");

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
}
connectDB();

// ======================= ROUTES ==========================

// Test route
app.get("/", (req, res) => {
  res.send("ProductHub Server is Running");
});

// ---------------- PRODUCTS CRUD ----------------

// Get all products
app.get("/products", async (req, res) => {
  const result = await Products.find().toArray();
  res.send(result);
});

// Get single product
app.get("/products/:id", async (req, res) => {
  const result = await Products.findOne({ _id: req.params.id });
  res.send(result);
});

// Add product
app.post("/products", async (req, res) => {
  const result = await Products.insertOne(req.body);
  res.send(result);
});

// Update product
app.put("/products/:id", async (req, res) => {
  const result = await Products.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  const result = await Products.deleteOne({ _id: req.params.id });
  res.send(result);
});

// ---------------- STORES CRUD ----------------

// Get all stores
app.get("/stores", async (req, res) => {
  const result = await Stores.find().toArray();
  res.send(result);
});

// ---------------- USERS BASIC INSERT + READ ----------------

// Add user (temporary until authentication added)
app.post("/users", async (req, res) => {
  const result = await Users.insertOne(req.body);
  res.send(result);
});

// Get all users
app.get("/users", async (req, res) => {
  const result = await Users.find().toArray();
  res.send(result);
});

// ---------------- RATINGS (Reviews) ----------------

// Get all ratings
app.get("/ratings", async (req, res) => {
  const result = await Ratings.find().toArray();
  res.send(result);
});

// Get ratings of a specific product
app.get("/ratings/product/:id", async (req, res) => {
  const result = await Ratings.find({ productId: req.params.id }).toArray();
  res.send(result);
});

// Add rating
app.post("/ratings", async (req, res) => {
  const result = await Ratings.insertOne(req.body);
  res.send(result);
});

// ===================== START SERVER =======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
