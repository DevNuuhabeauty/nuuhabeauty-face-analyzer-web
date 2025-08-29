"use client"

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
const SignInScreen = () => {

    const router = useRouter();

    useEffect(() => {
        router.push('/overview');
    }, []);
    return (
        <div>
            <h1>Sign In</h1>
        </div>
    )
}

export default SignInScreen;