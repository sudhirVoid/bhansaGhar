import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface LoginFormInputs {
    username: string;
    password: string;
}

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            navigate("/dashboard");
        }
    }, [navigate]);
    
    const onSubmit = (data: LoginFormInputs) => {
        console.log(data);
        // Mock login logic
        const isAuthenticated = data.username === "admin" && data.password === "password";
        if (isAuthenticated) {
            localStorage.setItem("authToken", "dummy-auth-token"); // TODO: Replace with real authentication token
            // Redirect to the dashboard
            navigate("/dashboard");
        } else {
            alert("Invalid username or password");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center px-4">
            <div className="bg-slate-100 p-8 rounded-2xl shadow-xl w-full max-w-md text-black">
                <h2 className="text-2xl font-bold mb-2 text-center">Bhansha Ghar</h2>
                <p className="mb-6 text-gray-600 text-center">Login to your BhansaGhar account</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <Label htmlFor="username" className="text-sm">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Your username"
                            className="mt-1 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            {...register("username", { required: "Username is required" })}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <Label htmlFor="password" className="text-sm">Password</Label>
                            <a href="#" className="text-xs text-blue-400 hover:underline">
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-black text-white hover:bg-gray-800 transition-all font-semibold py-2 rounded-md"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}