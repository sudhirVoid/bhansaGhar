import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; 

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
    const { login } = useAuth();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log(result); // for debugging

            if (response.ok && result?.data?.authToken) {
                const user = {
                  userId: result.data.userId,
                  username: result.data.username,
                  email: result.data.email,
                };
                login({ token: result.data.authToken, user }); // <-- pass user object
                navigate("/dashboard", { replace: true });
              }
            else {
                console.error("Invalid login response");
                // TODO: handle error UI if needed
            }
        } catch (error) {
            console.error('Login error:', error);
            // TODO: handle error UI if needed
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
