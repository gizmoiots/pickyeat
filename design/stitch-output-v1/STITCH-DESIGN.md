---
name: pickyeat
colors:
  surface: '#fff8f3'
  surface-dim: '#e2d8d0'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e9'
  surface-container: '#f6ece4'
  surface-container-high: '#f0e7de'
  surface-container-highest: '#eae1d8'
  on-surface: '#1f1b16'
  on-surface-variant: '#58413a'
  inverse-surface: '#34302a'
  inverse-on-surface: '#f9efe6'
  outline: '#8c7169'
  outline-variant: '#e0c0b6'
  surface-tint: '#a93705'
  primary: '#a93705'
  on-primary: '#ffffff'
  primary-container: '#f26b3a'
  on-primary-container: '#571700'
  inverse-primary: '#ffb59c'
  secondary: '#af3009'
  on-secondary: '#ffffff'
  secondary-container: '#ff6940'
  on-secondary-container: '#611400'
  tertiary: '#006d40'
  on-tertiary: '#ffffff'
  tertiary-container: '#14aa68'
  on-tertiary-container: '#00351d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832700'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a1'
  on-secondary-fixed: '#3b0800'
  on-secondary-fixed-variant: '#881f00'
  tertiary-fixed: '#7afbb1'
  tertiary-fixed-dim: '#5cde97'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#00522f'
  background: '#fff8f3'
  on-background: '#1f1b16'
  surface-variant: '#eae1d8'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-pill:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
  price-tag:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter: 12px
---

## Brand & Style
The brand personality is that of a knowledgeable, food-loving friend—someone who knows the best *tiffin* spot or where to find the crispest *dosa* in Pune. The UI evokes a sense of "Warm Minimalism," focusing on appetite appeal and clarity without the clutter of traditional delivery apps. 

This design system avoids the hyper-stimulation of typical food platforms. Instead of aggressive urgency, it uses generous whitespace and a "Coconut" surface to create a breathable, inviting atmosphere. The aesthetic is flat and structural, relying on thin 0.5px borders and precise geometry rather than shadows or depth effects to organize information. It is built to feel native to a mobile browser (PWA), prioritizing speed and legibility.

## Colors
The palette is inspired by the warmth of Indian spices and ingredients. 
- **Saffron (#F26B3A):** The primary energy of the app, used for main actions and the core logo.
- **Spice (#C8421C):** A deeper, grounded orange used for hover states and emphasis.
- **Sprig (#2BB673):** Reserved exclusively for "The Pick"—the recommended dish or highlight. It acts as a signature mark of quality.
- **Pepper (#1F1B16):** A soft black used for all typography to maintain high contrast without the harshness of pure black.
- **Coconut (#FFF8EE):** The foundational surface color. It provides a creamy, warm backdrop that feels more organic and culinary than standard white.

Avoid using gradients or glows. Color should be applied in flat, solid fills to maintain the "Warm Minimal" aesthetic.

## Typography
The design system employs **Plus Jakarta Sans** for English text and **Mukta** for Devanagari script (Hindi/Marathi). This combination ensures a modern, friendly character that remains highly legible at small sizes on mobile screens.

**Sentence case is mandatory** for all headings, buttons, and labels (e.g., "Add to thali" instead of "ADD TO THALI"). This supports the conversational, low-pressure voice of the brand. Mukta should be scaled to match the visual weight of Plus Jakarta Sans when used in bilingual contexts, typically requiring a slight increase in font size for the Devanagari character set.

## Layout & Spacing
The layout follows a fluid-first approach optimized for PWA environments. We use a strictly modular 4px/8px grid to maintain rhythm.

- **Margins:** A standard 20px safe area on the left and right of the viewport.
- **Padding:** Content groups should be separated by 24px (lg) or 32px (xl) to maintain the generous whitespace requested.
- **Vertical Rhythm:** List items and menu entries use 16px (md) internal padding to ensure touch targets are comfortable (minimum 44px height).

Avoid crowding elements; if a screen feels busy, increase the spacing between sections.

## Elevation & Depth
This design system rejects the use of drop shadows, inner glows, and blurs. Hierarchy is established through:
1. **0.5px Borders:** Use `border_color_hex` to define the edges of cards and panels. This creates a crisp, architectural feel without adding "weight."
2. **Layering:** Panels (16-20px rounded) sit directly on the Coconut surface.
3. **Contrast:** Elements that need attention use a Saffron fill. Secondary elements remain transparent with a 0.5px Pepper-tinted border.

To indicate interactivity (like a pressed button), the surface color shifts slightly darker or the border weight remains 0.5px but changes to the Spice color.

## Shapes
Shapes are intentionally soft to contrast with the technical precision of the 0.5px borders. 
- **Cards:** Used for individual dish picks (e.g., "Cafe Mocha’s Filter Coffee"), these feature a 12px corner radius.
- **Panels:** Larger containers or bottom sheets (e.g., restaurant info for FC Road) use a more generous 16px to 20px radius.
- **Chips & Buttons:** These are always pill-shaped (fully rounded) to evoke a friendly, tactile quality.

The "Sprig Dot" is a perfect circle and should be used as a marker above or to the right of the logo bowl, and as a status indicator for "The Pick" throughout the UI.

## Components
### Buttons
- **Primary:** Saffron fill, Pepper text (or white if contrast requires), pill-shaped. No shadow.
- **Secondary:** Transparent fill, 0.5px Spice border, Spice text.
- **State Change:** On tap, the Saffron button shifts to the Spice color.

### The Pick Motif
- A 8px Sprig (#2BB673) dot. Use this next to a dish name to indicate it is the recommended pick for that restaurant.

### Cards
- Background: #FFF8EE (Coconut).
- Border: 0.5px Pepper (10% opacity).
- Radius: 12px.
- Image: Top-aligned, 12px top-radius, no border on the bottom of the image where it meets the card content.

### Input Fields
- Understated: No background fill. 0.5px Pepper border (20% opacity) on the bottom only, or a full 12px rounded rectangle for search bars.

### Navigation (PWA Tab Bar)
- Flat Coconut background.
- Active state indicated by a Saffron icon and a small Sprig dot underneath.

### Mock Data Application
When displaying **Cafe Mocha, FC Road, Pune**, the price should be rendered as **₹250** using the `price-tag` typography level. All descriptions, like "best enjoyed with a side of buttered bun maska," must be in sentence case.