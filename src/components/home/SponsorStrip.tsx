import { SafeImage } from "@/components/ui/SafeImage";
import type { Sponsor } from "@/types/platform";

type Props = {
  sponsors?: Sponsor[];
};

export function SponsorStrip({ sponsors = [] }: Props) {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Partners and media network</p>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex h-20 items-center justify-center border border-white/10 bg-white/[0.03] px-4">
              <SafeImage src={sponsor.logo_url} fallbackSrc="/assets/images/logo-2.png" alt={sponsor.name} width={130} height={50} className="max-h-12 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
