/** @type {import('tailwindcss').Config} */

import * as daisyui from "daisyui";
import * as themes from "daisyui/src/theming/themes";
import { COLORS } from "./src/styles/constants";

import pSBCLib from "shade-blend-color";

const pSBC = pSBCLib.default;

export const PALETTE = {};

const darkOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50);
const lightOffsets = Array.from({ length: 9 }, (_, i) => (i + 1) * 50 + 500);

Object.entries(COLORS).forEach((value) => {
  const [key, color] = value;

  PALETTE[key] = [
    ...darkOffsets.map((offset) => [offset, pSBC(offset / 2000, color, "#000000")]),
    ...lightOffsets.map((offset) => [offset, pSBC(-offset / 3500, color, "#ffffff")]),
  ].reduce((acc, [offset, color]) => { acc[offset] = color; return acc; }, { DEFAULT: color });

});

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: PALETTE,
      fontSize: {
        "2xs": ".55rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          background: COLORS.tertiary,
          ...themes.default.dark,
          ...COLORS,
        },
      },
    ],

    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
