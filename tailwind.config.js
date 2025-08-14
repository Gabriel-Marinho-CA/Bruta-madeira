/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.liquid",             
    "./**/*.liquid"],
  theme: {
    screens: {
      xxl: { max: "1366px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      min_lg: { min: "1023px" },
      min_md: {min:'768px'}
    },
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        sans: [
          'area-regular', 
          'system-ui', 
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        black: [
          'area-bold',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        primary: "#CE4D35",
        'custom-black': "#303030",
      },
      container: {
        center: true,
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1279px",
          xl: "1366px",
        },
      },
      boxShadow: {
        xxl: '0px 6px 20px 0px #00000029',
        banner: `0px 2px 2px 0px rgba(60, 55, 56, 0.07),
        0px 0px 1px 0px rgba(60, 55, 56, 0.07),
        0px 0px 0px 1px rgba(60, 55, 56, 0.07)`
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        countdown: {
          '0%, 100%': { backgroundColor: '#CE4D35' },
          '50%': { backgroundColor: '#000000' }, 
        },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        countdown: 'countdown 1s step-start infinite',
      },
    },
  },
  plugins: [],
};
