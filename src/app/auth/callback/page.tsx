"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMe } from "@/services/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  const { setSession } = useAuth();

  useEffect(() => {
    async function finishSignIn() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const token = hash.get("token") || query.get("token");
      const next = hash.get("next") || query.get("next") || "/dashboard";

      if (!token) {
        setState("failed");
        return;
      }

      try {
        const user = await getMe(token);
        setSession({ token, user });
      } catch {
        setState("failed");
        return;
      }

      setState("ready");
      router.replace(next.startsWith("/") ? next : "/dashboard");
    }

    finishSignIn();
  }, [router, setSession]);

  return (
    <main className="section-shell">
      <div className="mx-auto max-w-xl border border-white/10 bg-[#101010] p-8 text-center">
        {state === "loading" ? <Loader2 className="mx-auto animate-spin text-[#d7b46a]" size={34} /> : null}
        {state === "ready" ? <CheckCircle2 className="mx-auto text-[#d7b46a]" size={34} /> : null}
        <h1 className="mt-5 text-3xl font-black uppercase text-white">
          {state === "failed" ? "Sign-in needs another try" : "Finishing your sign in"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          {state === "failed"
            ? "We could not complete Google sign-in this time. Your Nara Promotionz account is still ready through email or phone access."
            : "Your Nara Promotionz account is opening with your tickets, watch access, and fight-night rewards close by."}
        </p>
        {state === "failed" ? (
          <Link href="/account" className="primary-button mt-6 justify-center">
            Return to account access
          </Link>
        ) : null}
      </div>
    </main>
  );
}
