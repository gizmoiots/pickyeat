// Public marketing page for restaurant owners. The /owners landing.
// Phase 3 deliverable per design/launch-plan.md.

import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";
import { PrimaryButton } from "@/components/PrimaryButton";

export const metadata = {
  title: "For restaurants — pickyeat",
  description:
    "Your menu is already on pickyeat. Claim it free for 3 months and see who's looking at it."
};

export default function OwnersLanding() {
  return (
    <div className="min-h-screen bg-coconut text-pepper">
      <header className="px-5 py-4 flex items-center justify-between border-b-hair border-pepper/10 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BrandMark size={28} />
          <Wordmark className="text-lg" />
        </Link>
        <Link href="/owner/login" className="text-sm text-pepper/70 hover:text-pepper">
          Owner sign in
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <p className="eyebrow">for restaurant owners</p>
        <h1 className="text-4xl font-bold leading-tight mt-2">
          Your menu is already on pickyeat<span className="text-sprig">.</span>
        </h1>
        <p className="text-pepper/80 text-lg leading-relaxed mt-4">
          Pune diners scan menus on pickyeat and get personalised picks. If your
          restaurant has been scanned, you're already listed — for free,
          automatically. Claim it to see who's looking, control your menu, and
          unlock analytics.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/owner/login" className="flex-1">
            <PrimaryButton>Claim your restaurant — free for 3 months</PrimaryButton>
          </Link>
        </div>

        <section className="mt-14">
          <p className="eyebrow mb-3">what you get</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Feature
              title="See who's looking"
              body="Daily scan counts, top dishes picked, dietary breakdown of your diners — updated in real time."
            />
            <Feature
              title="Control your menu"
              body="Edit names, prices, descriptions. Mark dishes unavailable. Add daily specials that show for 24 hours."
            />
            <Feature
              title="Crowd-favourite badge"
              body="Dishes mentioned positively in reviews get a Sprig pill. Verified ownership boosts your placement."
            />
            <Feature
              title="Replace stock photos"
              body="Pin your own dish photos as the default. Curate which crowdsourced photos diners see first."
            />
          </div>
        </section>

        <section className="mt-14">
          <p className="eyebrow mb-3">how it works</p>
          <ol className="space-y-4 text-pepper/80 leading-relaxed">
            <Step n={1} text="Sign in with the phone number on file with your restaurant." />
            <Step n={2} text="Verify with an OTP. Confirm 'this is your restaurant.'" />
            <Step n={3} text="Your dashboard is live in under 60 seconds. Trial starts today, no card needed." />
          </ol>
        </section>

        <section className="mt-14 bg-white rounded-card border-hair border-pepper/10 p-6">
          <p className="eyebrow mb-2">pricing</p>
          <h2 className="text-2xl font-bold">Three tiers. Pay only if you stay.</h2>
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <Tier
              name="Claim"
              price="₹499 / mo"
              note="3 months free"
              features={["Dashboard & analytics", "Menu editor", "Daily specials"]}
              highlight
            />
            <Tier
              name="Featured"
              price="₹999 / mo"
              note="upgrade anytime"
              features={["Verified badge", "Priority in nearby search", "Curated dish photos"]}
            />
            <Tier
              name="Xenios POS"
              price="₹3-5K / mo"
              note="full POS sync"
              features={["Menu auto-syncs", "Kitchen display", "Inventory + recipes"]}
            />
          </div>
        </section>

        <section className="mt-14">
          <p className="eyebrow mb-3">questions?</p>
          <p className="text-pepper/80 leading-relaxed">
            WhatsApp or email{" "}
            <a
              href="mailto:owners@pickyeat.com"
              className="text-spice underline"
            >
              owners@pickyeat.com
            </a>
            . We usually reply within a few hours.
          </p>
        </section>

        <footer className="mt-16 pt-6 border-t-hair border-pepper/10 flex items-center justify-between text-sm text-pepper/60">
          <span>© 2026 pickyeat</span>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-card border-hair border-pepper/10 p-5">
      <div className="font-medium mb-1.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sprig" />
        {title}
      </div>
      <p className="text-sm text-pepper/70 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-4">
      <span className="font-bold text-spice text-lg shrink-0 w-7">{n}.</span>
      <span>{text}</span>
    </li>
  );
}

function Tier({
  name,
  price,
  note,
  features,
  highlight
}: {
  name: string;
  price: string;
  note: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-card p-4 ${
        highlight
          ? "border-2 border-saffron bg-coconut"
          : "border-hair border-pepper/10 bg-white"
      }`}
    >
      <div className="text-sm font-medium">{name}</div>
      <div className="text-xl font-bold mt-1">{price}</div>
      <div className="text-xs text-pepper/60 mt-0.5">{note}</div>
      <ul className="mt-3 text-xs text-pepper/70 space-y-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-sprig" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
