---
name: Zaika Dark Mode
colors:
  surface: '#19120c'
  surface-dim: '#19120c'
  surface-bright: '#413730'
  surface-container-lowest: '#140d07'
  surface-container-low: '#221a14'
  surface-container: '#261e18'
  surface-container-high: '#312822'
  surface-container-highest: '#3c332c'
  on-surface: '#efe0d5'
  on-surface-variant: '#d9c2b2'
  inverse-surface: '#efe0d5'
  inverse-on-surface: '#382f28'
  outline: '#a18d7e'
  outline-variant: '#534437'
  surface-tint: '#ffb878'
  primary: '#ffb878'
  on-primary: '#4c2700'
  primary-container: '#e8923c'
  on-primary-container: '#5c3100'
  inverse-primary: '#8e4f00'
  secondary: '#96d4aa'
  on-secondary: '#00391f'
  secondary-container: '#115131'
  on-secondary-container: '#85c39a'
  tertiary: '#51d7f4'
  on-tertiary: '#003640'
  tertiary-container: '#17b5d1'
  on-tertiary-container: '#00424d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc1'
  primary-fixed-dim: '#ffb878'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6c3a00'
  secondary-fixed: '#b1f1c5'
  secondary-fixed-dim: '#96d4aa'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#115131'
  tertiary-fixed: '#aaedff'
  tertiary-fixed-dim: '#51d7f4'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#19120c'
  on-background: '#efe0d5'
  surface-variant: '#3c332c'
typography:
  display:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  h1:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  h2:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
This design system utilizes a **Tactile Modern** style, leaning into the sensory richness of culinary exploration. By shifting into a dark mode variant, the brand evolves from a bright kitchen aesthetic to an intimate, "chef’s table" evening atmosphere. The UI should evoke a sense of warmth, premium quality, and aromatic depth. 

The visual language balances high-end editorial layouts with soft, approachable organic shapes. It avoids the clinical coldness of pure blacks, instead opting for charcoal tones with brown undertones to maintain a "savory" feel.

## Colors
The palette is rooted in Earth tones. The primary **Saffron** provides a high-energy focal point for actions, while **Cardamom** acts as a grounding secondary for botanical or health-related cues. 

The **Paprika Red** has been desaturated to `#D65B4A` to prevent visual vibration against the dark charcoal background, ensuring accessibility and eye comfort. Surfaces use a slightly elevated "Deep Charcoal" to create clear container boundaries without the need for harsh borders.

## Typography
The typography strategy pairs the geometric, editorial character of **Epilogue** for headings with the friendly, modern warmth of **Be Vietnam Pro** for body text. 

In this dark mode variant, the **Cream (#F8F4ED)** primary text ensures high legibility and a soft contrast that is easier on the eyes than pure white. Secondary text in **Warm Grey** should be used for metadata and descriptions to maintain a clear visual hierarchy.

## Layout & Spacing
The design system employs a **Fluid Grid** with a 12-column structure for desktop and a 4-column structure for mobile. Spacing follows a 4px/8px baseline rhythm to ensure mathematical harmony between elements.

Generous internal padding (24px) within cards is required to maintain the premium, "breathable" feel of the interface. Horizontal margins for mobile containers should be kept at 20px to accommodate the soft corner radii.

## Elevation & Depth
Depth in this dark mode variant is achieved through **Tonal Layering** rather than heavy shadows. 
- **Level 0 (Base):** Charcoal #1F1B17.
- **Level 1 (Cards/Chips):** Deep Charcoal #2A2520.
- **Level 2 (Modals/Overlays):** A lighter tint of Charcoal (#352F29) to suggest physical proximity to the user.

Where shadows are applied, they must be extremely soft, using a deep umber tint (`rgba(0, 0, 0, 0.4)`) with a high blur radius (20px+) to mimic ambient, warm restaurant lighting.

## Shapes
The shape language is defined by two primary radii:
1. **12px (Small/Medium Elements):** Used for buttons, input fields, and small chips.
2. **24px (Large Elements):** Used for primary cards, bottom sheets, and main container wrappers.

This distinct 12/24 ratio creates a "nested" look where internal elements feel perfectly cushioned within their parent containers.

## Components

### Buttons
- **Primary:** Solid Saffron (#E8923C) with dark text (#1F1B17) for maximum visibility.
- **Secondary:** Outlined using Warm Grey (#A89F95) or ghost buttons for less intrusive actions.

### Cards
Cards use the Deep Charcoal (#2A2520) surface. They should not have borders unless they are interactive "Selected" states, in which case a 2px Saffron border is applied.

### Chips & Tags
Used for dish categories or dietaries (e.g., "Vegan"). These use the Deep Charcoal background with Text Secondary for inactive states, and Cardamom (#1E5B3A) for active/positive attributes.

### Input Fields
Inputs are subtly recessed, using the Base Charcoal (#1F1B17) background against the Deep Charcoal surface to create a "well" effect. Focus states should glow slightly with a Saffron outer shadow.

### Additional Components
- **Ingredient Icons:** Use a thin-stroke (1.5pt) style in Warm Grey.
- **Floating Action Buttons (FAB):** Always in Saffron to highlight the primary "Add" or "Search" utility.