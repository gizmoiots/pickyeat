import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Wordmark } from "@/components/Wordmark";

export const metadata = {
  title: "Terms — pickyeat",
  description: "The agreement between you and us."
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-coconut text-pepper">
      <header className="px-5 py-4 flex items-center justify-between border-b-hair border-pepper/10 max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BrandMark size={28} />
          <Wordmark className="text-lg" />
        </Link>
        <Link href="/privacy" className="text-sm text-pepper/70 hover:text-pepper">
          Privacy
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10">
        <p className="eyebrow">last updated · 2026-05-17</p>
        <h1 className="text-3xl font-bold mt-2 mb-6">Terms of service</h1>

        <p className="text-pepper/80 leading-relaxed">
          By using pickyeat (the website, the PWA, the iOS app, the Android
          app) you agree to these terms. They're written to be readable. If
          something feels unclear, email{" "}
          <a href="mailto:hello@pickyeat.com" className="text-spice underline">
            hello@pickyeat.com
          </a>{" "}
          and we'll explain.
        </p>

        <Section title="What pickyeat does">
          <p>
            We help you decide what to order from a restaurant menu. We use AI
            to read menus, weigh your preferences, and surface picks. We are
            not a delivery service, a payment processor, or a restaurant. The
            actual food, the order, and the bill happen between you and the
            restaurant (or a third party like Zomato or Swiggy).
          </p>
        </Section>

        <Section title="Picks are recommendations, not guarantees">
          <p>
            Our picks are based on the best information we have at the time —
            the scanned menu, public reviews, your stated preferences. We make
            mistakes. A dish might be sold out, the price might have changed,
            or the description might be off. Treat picks as informed
            suggestions, not promises.
          </p>
          <p>
            <strong>Allergen tags</strong> deserve special attention. We tag
            dishes with allergens conservatively and filter aggressively, but
            we cannot inspect kitchens. If you have a serious food allergy,
            always confirm with the restaurant before ordering. We are not
            liable for allergen exposure from menu data that turns out to be
            incomplete.
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You can use pickyeat anonymously. If you sign in, you're
            responsible for the phone number you provide and for any actions
            taken from your account. Don't share your access with someone whose
            food preferences you don't want learned by the app.
          </p>
        </Section>

        <Section title="Content you upload">
          <p>
            Dish photos and feedback you submit help other diners. By
            uploading, you grant pickyeat a non-exclusive license to display
            that content within the app to other users. You retain ownership.
            You can delete your content any time.
          </p>
          <p>
            Don't upload anything that isn't yours, isn't a real dish, contains
            faces of other people without their consent, or is otherwise
            inappropriate. We may remove content that violates these rules.
          </p>
        </Section>

        <Section title="Paid plans">
          <p>
            Premium subscriptions are billed in advance — ₹49 monthly or ₹499
            yearly. You can cancel anytime; cancellation stops the next
            billing cycle but doesn't refund the current period.
          </p>
          <p>
            Refunds for legitimate billing errors are processed within 7 days.
            Email <a href="mailto:billing@pickyeat.com" className="text-spice underline">billing@pickyeat.com</a>.
          </p>
          <p>
            Restaurant plans (claim / featured / Xenios POS) are governed by a
            separate restaurant agreement. Contact{" "}
            <a href="mailto:owners@pickyeat.com" className="text-spice underline">owners@pickyeat.com</a>.
          </p>
        </Section>

        <Section title="What you can't do">
          <ul>
            <li>Scrape our data at scale (our menus are user-contributed; scraping breaks the moat for everyone)</li>
            <li>Reverse-engineer the recommendation engine for a competing product</li>
            <li>Submit fake reviews, fake feedback, or fake photos to skew picks</li>
            <li>Use the app to harass restaurant owners or staff</li>
            <li>Resell or rebrand pickyeat features as your own product</li>
          </ul>
        </Section>

        <Section title="Service availability">
          <p>
            We aim for 99.5% uptime but don't promise it. We'll let you know
            about planned maintenance. Unplanned outages happen — please be
            patient.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            pickyeat is provided "as is." We are not liable for indirect or
            consequential damages from using the app — that includes ordering
            something you didn't enjoy, missing a discount, or any other
            non-physical issue. For physical food-safety incidents, see the
            allergen note above.
          </p>
          <p>
            Our maximum liability for any claim is limited to the amount you
            paid us in the 12 months before the claim arose, capped at ₹10,000.
          </p>
        </Section>

        <Section title="Jurisdiction">
          <p>
            These terms are governed by Indian law. Disputes go to the courts
            of Pune, Maharashtra.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update these terms. If we do, we'll show you the diff in the
            app and ask you to re-accept. Continuing to use pickyeat after the
            update means you accept the new terms.
          </p>
        </Section>

        <p className="text-pepper/60 text-sm mt-12 pt-6 border-t-hair border-pepper/10">
          Questions? <a href="mailto:hello@pickyeat.com" className="text-spice underline">hello@pickyeat.com</a>
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
