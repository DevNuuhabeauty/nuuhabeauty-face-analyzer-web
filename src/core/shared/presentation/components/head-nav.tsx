'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/src/core/theme/theme-toggle";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { MobileMenuButton } from "./mobile-menu-button";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import CredentialDialog from "@/src/features/auth/screen/view/components/credential-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserCircle } from "lucide-react"

export const navigationItems = [
    { name: "Skin History", href: "/overview" },
    { name: "Face Analyzer", href: "/face-analyzer" },
    { name: "Ingredient Checker", href: "/product-ingredients" },
];

export function HeadNavbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();
    const isTabletOrMobile = useMediaQuery({ maxWidth: 1024 });

    return (
        <nav className="mx-4 md:container px-4 md:px-8 py-1 flex justify-between items-center">
            <div className="flex items-center">
                <Link href="https://nuuhabeauty.com/" target="_blank" >
                    <Image src={"/images/nuhabeauty-logo.png"}
                        alt="BeeRescue"
                        width={isTabletOrMobile ? 50 : 70}
                        height={isTabletOrMobile ? 50 : 70}
                        className="rounded-full object-cover"
                        style={{
                            objectFit: "cover"
                        }}
                    />
                </Link>
            </div>

            {!isTabletOrMobile && (
                <div className="flex justify-center items-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navigationItems.map((eachItem, index) => {
                                const isActive =
                                    eachItem.href === '/product-ingredients' ? pathname.startsWith('/product-ingredients') :
                                        eachItem.href === '/face-analyzer' ? pathname.startsWith('/face-analyzer') :
                                            pathname === eachItem.href;
                                return (
                                    <NavigationMenuItem key={index}>
                                        <Link
                                            href={eachItem.href}
                                            legacyBehavior
                                            passHref>
                                            <NavigationMenuLink
                                                active={isActive}
                                                className={`rounded-lg px-4 py-2 ${isActive ? "bg-primary" : "bg-background"} 
                                                    text-sm font-medium ${isActive ? "text-background" : "text-balance"}`}>
                                                {eachItem.name}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            )}

            <div className="flex items-center gap-2">
                {
                    isTabletOrMobile ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <UserCircle className="h-6 w-6" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {session ? (
                                    <>
                                        <DropdownMenuItem onClick={() => router.push('/settings')} >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            signOut({
                                                redirect: false,
                                                callbackUrl: '/sign-in'
                                            });
                                            router.push('/sign-in');
                                        }}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </DropdownMenuItem>

                                    </>
                                ) : (
                                    <DropdownMenuItem asChild>
                                        <CredentialDialog widget={<Button variant="ghost">Login</Button>} />
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <UserCircle className="h-5 w-5 mr-2" />
                                        Account
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => {
                                        signOut({
                                            redirect: false,
                                            callbackUrl: '/overview'
                                        });
                                    }}>
                                        Logout
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/delete-account')} className="text-destructive">
                                        Delete Account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <CredentialDialog widget={<Button variant="default">Login</Button>} />
                        )
                    )
                }
            </div>
        </nav>
    );
}