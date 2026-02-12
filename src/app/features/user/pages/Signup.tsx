/** Imported modules */
import { type FormEvent, useState, useEffect } from "react";
import { ArrowRight, Lock, Mail, Zap, Eye, EyeOff } from "lucide-react";
import { userAPI } from "../api/user-api.ts";
import { useLoadingOverlay } from "../../../shared/overlays/LoadingOverlayProvider.tsx";
import { toast } from "sonner";
import { useUserStore } from "../store/user-store.ts";
import { Link, useNavigate } from "react-router";

/** Signup component */
const Signup = () => {
    /** States */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    /** Hooks */
    const navigate = useNavigate();
    const { user, setUser } = useUserStore();
    const { showLoading, hideLoading } = useLoadingOverlay();

    /** Redirect to the dashboard if the user is already logged in */
    useEffect(() => {
        if (user) navigate("/apis");
    }, [navigate, user]);

    /** Handle the signup */
    const handleSignup = async (event: FormEvent) => {
        event.preventDefault();

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        const newErrors: { email?: string; password?: string } = {};
        if (!trimmedEmail) newErrors.email = "Email is required";
        if (!trimmedPassword) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        showLoading();
        try {
            const user = await userAPI.signup({ email: trimmedEmail, password: trimmedPassword });
            setUser({ role: user.role, _id: user._id, email: user.email });
            toast.success("Account created successfully");
            navigate("/apis");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to signup";
            toast.error(message);
        } finally {
            hideLoading();
        }
    };

    /** Handle the try demo */
    const handleTryDemo = async () => {
        showLoading();
        try {
            const user = await userAPI.guest();
            setUser({ role: user.role, _id: user._id, email: user.email });
            toast.success("Logged in as guest user for 7 days. Enjoy testing the demo!");
            navigate("/apis");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to login as guest";
            toast.error(message);
        } finally {
            hideLoading();
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FDFDFD] font-sans text-slate-600 antialiased selection:bg-blue-100 selection:text-blue-900">
            <div className="relative z-10 w-full max-w-[440px] px-4">
                {/* Card */}
                <div className="rounded-3xl bg-white/80 p-8 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-slate-200 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                    {/* Header */}
                    <div className="mb-7 flex flex-col items-center space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/15">
                            <Zap size={24} fill="currentColor" />
                        </div>

                        <div className="space-y-0.5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-950">
                                Create an account
                            </h1>
                            <p className="text-sm font-normal text-gray-500">
                                Enter your details to create your account
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="mb-3 space-y-4">
                        {/* Email */}
                        <div className="space-y-1">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-800">
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (errors.email)
                                            setErrors({ ...errors, email: undefined });
                                    }}
                                    placeholder="Enter your email address"
                                    className={`flex h-11 w-full rounded-xl border bg-gray-50 px-3 py-2 pl-10 text-sm font-normal text-gray-800 ring-offset-white transition-all placeholder:text-gray-400 focus:ring-1 focus:outline-none ${
                                        errors.email
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    }`}
                                />
                            </div>

                            {errors.email && (
                                <p className="mt-1 text-xs font-normal text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-800">
                                Password
                            </label>

                            <div className="relative">
                                <Lock className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        if (errors.password)
                                            setErrors({ ...errors, password: undefined });
                                    }}
                                    placeholder="Create a password"
                                    className={`flex h-11 w-full rounded-xl border bg-gray-50 px-3 py-2 pl-10 text-sm font-normal text-gray-800 ring-offset-white transition-all placeholder:text-gray-400 focus:ring-1 focus:outline-none ${
                                        errors.password
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-3.5 right-3 text-gray-400 hover:text-gray-600 focus:outline-none">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-xs font-normal text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Terms and conditions */}
                        <div className="pt-1 text-xs leading-relaxed text-gray-500">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="font-semibold text-blue-600 hover:underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="font-semibold text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none">
                            Create account{" "}
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>
                    </form>

                    {/* Try Demo button */}
                    <button
                        type="button"
                        onClick={handleTryDemo}
                        className="group mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-blue-600 focus:outline-none">
                        <svg
                            width="18"
                            height="18"
                            className="text-gray-500 transition-colors group-hover:text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Try Demo
                    </button>

                    {/* Login link */}
                    <div className="text-center text-sm font-normal text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 transition-colors hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-5 text-center text-xs text-slate-400">
                    &copy; 2026 APIFlow. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Signup;
