# Phase 4 — Restaurant outreach templates

For cold-WhatsApp / email to café owners whose menus have been scanned 5+ times. Goal: 8-12% claim conversion in month 1, ramping to 20%+ by month 3.

---

## The first WhatsApp message

Send to the owner's personal WhatsApp (not the restaurant's general number — too many cooks). The most-engaged restaurant gets the message first, so you have time to refine the script.

```
Namaste [owner name] —

I'm Nitin. I run pickyeat (pickyeat.com), a free app Pune diners use to
decide what to order at a restaurant. [Restaurant name]'s menu has been
scanned 47 times in the last month — your customers are looking at it on
their phones before they sit down.

I'm not selling anything. The app is free for diners, and the restaurant
listing is automatic — you're already in there, no setup needed.

What I wanted to ask: would you like to see the analytics?

- Which dishes diners are picking before they walk in
- What they said about each dish (real notes, not just star ratings)
- Veg vs non-veg, dietary patterns, average budget per visit

It's free for 3 months. After that ₹499/mo if you find it useful, no
charge if you don't.

If you want me to drop by the cafe and show you on my phone, I'm in Pune.
Whatever's easier for you — WhatsApp this number or owners@pickyeat.com.

— Nitin
```

Tweaks:
- If you know them personally, drop the formal Namaste and lean conversational
- If the restaurant has a strong dish: "the butter chicken was actually their top pick — 18 people picked it this month" — gives the message a hook
- If they're north of 200+ scans: lead with the number, "Your restaurant is one of the most-scanned in Pune on pickyeat"

---

## Follow-up after 3 days (no reply)

```
Hey [name] — just a quick follow-up. No pressure either way, but the
3-month free trial offer stays open. If now isn't the right time, totally
fine. Drop me a note any time — I'll keep your spot in the queue.

— Nitin
```

If they reply at all, even "not interested," reply once with a thank-you. Then leave it. They might come back in 6 months.

---

## After they say yes

```
Brilliant — thank you. Three things to set up:

1. Sign in at pickyeat.com/owner/login with the phone number you want to
manage the listing with. (We'll text you an OTP.) Takes 30 seconds.

2. You'll land on your dashboard. Click around — let me know if anything
is off.

3. WhatsApp me back with one thing you'd love the dashboard to show that
it doesn't already. We're building the next version based on what
restaurant owners actually need.

The 3-month free trial starts today. No credit card. After it, ₹499/mo
via UPI autopay if you want to keep it. No auto-charge — we'll ask.

— Nitin
```

---

## Email version (formal first contact)

Use for restaurants where you don't have a personal WhatsApp number — found via Google Maps phone scraping or Zomato listings.

**Subject:** Quick note — your menu on pickyeat

**Body:**

```
Hello [name],

I run pickyeat — a free app that helps Pune diners decide what to order.
[Restaurant name]'s menu has been scanned 47 times in the last month by
diners using the app. You're already listed automatically — no setup
needed on your end.

I wanted to offer the owner-side dashboard free for 3 months. It shows:

  • Which dishes diners pick before they order (top 10 each month)
  • What they actually order vs what we recommended (your conversion rate)
  • Anonymous notes diners leave about each dish
  • Veg/non-veg split, dietary preferences, budget patterns

If you'd like to see it, sign in at pickyeat.com/owner/login with your
restaurant's registered phone number. Takes 30 seconds to set up.

If you have questions or would prefer a quick call (or for me to drop by
the restaurant), just reply or WhatsApp +91 98765 12472.

— Nitin Solanke
   pickyeat.com
   owners@pickyeat.com
```

---

## Walk-in pitch (Day 30+)

When cold WhatsApp conversion plateaus, pick a Saturday and walk down FC Road / Koregaon Park lunch hours. Look for the owner (not the floor manager) and:

```
Hi — I'm Nitin. I made an app called pickyeat that Pune diners use to
pick what to order. Mind if I show you something in 30 seconds?

[Open the app, GPS detects this restaurant, show the picks screen, then
the analytics dashboard.]

This is your restaurant. 47 people scanned the menu last month. Here's
what they were picking before they sat down. It's free for the next 3
months — you can claim it right now on your phone.

— Nitin
   pickyeat.com
   +91 98765 12472
   owners@pickyeat.com
```

Don't sit down. Don't ask for tea. 60 seconds of demo. Hand them a small printed card with the URL and your number, then leave. They'll claim that evening or next morning if they're going to.

---

## When they ask about Xenios POS (Tier 3 conversation)

Don't bring up Xenios in first contact. Mention it only when:

- They've been on Tier 1 for 60+ days
- They've expressed frustration with their current POS or order management
- They've upgraded to Tier 2 featured

The pitch:

```
You've been using the pickyeat dashboard for 2 months now. One thing we
can do that no other POS in India can: when you update a dish or price
in Xenios POS, it auto-syncs to pickyeat instantly. Same with your
out-of-stock items — they disappear from picks the moment you mark them
sold out in the kitchen.

Most POS just runs your kitchen. Xenios runs your kitchen AND keeps your
listing on pickyeat fresh without you ever updating two places.

14-day free trial. Want to see it Saturday morning?
```

This is the close that turns a ₹499/mo café into a ₹4,000/mo POS customer.

---

## Internal — keep a CRM

Even a simple spreadsheet at `design/restaurants-pipeline.tsv` (or a Notion table). Columns:

| Restaurant | Owner name | WhatsApp | Email | Scans this month | Last contact | Stage | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Cafe Mocha | Priya R | +91 98... | priya@cafemocha.in | 47 | Day 26 | Trial active | Asked about menu editor for Sunday specials |
| Vaishali | Mr. Joshi | +91 98... | — | 31 | Day 27 | Awaiting reply | Walk-in scheduled Day 32 |

Update this weekly. The pattern of "who replied vs who didn't" is your first real B2B data, and it tells you what message variant is working.
