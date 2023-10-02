/* eslint-disable @typescript-eslint/no-explicit-any */
import { markRaw } from "vue";
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
import {
  IControlBaseProps,
  ISelectField,
  IInputField,
  ICardCollection,
  IEditorField,
  IGallery,
  IDynamicProperties,
  ICheckbox,
  IButton,
  IInputCurrency,
  IFieldset,
  IControlBaseOptions,
} from "./models";

export const ControlBase = ({
  visibility = undefined,
  noValidation = false,
}: IControlBaseOptions): IControlBaseOptions => ({
  visibility,
  noValidation,
});

export const ControlBaseProps = ({
  rules = undefined,
  label = undefined,
  placeholder = undefined,
  disabled = false,
  required = false,
  name = undefined,
  classNames = undefined,
  tooltip = undefined,
  key = undefined,
  ...rest
}: IControlBaseProps): IControlBaseProps => ({
  key,
  rules,
  label,
  placeholder,
  disabled,
  required,
  name,
  classNames,
  tooltip,
  ...rest,
});

export const SelectField = ({ props, slots, options }: Partial<ISelectField>): ISelectField => ({
  component: markRaw(VcSelect) as any,
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
  slots,
});

export const InputField = ({ props, options }: Partial<IInputField>): IInputField => ({
  component: markRaw(VcInput),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
});

export const InputCurrency = ({ props, options }: Partial<IInputCurrency>): IInputCurrency => ({
  component: markRaw(VcInputCurrency),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
});

export const CardCollection = ({ props, options, slots }: Partial<ICardCollection>): ICardCollection => ({
  component: markRaw(VcCard),
  props: {
    ...props,
    ...ControlBaseProps(props),
  },
  options: ControlBase(options),
  slots,
});

export const DynamicProperties = ({ props, options }: Partial<IDynamicProperties>): IDynamicProperties => ({
  component: markRaw(VcDynamicProperty) as any,
  props: {
    ...props,
    ...(ControlBaseProps(props) as IDynamicProperties["props"]),
  },
  options: ControlBase({ ...options, noValidation: true }),
});

export const EditorField = ({ props, options }: Partial<IEditorField>): IEditorField => ({
  component: markRaw(VcEditor),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
});

export const Gallery = ({ props, options }: Partial<IGallery>): IGallery => ({
  component: markRaw(VcGallery),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
});

export const Checkbox = ({ props, options, slots }: Partial<ICheckbox>): ICheckbox => ({
  component: markRaw(VcCheckbox),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase(options),
  slots,
});

export const Button = ({ props, options, slots }: Partial<IButton>): IButton => ({
  component: markRaw(VcButton),
  props: {
    ...ControlBaseProps(props),
    ...props,
  },
  options: ControlBase({ ...options, noValidation: true }),
  slots,
});

export const Fieldset = ({ columns, fields, property, remove }: IFieldset): IFieldset => ({
  columns,
  fields,
  property,
  remove,
});