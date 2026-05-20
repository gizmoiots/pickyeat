"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { PrimaryButton } from "@/components/PrimaryButton";

// Phone OTP sign-in. Used both as the standalone /signin page and as the
// landing after the free-tier scan cap triggers.
//
// Wrapped in Suspense because useSearchParams() requires it for static export
// in Next 14 (otherwise next build fails at pre-render).

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-coconut" />}>
      <SignInInner />
    </Suspense>
  );
}

function SignInInner() {
  const router = useRouter();
  const search = useSearchParams();
  const returnTo = search.get("returnTo") ?? "/picks";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

  const requestOtp = async () => {
    setError(null);
    setSending(true);
    try {
      const r = await fetch(`${base}/api/auth/otp/request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone })
      });
      if (!r.ok) throw new Error("send failed");
      setStep("otp");
    } catch (e) {
      setError("Couldn't send OTP. Check the number and retry.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setSending(true);
    try {
      const r = await fetch(`${base}/api/auth/otp/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      if (!r.ok) throw new Error("verify failed");
      const data = await r.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("pickyeat_token", data.token);
        localStorage.setItem("pickyeat_user_id", data.userId);
      }
      router.push(returnTo);
    } catch (e) {
      setError("Wrong OTP — try again, or request a new one.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell showBottomNav={false}>
      <EyebrowLabel>sign in</EyebrowLabel>
      <h1 className="text-2xl font-bold leading-tight mt-1 mb-4">
        {step === "phone"
          ? "Save your taste, sync your history."
          : "Enter your OTP."}
      </h1>
      <p className="text-sm text-pepper/70 mb-6 leading-relaxed">
        {step === "phone"
          ? "Unlimited scans + history + group invites + the food bucket list. Free, phone-only — no email or password needed."
          : `We sent a 6-digit code to +91 ${phone}.`}
      </p>

      {step === "phone" ? (
        <>
          <label className="text-sm text-pepper/70 block mb-2">Phone number</label>
          <div className="flex gap-2">
            <span className="bg-white border-hair border-pepper/15 rounded-card px-3 py-3 text-pepper/70">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="98765 43210"
              className="flex-1 bg-white border-hair border-pepper/15 rounded-card px-4 py-3 outline-none focus:border-pepper/40"
              autoFocus
            />
          </div>

          <div className="mt-auto pt-8">
            <PrimaryButton onClick={requestOtp} disabled={phone.length !== 10 || sending}>
              {sending ? "Sending…" : "Send OTP"}
            </PrimaryButton>
            {error && <p className="text-spice text-sm text-center mt-3">{error}</p>}
          </div>
        </>
      ) : (
        <>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className="w-full bg-white border-hair border-pepper/15 rounded-card px-4 py-3 outline-none focus:border-pepper/40 text-center text-2xl tracking-widest font-mono"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="text-sm text-pepper/60 mt-3"
          >
            Wrong number? Edit
          </button>

          <div className="mt-auto pt-8">
            <PrimaryButton onClick={verifyOtp} disabled={otp.length !== 6 || sending}>
              {sending ? "Verifying…" : "Verify and continue"}
            </PrimaryButton>
            {error && <p className="text-spice text-sm text-center mt-3">{error}</p>}
          </div>
        </>
      )}

      <p className="text-xs text-pepper/50 text-center mt-6">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline">terms</Link> and{" "}
        <Link href="/privacy" className="underline">privacy policy</Link>.
      </p>
    </AppShell>
  );
}
