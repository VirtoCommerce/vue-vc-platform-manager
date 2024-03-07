import VirtoShellFramework, { notification, useUser, useLanguages } from "@vc-shell/framework";
import { createApp } from "vue";
import { router } from "./router";
import * as locales from "./locales";
import { RouterView } from "vue-router";
import modules from "@vc-app/modules";
import { bootstrap } from "./bootstrap";

// Load required CSS
import "./styles/index.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@vc-shell/framework/dist/index.css";

async function startApp() {
  const { loadUser } = useUser();

  await loadUser();

  const { currentLocale, setLocale } = useLanguages();

  const app = createApp(RouterView);
  app.use(VirtoShellFramework, {
    router,
    platformUrl: import.meta.env.APP_PLATFORM_URL,
    i18n: {
      locale: import.meta.env.APP_I18N_LOCALE,
      fallbackLocale: import.meta.env.APP_I18N_FALLBACK_LOCALE,
    },
  });

  // Initialize dynamic views module
  app.use(modules.Offers.default, { router });

  // Initialize classic views module
  app.use(modules.OffersClassic.default, { router });

  app.use(router);

  bootstrap(app);

  Object.entries(locales).forEach(([key, message]) => {
    app.config.globalProperties.$mergeLocaleMessage(key, message);
  });

  setLocale(currentLocale.value);

  // Global error handler
  app.config.errorHandler = (err) => {
    notification.error((err as Error).toString(), {
      timeout: 5000,
    });
  };

  await router.isReady();

  app.mount("#app");
}

startApp();