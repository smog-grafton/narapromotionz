import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: [
      ["Events", "/events"],
      ["Watch", "/watch"],
      ["Tickets", "/tickets"],
      ["Boxers", "/boxers"],
      ["Videos", "/videos"],
    ],
  },
  {
    title: "Editorial",
    links: [
      ["Latest News", "/news"],
      ["Fight Previews", "/news?section=fight-previews"],
      ["Results", "/events?status=completed"],
      ["Interviews", "/videos?category=interview"],
      ["Opinion", "/news?section=opinion"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Contact", "/contact"],
      ["Ticket Help", "/tickets"],
      ["Streaming Help", "/watch"],
      ["Prize Draws", "/dashboard/prize-entries"],
      ["Legal", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1.8fr] lg:px-8">
        <div>
          <Image src="/assets/images/logo-2.svg" alt="Nara Promotionz" width={176} height={52} />
          <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
            Nara Promotionz is building Uganda&apos;s premium boxing promotions platform for live events, PPV streaming,
            professional boxer profiles, fight-night media, and official ticket-holder rewards.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-zinc-300">
            <span className="flex items-center gap-3">
              <Phone size={16} className="text-[#e1252b]" /> +256 752 463322
            </span>
            <span className="flex items-center gap-3">
              <Mail size={16} className="text-[#e1252b]" /> info@narapromotionz.com
            </span>
            <span className="flex items-center gap-3">
              <MapPin size={16} className="text-[#e1252b]" /> Kampala, Uganda
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-zinc-400 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs uppercase tracking-[0.18em] text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© {new Date().getFullYear()} Nara Promotionz. Nara Group of Companies.</span>
          <span className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
