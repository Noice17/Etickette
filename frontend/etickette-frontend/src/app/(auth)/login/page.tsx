"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/utils/apiFetch";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await apiFetch(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
        },
        false
      ); // disable auth for login

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("token", token);

      const userRes = await apiFetch("/users/me", { method: "GET" });
      if (!userRes.ok) {
        throw new Error("Failed to fetch user info");
      }
      const user = await userRes.json();
      localStorage.setItem("role", user.role);
      localStorage.setItem("id", user.id);

      if(user.role === "CLIENT"){
        router.push("/pages/client")
      }else if (user.role === "AGENT"){
        router.push("/pages/agent")
      }else{
        router.push("/");
      }

      // router.push("/");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-gray-600">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Etickette
          </h2>
          <p className="text-gray-600">Login to the #1 Ticketing System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-500 hover:text-indigo-300 font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          © 2025 Etickette. All rights reserved.
        </div>
      </div>
    </div>
  );
}
