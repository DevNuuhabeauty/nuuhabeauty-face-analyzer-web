
"use client"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom"

interface ButtonProps {
    buttonTitle: string
    buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined

}

export function SubmitButton({ buttonTitle, buttonVariant }: ButtonProps) {
    const { pending } = useFormStatus();
    return (
        <>
            {
                pending ?
                    (
                        <Button disabled className="w-full" variant={buttonVariant}>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Please wait

                        </Button>
                    )
                    :
                    (
                        <Button type="submit" variant={buttonVariant} className="w-full">{buttonTitle}</Button>
                    )
            }
        </>
    )
}