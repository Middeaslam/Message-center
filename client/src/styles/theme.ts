const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

export const theme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    sidebar: '#f1f5f9',
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af'
    },
    border: '#e5e7eb',
    unread: '#3b82f6',
    unreadBg: '#eff6ff',
    priority: {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#10b981'
    },
    status: {
      success: '#10b981',
      error: '#dc2626',
      warning: '#f59e0b'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  layout: {
    sidebarWidth: '240px',
    headerHeight: '64px',
    borderRadius: '8px',
    borderRadiusSm: '4px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  transitions: {
    default: '150ms ease-in-out',
    fast: '100ms ease-in-out',
    slow: '300ms ease-in-out'
  },
  breakpoints,
  mobile: {
    sidebarWidth: '280px', // Slightly wider on mobile for better touch targets
    headerHeight: '56px' // Shorter header on mobile
  },
  // Add media query helpers
  media: {
    mobile: `@media (max-width: ${breakpoints.md})`,
    desktop: `@media (min-width: ${breakpoints.md})`
  }
};

export type Theme = typeof theme;
