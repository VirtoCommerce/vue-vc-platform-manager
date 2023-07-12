import {
  computed,
  ref,
  unref,
  watch,
  Ref,
  ComponentPublicInstance,
  getCurrentInstance,
  markRaw,
  inject,
  nextTick,
} from "vue";
import * as _ from "lodash-es";
import { useRouter, RouteLocationNormalized } from "vue-router";
import { usePermissions } from "../../../../../core/composables";
import {
  IBladeContainer,
  IBladeRef,
  IBladeEvent,
  IParentCallArgs,
  BladeConstructor,
  BladeComponentInternalInstance,
  BladeNavigationPlugin,
  notification,
  BladePageComponent,
} from "../../../..";
import { bladeNavigationInstance } from "./../../plugin";
import pattern from "url-pattern";
import { useLocalStorage } from "@vueuse/core";

interface BladeData {
  blade?: string;
  param?: string;
  options?: string;
}
interface IUseBladeNavigation {
  readonly blades: Ref<IBladeContainer[]>;
  readonly workspaceOptions: Ref<Record<string, unknown>>;
  readonly workspaceParam: Ref<string>;
  readonly lastBladeData: Ref<BladeData>;
  bladesRefs: Ref<IBladeRef[]>;
  activeBlade: Ref<IBladeContainer>;
  openBlade: <Blade extends ComponentPublicInstance = ComponentPublicInstance>(
    { blade, param, options, onOpen, onClose }: IBladeEvent<Blade>,
    isWorkspace?: boolean
  ) => void;
  closeBlade: (index: number) => Promise<boolean>;
  onParentCall: (index: number, args: IParentCallArgs) => void;
  /**
   * Resolves blades from vue-router's navigation guard 'to' param. Used to display blades after page reload or accessing via direct link.
   * Returns a string containing the URL of the latest opened workspace.
   * @param to
   * @returns string
   */
  resolveBlades: (to: RouteLocationNormalized) => string;
  resolveLastBlade: (pages: BladePageComponent[]) => void;
  resolveUnknownRoutes: (to: RouteLocationNormalized) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workspaceOptions: Ref<Record<string, any>> = ref();
const workspaceParam: Ref<string> = ref();
const activeBlade = ref();
const lastBladeData = useLocalStorage<BladeData>("VC_BLADE_DATA", {});

export function useBladeNavigation(): IUseBladeNavigation {
  const router = useRouter();
  const urlPattern = new pattern("(/:workspace(/:blade(/:param)))");
  const { checkPermission } = usePermissions();
  const isPrevented = ref(false);
  const routes = router.getRoutes();

  const instance: BladeComponentInternalInstance = getCurrentInstance();
  const navigationInstance =
    (instance && inject<BladeNavigationPlugin>("bladeNavigationPlugin")) || bladeNavigationInstance;

  watch(
    navigationInstance?.blades,
    (newVal) => {
      if (newVal) {
        const workspace = navigationInstance.bladesRefs.value[0]?.blade;
        const lastBlade = newVal[newVal.length - 1];

        if (workspace && workspace.blade.url) {
          if (lastBlade && lastBlade.blade.url) {
            const url = urlPattern.stringify({
              workspace: workspace?.blade.url.substring(1),
              blade: lastBlade?.blade.url.substring(1),
              param: lastBlade?.param,
            });

            addEntryToLocation(url);
          } else {
            const url = workspace?.blade.url;
            if (url) {
              clearParentData();
              addEntryToLocation(url);
            }
          }
        }
      }
    },
    { deep: true }
  );

  async function openWorkspace({ blade, param, options }: IBladeEvent) {
    await closeBlade(0);

    const bladeComponent = unref(blade);

    if (!isPrevented.value) {
      workspaceOptions.value = unref(options);
      workspaceParam.value = unref(param);

      await router.replace(bladeComponent.url);
    }
  }

  async function openBlade<Blade extends ComponentPublicInstance>(
    { blade, param, options, onOpen, onClose }: IBladeEvent<Blade>,
    isWorkspace = false
  ) {
    if (isWorkspace) {
      openWorkspace({ blade, param, options });
      return;
    }

    // caller blade component
    const instanceComponent =
      navigationInstance.bladesRefs.value.find((item) => item.active)?.blade?.blade ??
      (instance && instance.vnode.type);

    if (instanceComponent) {
      // Caller blade index in blades array
      const callerIndex = navigationInstance.bladesRefs.value.findIndex((item) => {
        return _.isEqual(item.blade.blade, instanceComponent);
      });

      // Trying to determine if the calling blade already has a child in order to replace it
      const isBladeAlreadyExist =
        callerIndex >= 0 ? navigationInstance.bladesRefs.value[callerIndex + 1]?.blade.blade : undefined;

      // Blade we want to open
      const bladeComponent = unref(blade);

      // Check if caller blade has idx
      const index = instanceComponent?.idx ? instanceComponent.idx : 0;

      if (isBladeAlreadyExist === undefined) {
        bladeComponent.idx = index ? index + 1 : 1;
      } else if (isBladeAlreadyExist) {
        await closeBlade(
          navigationInstance.blades.value.findIndex((x: IBladeContainer) => x.idx === isBladeAlreadyExist.idx)
        );
        bladeComponent.idx = isBladeAlreadyExist.idx;
      }
      if (!isPrevented.value) {
        await addBlade(bladeComponent, param, options, onOpen, onClose, index);
      }
    }
  }

  async function closeBlade(index: number) {
    console.debug(`[@vc-shell/framework#useBladeNavigation] - closeBlade called.`);
    const refsIndex = index + 1;

    if (refsIndex < navigationInstance.bladesRefs.value.length) {
      const children = navigationInstance.bladesRefs.value.slice(refsIndex).reverse();

      isPrevented.value = false;
      for (let i = 0; i < children.length; i++) {
        if (children[i]?.exposed.onBeforeClose && typeof children[i].exposed.onBeforeClose === "function") {
          const result = await children[i].exposed.onBeforeClose();
          if (result === false) {
            isPrevented.value = true;
            console.debug(`[@vc-shell/framework#useBladeNavigation] - Navigation is prevented`);
            return isPrevented.value;
          }
        }
      }
      if (!isPrevented.value) {
        const blade = navigationInstance.blades.value[index];
        if (typeof blade?.onClose === "function") {
          blade?.onClose?.();
        }

        navigationInstance.blades.value.splice(index);
      }
    }
  }

  async function addBlade(
    blade: BladeConstructor,
    param: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>,
    onOpen: () => void,
    onClose: () => void,
    index?: number
  ) {
    if (index && navigationInstance.blades.value.length > index) {
      await closeBlade(index);
    }

    if (blade && checkPermission(blade.permissions)) {
      navigationInstance.blades.value.push({
        blade: markRaw(blade),
        options,
        param,
        onOpen,
        onClose,
        idx: blade.idx,
      });

      if (onOpen && typeof onOpen === "function") {
        onOpen();
      }
    } else {
      notification.error("Access restricted", {
        timeout: 3000,
      });
    }
  }

  async function onParentCall(index: number, args: IParentCallArgs) {
    console.debug(`vc-app#onParentCall(${index}, { method: ${args.method} }) called.`);

    if (index >= 0) {
      const currentParent = unref(navigationInstance.bladesRefs.value[index]);

      if (currentParent) {
        if (args.method && typeof currentParent.exposed[args.method] === "function") {
          const method = currentParent.exposed[args.method] as (args: unknown) => Promise<unknown>;
          const result = await method(args.args);
          if (typeof args.callback === "function") {
            args.callback(result);
          }
        } else {
          console.error(`No such method: ${args.method}.`);
        }
      }
    }
  }

  function addEntryToLocation(params: string) {
    history.replaceState({}, null, "#" + params);
  }

  async function clearParentData() {
    nextTick(() => {
      workspaceOptions.value = undefined;
      workspaceParam.value = undefined;
    });
  }

  function resolveBlades(to: RouteLocationNormalized) {
    const data = urlPattern.match(to.path);

    const resolvedRoute = (bladeUrl: string) => routes.find((r) => r.path === "/" + bladeUrl);

    if (resolvedRoute(data?.workspace) && to.path !== "/" + data.workspace) {
      if (resolvedRoute(data?.blade)) {
        lastBladeData.value = {
          blade: "/" + data?.blade,
          param: data?.param,
        };
      }

      return "/" + data.workspace;
    }
  }

  function resolveUnknownRoutes(to: RouteLocationNormalized) {
    if (routes.find((r) => r.path !== to.path)) {
      closeBlade(0);
      return "/";
    }
  }

  function clearSavedBladeData() {
    lastBladeData.value = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setParentData({ param, options }: { param?: string; options?: Record<string, any> }) {
    workspaceOptions.value = options;
    workspaceParam.value = param;
  }

  function resolveLastBlade(pages: BladePageComponent[]) {
    if (lastBladeData.value?.blade) {
      const blade = pages?.find((b) => b.url === lastBladeData.value?.blade);
      setParentData({ param: lastBladeData.value?.param });
      openBlade({ blade, param: lastBladeData.value?.param });
      clearSavedBladeData();
    }
  }

  return {
    blades: computed(() => navigationInstance.blades.value),
    workspaceOptions: computed(() => workspaceOptions.value),
    workspaceParam: computed(() => workspaceParam.value),
    lastBladeData: computed(() => lastBladeData.value),
    activeBlade,
    bladesRefs: navigationInstance.bladesRefs,
    openBlade,
    closeBlade,
    onParentCall,
    resolveBlades,
    resolveUnknownRoutes,
    resolveLastBlade,
  };
}