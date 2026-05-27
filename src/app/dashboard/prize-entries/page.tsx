import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPrizeEntriesPage() {
  return (
    <DashboardShell title="Prize Draw Entries">
      <div className="border border-white/10 bg-[#101010] p-8">
        <h2 className="text-2xl font-black uppercase text-white">Fight-night rewards</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          Confirmed ticket holders can be entered into official Nara Promotionz prize draws when rewards are active for an event.
        </p>
      </div>
    </DashboardShell>
  );
}
