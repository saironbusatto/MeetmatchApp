const farmeiTheme = require("@farmei/design-tokens/tailwind").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      ...farmeiTheme.theme.extend,
      // shadows nativos via shadow color helpers do nativewind:
      // o stamp shadow vai ser aplicado por componente via boxShadow nativo no iOS
      // e elevation no Android (ver components/StampCard.tsx)
    }
  }
};
