# 🛒 ProductHub — Simplify Your Product Management

**ProductHub** is a full-stack e-commerce and product management platform.  
Users can browse products, add them to cart, and manage purchases.  
Sellers/Admins can manage their product inventory in real-time.

🚀 **Live Demo:** https://product-hub-simplify-your-product-m.vercel.app/

---

## 🎯 Features

### 👥 User Features
- 🔐 Login & Authentication (Google + Email/Password)
- 🛒 Persistent Shopping Cart (stored in database)
- 👀 Product browsing with categories & reviews
- ❤️ Add products to cart only after login
- 💳 Checkout page (coming soon)

### 🏬 Seller / Admin Features
- 📦 Add, Update, and Delete Products
- 🧾 Manage all store products
- ⭐ View product ratings
- 📊 Dashboard (basic analytics)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | **Next.js 15**, React 19, App Router |
| Styling | TailwindCSS v4, Lucide Icons |
| State Management | Redux Toolkit |
| Authentication | NextAuth + Google + Credentials (Password Login) |
| Backend | Express.js + MongoDB |
| Database | MongoDB (Collections: users, products, carts, ratings, categories) |
| Other | Axios, Firebase (UI use only), Toast Notifications |

---

## 📦 Frontend Setup (Next.js)

```bash
cd clients
npm install
npm run dev


---


## 🌍 Environment Variables (Frontend .env.local)

NEXT_PUBLIC_CURRENCY_SYMBOL="$"
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_IMGBB_KEY=your_imgbb_key
NEXT_PUBLIC_API_URL=http://localhost:5000


---
## 🌐 Backend Setup (Express + MongoDB)

cd server
npm install
npm run dev

---

## 🔐 Environment Variables (Backend .env)

MONGO_URI=your_mongodb_connection
PORT=5000

---

## 🌍 API Routes Summary

| Method | Route                    | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/products`              | Get all products         |
| GET    | `/products/:id`          | Get product by ID        |
| POST   | `/products`              | Add new product          |
| PUT    | `/products/:id`          | Update a product         |
| DELETE | `/products/:id`          | Delete a product         |
| GET    | `/cart/:uid`             | Get user cart            |
| POST   | `/cart/add`              | Add item to user cart    |
| PATCH  | `/cart/update`           | Update cart quantity     |
| DELETE | `/cart/remove/:uid/:pid` | Remove product from cart |
| GET    | `/ratings/product/:id`   | Get product reviews      |
| POST   | `/ratings`               | Add a review             |
| GET    | `/categories`            | Get categories           |
| POST   | `/categories`            | Add category             |

## 📌 Notes

🔐 Cart items are saved only for logged-in users.
🛍 User cannot add items to cart without login.
💳 Payment/Order system will be integrated later.

---

## 💚 Contributing
Pull Requests are welcome.
If you have suggestions, feel free to open an issue.

#Made with ❤️ by Ali Hossen Shuvo

---

If you want a **logo design**, **documentation PDF**, or **deployment guide**, just let me know 😊💚
