module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lodash-es)(?!@ckeditor/*)(?!ckeditor5/*)", // transform all ckeditor dependencies
    "\\.pnp\\.[^\\/]+$",
    "/node_modules/(?!@ag-grid-community/vue3)", // https://www.ag-grid.com/vue-data-grid/testing/
    "/node_modules/(?!ag-grid-vue3)",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>src/utils/__mocks__/styleMock.js",
  },
  collectCoverage: true,
  testEnvironment: "jsdom",
  setupFiles: ["jest-canvas-mock"],
  collectCoverageFrom: ["src/**/*.{js,vue,ts}", "!src/main.js"],
  modulePathIgnorePatterns: [
    "src/main.ts",
    "src/store/index.ts",
    "protectedRoute.ts",
    "shims-vue.d.ts",
    "/node_modules/",
  ],
  verbose: true,
};
