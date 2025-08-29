"use client"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useShopifyAuth } from "../../tanstack/auth-tanstack"
import DefaultButton from "@/src/core/shared/presentation/components/default-button"
import { toast } from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import nuhabeautyLogo from "@/public/nuhabeauty-logo.png"

const CredentialScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const { loginMutation, signUpMutation, recoverCustomerMutation } = useShopifyAuth();

    const handleLogin = () => {
        if (!email || !password) {
            toast.error('Please enter your email and password');
            return;
        }
        loginMutation.mutate({ email, password });
    }

    const handleRegister = () => {
        signUpMutation.mutate({ email, password });
    }

    const handleSignUp = () => {
        setIsSignUp(!isSignUp);
        setIsForgotPassword(false);
    }

    const handleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
    }

    const handleRecoverCustomer = () => {
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        recoverCustomerMutation.mutate(email);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8 border border-gray-200">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                        <Image
                            src={nuhabeautyLogo}
                            alt="Nuha Beauty"
                            width={70}
                            height={70}
                            className="rounded-full object-cover bg-transparent"
                            style={{
                                objectFit: "cover"
                            }}
                        />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        {isForgotPassword ? "Reset Password" : isSignUp ? "Join Nuuha Beauty" : "Welcome Back"}
                    </h1>
                    <p className="text-gray-600 text-center max-w-sm">
                        {isForgotPassword
                            ? "Enter your email to reset your password"
                            : isSignUp
                                ? "Create your account to start your skincare journey"
                                : "Sign in to access your personalized skincare routine"}
                    </p>
                </div>

                {isForgotPassword ? (
                    <BuildForgotPasswordContent email={email} setEmail={setEmail} />
                ) : (
                    isSignUp
                        ? <BuildSignUpContent
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                        : <BuildSignInContent
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            onForgotPassword={handleForgotPassword}
                        />
                )}

                <div className="flex flex-col gap-3 items-center justify-center w-full">
                    {isForgotPassword ? (
                        <DefaultButton
                            title="Send Reset Link"
                            isLoading={recoverCustomerMutation.isPending}
                            variant="default"
                            onClick={handleRecoverCustomer}
                            className="w-full rounded-xl py-3 bg-primary hover:bg-primary/90 transition-all"
                        />
                    ) : (
                        <DefaultButton
                            title={isSignUp
                                ? (signUpMutation.isPending ? "Creating Account..." : "Create Account")
                                : (loginMutation.isPending ? "Signing In..." : "Sign In")
                            }
                            isLoading={isSignUp ? signUpMutation.isPending : loginMutation.isPending}
                            variant="default"
                            onClick={isSignUp ? handleRegister : handleLogin}
                            className="w-full rounded-xl py-3 bg-primary hover:bg-primary/90 transition-all"
                        />
                    )}

                    <span className="text-sm text-gray-600 flex flex-row gap-1 items-center justify-center">
                        {isSignUp ? "Already have an account?" : "New to Nuuha Beauty?"}
                        <span
                            onClick={handleSignUp}
                            className="text-primary font-medium hover:underline cursor-pointer"
                        >
                            {isSignUp ? "Sign In" : "Create Account"}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

const BuildSignInContent = ({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    onForgotPassword
}: {
    email: string,
    setEmail: (email: string) => void,
    password: string,
    setPassword: (password: string) => void,
    showPassword: boolean,
    setShowPassword: (showPassword: boolean) => void,
    onForgotPassword: () => void
}) => {
    return (
        <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className="text-xs text-gray-500">We'll never share your email with anyone else.</p>
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
                <div className="flex justify-end">
                    <p
                        className="text-xs text-gray-500 hover:underline cursor-pointer hover:text-primary"
                        onClick={onForgotPassword}
                    >
                        Forgot your password?
                    </p>
                </div>
            </div>
        </div>
    )
}

const BuildSignUpContent = ({
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword
}: {
    email: string,
    setEmail: (email: string) => void,
    password: string,
    setPassword: (password: string) => void,
    showPassword: boolean,
    setShowPassword: (showPassword: boolean) => void
}) => {
    return (
        <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className="text-xs text-gray-500">We'll never share your email with anyone else.</p>
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

const BuildForgotPasswordContent = ({
    email,
    setEmail
}: {
    email: string,
    setEmail: (email: string) => void
}) => {
    return (
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <p className="text-xs text-gray-500">We'll never share your email with anyone else.</p>
        </div>
    )
}

export default CredentialScreen