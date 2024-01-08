import { Router } from "vue-router";
import { App, inject } from "vue";
import * as components from "./components";
import { BladeNavigationPlugin, BladeRoutesRecord } from "./types";

// Declare globally
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    VcBladeNavigation: (typeof components)["VcBladeNavigation"];
  }
}

export let bladeNavigationInstance: BladeNavigationPlugin;

export const VcBladeNavigationComponent = {
  install(app: App, args: { router: Router }) {
    // Register components
    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component);
    });

    const internalRoutes = app.runWithContext(() => inject("bladeRoutes")) as BladeRoutesRecord[];

    // Plugin
    const bladeNavigationPlugin: BladeNavigationPlugin = {
      router: args.router,
      internalRoutes,
    };

    app.config.globalProperties.$bladeNavigationPlugin = bladeNavigationPlugin;
    app.provide("bladeNavigationPlugin", bladeNavigationPlugin);
    bladeNavigationInstance = bladeNavigationPlugin;
  },
};
