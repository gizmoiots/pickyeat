# pickyeat — the picking algorithm

The picking algorithm is the product. Everything else (brand, screens, GPS, cache, group mode) exists to deliver picks the user trusts.

This doc defines the algorithm itself: what's running today, what production looks like, and the explicit signals and failure modes.

---

## 1. What's running today

Mock mode. `backend/src/services/claude.ts → recommend()` returns three hardcoded picks regardless of input:

| Dish | Reason |
| --- | --- |
| Butter chicken | "matches your high-protein goal + 3 reviews call it the best in Pune" |
| Dal makhani | "lighter pick — you wanted under 500 cal" |
| Garlic naan | "pairs with the butter chicken everyone else picked" |

This is intentional — the frontend was built first so the experience could be validated before the real engine. Live mode is `throw new Error(...)` until §6 lands.

---

## 2. Architecture — three stages

```
   user prefs + menu + crowd data
              │
              ▼
   ┌─────────────────────┐
   │ Stage 1 — Hard      │   pure TypeScript
   │  filter             │   no LLM, no network
   │  (allergens, diet,  │   ≤ 10 ms
   │   budget, calories) │
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ Stage 2 — Rank      │   single Claude call
   │  + reason           │   3-second timeout
   │  (LLM scoring)      │   ~500-1200 ms typical
   └──────────┬──────────┘
              ▼
   ┌─────────────────────┐
   │ Stage 3 — Shape     │   pure TypeScript
   │  (validate, diverse,│   ≤ 10 ms
   │   format)           │
   └──────────┬──────────┘
              ▼
        three picks + reasons
```

The hybrid is deliberate: hard filters are deterministic so safety (allergens, diet) is **guaranteed**, not probabilistic. Soft scoring lives in Claude because that's where nuance and crowd signal blend into a sentence.

---

## 3. Stage 1 — Hard filters

A dish is dropped if any of the following are true:

| Filter | Source | Behavior |
| --- | --- | --- |
| Allergen overlap | `prefs.allergens ∩ dish.allergens ≠ ∅` | drop |
| Diet violation | `prefs.diet = vegan` AND dish lacks `diet: ["vegan"]` tag | drop |
| Diet violation | `prefs.diet = jain` AND dish contains onion/garlic/root flagged | drop |
| Diet violation | `prefs.diet = gluten-free` AND `"gluten" ∈ dish.allergens` | drop |
| Diet violation | `prefs.diet = halal` AND dish not flagged halal | drop |
| Hard budget | `dish.priceInr > prefs.budgetMaxInr` (when set) | drop |
| Hard calorie cap | `dish.estCalories > prefs.health.calorieMax` (when health mode on) | drop |

What's NOT a hard filter:

- Spice level → soft (the mild person might want one hot pick to push themselves)
- Crowd favorite → soft (boost, never required)
- Time of day → soft (hint, never required)

If hard filters drop the menu below 3 dishes, surface a "no clean match — relax a constraint?" state with the *single most-blocking* filter named. Never silently return less than 3 picks.

---

## 4. Stage 2 — Soft ranking via Claude

A single message to `claude-sonnet-4-6` with the filtered menu and full user context. Output is strict JSON.

### 4.1 Signals passed to Claude

```
{
  "restaurant": {
    "name": "Cafe Mocha",
    "scanCount": 47,
    "bestsellers": {"Butter chicken": 12, "Paneer tikka masala": 7},
    "googleRating": 4.3,
    "address": "FC Road, Pune"
  },
  "diner": {
    "craving": "full-meal",
    "spice": "medium",
    "hunger": "normal",
    "occasion": "solo",
    "budgetMaxInr": 500,
    "health": {"goal": "bulking", "calorieMax": 800, "macroFocus": "high-protein"},
    "diet": "nonveg",
    "allergens": ["peanuts", "shellfish"],
    "tasteSummary": "spicy, high-protein, ₹200-400 dishes",
    "recentLikes": ["dish_butter_chicken", "dish_chicken_tikka"],
    "recentDislikes": []
  },
  "context": {
    "timeOfDay": "20:42",
    "weather": "light-rain-23C",
    "isFirstVisit": false
  },
  "group": null,
  "menu": [/* filtered dishes with id, name, price, allergens, est macros */]
}
```

### 4.2 Brand-voice constraints (in the system prompt)

- Exactly 3 picks.
- Each `reason` is one sentence, under 15 words.
- Format: "matches your <personal signal> + <social signal>" — but only when both are available; otherwise lead with whichever is stronger.
- Indian vocabulary preferred (thali / tiffin / naan / chai, not platter / lunchbox / flatbread / tea).
- Banned words: amazing, delicious, yum, curated, AI-powered, discover, journey, experience (as a verb).
- No emoji, no exclamation marks.
- Currency rendered as ₹ with no decimals.

### 4.3 Ranking intent (priority order, decreasing)

The prompt asks Claude to weigh signals roughly in this order. Not literal weights — guidance for the LLM:

1. **Mood / craving alignment** — full-meal request never gets answered with drinks
2. **Health goal alignment** — bulking + high-protein gets pushed; cutting + low-cal gets pushed
3. **Crowd signal** — bestsellers from the Google reviews scrape, weighted by scan count
4. **Personal taste history** — recent likes at this cuisine or in this price band
5. **Pairing logic** — if Claude picks an entrée first, look for a side / drink to round out
6. **Context** — weather (warmer dishes when raining), time of day (lighter at lunch, heavier at dinner)
7. **Diversity** — three picks should span at least two of: drink / side / main; never three identical price bands
8. **Novelty** — for repeat visitors, surface one dish they haven't ordered before, even if a usual pick would rank higher

### 4.4 Expected output

```json
{
  "picks": [
    {
      "dishId": "dish_butter_chicken",
      "reason": "matches your high-protein goal + 12 reviews call it the best here"
    },
    {
      "dishId": "dish_dal_makhani",
      "reason": "lighter pick at ₹280 — you wanted under 500 cal"
    },
    {
      "dishId": "dish_garlic_naan",
      "reason": "pairs with the butter chicken — most diners get it together"
    }
  ]
}
```

---

## 5. Stage 3 — Output shaping

After Claude responds, deterministic code validates and shapes:

1. **Schema validation** — must be `{picks: [{dishId, reason}]}` of length 3. If invalid → fallback (§7).
2. **Dish existence** — every `dishId` must be in the filtered menu. Hallucinations dropped → fallback to fill the gap.
3. **Brand-voice lint** — reason length ≤ 15 words, no banned words, no exclamation marks. If a reason fails lint, regenerate just that reason with a single retry or truncate.
4. **Diversity check** — if all three dishes are entrées over ₹300, swap one for the cheapest side from the filtered menu and rewrite its reason.
5. **Hydration** — load full dish records (name, price, macros, allergens) and crowd flags.
6. **Pick-dot assignment** — the highest-ranked pick gets the Sprig dot in the corner. Crowd-favorites get the additional `crowd favorite` pill.

---

## 6. Implementation in the codebase

Today: `backend/src/services/claude.ts → recommend()` is the entry point. Wire it like this when going live:

```ts
export async function recommend(menu: Dish[], prefs: Prefs, context: Context): Promise<Pick[]> {
  // Stage 1 — hard filter (deterministic)
  const candidates = hardFilter(menu, prefs);
  if (candidates.length < 3) return fallbackInsufficientMenu(candidates, prefs);

  // Stage 2 — Claude ranking
  let response;
  try {
    response = await Promise.race([
      callClaude(candidates, prefs, context),
      timeout(3000)
    ]);
  } catch (e) {
    return crowdFavoriteFallback(candidates, 3);
  }

  // Stage 3 — shape and validate
  return shape(response, candidates);
}
```

The three helpers (`hardFilter`, `callClaude`, `shape`) live in adjacent files. None of this exists yet — it's the v0.2 task.

---

## 7. Failure modes and fallbacks

| Failure | Detection | Behavior |
| --- | --- | --- |
| Claude returns invalid JSON | `JSON.parse` throws | Fall back to top-3 by `bestsellers` rank, generic reasons |
| Claude hallucinates a dish | `dishId` not in filtered menu | Drop the hallucinated pick, fill from crowd-favorite list |
| Claude API down or > 3s | `Promise.race` timeout | Same as above — crowd-favorite fallback, log incident to Sentry |
| Hard filters drop below 3 dishes | Stage 1 short-circuits | Surface "relax a constraint?" UI naming the most-blocking filter |
| User has no profile (anon) | `prefs.tasteSummary` empty | Skip personal-history weighting; lean fully on crowd + mood |
| Group mode, no overlap | Stage 1 returns 0 for the union of all members' constraints | Surface "split the order?" UI; offer per-member picks instead of a unified set |
| Hard-filter rule conflict (e.g., user toggled "vegan" + occasion = "celebration" with no veg high-protein on this menu) | Filtered menu is short on the macro-focus axis | Relax `macroFocus` first; keep `diet` and `allergens` absolutely rigid |

The order of relaxation is fixed: never relax allergens or diet, ever. Always relax soft preferences first.

---

## 8. Taste vector — long-term personalization

The architecture doc has `users.taste_vector JSONB`. This is the substrate for §4.1's `recentLikes` and `tasteSummary`.

Two versions planned:

**v0 (post-MVP)** — a simple summary string. After every 5 feedback events, recompute:

```
"<adjectives derived from liked dishes>, <cuisine clusters>, <price band>"
```

Example: `"spicy, north-indian, ₹200-400, sides preferred over mains"`. Easy to debug, easy to surface on the "what we know about you" screen, easy to hand to Claude.

**v1 (later)** — embeddings-based. Each dish gets a 1536-dim embedding from its name + description. User's taste vector is the average of embeddings for dishes they liked, weighted by recency and rating. Picks get ranked by cosine similarity to the taste vector. Still hand the *string summary* to Claude — the embedding is just for the ranking pass before the LLM call.

---

## 9. Group mode — algorithmic difference

Group picks find the **union of constraints, intersection of dishes**. The flow:

1. Each member submits prefs to the group.
2. Hard filter runs against the **union** of all allergens and the **intersection** of compatible diets.
3. Claude is asked for 3-5 picks that "every member can eat and at least 2 members would prefer."
4. If no overlap exists at all (vegan + meat-required), surface the "split the order?" UI.

This is genuinely different from solo mode — it's the most under-served use case in food apps, and the group reasons should reference the dynamic ("Maya is vegan, Aarav wants protein — this thali works for both").

---

## 10. Decisions still open

- **How many feedback events before personalization kicks in?** Default proposal: 5 events. Below that, fall back to crowd + mood only.
- **Should we cache picks per (restaurant, prefs-hash) for 24h?** Probably yes — same diner, same restaurant, same prefs should produce the same picks within a session. Save Claude calls.
- **How aggressively should novelty push?** Proposal: 1 of 3 picks is a novelty pick for returning visitors at the same restaurant. Test against retention.
- **Sponsored picks** — architecture doc §6 mentions this for v2. The moment a pick is paid for, the brand voice constraint changes. Probably a separate "Try also:" row, never blended with organic picks.
- **Cold start at a new restaurant** — we have crowd-favorite from Google reviews but no scan count. Weight Google data heavily until first scan completes.

---

## 11. What success looks like

The algorithm is right when:

1. A first-time anon user at Cafe Mocha gets picks that match what most diners actually order at Cafe Mocha. (Crowd signal works.)
2. A returning user with a logged taste history gets picks that diverge from the crowd in their direction. (Personalization works.)
3. A user with a hard allergen never sees a dish containing that allergen. (Hard filters work.)
4. A group with conflicting constraints either gets a workable shared order or a clean "split" suggestion. (Group mode works.)
5. The "I ordered this" rate on recommended picks rises over time as the taste vector matures. (Feedback loop closes.)
6. The reasons feel like they came from a friend, not a database. (Brand voice survives Claude.)
