"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";
import { PrimaryButton } from "@/components/PrimaryButton";

// Magic-link owner sign-in. Phone OTP for now — same wrapper as user auth,
// just lands on the owner dashboard after verification.

export default function OwnerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"}/api/owner/otp/request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone })
      });
      if (!res.ok) throw new Error("send failed");
      setStep("otp");
    } catch (e) {
      setError("Couldn't send OTP. Check the number and try again.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000"}/api/owner/otp/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      if (!res.ok) throw new Error("verify failed");
      const data = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("pickyeat_owner_token", data.token);
      }
      router.push("/owner");
    } catch (e) {
      setError("Wrong OTP. Try again, or request a new one.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-coconut text-pepper flex flex-col">
      <header className="px-5 py-4 flex items-center justify-between border-b-hair border-pepper/10 max-w-md w-full mx-auto">
        <Link href="/owners" className="flex items-center gap-2 no-underline">
          <BrandMark size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-5 py-10 flex flex-col">
        <p className="eyebrow">owner sign in</p>
        <h1 className="text-2xl font-bold mt-2 mb-6">
          {step === "phone" ? "Claim your restaurant." : "Enter the OTP."}
        </h1>

        {step === "phone" && (
          <>
            <label className="text-sm text-pepper/70 mb-2 block">Phone number</label>
            <div className="flex items-center gap-2">
              <span className="bg-white border-hair border-pepper/15 rounded-card px-3 py-3 text-pepper/70">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                className="flex-1 bg-white border-hair border-pepper/15 rounded-card px-4 py-3 outline-none focus:border-pepper/40"
              />
            </div>
            <p className="text-xs text-pepper/60 mt-2">
              We'll text you a one-time code. No password, no email needed.
            </p>

            <div className="mt-auto pt-8">
              <PrimaryButton onClick={requestOtp} disabled={phone.length !== 10 || sending}>
                {sending ? "Sending…" : "Send OTP"}
              </PrimaryButton>
              {error && <p className="text-spice text-sm mt-3 text-center">{error}</p>}
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <label className="text-sm text-pepper/70 mb-2 block">Code sent to +91 {phone}</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit OTP"
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
              {error && <p className="text-spice text-sm mt-3 text-center">{error}</p>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
