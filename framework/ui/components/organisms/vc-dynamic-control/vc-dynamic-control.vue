<template>
  <VcInput
    v-if="valueType === 'ShortText'"
    type="text"
    :model-value="(modelValue as string)"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.TEXT')"
    :required="required"
    :disabled="disabled"
    :error="!!errors?.length"
    :error-message="errorMessage"
    clearable
    @update:model-value="
      (value) => {
        $emit('handleChange');
        $emit('update:modelValue', value);
      }
    "
  >
    <slot name="prepend"></slot>
  </VcInput>
</template>
<script lang="ts" setup generic="T extends string | string[] | number | number[] | Date | boolean | null | undefined">
import {
  IDisabled,
  IHasErrors,
  IHasLabel,
  IHasName,
  IHasPlaceholder,
  IHasValue,
  IRequired,
} from "../../../../core/types/props";

export interface Props<T> extends IHasValue<T>, IHasName, IHasLabel, IHasPlaceholder, IRequired, IDisabled, IHasErrors {
  valueType:
    | "SecureString"
    | "ShortText"
    | "LongText"
    | "PositiveInteger"
    | "Integer"
    | "Decimal"
    | "Number"
    | "DateTime"
    | "Boolean"
    | "Html"
    | "Json"
    | "Image"
    | "GeoPoint";
  dictionary: boolean;
  multivalue: boolean;
  multilanguage: boolean;
}

export interface Emits<T> {
  (event: "handleChange", shouldValidate?: boolean): void;
  (event: "update:modelValue", value: T): void;
}

defineProps<Props<T>>();
defineEmits<Emits<T>>();
</script>
