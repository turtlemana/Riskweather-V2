/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        1320: "82.5rem",
        406: "406px",
      },
      maxWidth: {
        1320: "82.5rem",
      },
      borderRadius: {
        20: "20px",
      },
      screens: {
        'w-800': '800px',
        laptop: { min: "0", max: "1024px" },
        desktop: { min: "1024px", max: "1320px" },
      },
      backgroundImage: {
        backgroundColor:
          "linear-gradient(88.83deg, rgba(1, 72, 255, 0.4) 11.32%, rgba(1, 152, 255, 0) 80.03%)",
        background: "url('../assets/images/main/background.png')",
        backgroundLearn: "url('../assets/images/learn/background.png')",
        backgroundMembership:
          "url('../assets/images/membership/background.svg')",
      },
      colors: {
        "blue-rgba": "rgba(1, 152, 255, 0.05)",
        "gray-rgba": "rgba(17, 17, 17, 0.5);",
        "light-gray-rgba": "rgba(0, 0, 0, 0.2)",
        "mapBg": "#AFD5F0",
        "chart1": "#3366E6",
        "chart2": "#FF6633",
        "chart3": "#FF33FF",
        "chart4": "#FFFF99",
        "chart5": "#00B3E6",
        "chart6": "#E6B333",
        "chart7": "#FFB399",
        "chart8": "#999966",
        "chart9": "#99FF99",
        "chart10": "#B34D4D",
      },
      translate: {
        half: "-50%",
      },
    },
  },
  plugins: [],
};

export { };
