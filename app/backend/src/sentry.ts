// Sentry wrapper. No-op when SENTRY_DSN is absent so local dev runs clean.
// When DSN is set (Railway env), the live SDK initializes and captures errors
// from all routes.

type ErrorContext = Record<string, unknown>;

let initialized = false;
let SentryRef: any = null;

export async function initSentry(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn || initialized) return;

  try {
    // Live mode — uncomment once @sentry/node is installed
    // npm install @sentry/node
    //
    // SentryRef = (await import("@sentry/node")).default ?? (await import("@sentry/node"));
    // SentryRef.init({
    //   dsn,
    //   environment: process.env.NODE_ENV ?? "production",
    //   tracesSampleRate: 0.1
    // });
    // initialized = true;
    // console.log("[sentry] initialized");
  } catch (e) {
    console.warn("[sentry] init failed:", e);
  }
}

export function captureError(err: unknown, context?: ErrorContext): void {
  console.error("[err]", err, context ?? "");
  if (SentryRef && initialized) {
    SentryRef.captureException(err, { extra: context });
  }
}

export function captureMessage(msg: string, context?: ErrorContext): void {
  console.log("[msg]", msg, context ?? "");
  if (SentryRef && initialized) {
    SentryRef.captureMessage(msg, { extra: context });
  }
}
