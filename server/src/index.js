import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

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
    db = client.db("Producthub");
    Users = db.collection("users");
    Products = db.collection("products");
    Stores = db.collection("stores");
    Ratings = db.collection("ratings");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
}
connectDB();

// ======================= ROUTES ==========================

// Test Route
app.get("/", (req, res) => {
  res.send("ProductHub Server is Running");
});

// ---------------- PRODUCTS CRUD ----------------

// Get all products
app.get("/products", async (req, res) => {
  try {
    const result = await Products.find().toArray();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// Get single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const result = await Products.findOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch {
    res.status(400).send({ error: "Invalid product ID" });
  }
});

// Add product
app.post("/products", async (req, res) => {
  try {
    const result = await Products.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to add product" });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const result = await Products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to update product" });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const result = await Products.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to delete product" });
  }
});

// ---------------- STORES CRUD ----------------

// Get all stores
app.get("/stores", async (req, res) => {
  try {
    const result = await Stores.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch stores" });
  }
});

// ---------------- USERS REGISTER & READ ----------------

// Add user
app.post("/users", async (req, res) => {
  try {
    const result = await Users.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to save user" });
  }
});

// Get users
app.get("/users", async (req, res) => {
  try {
    const result = await Users.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// ---------------- RATINGS (Reviews) ----------------

// Get all ratings
app.get("/ratings", async (req, res) => {
  try {
    const result = await Ratings.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch ratings" });
  }
});

// Get ratings of a specific product
app.get("/ratings/product/:id", async (req, res) => {
  try {
    const result = await Ratings.find({ productId: req.params.id }).toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch product reviews" });
  }
});

// Add rating
app.post("/ratings", async (req, res) => {
  try {
    const result = await Ratings.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to save rating" });
  }
});

// ===================== START SERVER =======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
