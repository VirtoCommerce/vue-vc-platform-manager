import typescript from "@rollup/plugin-typescript";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import { loadEnv, ProxyOptions } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import checker from "vite-plugin-checker";

// Get actual package version from package.json
const packageJson = fs.readFileSync(process.cwd() + "/package.json");
const version = JSON.parse(packageJson.toString()).version || 0;

// Build configuration for the application
const mode = process.env.APP_ENV as string;
process.env = {
  ...process.env,
  ...loadEnv(mode, process.cwd(), "APP_"),
};
const TSCONFIG = process.cwd() + "/tsconfig.json";
const TSCONFIG_BUILD = process.cwd() + "/tsconfig.build.json";
const tsconfigFile = mode === "production" ? TSCONFIG_BUILD : TSCONFIG;

const isMonorepo = fs.existsSync(path.resolve(__dirname, "./../../framework/package.json"));

// "Not so smart" override: https://github.com/bevacqua/dragula/issues/602#issuecomment-912863804
const _define: { global?: unknown } = {};
if (mode !== "production") {
  _define.global = {};
}

const getProxy = (target: ProxyOptions["target"], options: Omit<ProxyOptions, "target"> = {}): ProxyOptions => {
  const dontTrustSelfSignedCertificate = false;
  return {
    target,
    changeOrigin: true,
    secure: dontTrustSelfSignedCertificate,
    ...options,
  };
};

const aliasResolver = () => {
  if (isMonorepo) {
    if (mode === "development") {
      return {
        "@vc-shell/framework/dist/style.css": "@vc-shell/framework/dist/style.css",
        "@vc-shell/framework": "@vc-shell/framework/index.ts",
      };
    }
    return {};
  } else {
    if (mode === "development") {
      return {
        "@vc-shell/framework/dist/style.css": "@vc-shell/framework/dist/style.css",
        "vue-router": "vue-router/dist/vue-router.cjs.js",
        "vee-validate": "vee-validate/dist/vee-validate.js",
      };
    } else {
      return {};
    }
  }
};

export default {
  plugins: [
    mkcert({ hosts: ["localhost", "127.0.0.1"] }),
    vue(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Vendor Portal",
        theme_color: "#319ED4",
        display: "fullscreen",
        start_url: "/index.html",
        icons: [
          {
            src: "./img/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./img/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./img/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
    checker({
      vueTsc: true,
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: aliasResolver(),
  },
  base: process.env.APP_BASE_PATH,
  mode,
  envPrefix: "APP_",
  define: {
    ..._define,

    "import.meta.env.PACKAGE_VERSION": `"${version}"`,
    "import.meta.env.APP_PLATFORM_URL": `"${process.env.APP_PLATFORM_URL}"`,
    "import.meta.env.APP_LOG_ENABLED": `"${process.env.APP_LOG_ENABLED}"`,
    "import.meta.env.APP_LOG_LEVEL": `"${process.env.APP_LOG_LEVEL}"`,
    "import.meta.env.APP_BASE_PATH": `"${process.env.APP_BASE_PATH}"`,

    // https://vue-i18n.intlify.dev/guide/advanced/optimization.html#reduce-bundle-size-with-feature-build-flags
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
  },
  server: {
    watch: {
      ignored: ["!**/node_modules/@vc-shell/**"],
    },
    host: "0.0.0.0",
    port: 8080,
    https: true,
    proxy: {
      "/api": getProxy(`${process.env.APP_PLATFORM_URL}`),
      "/connect/token": getProxy(`${process.env.APP_PLATFORM_URL}`),
      "/pushNotificationHub": getProxy(`${process.env.APP_PLATFORM_URL}`),
      "^/pushNotificationHub": getProxy(`${process.env.APP_PLATFORM_URL}`, {
        ws: true,
      }),
      "/Modules": getProxy(`${process.env.APP_PLATFORM_URL}`),
    },
  },
  optimizeDeps: {
    include: mode === "development" ? ["ace-builds", "client-oauth2", "vee-validate"] : [],
    esbuildOptions: {
      target: ["es2020", "safari14"],
    },
  },
  build: {
    target: "esnext",
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      plugins: [
        typescript({
          tsconfig: tsconfigFile,
        }),
      ],
    },
  },
};
