/** @type {import('tailwindcss').Config} */

import lineClamp from "tailwindcss-line-clamp";
import tailwindScrollbar from "tailwind-scrollbar";

export const content = ["./src/**/*.{js,jsx,ts,tsx}"];
export const theme = {
  extend: {
    fontFamily: {
      outfit: ["Outfit", "sans‑serif"],
      /* o remplazá la sans por defecto */
      sans: ["Outfit", "ui-sans-serif", "system-ui"],
    },
  },
};
export const plugins = [
  lineClamp,
  tailwindScrollbar({ nocompatible: true }), // <-- variante moderna
  // o require("tailwind-scrollbar-hide") para solo hide
];
