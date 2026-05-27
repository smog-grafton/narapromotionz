"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, LayoutDashboard, LogOut, Menu, Radio, Ticket, UserCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import { getActiveLiveEvents } from "@/services/api";
import type { Event as PlatformEvent } from "@/types/platform";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/watch", label: "Watch" },
  { href: "/news", label: "News" },
  { href: "/boxers", label: "Boxers" },
  { href: "/videos", label: "Videos" },
  { href: "/tickets", label: "Tickets" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [liveEvent, setLiveEvent] = useState<PlatformEvent | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const previousPathRef = useRef(pathname);
  const { user, isAuthenticated, logout } = useAuth();
  const liveHref = liveEvent ? `/watch?event=${liveEvent.slug}` : "/watch";

  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (previousPathRef.current === pathname) return;

    previousPathRef.current = pathname;
    setAccountOpen(false);

    if (!open) return;

    const closeTimer = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(closeTimer);
  }, [open, pathname]);

  useEffect(() => {
    let mounted = true;

    if (process.env.NEXT_PUBLIC_ENABLE_LIVE_BANNER === "false") {
      return;
    }

    getActiveLiveEvents(1)
      .then((events) => {
        if (mounted) {
          setLiveEvent(events[0] ?? null);
        }
      })
      .catch(() => {
        if (mounted) {
          setLiveEvent(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;

    const onMouseDown = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  async function signOut() {
    await logout();
    setAccountOpen(false);
    router.push("/");
  }

  const accountHref = isAuthenticated ? "/dashboard" : "/account";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Nara Promotionz home">
          <Image src="/assets/images/logo.svg" alt="Nara Promotionz" width={154} height={44} priority className="h-auto w-[154px]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {liveEvent ? (
            <Link
              href={liveHref}
              className="group flex h-12 items-center gap-2 border border-red-500/60 bg-red-600/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-600"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 bg-red-500" />
              </span>
              Live now
            </Link>
          ) : null}
          <div className="relative" ref={accountRef}>
            {isAuthenticated ? (
              <button
                type="button"
                className="icon-button"
                aria-label="Open account menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((value) => !value)}
              >
                <span className="relative grid h-7 w-7 place-items-center overflow-hidden">
                  {user?.avatar_url ? (
                    <SafeImage src={user.avatar_url} fallbackSrc="/images/default-user.svg" alt="" width={28} height={28} className="h-7 w-7 object-cover" />
                  ) : initials ? (
                    <span className="grid h-7 w-7 place-items-center bg-[#111] text-xs font-black uppercase text-white">{initials}</span>
                  ) : (
                    <Image src="/images/default-user.svg" alt="" width={28} height={28} className="h-7 w-7 object-cover" />
                  )}
                </span>
              </button>
            ) : (
              <Link href={accountHref} className="icon-button" aria-label="Account access">
                <Image src="/images/default-user.svg" alt="" width={24} height={24} className="h-6 w-6 object-cover" />
              </Link>
            )}

            {isAuthenticated ? (
              <div
                className={cn(
                  "absolute right-0 top-[calc(100%+12px)] w-72 border border-white/10 bg-[#0b0b0b] p-3 shadow-2xl transition",
                  accountOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
                )}
              >
                <div className="border-b border-white/10 p-3">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">Signed in</p>
                  <p className="mt-1 truncate text-sm font-bold text-white">{user?.name}</p>
                  <p className="truncate text-xs text-zinc-500">{user?.email || user?.phone}</p>
                </div>
                <div className="grid py-2">
                  {[
                    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                    { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
                    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
                    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 text-sm font-bold uppercase tracking-[0.1em] text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-3 border-t border-white/10 px-3 py-3 text-left text-sm font-bold uppercase tracking-[0.1em] text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
          <Link href={isAuthenticated ? "/dashboard/tickets" : "/tickets"} className="primary-button">
            <Ticket size={18} />
            {isAuthenticated ? "My Tickets" : "Buy Ticket"}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {liveEvent ? (
            <Link
              href={liveHref}
              className="flex h-12 items-center gap-2 border border-red-500/70 bg-red-600 px-3 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(237,28,36,0.25)]"
              aria-label={`Watch ${liveEvent.name} live`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping bg-white opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 bg-white" />
              </span>
              Live
            </Link>
          ) : null}
          <button className="icon-button flex" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      <div
        className={cn("fixed inset-0 z-50 bg-black/70 transition-opacity duration-200 lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onMouseDown={(event) => {
          if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setOpen(false);
          }
        }}
      >
        <div
          ref={panelRef}
          className={cn(
            "ml-auto min-h-screen w-[min(88vw,390px)] border-l border-white/10 bg-[#0b0b0b] px-5 py-5 transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Image src="/assets/images/logo-2.svg" alt="Nara Promotionz" width={138} height={38} className="h-auto w-[138px]" />
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <nav className="mt-8 grid gap-1">
            {liveEvent ? (
              <Link
                href={liveHref}
                onClick={() => setOpen(false)}
                className="mb-2 flex items-center justify-between border border-red-500/70 bg-red-600 px-4 py-4 text-sm font-black uppercase tracking-[0.14em] text-white"
              >
                <span className="flex items-center gap-2">
                  <Radio size={16} />
                  Watch live
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-white opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 bg-white" />
                </span>
              </Link>
            ) : null}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-7 grid gap-3">
            <Link href={isAuthenticated ? "/dashboard/tickets" : "/tickets"} className="primary-button justify-center" onClick={() => setOpen(false)}>
              <Ticket size={18} />
              {isAuthenticated ? "My Tickets" : "Buy Ticket"}
            </Link>
            <Link href={accountHref} className="secondary-button justify-center" onClick={() => setOpen(false)}>
              {isAuthenticated ? "My Account" : "Sign in"}
            </Link>
            {isAuthenticated ? (
              <div className="grid border border-white/10 bg-black/35">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/dashboard/tickets", label: "My Tickets" },
                  { href: "/dashboard/payments", label: "Payments" },
                  { href: "/dashboard/profile", label: "Profile" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-300 last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
                <button type="button" onClick={signOut} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-[#d7b46a]">
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
