import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "Producthub"; // same name you used in backend

export const authOptions = {
  providers: [
    // 👉 Email/Password Login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await client.connect();
        const db = client.db(dbName);
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user) return null; // user not exists

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null; // wrong password

        return user; // success login
      }
    }),

    // 👉 Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user._id;
      return token;
    },
    async session({ session, token }) {
      session.user._id = token.uid;
      return session;
    },
  },
};

