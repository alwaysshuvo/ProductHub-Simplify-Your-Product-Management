"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // 🔐 If user not logged in → go to login
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5">
      <div className="bg-white shadow-md p-10 rounded-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          🎉 Order Confirmed!
        </h1>
        <p className="text-slate-600">
          Thank you for your purchase. <br /> 
          Your payment gateway is coming soon!
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all active:scale-95"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
