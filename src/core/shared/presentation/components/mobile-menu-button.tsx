'use client'

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationItems } from "./head-nav"
import { signOut, useSession } from "next-auth/react"
import CredentialDialog from "@/src/features/auth/screen/view/components/credential-dialog"
import { useState } from "react"


export function MobileMenuButton() {

    const location = usePathname();
    const router = useRouter();
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <div className="mt-5 flex px-2 space-y-1 flex-col">
                    {
                        navigationItems.map((eachItem, index) => {
                            return (
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    key={index}
                                    href={eachItem.href}
                                    className={cn(location === eachItem.href ? 'bg-muted' : 'hover:bg-muted hover:bg-opacity-75',
                                        "group flex items-center px-2 py-2 text-md rounded-md font-semibold"
                                    )}>
                                    {eachItem.name}
                                </Link>

                            )
                        })
                    }
                </div>

                <SheetFooter className="mt-5">
                    {
                        session && (
                            <SheetClose asChild>
                                <Button onClick={() => {
                                    signOut({
                                        redirect: false,
                                        callbackUrl: '/overview'
                                    });
                                    // router.push('/overview');
                                }}>
                                    Logout
                                </Button>
                            </SheetClose>
                        )
                    }
                    {
                        !session && (
                            <SheetClose asChild>
                                <CredentialDialog widget={<Button>Sign In</Button>} />

                            </SheetClose>
                        )
                    }
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}