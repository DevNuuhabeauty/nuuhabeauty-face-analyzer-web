"use client"

import { useSession } from "next-auth/react";

const GreetingText = () => {
    const { data: session } = useSession();


    return (
        <p className="text-md font-bold">Hi, {session?.user?.first_name} {session?.user?.last_name}</p>
    )
}

export default GreetingText;