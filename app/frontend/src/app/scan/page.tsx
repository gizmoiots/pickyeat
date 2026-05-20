"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PrimaryButton } from "@/components/PrimaryButton";

// 03 — Real camera scan. Streams the rear camera into a video element,
// captures a frame on demand, sends to /api/scan, navigates to /mood with
// the scanned menu cached server-side.

type State = "asking" | "denied" | "ready" | "capturing" | "sending" | "error";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<State>("asking");
  const [translateOn, setTranslateOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      // Stop the camera stream when the user leaves the page.
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      setState("denied");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }, // rear camera on phones
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState("ready");
    } catch (e: any) {
      setState("denied");
      setErrorMsg(e?.message ?? "Camera access denied");
    }
  };

  const capture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setState("capturing");
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setState("error");
      setErrorMsg("canvas not available");
      return;
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    const imageBase64 = dataUrl.split(",")[1]; // strip "data:image/jpeg;base64,"

    setState("sending");
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
      const r = await fetch(`${base}/api/scan`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageBase64, translateToEnglish: translateOn })
      });
      if (!r.ok) throw new Error(`scan failed: ${r.status}`);
      const data = await r.json();
      // Cache the menu+restaurant locally so /mood and /picks can use it.
      if (typeof window !== "undefined") {
        localStorage.setItem("pickyeat_last_scan", JSON.stringify(data));
      }
      router.push("/mood");
    } catch (e: any) {
      setState("error");
      setErrorMsg(e?.message ?? "Couldn't scan the menu");
    }
  };

  if (state === "denied") {
    return (
      <AppShell showBottomNav={false}>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 max-w-xs mx-auto">
          <h1 className="text-2xl font-bold leading-tight">
            Camera access needed<span className="text-sprig">.</span>
          </h1>
          <p className="text-sm text-pepper/70">
            We need your camera to read the menu. Enable it in your browser
            settings or use the back arrow to skip.
          </p>
          {errorMsg && <p className="text-xs text-pepper/50 italic">{errorMsg}</p>}
          <div className="pt-6 w-full flex flex-col gap-3">
            <PrimaryButton onClick={startCamera}>Try again</PrimaryButton>
            <Link href="/detect" className="text-center text-sm text-pepper/60">
              Back to GPS detect
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <p className="eyebrow">frame the menu</p>
          <button
            type="button"
            onClick={() => setTranslateOn((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border-hair transition-colors
              ${translateOn ? "border-pepper bg-coconut" : "border-pepper/20 text-pepper/70 bg-white"}
            `}
          >
            {translateOn && <span className="w-1.5 h-1.5 rounded-full bg-sprig" />}
            Translate to English
          </button>
        </div>

        <div className="flex-1 rounded-panel border-hair border-pepper/15 bg-pepper/[0.04] grid place-items-center relative overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-6 border-2 border-dashed border-sprig/70 rounded-card pointer-events-none" />
          {state === "asking" && (
            <p className="text-pepper/80 text-sm relative bg-coconut/90 px-3 py-1.5 rounded-full">
              requesting camera…
            </p>
          )}
          {state === "sending" && (
            <p className="text-coconut text-sm relative bg-pepper/80 px-4 py-2 rounded-full">
              reading the menu…
            </p>
          )}
          {state === "error" && (
            <p className="text-coconut text-sm relative bg-spice px-4 py-2 rounded-full">
              {errorMsg ?? "Something went wrong"}
            </p>
          )}
        </div>

        <p className="text-xs text-pepper/50 text-center mt-4">
          Hold steady. The whole menu should fit inside the dashed area.
        </p>

        <div className="mt-6">
          <PrimaryButton
            onClick={capture}
            disabled={state !== "ready" && state !== "error"}
          >
            {state === "sending" || state === "capturing" ? "Working…" : "Capture menu"}
          </PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}
