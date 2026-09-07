export const farmeiTokens = {
  colors: {
    vermillion: {
      50: "#FFF1EE",
      100: "#FFD9D2",
      200: "#FFB1A4",
      300: "#FF8674",
      400: "#FF5A42",
      500: "#FF3B2E",
      600: "#E92518",
      700: "#BC1809",
      800: "#8E1408",
      900: "#5C0A03"
    },
    spark: {
      50: "#FFFBE8",
      100: "#FFF4BD",
      200: "#FFE980",
      300: "#FFD93D",
      400: "#F5C400",
      500: "#C99B00"
    },
    ink: {
      0: "#FFFFFF",
      25: "#FAFAF7",
      50: "#F4F2EC",
      100: "#E8E6E0",
      200: "#D4D1C8",
      300: "#B8B4A8",
      400: "#8C8A82",
      500: "#5F5D57",
      600: "#3F3E3A",
      700: "#28272A",
      800: "#161618",
      900: "#0A0A0A"
    },
    success: { 100: "#D7F3E2", 500: "#2EA862" },
    warn: { 100: "#FFF0D6", 500: "#E89E18" }
  },
  fontFamily: {
    display: ["Bricolage Grotesque", "Geist", "system-ui", "sans-serif"],
    body: ["Geist", "system-ui", "sans-serif"],
    mono: ["JetBrains Mono", "ui-monospace", "monospace"]
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px"
  },
  boxShadow: {
    xs: "0 1px 2px rgba(10,10,10,0.04)",
    sm: "0 2px 6px rgba(10,10,10,0.06)",
    md: "0 6px 18px rgba(10,10,10,0.08)",
    lg: "0 16px 40px rgba(10,10,10,0.10)",
    stamp: "2px 2px 0 #0A0A0A",
    "stamp-lg": "4px 4px 0 #0A0A0A",
    "stamp-brand": "2px 2px 0 #E92518"
  }
} as const;

const tailwindConfig = {
  theme: {
    extend: {
      colors: farmeiTokens.colors,
      fontFamily: farmeiTokens.fontFamily,
      spacing: farmeiTokens.spacing,
      boxShadow: farmeiTokens.boxShadow
    }
  }
};

export default tailwindConfig;
