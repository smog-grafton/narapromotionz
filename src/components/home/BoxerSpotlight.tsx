import Link from "next/link";
import { BoxerCard } from "@/components/boxers/BoxerCard";
import type { Boxer } from "@/types/platform";

type Props = {
  boxers?: Boxer[];
};

export function BoxerSpotlight({ boxers = [] }: Props) {
  const featured = boxers.slice(0, 4);

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Featured Boxers</p>
          <h2 className="section-title-tight">Nara fighters built for the bright lights.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Follow the records, rankings, stories, and next steps of the fighters carrying Nara Promotionz into every fight night.
          </p>
        </div>
        <Link href="/boxers" className="text-link">
          Full roster
        </Link>
      </div>

      {featured.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {featured.map((boxer, index) => (
            <BoxerCard key={boxer.id} boxer={boxer} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#101010] p-8 text-sm text-zinc-400">
          The Nara roster is being shaped for the next spotlight. Check back for confirmed fighter features.
        </div>
      )}
    </section>
  );
}
