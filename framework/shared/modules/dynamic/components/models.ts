/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VcButton,
  VcCard,
  VcCheckbox,
  VcDynamicProperty,
  VcEditor,
  VcGallery,
  VcInput,
  VcInputCurrency,
  VcSelect,
} from "../../../../ui/components";
import { Raw } from "vue";
import type { ComponentProps, ComponentEmit, ComponentSlots } from "vue-component-type-helpers";

type FromGenericEventsToProps<T extends Record<string, any>> = T extends Record<string, any>
  ? {
      [K in string & `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
        ? (...args: T[Uncapitalize<C>]) => any
        : never;
    }
  : never;

interface FieldOpts<T> {
  component?: ComponentType<T>;
  id?: string | number;
  props?: Record<string, any>;
}

export type ComponentType<T> = Raw<T>;

export type FormFields = {
  [key: string]: ControlType & IFieldset;
};

export type ControlType =
  | ISelectField
  | IInputField
  | ICardCollection
  | IEditorField
  | IGallery
  | IDynamicProperties
  | ICheckbox
  | IButton
  | IInputCurrency;

export type ControlTypeWithSlots = Extract<ControlType, ISelectField | ICardCollection | ICheckbox | IButton>;
export type ControlTypeCtr = Extract<ControlType, ISelectField | IInputField | IInputCurrency | IEditorField>;

export interface IControlBaseProps {
  key?: string | number | symbol;
  rules?: string | Record<string, unknown>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  classNames?: string;
  modelValue?: any;
  tooltip?: string;
  "onUpdate:modelValue"?: (event: any) => void;
  multilanguage?: boolean;
}

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export interface IControlBaseOptions {
  visibility?:
    | {
        method?: string;
      }
    | boolean;
  noValidation?: boolean;
}

export type ISelectField = {
  props: ComponentProps<typeof VcSelect> | IControlBaseProps;
  slots?: Partial<ComponentSlots<typeof VcSelect>>;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcSelect>;

export type IInputField = {
  props: ComponentProps<typeof VcInput> | IControlBaseProps;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcInput>;

export type IInputCurrency = {
  props: Partial<ComponentProps<typeof VcInputCurrency>> | IControlBaseProps;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcInputCurrency>;

export type ICardCollection = {
  props: ComponentProps<typeof VcCard> | IControlBaseProps;
  options: IControlBaseOptions;
  slots?: Partial<Pick<ComponentSlots<typeof VcCard>, "default" | "actions">>;
} & FieldOpts<typeof VcCard>;

export type ICheckbox = {
  props: ComponentProps<typeof VcCheckbox> | IControlBaseProps;
  options: IControlBaseOptions;
  slots?: Partial<Pick<ComponentSlots<typeof VcCheckbox>, "default" | "error">>;
} & FieldOpts<typeof VcCheckbox>;

export type IDynamicProperties = {
  props:
    | (ComponentProps<typeof VcDynamicProperty> & FromGenericEventsToProps<ComponentEmit<typeof VcDynamicProperty>>)
    | IControlBaseProps;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcDynamicProperty>;

export type IEditorField = {
  props: ComponentProps<typeof VcEditor> | IControlBaseProps;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcEditor>;

export type IGallery = {
  props: ComponentProps<typeof VcGallery> | IControlBaseProps;
  options: IControlBaseOptions;
} & FieldOpts<typeof VcGallery>;

export type IButton = {
  props: ComponentProps<typeof VcButton>;
  options: IControlBaseOptions;
  slots?: Partial<Pick<ComponentSlots<typeof VcButton>, "default">>;
} & FieldOpts<typeof VcButton>;

export type IFieldset = {
  columns?: number;
  property?: string;
  remove?: { method?: string };
  fields?: ControlType[];
};

export interface GeneratedModel {
  children?: GeneratedModel[];
  component: ControlType["component"];
  id: number | string;
  options: IControlBaseOptions;
  props: (
    | ISelectField
    | IInputField
    | ICardCollection
    | IEditorField
    | IGallery
    | IDynamicProperties
    | ICheckbox
    | IButton
    | IInputCurrency
  )["props"];
  slots?: ControlTypeWithSlots["slots"];
  content?: { fields: ControlType[] }[];
}