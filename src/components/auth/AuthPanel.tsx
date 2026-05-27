"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { LockKeyhole, Mail, Phone, Ticket, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getGoogleRedirect, login, register } from "@/services/api";

type Mode = "login" | "register";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession, isAuthenticated, user, logout } = useAuth();

  const copy = useMemo(
    () =>
      mode === "login"
        ? {
            title: "Sign in to Nara Promotionz",
            body: "Access your tickets, live streams, replays, and fight-night rewards.",
            cta: "Sign in",
          }
        : {
            title: "Create your Nara account",
            body: "Buy tickets, watch live, follow boxers, and stay ready for fight night.",
            cta: "Create account",
          },
    [mode],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const form = new FormData(event.currentTarget);

    try {
      const payload =
        mode === "login"
          ? await login({
              login: String(form.get("login") ?? ""),
              password: String(form.get("password") ?? ""),
              device_name: "nara-next-web",
            })
          : await register({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? "") || undefined,
              phone: String(form.get("phone") ?? "") || undefined,
              password: String(form.get("password") ?? ""),
              password_confirmation: String(form.get("password_confirmation") ?? ""),
              device_name: "nara-next-web",
            });

      setSession(payload);
      setMessage("Welcome to your Nara Promotionz account.");
      const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
      router.push(next?.startsWith("/") ? next : "/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Please check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    setBusy(true);
    setError(null);

    try {
      const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") || "/dashboard" : "/dashboard";
      const { url } = await getGoogleRedirect(next);
      window.location.href = url;
    } catch {
      setError("Google sign-in could not start right now. Please use your email or phone number, or try again shortly.");
      setBusy(false);
    }
  }

  if (isAuthenticated) {
    return (
      <div className="grid overflow-hidden border border-white/10 bg-[#101010] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="bg-[#100607] p-6 lg:p-8">
          <p className="section-kicker">Welcome Back</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-none text-white">Your fight-night account is ready.</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-300">
            Keep your tickets, payments, live access, and replays close before the next Nara Promotionz bell.
          </p>
        </div>
        <div className="grid content-center gap-5 p-5 sm:p-7 lg:p-8">
          <div className="border border-white/10 bg-black p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">Signed in as</p>
            <h3 className="mt-2 text-3xl font-black uppercase text-white">{user?.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{user?.email || user?.phone}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="primary-button justify-center">
              <Ticket size={18} />
              Open dashboard
            </Link>
            <button type="button" onClick={logout} className="secondary-button justify-center">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden border border-white/10 bg-[#101010] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="mb-5">
          <p className="section-kicker">Account Access</p>
          <h2 className="mt-3 text-3xl font-black uppercase leading-none text-white sm:text-4xl">{copy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{copy.body}</p>
        </div>

        <div className="grid grid-cols-2 border border-white/10">
          {(["login", "register"] as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`min-h-12 text-sm font-black uppercase tracking-[0.12em] transition ${mode === item ? "bg-[#e1252b] text-white" : "bg-black text-zinc-400 hover:text-white"}`}
              onClick={() => {
                setMode(item);
                setError(null);
                setMessage(null);
              }}
            >
              {item === "login" ? "Sign in" : "Register"}
            </button>
          ))}
        </div>

        <button type="button" onClick={continueWithGoogle} className="secondary-button mt-5 w-full justify-center" disabled={busy}>
          <GoogleMark />
          Continue with Google
        </button>

        <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Full name
              <span className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input name="name" required className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="Your name" />
              </span>
            </label>
          ) : null}

          {mode === "login" ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Email or phone number
              <span className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input name="login" required className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="Email address or phone number" />
              </span>
            </label>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-zinc-300">
                Email
                <span className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                  <input name="email" type="email" className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="you@example.com" />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-bold text-zinc-300">
                Phone
                <span className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                  <input name="phone" className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="07XX XXX XXX" />
                </span>
              </label>
            </div>
          )}

          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Password
            <span className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
              <input name="password" type="password" required minLength={8} className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="Password" />
            </span>
          </label>

          {mode === "register" ? (
            <label className="grid gap-2 text-sm font-bold text-zinc-300">
              Confirm password
              <span className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
                <input name="password_confirmation" type="password" required minLength={8} className="min-h-12 w-full border border-white/10 bg-black pl-10 pr-3 text-white outline-none focus:border-[#e1252b]" placeholder="Confirm password" />
              </span>
            </label>
          ) : null}

          {error ? <div className="border border-[#e1252b]/50 bg-[#e1252b]/10 p-3 text-sm font-bold text-white">{error}</div> : null}
          {message ? <div className="border border-[#d7b46a]/50 bg-[#d7b46a]/10 p-3 text-sm font-bold text-[#d7b46a]">{message}</div> : null}

          <button className="primary-button w-full" type="submit" disabled={busy}>
            {busy ? "Please wait..." : copy.cta}
          </button>
        </form>

        <p className="mt-5 text-sm leading-7 text-zinc-500">
          Forgot your password? Contact Nara Promotionz support with your account email or ticket order number for secure recovery assistance.
        </p>
      </div>

      <div className="border-t border-white/10 bg-[#100607] p-6 lg:border-l lg:border-t-0 lg:p-8">
        <p className="section-kicker">Nara Account</p>
        <h3 className="mt-3 text-3xl font-black uppercase leading-tight text-white">Every fight-night pass in one place.</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-300">
          Your account keeps tickets, payments, watch passes, replays, and prize entries close from the first bell to the final result.
        </p>
        <div className="mt-6 border border-white/10 bg-black/35 p-4 text-sm leading-7 text-zinc-300">
          Sign in before checkout to return straight to your ticket, live room, or dashboard.
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#4285F4" d="M21.6 12.23c0-.76-.07-1.49-.2-2.19H12v4.14h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.48z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.29l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.41 14.04A6.01 6.01 0 0 1 6.1 12c0-.71.11-1.39.31-2.04V7.37H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.63l3.35-2.59z" />
      <path fill="#EA4335" d="M12 5.84c1.47 0 2.8.5 3.84 1.5l2.86-2.86A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.37l3.35 2.59C7.2 7.6 9.4 5.84 12 5.84z" />
    </svg>
  );
}
