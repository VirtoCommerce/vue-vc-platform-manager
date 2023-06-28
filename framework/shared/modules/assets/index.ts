import { createAppModule } from "../../../core/plugins/modularity";
import * as components from "./components";
import * as locales from "./locales";

// Declare globally
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    AssetsDetails: (typeof components)["AssetsDetails"];
  }
}

export const AssetsDetailsModule = createAppModule(components, locales);

export * from "./components";
