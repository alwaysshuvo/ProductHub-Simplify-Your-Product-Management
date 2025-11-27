import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const dbName = "Producthub";

async function getUser(credentials) {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(dbName);

  const user = await db.collection("users").findOne({ email: credentials.email });
  if (!user) return null;

  const passwordMatch = await bcrypt.compare(credentials.password, user.password);
  if (!passwordMatch) return null;

  return user;
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          return await getUser(credentials);
        } catch (err) {
          console.error("AUTH ERROR:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user._id?.toString();  // 🔥 Ensure string ID
      return token;
    },
    async session({ session, token }) {
      session.user._id = token.uid;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
