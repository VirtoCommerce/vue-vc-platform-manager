import { Component, ComponentPublicInstance, ComputedRef } from "vue";

// Type instead of interface here is workaround for:
// https://github.com/microsoft/TypeScript/issues/15300
// (index signature is missing for interfaces in Typescript,
// i.e. interface N { key: value } can't be casted to Record<TKey,TValue>
// while it satisfies requirements
export type IValidationRules = {
  required?: boolean;
  numberic?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  regex?: RegExp;
  min_value?: number;
  max_value: number;
  after?: string;
  maxdimensions?: [string | number, string | number];
  size?: number;
};

export interface IComponent extends ComponentPublicInstance {
  openDashboard(): void;
}

export interface IBladeToolbar {
  id?: string;
  icon?: string;
  title?: string | ComputedRef<string>;
  isVisible?: boolean | unknown;
  isAccent?: boolean | ComputedRef<boolean>;
  component?: Component & { url?: string };
  componentOptions?: Record<string, unknown> | unknown;
  disabled?: boolean | ComputedRef<boolean>;
  dropdownItems?: IBladeDropdownItem[];
  clickHandler?(): void;
}

export interface IBladeDropdownItem {
  id: number;
  title: string;
  icon?: string;
  clickHandler?(): void;
}

export interface IMenuItems extends IBladeToolbar {
  clickHandler?(app?: IComponent): void;
  componentOptions?: Record<string, unknown> | unknown;
  children?: IMenuItems[];
}

export interface IPage {
  component: Component | unknown;
  componentOptions?: Record<string, unknown> | unknown;
  permissions?: string[];
  url?: string;
  param?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface IActionBuilderResult {
  icon: string;
  title: string;
  variant: string;
  leftActions?: boolean;
  clickHandler(): void;
}

export interface IImage {
  sortOrder?: number;
}