---
name: Warm Minimalism
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
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-rg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
  ui-label:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  ui-label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
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

The design system is centered on a "Warm Minimalist" aesthetic, specifically tailored for a culinary mobile PWA. The personality is approachable, appetizing, and organized, evoking the feeling of a clean, modern kitchen or a curated pantry. 

The emotional response should be one of clarity and comfort. By eschewing modern trends like glassmorphism or heavy shadows in favor of flat, high-quality surfaces and thin 0.5px strokes, the system prioritizes content and ease of use. Generous whitespace is used as a functional tool to prevent cognitive overload, ensuring the "The Pick" (the Sprig dot) remains a distinctive, high-signal marker throughout the experience.

## Colors

This design system uses a warm, organic palette inspired by natural ingredients. 

- **Saffron (#F26B3A):** The energetic primary, reserved for high-priority actions and essential accents.
- **Spice (#C8421C):** A deeper earth tone used for display typography and hover/active states to provide visual weight without relying on shadows.
- **Sprig (#2BB673):** A fresh green used exclusively for selection indicators and the brand’s signature dot motif.
- **Pepper (#1F1B16):** A warm black that maintains legibility while feeling softer and more "organic" than pure hex black.
- **Coconut (#FFF8EE):** The foundation of the system, providing a soft, creamy alternative to stark white.

## Typography

The design system utilizes **Plus Jakarta Sans** exclusively to maintain a friendly and modern presence. 

- **Sentence Case:** Applied globally across all headlines, buttons, and labels to keep the tone conversational and humble.
- **Weight Logic:** Display levels use a bold 700 weight in **Spice** for hierarchy. Body text uses 400 for maximum readability against the **Coconut** surface. UI labels and interactive elements use 500 to differentiate them from static content.

## Layout & Spacing

This design system follows a fluid layout model optimized for mobile PWA constraints. It relies on a 4px base increment to maintain a rigorous rhythm.

- **Margins:** A standard 20px horizontal margin is used for primary screen content.
- **Whitespace:** Emphasize vertical rhythm by using larger spacing increments (24px+) between distinct content groups to maintain the minimalist feel.
- **Grid:** Use a simple single-column layout for lists and a 2-column flex grid for card-based browsing.

## Elevation & Depth

Depth is achieved through **structural containment and color contrast** rather than light simulation. 

- **Zero Shadows:** No box-shadows or drop-shadows are permitted. 
- **Tonal Layering:** Depth is communicated by placing Pepper-colored 0.5px borders around elements. 
- **The "Sprig" Marker:** The primary method for showing "active" or "selected" depth is the addition of the Sprig dot motif or a 0.5px Sprig border. 
- **Surface Tiers:** Use subtle variations of the Coconut palette or simple 0.5px Pepper outlines to separate panels from the background.

## Shapes

The shape language is rounded and inviting, avoiding sharp aggression while maintaining a structured grid.

- **Cards:** 12px corner radius.
- **Panels/Modals:** 16px to 20px corner radius (the larger the surface, the larger the radius).
- **Interactive Chips:** Full pill-shape (height / 2).
- **Borders:** All borders must be exactly 0.5px in width, using the Pepper color at 20% opacity for subtle division or 100% for high emphasis.
- **The Dot:** The Sprig motif is a perfect circle, typically 6px or 8px in diameter.

## Components

### Buttons
- **Primary:** Saffron background, Pepper text, 12px radius, no shadow.
- **Secondary:** Coconut background, 0.5px Pepper border, Pepper text.

### Chips
- Pill-shaped with a 0.5px Pepper border.
- **Selected State:** Background remains Coconut, but a 6px Sprig dot appears to the left of the label.

### Cards
- 12px rounded corners.
- 0.5px Pepper border (#1F1B16 at 15-20% opacity).
- Coconut background.

### Selection Indicators (Radio/Check)
- Custom circular indicators.
- When selected, they do not fill completely; instead, they feature the Sprig dot centered within a 0.5px Pepper circle.

### Input Fields
- Underline style or 0.5px bordered box with 12px radius.
- Labels are always sentence case UI-label (500 weight).

### The Brand Motif (The Sprig Dot)
- Used as a "New" indicator, a "Selected" marker, or a decorative element at the end of a display headline. It is always #2BB673.