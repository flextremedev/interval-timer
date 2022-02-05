const plugin = require('tailwindcss/plugin');

const notLast = plugin(({ addVariant, e }) => {
  addVariant('not-last', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      const element = e(`not-last${separator}${className}`);
      return `.${element} > :not(:last-child)`;
    });
  });
});

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [notLast],
};
