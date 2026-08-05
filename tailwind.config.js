import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            colors: {
                ink: "#1B2E28", // deep forest-ink, dark sections / footer / nav
                ivory: "#F7F3EA", // primary light background
                brass: "#B08D57", // signature metallic accent — links, tags, focus rings
                "brass-dark": "#8C6E41",
                burgundy: "#6E2B34", // used sparingly — primary CTA fill
                sage: "#7C8B7A", // secondary/muted text and borders on light bg
                hairline: "#E7E0D2", // divider lines on ivory
                charcoal: "#23241F", // body text on ivory
            },
            fontFamily: {
                // sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                display: ["Fraunces", "ui-serif", "Georgia", "serif"],
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
            },
            borderRadius: {
                tag: "14px",
            },
        },
    },

    // plugins: [forms],
    plugins: [require("@tailwindcss/forms")],
};
