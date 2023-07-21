export interface IUpdateValue<T> {
  (event: "update:modelValue", value: T): void;
}
