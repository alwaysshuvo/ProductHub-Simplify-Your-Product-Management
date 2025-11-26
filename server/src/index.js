import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();
const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== DATABASE CONNECTION ======

const uri = process.env.MONGO_URI;
let db, Users, Products, Stores, Ratings, Categories;

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
    Categories = db.collection("categories");

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
}
connectDB();

// =================================================
//                    ROUTES
// =================================================

// ===== TEST ROUTE =====
app.get("/", (req, res) => {
  res.send("ProductHub Server is Running");
});

// =================================================
//                PRODUCTS CRUD
// =================================================

// Get all products
app.get("/products", async (req, res) => {
  try {
    const result = await Products.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// Get Single Product
app.get("/products/:id", async (req, res) => {
  try {
    const result = await Products.findOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch {
    res.status(400).send({ error: "Invalid product ID" });
  }
});

// Create Product
app.post("/products", async (req, res) => {
  try {
    const result = await Products.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to add product" });
  }
});

// Update Product
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

// Delete Product
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

// =================================================
//                STORES CRUD
// =================================================

// Get all stores
app.get("/stores", async (req, res) => {
  try {
    const result = await Stores.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch stores" });
  }
});

// =================================================
//                 USERS
// =================================================

// Add User
app.post("/users", async (req, res) => {
  try {
    const result = await Users.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to save user" });
  }
});

// Get Users
app.get("/users", async (req, res) => {
  try {
    const result = await Users.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// =================================================
//                 RATINGS / REVIEWS
// =================================================

// Get all ratings
app.get("/ratings", async (req, res) => {
  try {
    const result = await Ratings.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch ratings" });
  }
});

// Get ratings by product
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

// =================================================
//                 CATEGORIES CRUD
// =================================================

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const result = await Categories.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to fetch categories" });
  }
});

// Add Category
app.post("/categories", async (req, res) => {
  try {
    const result = await Categories.insertOne(req.body);
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to add category" });
  }
});

// Update Category
app.put("/categories/:id", async (req, res) => {
  try {
    const result = await Categories.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to update category" });
  }
});

// Delete Category
app.delete("/categories/:id", async (req, res) => {
  try {
    const result = await Categories.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to delete category" });
  }
});

// =================================================
//               SERVER START
// =================================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
