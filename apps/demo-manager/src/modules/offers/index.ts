import { App } from "vue";
import * as pages from "./pages";
import * as locales from "./locales";
import { useBlade } from "@virtoshell/core";

export default {
  install(app: App): void {
    const { registerBlade } = useBlade();

    // Register exported pages
    Object.entries(pages).forEach(([componentName, component]) => {
      app.component(componentName, component);
    });

    // Setup routing
    registerBlade({
      name: "offers-list",
      url: "offers",
      component: pages.OffersList,
    });
    registerBlade({
      name: "offers-details",
      url: "offer/:id",
      component: pages.OffersDetails,
    });

    // Load locales
    Object.entries(locales).forEach(([key, message]) => {
      app.config.globalProperties.$mergeLocaleMessage(key, message);
    });
  },
};

export * from "./pages";
