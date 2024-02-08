"use client";

import { authStateAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const auth = useAtomValue(authStateAtom);
  const router = useRouter();

  useEffect(() => {
    if (auth) router.push("/editor");
    else router.push("/login");
  }, [auth, router]);

  return <div></div>;
}
