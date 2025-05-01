module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          spotifyPink: "#ED0068",
          spotifyRose: "#D84278",
        },
        backgroundImage: {
          'main-gradient': "linear-gradient(to right, #ED0068, #D84278)",
          'bg-gradient': "linear-gradient(to bottom, #000000, #000428)",
        },
      },
    },
    plugins: [],
  }
  