import Link from "next/link";
import { Gift, Radio, Smartphone, TicketCheck } from "lucide-react";

const blocks = [
  {
    icon: Radio,
    title: "Live and Replay Access",
    text: "Step into the live room on fight night, then return for official replays when your pass includes them.",
  },
  {
    icon: TicketCheck,
    title: "Ticket-Gated PPV",
    text: "Choose the pass that fits your night, from arena entry to online viewing and VIP access.",
  },
  {
    icon: Gift,
    title: "Official Prize Draws",
    text: "Confirmed ticket holders can be part of official Nara Promotionz rewards when draws are active.",
  },
  {
    icon: Smartphone,
    title: "Multi-Device Fight Night",
    text: "Follow the action from your phone, laptop, tablet, or the big screen at home.",
  },
];

export function PlatformBlocks() {
  return (
    <section className="bg-[#111]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="section-kicker">How to Watch</p>
            <h2 className="section-title-tight">Buy once, enter the arena or unlock the stream.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Choose your fight-night pass, secure your seat or stream, and keep your live access ready before the first bell.
            </p>
            <Link href="/watch" className="primary-button mt-7 inline-flex">
              Watch Page
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {blocks.map((block) => (
              <div key={block.title} className="grid grid-cols-[38px_1fr] gap-3 border border-white/10 bg-[#101010] p-4 sm:block sm:p-5">
                <span className="grid h-9 w-9 place-items-center border border-[#e1252b]/30 bg-[#e1252b]/10">
                  <block.icon size={19} className="text-[#e1252b]" />
                </span>
                <span>
                  <h3 className="text-base font-black uppercase leading-tight text-white sm:text-xl">{block.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400 sm:leading-7">{block.text}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
