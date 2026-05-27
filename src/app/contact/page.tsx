import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Nara Promotionz",
  description: "Contact Nara Promotionz for tickets, events, streaming support, boxer media, and sponsorship enquiries.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="section-kicker">Contact</p>
          <h1 className="section-title-tight">Need ticket, streaming, media, or event support?</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400">
            Reach the Nara Promotionz team for fight-night access, official tickets, event enquiries, sponsorships, and boxer media support.
          </p>
        </div>
      </section>
      <section className="section-shell grid gap-5 md:grid-cols-3">
        <a href="tel:+256752463322" className="info-panel hover:border-[#e1252b]">
          <Phone className="text-[#e1252b]" />
          <h3>Call</h3>
          <p>+256 752 463322</p>
        </a>
        <a href="mailto:info@narapromotionz.com" className="info-panel hover:border-[#e1252b]">
          <Mail className="text-[#d7b46a]" />
          <h3>Email</h3>
          <p>info@narapromotionz.com</p>
        </a>
        <div className="info-panel">
          <MapPin className="text-[#e1252b]" />
          <h3>Location</h3>
          <p>Kampala, Uganda</p>
        </div>
      </section>
      <section className="section-shell pt-0">
        <div className="border border-white/10 bg-[#101010] p-6 sm:p-8">
          <h2 className="text-3xl font-black uppercase text-white">For urgent fight-night help</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Include your order number, event name, account email, and phone number so support can confirm your ticket or watch access faster.
          </p>
          <Link href="/dashboard/payments" className="primary-button mt-6 w-fit">
            Check payments
          </Link>
        </div>
      </section>
    </main>
  );
}
