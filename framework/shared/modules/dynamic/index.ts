/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "vue-router";
import * as pages from "./pages";
import { App, Component, DefineComponent, defineComponent } from "vue";
import { useDynamicMenu } from "./composables";
import { DynamicSchema, OverridesSchema } from "./types";
import * as _ from "lodash-es";
import { handleOverrides } from "./helpers/override";
import { reactiveComputed } from "@vueuse/core";
import { kebabToPascal } from "../../../core/utilities";
import { BladeConstructor } from "../../index";
import { createAppModule } from "../../../core/plugins";

interface Registered {
  component: BladeConstructor;
  name: string;
  model: DynamicSchema;
}

const { createMenuItem } = useDynamicMenu();

const createAppModuleWrapper = (args: {
  bladeName: string;
  bladeComponent: BladeConstructor;
  appModuleContent: {
    locales?: { [key: string]: object };
    notificationTemplates?: { [key: string]: Component };
    moduleComponents?: { [key: string]: Component };
  };
}) => {
  const { bladeName, bladeComponent, appModuleContent } = args;
  return createAppModule(
    { [bladeName]: bladeComponent },
    appModuleContent?.locales,
    appModuleContent?.notificationTemplates,
    appModuleContent?.moduleComponents
  );
};

const register = (
  args: {
    app: App;
    component: BladeConstructor;
    composables: any;
    json: DynamicSchema;
    options?: { router: Router };
  },
  appModuleContent: {
    locales?: { [key: string]: object };
    notificationTemplates?: { [key: string]: Component };
    moduleComponents?: { [key: string]: Component };
  }
): Registered => {
  const { app, component, json, options } = args;
  const bladeComponent = _.cloneDeep(component);
  let rawUrl: `/${string}`;

  const bladeName = kebabToPascal(json.settings.name);

  if (json.settings.url) {
    rawUrl = json.settings.url as `/${string}`;
    bladeComponent.url = rawUrl;
  }

  if (json.settings.permissions) {
    bladeComponent.permissions = json.settings.permissions;
  }

  const defineBladeComponent = defineComponent({
    ...bladeComponent,
    name: bladeName,
    setup: (props, ctx) =>
      (bladeComponent as DefineComponent).setup(
        reactiveComputed(() => ({
          ...props,
          model: json,
          composables: args.composables,
        })),
        reactiveComputed(() => ctx)
      ),
  });

  const module = createAppModuleWrapper({
    bladeName,
    bladeComponent: defineBladeComponent,
    appModuleContent,
  });

  module.install(app, options);

  return {
    component: defineBladeComponent,
    name: bladeName,
    model: json,
  };
};

const handleError = (errorKey: string, schema: { [key: string]: DynamicSchema }, text?: string) => {
  console.error(
    `Module initialization aborted. '${errorKey}' key not found in files: ${Object.keys(schema).join(
      ", "
    )}. '${errorKey}' key ${text}`
  );
};

export const createDynamicAppModule = (args: {
  schema: { [key: string]: DynamicSchema };
  composables: any;
  overrides?: OverridesSchema;
  moduleComponents?: { [key: string]: Component };
  locales?: { [key: string]: object };
  notificationTemplates?: { [key: string]: Component };
}) => {
  const moduleInitializer = _.findKey(args.schema, (o) => "moduleName" in o.settings && o.settings.moduleName);
  const everyHasModel = _.every(Object.values(args.schema), (o) => o.settings.model);

  if (!everyHasModel) handleError("model", args.schema, "must be included in 'settings' of every file");
  if (!moduleInitializer)
    handleError("moduleName", args.schema, "must be included in one of this files to initialize the module");

  if (moduleInitializer && everyHasModel) {
    let schemaCopy = _.cloneDeep({ ...args.schema });

    if (args.overrides) {
      schemaCopy = handleOverrides(args.overrides, schemaCopy);
    }

    return {
      install(app: App, options: { router }) {
        const bladePages = { ...pages };
        const appModuleContent = {
          locales: args?.locales,
          notificationTemplates: args?.notificationTemplates,
          moduleComponents: args?.moduleComponents,
        };
        Object.entries(schemaCopy).forEach(([JsonName, JsonSchema], index) => {
          const blade = register(
            {
              app,
              component: bladePages[JsonSchema.settings.model],
              composables: { ...args.composables },
              json: JsonSchema,
              options,
            },
            index === 0 ? appModuleContent : undefined
          );

          if (!blade) {
            return;
          }

          if (JsonName === moduleInitializer) {
            if (blade.name) {
              createMenuItem(blade.component, blade.model);
            }
          }
        });
      },
    };
  }
};

export * from "./pages";
export * from "./composables";
export * from "./components";
export * from "./factories";
export * from "./types";