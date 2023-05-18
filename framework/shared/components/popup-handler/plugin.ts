import { App, shallowReactive } from "vue";
import * as components from "./components";
import { PopupPlugin, UsePopupProps, UsePopupInternal } from "./types";
import { createModule } from "./../../../core/plugins";

export let popupPluginInstance;

export const VcPopupHandler = {
  install(app: App) {
    // Register components
    createModule(components).install(app);

    // Plugin
    const popups = shallowReactive<(UsePopupProps<unknown> & UsePopupInternal)[]>([]);

    const popupPlugin: PopupPlugin = {
      popups,
    };

    app.config.globalProperties.$popupPlugin = popupPlugin;
    app.provide("popupPlugin", popupPlugin);
    popupPluginInstance = popupPlugin;
  },
};
