---
name: Aether Insight
colors:
  surface: '#18101f'
  surface-dim: '#18101f'
  surface-bright: '#403547'
  surface-container-lowest: '#130b1a'
  surface-container-low: '#211828'
  surface-container: '#251c2c'
  surface-container-high: '#302637'
  surface-container-highest: '#3b3142'
  on-surface: '#edddf4'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#edddf4'
  inverse-on-surface: '#362d3e'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#d3bbff'
  on-secondary: '#3f008d'
  secondary-container: '#5d03ca'
  on-secondary-container: '#c7aaff'
  tertiary: '#deb8ff'
  on-tertiary: '#490080'
  tertiary-container: '#cb94ff'
  on-tertiary-container: '#5f00a3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#250059'
  on-secondary-fixed-variant: '#5b00c5'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#18101f'
  on-background: '#edddf4'
  surface-variant: '#3b3142'
typography:
  headline-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
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
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for the elite venture capital and angel investment landscape. It targets high-stakes decision-makers who require rapid data synthesis and a sense of technological edge. The brand personality is **authoritative, futuristic, and precise**, evoking the feeling of a high-end command center.

The visual style is a refined **Glassmorphism**, leveraging deep obsidian layers, vibrant neon accents, and subtle glowing edges. This aesthetic mimics sophisticated aerospace or fintech hardware interfaces. By combining heavy background blurs with sharp, glowing borders, the system achieves a sense of depth and hierarchy that feels both physical and digital. The emotional response should be one of "controlled power"—where massive amounts of data are rendered with clarity and elegance.

## Colors

The palette is rooted in a "Deep Space" theme. The primary neutral is a rich, dark charcoal with a slight purple undertone to maintain warmth and sophistication across the dark mode interface.

- **Primary (Neon Emerald):** Reserved exclusively for high-priority CTAs, success states, and critical growth indicators. It provides a sharp, high-contrast anchor against the dark background.
- **Secondary (Deep Violet):** Used for ambient effects, gradients, and secondary visual hierarchy. It provides the "glow" that defines the glassmorphism style.
- **Surface & Background:** Layers use semi-transparent whites on top of the dark canvas to create the frosted glass effect.
- **Accents:** Use gradients blending Secondary and Tertiary colors for data visualizations and non-interactive decorative elements.

## Typography

This design system utilizes a dual-font strategy to balance impact with utility. 

**Montserrat** is used for headlines to provide a geometric, bold, and modern tech feel. Its wide proportions communicate stability and confidence. **Inter** is the primary workhorse for body copy and data labels, chosen for its exceptional legibility in dark mode and high-density data environments.

For numerical data (IRR, valuations, etc.), utilize Inter with tabular lining figures to ensure vertical alignment in charts and lists. All labels should utilize a slight letter-spacing increase to improve readability against blurred backgrounds.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model built on an 8px base unit. 

- **Desktop:** 12-column grid with a 24px gutter. Content is housed in glass containers that reflow based on the container width.
- **Tablet:** 8-column grid with 20px gutters. 
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Spacing should be generous to allow the "glow" and glass effects room to breathe. High-density data tables should use a "Compact" variation of the spacing (4px/8px) while marketing and landing pages use "Spacious" units (40px/64px). Use dynamic padding for glass cards to ensure the background blur is visible and effective.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tonal Layering** rather than traditional shadows.

1.  **Level 0 (Canvas):** The base dark background (#09040D).
2.  **Level 1 (Section):** Subtle cards with a background blur (12px) and 1px border at 10% opacity.
3.  **Level 2 (Interactive):** Elements that float above the section, using a higher background blur (20px) and a subtle inner glow.
4.  **Level 3 (Modals/Popovers):** Highest contrast, using a 40px backdrop blur and a Primary (Emerald) or Secondary (Violet) 1px "Glow Border" to define the edge.

Shadows, when used, are colored (e.g., a soft Violet glow) rather than black, creating an ambient light effect that feels emitted from the UI itself.

## Shapes

The shape language is **"Modern Rounded."** 

A radius of 0.5rem (8px) is the standard for most components, providing a balance between the precision of a sharp grid and the approachability of a modern SaaS tool. 

- **Large Containers/Cards:** Use `rounded-xl` (24px) to create soft, defined sections for data groups.
- **Buttons & Chips:** Use a full pill shape for secondary actions, while primary buttons maintain the standard 8px radius for a more "professional" feel.
- **Inner Elements:** Elements inside a card should have a 4px radius to maintain nested harmony.

## Components

### Buttons
- **Primary:** Solid Neon Emerald (#22C55E) with black text. On hover, apply a subtle emerald outer glow.
- **Secondary:** Glass background (white @ 10%) with a white border.
- **Ghost:** No background, Violet text, used for tertiary actions.

### Cards & Containers
All cards must implement `backdrop-filter: blur(16px)`. Use a linear gradient for the border: a 1px stroke that transitions from White (20% opacity) at the top-left to Violet (10% opacity) at the bottom-right.

### Data Visualizations
- **Charts:** Use thin, glowing lines for line charts. Use the Secondary/Tertiary gradient for area fills with a 0.2 opacity.
- **Value Indicators:** Positive growth is always Neon Emerald; negative is a muted Coral/Red.

### Inputs & Selects
Dark surfaces with a 1px border. When focused, the border transitions to a Neon Emerald glow and the background opacity increases slightly.

### Chips
Used for sector tags (e.g., "SaaS", "Web3"). These should be semi-transparent with a border color matching the category's assigned accent color.