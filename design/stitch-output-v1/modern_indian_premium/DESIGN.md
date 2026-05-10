---
name: Modern Indian Premium
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2eb'
  surface-container: '#f6ece5'
  surface-container-high: '#f0e6e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#534437'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f9efe8'
  outline: '#867465'
  outline-variant: '#d9c2b2'
  surface-tint: '#8e4f00'
  primary: '#8e4f00'
  on-primary: '#ffffff'
  primary-container: '#e8923c'
  on-primary-container: '#5c3100'
  inverse-primary: '#ffb878'
  secondary: '#2e6a47'
  on-secondary: '#ffffff'
  secondary-container: '#b1f1c5'
  on-secondary-container: '#34704d'
  tertiary: '#ab3326'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff816f'
  on-tertiary-container: '#7a0e07'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#ffb878'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a00'
  secondary-fixed: '#b1f1c5'
  secondary-fixed-dim: '#96d4aa'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#115131'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#8a1b12'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display-xl:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  title-lg:
    fontFamily: Fraunces
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Fraunces
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
---

## Brand & Style

The design system is rooted in the concept of digital hospitality—modernizing the warmth of Indian culinary traditions through a refined, editorial lens. It targets a discerning audience that seeks expertise without pretension. The emotional response should be one of "effortless discovery" and "sensory comfort."

The aesthetic combines **Minimalism** with **Tactile** warmth. By pairing generous whitespace and a clean structural grid with subtle grain textures and organic earth tones, the design system avoids the coldness of traditional tech brands. It feels like a high-end physical menu or a boutique food journal, using "Modern Indian" motifs that emphasize quality, heritage, and the personal touch of a concierge.

## Colors

The palette for this design system is inspired by the spice markets and natural landscapes of India. **Saffron (#E8923C)** serves as the primary action color, providing energy and appetite appeal. **Deep Cardamom Green (#1E5B3A)** acts as a grounding secondary tone, used for brand markers and premium features.

**Cream (#F8F4ED)** is the foundational background, chosen to reduce eye strain and provide a softer contrast than pure white. All surfaces use **Soft Ivory (#FBFAF6)** to create subtle depth against the cream background. Functional colors for dietary indicators (Veg/Non-Veg) follow traditional Indian labeling but are tuned to match the desaturated, premium aesthetic of the system.

## Typography

This design system utilizes a high-contrast typographic pairing to balance heritage with modern utility. **Fraunces** is used for conversational headers and storytelling, lending a soft, "bookish" serif quality that feels premium and personal.

For all functional and body text, **Plus Jakarta Sans** is employed for its geometric clarity and warm, open apertures. To maintain the conversational tone, use Title Case for headers and avoid All-Caps except for small, tracked-out labels or dietary tags. Line heights are kept generous (1.5x for body) to ensure a relaxed reading pace.

## Layout & Spacing

The design system employs a **fluid grid** optimized for mobile, utilizing a 4-column structure with 20px outer margins. The rhythm of the layout is governed by a 4px base unit, ensuring all components and vertical rhythms are multiples of four.

Generous whitespace is a core principle here; content should never feel crowded. Use `xl` (32px) or `xxl` (48px) spacing to separate major sections, such as "Recommended for You" and "Local Classics." This vertical breathing room is essential to convey the "Premium" brand personality.

## Elevation & Depth

Hierarchy in this design system is created through **tonal layers** and **ambient shadows** rather than heavy borders. 

1.  **Base Layer:** The Cream background (#F8F4ED).
2.  **Surface Layer:** Cards and containers in Soft Ivory (#FBFAF6).
3.  **Elevation:** For interactive cards, use an extremely subtle, diffused shadow: `0 4px 16px rgba(31, 27, 23, 0.06)`. This gives the impression of paper resting on a table.

A subtle, low-opacity **grain texture overlay** should be applied to the background and surface layers to mimic high-quality cardstock, adding a tactile dimension that feels "Indian roots" and artisanal.

## Shapes

The shape language in this design system is sophisticated and soft. 
- **Standard Cards:** Use a 12px (medium) radius to provide a friendly but structured feel.
- **Pills & Primary Buttons:** Use a 24px (large) radius for a fully rounded appearance that invites interaction and feels modern.
- **Small Elements:** Icons, input fields, and small decorative tags use an 8px (small) radius.

Avoid sharp 90-degree corners to maintain the "warm and approachable" brand personality.

## Components

### Buttons
Primary buttons are pill-shaped (24px radius), filled with Saffron, and use bolded Plus Jakarta Sans text in Deep Charcoal. Secondary buttons use a Deep Cardamom Green outline or a text-link style with an arrow icon.

### Cards
Dish and restaurant cards use the 12px radius and the Soft Ivory surface. They feature a soft shadow on hover/press. High-quality photography with natural, warm lighting must occupy at least 50% of the card area to emphasize the "Zaika" (flavor) aspect.

### Chips & Indicators
- **Mood Chips:** Use emojis paired with Label-style text (e.g., "🌶️ Spicy") in a pill-shaped container.
- **Dietary Indicators:** Small circles with an 8px radius. Mint (#7FB069) for Veg, Crimson (#C44536) for Non-Veg. These should be placed discreetly near the dish title.

### Input Fields
Inputs are Soft Ivory with a subtle 1px border in Warm Grey. On focus, the border transitions to Saffron. Use the 8px radius for all form fields.

### Navigation
The bottom navigation uses a frosted version of Soft Ivory (backdrop-blur) with minimal line icons. The active state is indicated by a Saffron dot or icon color change.