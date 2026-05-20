# Phase 2 — soft launch comms (Days 15-21)

For the first 20 friends. Goal: 100 successful scans, candid feedback, zero allergic incidents.

---

## The WhatsApp invite

Send individually (one message per person — keep it personal, not blast). One day before you want them to start.

```
Hey [name] —

I've been building this thing called pickyeat. Open any restaurant menu,
scan it with your phone, tell it your mood — it picks three dishes you'll
actually like, with reasons. Free. No signup.

Trying it with ~20 people this week before opening it up. Would love your
honest reaction.

Just open this on your phone (works in any browser, no app needed):
https://pickyeat.com

Scan whatever you eat this week — 3-5 meals would be amazing. Anything that
feels off, broken, or annoying, tell me directly.

Cheers,
Nitin
```

Tweaks per person:
- Vegetarian friend: add "diet filter is the first thing — try it"
- Friend with allergies: "test the allergen filter — it's the whole reason I built this"
- Tourist friend: "translate mode lets you point at a Marathi menu and it reads in English"
- Foodie / cafe-hopping friend: "your top 5 cafes — let me know if the picks feel right"

---

## The Google Form for structured feedback

Create at forms.google.com → blank form → title **"pickyeat — 60-second feedback"**.

### Form fields

1. **Which restaurant did you scan?** — short answer
2. **Did the picks feel like you?** — multiple choice
   - Yes, mostly
   - Mixed — one or two were right
   - No, the picks felt off
3. **What did you actually order?** — short answer
4. **One thing that worked** — long answer
5. **One thing that annoyed you** — long answer (force a complaint)
6. **Would you tell a friend about this?** — multiple choice
   - Definitely
   - Maybe
   - Not yet
7. **Anything else?** — long answer

Send the form link with the WhatsApp invite. Don't gate any feature behind filling it — make it optional.

---

## The mid-week check-in call

On Day 18, pick 3 of the 20 for a 15-minute phone or video call. Mix:

- One person who's clearly using it (most scans logged)
- One person who hasn't opened it since Day 15 (find out why)
- One person whose feedback in the form was confused or contradictory

Questions for the call:

1. Walk me through the last time you used pickyeat. What did you do, what did you expect, what actually happened?
2. Was there a moment it felt magical? A moment it felt broken?
3. Did the picks feel like a friend recommending, or like an app?
4. If pickyeat disappeared tomorrow, would you miss it?
5. Who else would you tell about this?

Take notes. Don't try to defend the product. Just listen.

---

## Daily monitoring

While the 20 are scanning:

- Open Sentry once in the morning, once in the evening. Any uncaught errors → fix today.
- Check Railway logs for `[err]` lines. Any user-facing failure → fix today.
- Glance at `/health` mid-day. If `db: not-configured` shows up unexpectedly, the connection dropped.
- Tally daily scans in a notes app. Aim for: Day 16 = 20 scans, Day 18 = 50, Day 21 = 100.

---

## Triage at end of week (Day 21)

Sort all feedback into three buckets in a single doc:

1. **Fix before public launch** — anything that confused 2+ users or generated a 1-2 star reaction
2. **Fix in Phase 3-4** — things that work but feel rough
3. **v2 idea** — feature requests that are real but not MVP

Decide which Phase 2 fixes ship before Day 22 (the public r/pune post). Anything in bucket 1 that's not fixable in 24h → delay the public launch by a day. Better to push than to launch with known sharp edges.
