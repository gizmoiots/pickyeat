import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";

export const metadata = {
  title: "Privacy — pickyeat",
  description: "What we store, where, and how to delete it."
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-coconut text-pepper">
      <header className="px-5 py-4 flex items-center justify-between border-b-hair border-pepper/10 max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BrandMark size={28} />
          <Wordmark className="text-lg" />
        </Link>
        <Link href="/terms" className="text-sm text-pepper/70 hover:text-pepper">
          Terms
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 prose prose-pepper">
        <p className="eyebrow">last updated · 2026-05-17</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">Privacy</h1>

        <p className="text-pepper/80 leading-relaxed">
          pickyeat is built on the belief that your food preferences are yours.
          We don't sell them. We don't profile you for anyone else. We collect
          only what makes the picks better, and we let you delete all of it
          with one tap. This page is plain-language honest about every field we
          store.
        </p>

        <Section title="What you can use anonymously">
          <p>
            The core flow — scanning a menu, getting picks, filtering for
            allergens and diet — works without an account. We don't ask for your
            name, phone, or email. No cookies that track you across sites.
          </p>
          <p>
            We do store an anonymous device ID locally so we can show you your
            history within a session and respect your daily scan limit. That ID
            never leaves your phone.
          </p>
        </Section>

        <Section title="When you sign in">
          <p>
            Signing in is optional. We use phone-number OTP via MSG91. If you
            sign in, we store:
          </p>
          <ul>
            <li>Your phone number (hashed before storage)</li>
            <li>Your name, if you provide one</li>
            <li>Your dietary defaults, allergens, spice tolerance, health goal</li>
            <li>Your past scans, picks, and feedback (so the taste graph improves over time)</li>
            <li>Dish photos you choose to upload</li>
            <li>A timestamp of when you consented to all of this</li>
          </ul>
          <p>
            We use this only to (a) show you what we know on the "What we know
            about you" screen, (b) make future picks better for you, and (c)
            anonymize and aggregate it for restaurant-side analytics (no
            individual user data is shared with restaurants — ever).
          </p>
        </Section>

        <Section title="Where it lives">
          <p>
            Our database is hosted on Supabase in Singapore. We're working to
            migrate to India (Mumbai region) as DPDP compliance requires for
            larger scale. Backups are encrypted and retained for 30 days.
          </p>
          <p>
            Photos you upload are stored on Supabase Storage in the same region,
            run through AI moderation before becoming publicly visible to other
            diners, and never associated with your name in the moderation
            queue.
          </p>
        </Section>

        <Section title="What we never do">
          <ul>
            <li>Sell your data. To anyone. For any reason.</li>
            <li>Share individual user info with restaurants (only anonymized aggregates)</li>
            <li>Background-track your location. GPS is read only at the moment of a scan.</li>
            <li>Profile you for advertising (we don't run ads from third parties)</li>
            <li>Paywall safety features. Allergen and diet filters are free forever.</li>
          </ul>
        </Section>

        <Section title="Deleting everything">
          <p>
            Open the app, go to <strong>Profile → "What we know about you"</strong>,
            tap <strong>Delete everything</strong>. We cascade-delete your user
            record, scans, feedback, photos, and any taste-graph derived from
            them. The deletion runs in real time; no waiting period, no
            verification email.
          </p>
          <p>
            If for any reason that path doesn't work, email{" "}
            <a href="mailto:privacy@pickyeat.com">privacy@pickyeat.com</a> and
            we'll do it manually within 48 hours.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            We use one technical cookie to keep you signed in. We don't use
            third-party tracking cookies. We don't run advertising networks.
          </p>
        </Section>

        <Section title="Children">
          <p>
            pickyeat is intended for adults. We don't knowingly collect data
            from anyone under 13. If you believe a child has signed up, please
            email <a href="mailto:privacy@pickyeat.com">privacy@pickyeat.com</a>{" "}
            and we'll delete the account.
          </p>
        </Section>

        <Section title="DPDP rights">
          <p>
            Under India's Digital Personal Data Protection Act, you have the
            right to:
          </p>
          <ul>
            <li>See what data we hold about you (one tap, in the app)</li>
            <li>Correct any inaccuracies (edit in profile)</li>
            <li>Delete your data (one tap, in the app)</li>
            <li>Withdraw consent (deletes everything)</li>
            <li>File a complaint with the Data Protection Board of India</li>
          </ul>
          <p>
            Our Data Protection Officer can be reached at{" "}
            <a href="mailto:dpo@pickyeat.com">dpo@pickyeat.com</a>.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If we ever materially change this policy, we'll show you the diff
            inside the app and ask you to re-consent. We won't quietly change
            it via this page.
          </p>
        </Section>

        <p className="text-pepper/60 text-sm mt-12 pt-6 border-t-hair border-pepper/10">
          Questions? <a href="mailto:hello@pickyeat.com">hello@pickyeat.com</a>
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="text-pepper/80 leading-relaxed space-y-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:space-y-1 [&_a]:text-spice [&_a]:underline">
        {children}
      </div>
    </section>
  );
}
