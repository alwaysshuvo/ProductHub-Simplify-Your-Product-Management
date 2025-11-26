"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, UserPlus, User, Camera } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Upload image to Firebase Storage
  const uploadImage = async (file, uid) => {
    const storageRef = ref(storage, `users/${uid}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // ============== HANDLE REGISTER ================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Upload your profile picture!");
    if (!fullName.trim()) return toast.error("Name is required!");
    if (!email || !password) return toast.error("Email & password are required!");
    if (password.length < 6) return toast.error("Password must be at least 6 characters!");

    try {
      setLoading(true);

      // Create user in Firebase
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      // Upload Profile Image
      const photoURL = await uploadImage(image, uid);

      // Update Firebase Auth Profile
      await updateProfile(res.user, { displayName: fullName, photoURL });

      // Save to MongoDB
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: fullName,
          email,
          photoURL,
          role: "customer",
          createdAt: new Date(),
        }),
      });

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered!");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid Email!");
      } else {
        toast.error("Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Join <span className="text-green-600">ProductHub</span>
        </h2>
        <p className="text-center text-gray-500 mt-2">Create your account</p>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          
          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer group">
              <div className="size-20 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 transition group-hover:shadow-md">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-gray-400 w-8 h-8" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Your Name</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <User className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Your Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail className="text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock className="text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 outline-none text-gray-700 bg-transparent"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            <UserPlus size={20} />
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?
          <Link href="/login" className="text-green-600 font-medium hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
