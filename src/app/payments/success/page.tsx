import Link from "next/link";
import { CheckCircle2, Ticket, Video } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="section-shell">
      <div className="mx-auto max-w-2xl border border-[#d7b46a]/40 bg-[#101010] p-8 text-center">
        <CheckCircle2 className="mx-auto text-[#d7b46a]" size={42} />
        <h1 className="mt-5 text-4xl font-black uppercase text-white">Your ticket is confirmed.</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          You are ready for fight night. Your ticket, payment confirmation, and eligible watch access are now waiting in your Nara Promotionz account.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/tickets" className="primary-button justify-center">
            <Ticket size={18} />
            View my tickets
          </Link>
          <Link href="/watch" className="secondary-button justify-center">
            <Video size={18} />
            Enter watch room
          </Link>
        </div>
      </div>
    </main>
  );
}
