import AuthNav from "@/src/features/auth/screen/view/components/auth-nav";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>

            {children}
        </div>
    )
}

export default AuthLayout;