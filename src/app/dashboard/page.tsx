import Link from "next/link";
import { CalendarClock, CreditCard, Dumbbell, Gift, Repeat, Ticket } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard">
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["My tickets", "Keep every venue and online fight-night pass close before the first bell.", Ticket, "/dashboard/tickets"],
          ["Watch access", "Step into the live room or return to official replays from your account.", CalendarClock, "/watch"],
          ["Fight passes", "Choose a daily, weekly, or monthly pass for premium Nara Promotionz coverage.", Repeat, "/subscriptions"],
          ["Payments", "Follow your Nara Promotionz ticket payments and confirmations in one place.", CreditCard, "/dashboard/payments"],
          ["Prize entries", "Track official fight-night rewards connected to your confirmed tickets.", Gift, "/dashboard/prize-entries"],
          ["Fighter pathway", "Apply for fighter opportunities and prepare your profile for official Nara Promotionz review.", Dumbbell, "/dashboard/fighter-application"],
        ].map(([title, body, Icon, href]) => (
          <Link key={title as string} href={href as string} className="info-panel hover:border-[#e1252b]">
            <Icon className="text-[#e1252b]" />
            <h3>{title as string}</h3>
            <p>{body as string}</p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
