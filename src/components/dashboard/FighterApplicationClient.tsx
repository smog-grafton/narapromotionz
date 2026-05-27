"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getFighterApplication, submitFighterApplication } from "@/services/api";
import type { FighterApplication } from "@/types/platform";

export function FighterApplicationClient() {
  const { token, loading } = useAuth();
  const [application, setApplication] = useState<FighterApplication | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    getFighterApplication(token)
      .then(setApplication)
      .catch(() => null);
  }, [token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    const form = new FormData(event.currentTarget);

    try {
      const saved = await submitFighterApplication(token, {
        stage_name: String(form.get("stage_name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        weight_class: String(form.get("weight_class") ?? ""),
        record_summary: String(form.get("record_summary") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setApplication(saved);
      setMessage("Your fighter request is with the Nara Promotionz team.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not send your fighter request right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="border border-white/10 bg-[#101010] p-6 text-sm text-zinc-400">Preparing your fighter profile form...</div>;
  }

  if (!token) {
    return <div className="border border-white/10 bg-[#101010] p-6 text-sm text-zinc-400">Please sign in to apply for fighter opportunities with Nara Promotionz.</div>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_.75fr]">
      <form onSubmit={onSubmit} className="grid gap-4 border border-white/10 bg-[#101010] p-5 sm:p-6">
        <div>
          <p className="section-kicker">Fighter Pathway</p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white">Step toward the Nara ring.</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Share your fight name, division, record, and contact details. Approved fighters can be linked to bouts, profiles, and official fight-night promotions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Fight or stage name
            <input name="stage_name" defaultValue={application?.stage_name ?? ""} className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Phone number
            <input name="phone" defaultValue={application?.phone ?? ""} className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Weight class
            <input name="weight_class" defaultValue={application?.weight_class ?? ""} className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-300">
            Current record
            <input name="record_summary" defaultValue={application?.record_summary ?? ""} placeholder="Example: 6-0-0, 4 KOs" className="min-h-12 border border-white/10 bg-black px-3 text-white outline-none focus:border-[#e1252b]" />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-zinc-300">
          Tell us about your next move
          <textarea name="message" defaultValue={application?.message ?? ""} rows={5} className="border border-white/10 bg-black p-3 text-white outline-none focus:border-[#e1252b]" />
        </label>

        {message ? <div className="border border-[#d7b46a]/50 bg-[#d7b46a]/10 p-3 text-sm font-bold text-[#d7b46a]">{message}</div> : null}
        {error ? <div className="border border-[#e1252b]/50 bg-[#e1252b]/10 p-3 text-sm font-bold text-white">{error}</div> : null}

        <button type="submit" disabled={busy} className="primary-button w-full justify-center">
          {busy ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
          {busy ? "Sending..." : "Send fighter request"}
        </button>
      </form>

      <aside className="grid content-start gap-4">
        <div className="info-panel">
          <ShieldCheck className="text-[#d7b46a]" />
          <h3>Application status</h3>
          <p>{application ? `Your request is currently ${application.status}.` : "Send your fighter request and the Nara Promotionz team will review your details."}</p>
        </div>
        <div className="info-panel">
          <h3>Fighter promotion codes</h3>
          <p>Approved fighter codes help fans support a boxer during ticket checkout while keeping each sale tied to the fight-night campaign.</p>
        </div>
      </aside>
    </div>
  );
}
