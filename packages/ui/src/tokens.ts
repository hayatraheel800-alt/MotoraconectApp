export const colors = {
  primary: "#0B1F3A",
  primaryLight: "#16335C",
  accent: "#F2A93B",
  accentDark: "#D68F1F",
  background: "#FFFFFF",
  surface: "#F5F7FA",
  border: "#E1E5EB",
  textPrimary: "#12172B",
  textSecondary: "#5B6472",
  textInverse: "#FFFFFF",
  success: "#1E8E5A",
  warning: "#C97A0A",
  danger: "#C0392B",
  info: "#2563A6",
  status: {
    DRAFT: "#8A8F98",
    PENDING_REVIEW: "#C97A0A",
    ACTIVE: "#1E8E5A",
    RESERVED: "#2563A6",
    SOLD: "#5B6472",
    EXPIRED: "#8A8F98",
    REJECTED: "#C0392B",
    SUSPENDED: "#C0392B",
  },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 6, md: 10, lg: 16, pill: 999 } as const;
export const typography = {
  fontFamily: { regular: "System", medium: "System", bold: "System" },
  size: { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, xxl: 28, display: 34 },
} as const;