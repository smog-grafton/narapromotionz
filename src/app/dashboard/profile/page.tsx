import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardProfilePage() {
  return (
    <DashboardShell title="Profile">
      <div className="grid gap-4 border border-white/10 bg-[#101010] p-6">
        <label className="grid gap-2 text-sm text-zinc-400">
          Name
          <input className="min-h-11 border border-white/10 bg-black px-3 text-white" placeholder="Your name" disabled />
        </label>
        <label className="grid gap-2 text-sm text-zinc-400">
          Email
          <input className="min-h-11 border border-white/10 bg-black px-3 text-white" placeholder="Your email address" disabled />
        </label>
        <p className="text-sm leading-7 text-zinc-400">Keep your account details ready so ticket support, stream access, and prize entries can be matched quickly on fight night.</p>
      </div>
    </DashboardShell>
  );
}
