// Design tokens following Civilization Mobile Guidelines

export const tokens = {
  // Radius tokens (4, 8, 12, 16, 24px)
  radius: { 
    xs: 4, 
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24 
  },
  
  // Spacing tokens (8pt grid: 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48px)
  spacing: { 
    0: 0, 
    1: 4, 
    2: 8, 
    3: 12, 
    4: 16, 
    5: 20, 
    6: 24, 
    7: 28, 
    8: 32, 
    10: 40, 
    12: 48 
  },
  
  // Elevation mapping to shadcn shadows
  elevation: { 
    0: "none", 
    1: "sm", 
    2: "md", 
    3: "lg" 
  },
  
  // Border widths
  border: { 
    hair: 1, 
    thin: 1.5, 
    thick: 2 
  },
  
  // Motion/Animation durations in ms
  motion: { 
    fast: 120, 
    base: 200, 
    slow: 320 
  },
  
  // Breakpoints in px
  breakpoints: { 
    mobile: 0, 
    phablet: 480, 
    tablet: 768 
  },
  
  // Touch target minimums
  hitSlop: { 
    minTarget: 44 
  },

  // Typography scale: 12, 14, 16, 18, 22, 28 (Base = 16)
  typography: {
    sizes: {
      micro: 12,    // text-micro
      caption: 14,  // text-caption  
      body: 16,     // text-body (base)
      section: 18,  // text-section
      titleSm: 22,  // text-title-sm
      title: 28     // text-title
    },
    roles: {
      micro: { size: 12, weight: 400, lineHeight: 1.3 },
      caption: { size: 14, weight: 400, lineHeight: 1.4 },
      body: { size: 16, weight: 400, lineHeight: 1.5 },
      section: { size: 18, weight: 500, lineHeight: 1.4 },
      titleSm: { size: 22, weight: 500, lineHeight: 1.3 },
      title: { size: 28, weight: 500, lineHeight: 1.3 }
    }
  }
};

// Color system following guidelines
export const colors = {
  light: {
    // Cream background, dark text, gold/ochre accent
    background: '#faf9f6',
    foreground: '#2d2d2d',
    primary: '#c9951a',      // Gold/Ochre
    secondary: '#f5f4f1',
    accent: '#e6d3a3',       // Light gold
    muted: '#f0eeeb',
    success: '#16a34a',
    warning: '#ea580c',
    destructive: '#dc2626',
    info: '#2563eb'
  },
  dark: {
    // Near black canvas, light gray text, same accent
    background: '#0c0c0c',
    foreground: '#e5e5e5',
    primary: '#c9951a',      // Same gold/ochre
    secondary: '#262626',
    accent: '#3d3524',       // Dark gold
    muted: '#262626',
    success: '#16a34a',
    warning: '#ea580c',
    destructive: '#dc2626',
    info: '#2563eb'
  }
};

// Helper functions for applying design tokens
export function applySpacing(value: keyof typeof tokens.spacing): number {
  return tokens.spacing[value];
}

export function applyRadius(value: keyof typeof tokens.radius): number {
  return tokens.radius[value];
}

export function applyMotion(value: keyof typeof tokens.motion): number {
  return tokens.motion[value];
}

export function getTypographyClass(role: keyof typeof tokens.typography.roles): string {
  return `text-${role}`;
}

// Touch target validation
export function ensureMinTouchTarget(size: number): number {
  return Math.max(size, tokens.hitSlop.minTarget);
}

// Responsive design helpers
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < tokens.breakpoints.phablet;
}

export function isPhablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= tokens.breakpoints.phablet && window.innerWidth < tokens.breakpoints.tablet;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= tokens.breakpoints.tablet;
}

// Animation presets following guidelines
export const animations = {
  // Reduced motion support
  getMotionDuration: (duration: keyof typeof tokens.motion) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return Math.floor(tokens.motion[duration] * 0.5);
    }
    return tokens.motion[duration];
  },
  
  // Common transitions
  fadeIn: `opacity ${tokens.motion.base}ms ease-in-out`,
  slideUp: `transform ${tokens.motion.base}ms ease-out`,
  scaleIn: `transform ${tokens.motion.fast}ms ease-out`,
  
  // Interactive states
  buttonPress: `transform ${tokens.motion.fast}ms ease-out`,
  cardHover: `box-shadow ${tokens.motion.base}ms ease-out`,
};

// Layout helpers following guidelines
export const layout = {
  // 8pt grid spacing
  grid: {
    outer: tokens.spacing[4], // 16px outer spacing
    inner: tokens.spacing[3], // 12px inner spacing for cards
    cardSpacing: tokens.spacing[6], // 24px between cards
  },
  
  // Safe areas and containers
  container: {
    maxWidth: 448, // ~md mobile width
    padding: tokens.spacing[4], // 16px padding
  },
  
  // Z-levels following guidelines
  zIndex: {
    background: 0,
    cards: 1,
    modals: 2,
    tooltips: 3,
  }
};

export default tokens;