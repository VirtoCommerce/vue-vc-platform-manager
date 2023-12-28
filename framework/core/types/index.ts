import { Component, ComponentPublicInstance, ComputedRef, Ref } from "vue";
import { BladeInstanceConstructor, CoreBladeExposed, ExtractedBladeOptions } from "./../../shared";
import { ComponentPublicInstanceConstructor } from "../../shared/utilities/vueUtils";

// Type instead of interface here is workaround for:
// https://github.com/microsoft/TypeScript/issues/15300
// (index signature is missing for interfaces in Typescript,
// i.e. interface N { key: value } can't be casted to Record<TKey,TValue>
// while it satisfies requirements
export type IValidationRules = {
  required?: boolean;
  numeric?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  regex?: RegExp;
  min_value?: number;
  max_value?: number;
  maxdimensions?: [string | number, string | number];
  size?: number;
  alpha?: boolean;
  alpha_dash?: boolean;
  alpha_num?: boolean;
  alpha_spaces?: boolean;
  between?: [number, number] | { min: number; max: number };
  confirmed?: `@${string}`;
  digits?: number;
  dimensions?: [number, number] | { width: number; height: number };
  not_one_of?: [number, number];
  ext?: string[];
  image?: boolean;
  integer?: boolean;
  is?: string;
  is_not?: string;
  length?: number;
  mimes?: string[];
  one_of?: number[];
  url?: string;
  mindimensions?: [number, number] | { width: number; height: number };
  fileWeight?: number;
  before?: `@${string}`;
  after?: `@${string}`;
  bigint?: boolean;
};

export interface IBladeDropdownItem {
  id: string;
  title: string;
  icon?: string;
  clickHandler?(): void;
}

export interface BladeMenu<T extends Component = Component> {
  title?: string | Ref<string>;
  icon?: string;
  isVisible?: boolean | Ref<boolean>;
  component?: BladeInstanceConstructor<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickHandler?(app?: Record<string, any> | CoreBladeExposed | null): void;
  children?: BladeMenu<T>[];
  options?: ExtractedBladeOptions<InstanceType<BladeInstanceConstructor<T>>["$props"], "options">;
}

export interface IBladeToolbar<T extends ComponentPublicInstance = ComponentPublicInstance> {
  id?: string;
  icon?: string | (() => string);
  isAccent?: boolean | ComputedRef<boolean>;
  component?: ComponentPublicInstanceConstructor<T>;
  disabled?: boolean | ComputedRef<boolean | undefined>;
  dropdownItems?: IBladeDropdownItem[];
  options?: InstanceType<ComponentPublicInstanceConstructor<T>>["$props"];
  title?: string | Ref<string>;
  isVisible?: boolean | Ref<boolean | undefined> | ComputedRef<boolean | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickHandler?(app?: Record<string, any> | CoreBladeExposed | null): void;
}

export type ToolbarMenu<T> = T extends {
  component?: infer C extends ComponentPublicInstanceConstructor;
}
  ? {
      component?: C;
      options?: InstanceType<C>["$props"];
    } & IBladeToolbar
  : T & { component?: ComponentPublicInstanceConstructor };

export type NotificationTemplateConstructor = ComponentPublicInstanceConstructor & {
  notifyType: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IActionBuilderResult<T = {}> {
  icon: string;
  title: string | Ref<string>;
  variant: string;
  leftActions?: boolean;
  clickHandler(item?: T): void;
}

export interface AssetsHandler<T extends ICommonAsset> {
  loading?: Ref<boolean>;
  upload?: (files: FileList, startingSortOrder?: number) => Promise<T[]>;
  edit?: (files: T[]) => T[];
  remove?: (files: T[]) => T[];
}

export interface ICommonAsset {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  sortOrder?: number;
  title?: string | undefined;
  name?: string | undefined;
  url?: string | undefined;
  readableSize?: string;
  relativeUrl?: string;
  description?: string;
  modifiedDate?: Date;
  id?: string;
  altText?: string;
  typeId?: string;
  size?: number;
  createdDate?: Date;
}

export interface RequestPasswordResult {
  succeeded: boolean;
  error?: string;
  errorCode?: string;
}

export type ITableColumns = {
  id: string;
  title: string | ComputedRef<string>;
  width?: number | string;
  field?: string;
  alwaysVisible?: boolean;
  type?: "money" | "date-ago" | "date" | "time" | "date-time" | "image" | "status" | "status-icon" | "number" | "link";
  sortable?: boolean;
  class?: string;
  format?: string;
  align?: "start" | "end" | "center" | "between" | "around" | "evenly";
  visible?: boolean;
};

export interface MenuItem {
  icon: string;
  id: number;
  priority: number;
  routeId: string;
  title: ComputedRef<string> | string;
  url: string;
  groupId?: string;
  children: MenuItem[];
}
