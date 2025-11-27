import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
let db, Users, Products, Stores, Ratings, Categories;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
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

// ROOT CHECK
app.get("/", (req, res) => res.send("ProductHub Server is Running"));

/* ===========================
          PRODUCTS 
=========================== */

// All products
app.get("/products", async (_, res) => {
  try {
    res.send(await Products.find().toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch products" });
  }
});

// Single product
app.get("/products/:id", async (req, res) => {
  try {
    res.send(await Products.findOne({ _id: new ObjectId(req.params.id) }));
  } catch {
    res.status(400).send({ error: "Invalid product ID" });
  }
});

// Create product
app.post("/products", async (req, res) => {
  try {
    const result = await Products.insertOne({ ...req.body, inStock: true });
    res.send(result);
  } catch {
    res.status(500).send({ error: "Failed to add product" });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    res.send(await Products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    ));
  } catch {
    res.status(500).send({ error: "Failed to update product" });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    res.send(await Products.deleteOne({ _id: new ObjectId(req.params.id) }));
  } catch {
    res.status(500).send({ error: "Failed to delete product" });
  }
});

// Products by user
app.get("/products/user/:uid", async (req, res) => {
  try {
    res.send(await Products.find({ userId: req.params.uid }).toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch user products" });
  }
});

// Toggle stock
app.patch("/products/toggle/:id", async (req, res) => {
  try {
    const product = await Products.findOne({ _id: new ObjectId(req.params.id) });
    res.send(await Products.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { inStock: !product.inStock } }
    ));
  } catch {
    res.status(500).send({ error: "Failed to toggle stock" });
  }
});

/* ===========================
            USERS 
=========================== */

app.post("/users", async (req, res) => {
  try {
    res.send(await Users.insertOne(req.body));
  } catch {
    res.status(500).send({ error: "Failed to save user" });
  }
});

app.get("/users", async (_, res) => {
  try {
    res.send(await Users.find().toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

/* ===========================
           RATINGS 
=========================== */

app.get("/ratings", async (_, res) => {
  try {
    res.send(await Ratings.find().toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch ratings" });
  }
});

app.get("/ratings/product/:id", async (req, res) => {
  try {
    res.send(await Ratings.find({ productId: req.params.id }).toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch reviews" });
  }
});

app.post("/ratings", async (req, res) => {
  try {
    res.send(await Ratings.insertOne(req.body));
  } catch {
    res.status(500).send({ error: "Failed to save rating" });
  }
});

/* ===========================
          CATEGORIES 
=========================== */

app.get("/categories", async (_, res) => {
  try {
    res.send(await Categories.find().toArray());
  } catch {
    res.status(500).send({ error: "Failed to fetch categories" });
  }
});

app.post("/categories", async (req, res) => {
  try {
    res.send(await Categories.insertOne(req.body));
  } catch {
    res.status(500).send({ error: "Failed to add category" });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    res.send(await Categories.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    ));
  } catch {
    res.status(500).send({ error: "Failed to update category" });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    res.send(await Categories.deleteOne({ _id: new ObjectId(req.params.id) }));
  } catch {
    res.status(500).send({ error: "Failed to delete category" });
  }
});

/* ===========================
       SELLER DASHBOARD API 
=========================== */

app.get("/store-dashboard/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    const totalProducts = await Products.countDocuments({ userId: uid });
    const ratings = await Ratings.find({ sellerId: uid }).toArray();

    res.send({
      totalProducts,
      totalOrders: 0,
      totalEarnings: 0,
      ratings,
    });
  } catch {
    res.status(500).send({ error: "Failed to fetch dashboard info" });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
