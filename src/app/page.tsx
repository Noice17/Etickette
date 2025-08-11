"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, login } from "./api";

export default function LandingPage() {
    const router = useRouter();
    const [isRegister, setIsRegister] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        role: "CLIENT",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = isRegister
                ? await register(formData)
                : await login(formData);

            console.log("Success:", result);

            if (!isRegister) {
                const role = localStorage.getItem("role");

                switch (role?.toUpperCase()) {
                    case 'CLIENT':
                        router.push('/Webpages/client');
                        break;
                    case 'AGENT':
                        router.push('/Webpages/agent');
                        break;
                    default:
                        console.error('Unknown or missing role:', role);
                        break;
                }
            }else{
                alert("Account created successfully. You can now log in.");
                setIsRegister(false);
            }
        } catch (err: any) {
            alert(err.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full h-screen bg-bg-og-bg-of-mc flex items-center justify-center font-montserrat relative overflow-hidden">
            {/* Main Card with Fixed Height */}
            <div className="w-full max-w-md mx-auto h-5/6 bg-white/90 backdrop-blur-lg border border-border-blue rounded-3xl shadow-xl flex flex-col">
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="text-center mb-6 mt-8">
                        <h1 className="text-3xl font-bold text-blue-active">
                            {isRegister ? "Create Account" : "Welcome Back"}
                        </h1>
                        <p className="text-gray-category mt-1.5">
                            {isRegister ? "Join our happy team!" : "We are here to gracefully resolve your concerns"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium mb-1 text-darkIndigo">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border-blue rounded-xl focus:outline-none focus:ring-2 focus:ring-activeBlue/50 focus:border-activeBlue transition-all duration-200 placeholder-gray-400"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-darkIndigo">Role</label>
                                    <div className="flex gap-2">
                                        {["CLIENT", "AGENT"].map((role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role })}
                                                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 capitalize
                                                    ${formData.role === role
                                                        ? "bg-blue-buttons text-white shadow-md"
                                                        : "bg-lightBabyBlue text-darkIndigo hover:bg-deepBabyBlue/30"
                                                    }`}
                                            >
                                                {role.toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1 text-darkIndigo">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-border-blue rounded-xl focus:outline-none focus:ring-2 focus:ring-activeBlue/50 focus:border-activeBlue transition-all duration-200 placeholder-gray-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-1 text-darkIndigo">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-border-blue rounded-xl focus:outline-none focus:ring-2 focus:ring-activeBlue/50 focus:border-activeBlue transition-all duration-200 placeholder-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-buttons text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:bg-white hover:text-blue-buttons transform transition-all duration-200"
                        >
                            {isRegister ? "Sign Up" : "Log In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-darkIndigo/80">
                            {isRegister ? "Already have an account?" : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="text-blue-buttons font-medium underline hover:text-darkActiveBlue transition-colors duration-200"
                        >
                            {isRegister ? "Log In" : "Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}