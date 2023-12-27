import vue from "@vitejs/plugin-vue";
import { getLibraryConfiguration } from "@vc-shell/config-generator";
import * as path from "path";
import { checker } from "vite-plugin-checker";

const mode = process.env.APP_ENV as string;

export default getLibraryConfiguration({
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
  ],
  build: {
    minify: false,
    target: "esnext",
    cssCodeSplit: true,
    sourcemap: mode === "development",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "vue-router",
        "vee-validate",
        "@vc-shell/config-generator",
        "@vc-shell/framework",
        "vue-i18n",
        "lodash-es",
      ],
    },
  },
  envPrefix: "APP_",
  optimizeDeps: {
    esbuildOptions: {
      target: ["es2020", "safari14"],
    },
  },
});