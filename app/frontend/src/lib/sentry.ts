// Frontend Sentry wrapper. No-op when DSN is absent.
// Initialize once at app startup; call captureError on caught exceptions.

let initialized = false;
let SentryRef: any = null;

export async function initSentry(): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || initialized || typeof window === "undefined") return;

  try {
    // Live mode — uncomment once @sentry/nextjs is installed.
    // npm install @sentry/nextjs
    //
    // SentryRef = await import("@sentry/nextjs");
    // SentryRef.init({
    //   dsn,
    //   environment: process.env.NODE_ENV ?? "production",
    //   tracesSampleRate: 0.1,
    //   replaysSessionSampleRate: 0.0,
    //   replaysOnErrorSampleRate: 1.0
    // });
    // initialized = true;
  } catch (e) {
    console.warn("[sentry] init failed:", e);
  }
}

export function captureError(err: unknown, ctx?: Record<string, unknown>): void {
  console.error("[err]", err, ctx);
  if (SentryRef && initialized) SentryRef.captureException(err, { extra: ctx });
}
