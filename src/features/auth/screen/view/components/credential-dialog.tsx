import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Link } from "lucide-react"
import { useState } from "react"
import { useShopifyAuth } from "../../tanstack/auth-tanstack"
import DefaultButton from "@/src/core/shared/presentation/components/default-button"
import { toast } from "react-hot-toast"

const CredentialDialog = ({ widget }: { widget: React.ReactNode, }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isSignUp, setIsSignUp] = useState(false);

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const { loginMutation, logoutMutation, recoverCustomerMutation, signUpMutation } = useShopifyAuth();


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
        <Dialog>
            <DialogTrigger asChild>
                {widget}
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] px-4 md:px-6">
                <DialogHeader>
                    <DialogTitle>{isForgotPassword ? "Forgot Password" : isSignUp ? "Create an account" : "Sign In"}</DialogTitle>
                    <DialogDescription>
                        {isForgotPassword ? "Please enter your email to reset your password." : isSignUp ? "Please create an account using email that you use in nuuhabeauty.com." : "Please enter your email and password to login."}
                    </DialogDescription>
                </DialogHeader>

                {
                    isForgotPassword ? (
                        <BuildForgotPasswordContent email={email} setEmail={setEmail} />
                    ) : (
                        isSignUp ? <BuildSignUpContent email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} /> : <BuildSignInContent email={email} setEmail={setEmail} password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword} onForgotPassword={handleForgotPassword} />
                    )
                }



                <DialogFooter >
                    <div className="flex flex-col gap-2 items-center justify-center w-full">

                        {
                            isForgotPassword ? (
                                <DefaultButton
                                    title="Recover Customer"
                                    isLoading={recoverCustomerMutation.isPending}
                                    variant="default"
                                    onClick={handleRecoverCustomer}
                                    className="w-full"
                                />
                            ) : <>
                                {
                                    isSignUp ? (<DefaultButton
                                        title={signUpMutation.isPending ? "Signing up..." : "Sign up"}
                                        isLoading={signUpMutation.isPending}
                                        variant="default"
                                        onClick={handleRegister}
                                        className="w-full"
                                    />) : (<DefaultButton
                                        title={loginMutation.isPending ? "Logging in..." : "Login"}
                                        isLoading={loginMutation.isPending}
                                        variant="default"
                                        onClick={handleLogin}
                                        className="w-full"
                                    />)


                                }
                            </>
                        }


                        {

                            isSignUp ? (
                                <span className="text-xs text-gray-500 font-light flex flex-row gap-1 items-center justify-center">
                                    Already have an account?
                                    <span
                                        onClick={handleSignUp}
                                        className="text-primary hover:underline cursor-pointer text-xs" >
                                        Sign In
                                    </span>
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500 font-light flex flex-row gap-1 items-center justify-center">
                                    Dont have an account?
                                    <span
                                        onClick={handleSignUp}
                                        className="text-primary hover:underline cursor-pointer text-xs" >
                                        Sign Up
                                    </span>
                                </span>
                            )
                        }

                    </div>


                </DialogFooter>
            </DialogContent>
        </Dialog>
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
        <div className="grid w-full items-center gap-6 mb-4">
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
                <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>

                </div>
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
                            < Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Please enter your password to login.</p>

            </div>

            <div className="flex w-full justify-end"
                onClick={onForgotPassword}>
                <p className="text-xs text-gray-500 hover:underline cursor-pointer hover:text-primary text-left">
                    Forgot your password?
                </p>
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
        <div className="grid w-full items-center gap-6 mb-4">
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
                <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>

                </div>
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
                            < Eye className="h-4 w-4 text-gray-500" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-500">Please enter your password to login.</p>


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

export default CredentialDialog;    