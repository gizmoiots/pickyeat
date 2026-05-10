import { Router } from "express";
import { sendOtp, verifyOtp } from "../services/otp.js";
import { issueToken } from "../services/session.js";
import { captureError } from "../sentry.js";

// POST /api/auth/otp/request → sends an OTP via MSG91 (mock returns devOtp)
// POST /api/auth/otp/verify  → returns a session token + userId

export const authRouter = Router();

authRouter.post("/otp/request", async (req, res) => {
  const { phone } = req.body ?? {};
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: "phone must be 10 digits" });
  }

  try {
    const result = await sendOtp(phone);
    return res.json(result);
  } catch (e) {
    captureError(e, { phone });
    return res.status(500).json({ error: "send_failed" });
  }
});

authRouter.post("/otp/verify", (req, res) => {
  const { phone, otp } = req.body ?? {};
  if (!phone || !otp) return res.status(400).json({ error: "phone+otp required" });

  const result = verifyOtp(phone, otp);
  if (!result.ok) return res.status(401).json({ error: result.reason ?? "invalid" });

  // Real impl: lookup-or-create the users row by phone-hash, return its id.
  const userId = `usr_${phone}`;
  const token = issueToken(userId);
  return res.json({ token, userId });
});
