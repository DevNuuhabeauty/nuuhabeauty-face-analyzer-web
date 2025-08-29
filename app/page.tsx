"use client"
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/face-analyzer');
    } else {
      router.push('/sign-in');
    }
  }, [session]);

  return (
    <div>

    </div>
  );
}
