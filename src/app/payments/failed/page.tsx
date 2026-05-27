import Link from "next/link";
import { LifeBuoy, RotateCcw, XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <main className="section-shell">
      <div className="mx-auto max-w-2xl border border-[#e1252b]/50 bg-[#101010] p-8 text-center">
        <XCircle className="mx-auto text-[#e1252b]" size={42} />
        <h1 className="mt-5 text-4xl font-black uppercase text-white">Payment not confirmed.</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400">
          We could not confirm this ticket payment. You can try again, choose another pass, or contact Nara Promotionz support for help.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/tickets" className="primary-button justify-center">
            <RotateCcw size={18} />
            Try again
          </Link>
          <Link href="/dashboard/payments" className="secondary-button justify-center">
            <LifeBuoy size={18} />
            Get support
          </Link>
        </div>
      </div>
    </main>
  );
}
