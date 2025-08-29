'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
const AuthNav = () => {
    const router = useRouter();
    return (
        <nav className="mx-4 md:container px-4 md:px-8 py-1 grid grid-cols-12">
            <div className="col-span-6 flex md:col-span-3">
                <div className="flex items-center gap-2" onClick={() => router.push('/overview')}>
                    <Image src={"/nuhabeauty-logo.png"}
                        alt="BeeRescue"
                        width={70}
                        height={70}
                        className="rounded-full object-cover"
                        style={
                            {
                                objectFit: "cover"
                            }
                        }
                    />
                </div>
            </div>
        </nav>
    )
}

export default AuthNav;