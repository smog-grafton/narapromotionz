import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Account | Nara Promotionz",
  description: "Sign in to your Nara Promotionz account for tickets, live stream access, replays, payments, and fight-night rewards.",
};

export default function AccountPage() {
  return (
    <main>
      <section className="section-shell py-8 sm:py-12">
        <AuthPanel />
      </section>
    </main>
  );
}
