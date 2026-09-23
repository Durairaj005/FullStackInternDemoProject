// ─── Feedants Design Tokens ───────────────────────────────────────────────────
// Faithfully matches the exact design reference (media_1790197997127.jpg)
// Clean, modern aesthetic with emerald/teal branding, white cards, and crisp hierarchy.

export const Colors = {
  // Background surfaces (matching the design's clean, premium look)
  bg: {
    base: '#F4F7F6',          // soft muted grey-teal page background
    card: '#FFFFFF',          // pure white cards
    cardElevated: '#FFFFFF',
    cardSubtle: '#F8FAFA',
    pill: '#EBF5F3',          // very light teal for chips and countdown
    pillSelected: '#00665C',  // active language switcher
    input: '#F1F5F9',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Brand Colors (Feedants signature deep teal and accents)
  brand: {
    primary: '#00665C',       // primary deep teal (CTA buttons, header links)
    primaryDark: '#004D46',
    primaryLight: '#008577',
    primaryTint: '#E6F4F1',   // badge/pill background
    primaryBorder: '#B2DFDB',
    secondary: '#00838F',
    accent: '#0D9488',
    gold: '#D97706',          // prize / trophy gold
    goldBg: '#FEF3C7',
  },

  // Status & Urgency Colors
  status: {
    active: '#059669',        // registered / open
    activeBg: '#D1FAE5',
    activeText: '#065F46',
    warning: '#D97706',       // hurry up / closing soon
    warningBg: '#FEF3C7',
    danger: '#DC2626',        // full / closed
    dangerBg: '#FEE2E2',
    info: '#0284C7',
    infoBg: '#E0F2FE',
  },

  // Typography Colors
  text: {
    primary: '#111827',       // dark slate title text
    secondary: '#4B5563',     // body text
    tertiary: '#6B7280',      // subtitles and captions
    muted: '#9CA3AF',         // placeholders, hints
    brand: '#00665C',         // branded links and highlights
    brandDark: '#004D46',
    white: '#FFFFFF',
    gold: '#B45309',
  },

  // Borders & Dividers
  border: {
    subtle: '#E5E7EB',
    default: '#D1D5DB',
    card: '#E9ECEF',
    brand: '#B2DFDB',
  },

  // Special colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  razorpay: '#0C2340',
  referralBg: '#EBF8F5',
  referralBorder: '#A7F3D0',
} as const;

export const Typography = {
  size: {
    '2xs': 10,
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

export const Spacing = {
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  screen: 16,
} as const;

export const Radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cta: {
    shadowColor: '#00665C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
