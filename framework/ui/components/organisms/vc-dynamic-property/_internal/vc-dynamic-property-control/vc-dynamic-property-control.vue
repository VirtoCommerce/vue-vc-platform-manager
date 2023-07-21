<template>
  <!--VcSelect
    v-if="valueType === 'ShortText' && dictionary && multivalue"
    :model-value="modelValue"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.DICTIONARY_MULTIVALUE')"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    :options="items"
    option-label="alias"
    option-value="id"
    :display-label="displayedValueLabel.label"
    :display-value="displayedValueLabel.value"
    :multiple="multivalue"
    :emit-value="false"
    @update:model-value="$emit('update:modelValue', $event.target.value)"
    @search="onSearch"
    @close="onClose"
  ></VcSelect>

  <VcSelect
    v-if="valueType === 'ShortText' && dictionary && !multivalue"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.DICTIONARY')"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :model-value="getter(property, true)"
    :required="property.required || property.isRequired"
    :options="items"
    option-value="id"
    :option-label="handleDisplayProperty"
    :disabled="disabled"
    searchable
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e, items);
      }
    "
    @search="onSearch"
    @close="onClose"
  ></VcSelect>

  <VcSelect
    v-else-if="valueType === 'ShortText' && !dictionary && multivalue"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.MULTIVALUE')"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :model-value="property.values"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    option-label="alias"
    option-value="id"
    :display-label="displayedValueLabel.label"
    :display-value="displayedValueLabel.value"
    :multiple="true"
    :emit-value="false"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e);
      }
    "
  ></VcSelect-->

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
  ></VcInput>

  <!--VcTextarea
    v-else-if="valueType === 'LongText'"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.TEXT')"
    :error-message="errorMessage"
    :model-value="getter(property) as string"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e);
      }
    "
  ></VcTextarea>

  <VcInput
    v-else-if="valueType === 'Integer'"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.INTEGER')"
    v-bind="$attrs"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :model-value="(getter(property) as string | number | Date)"
    clearable
    type="number"
    step="1"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e as Record<string, unknown> | string | number | boolean);
      }
    "
  ></VcInput>

  <VcInput
    v-else-if="valueType === 'Number'"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.NUMBER')"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :model-value="(getter(property) as string | number | Date)"
    clearable
    type="number"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e as Record<string, unknown> | string | number | boolean);
      }
    "
  ></VcInput>

  <VcInput
    v-else-if="valueType === 'DateTime'"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.DATETIME')"
    :error="!!errors?.length"
    :error-message="errorMessage"
    :model-value="(getter(property) as string | number | Date)"
    type="datetime-local"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e as Record<string, unknown> | string | number | boolean);
      }
    "
  ></VcInput>

  <VcCheckbox
    v-else-if="valueType === 'Boolean'"
    :name="name"
    :error-message="errorMessage"
    :model-value="getter(property) as boolean"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    :name="property.displayName || property.name"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e);
      }
    "
  >
    {{ label }}
  </VcCheckbox>

  <VcCodeEditor
    v-else-if="valueType === 'Html'"
    :name="name"
    :label="label"
    :placeholder="$t('COMPONENTS.ORGANISMS.VC_DYNAMIC_PROPERTY.PLACEHOLDER.TEXT')"
    :model-value="(getter(property) as string | number | Date)"
    :required="property.required || property.isRequired"
    :disabled="disabled"
    :name="property.displayName || property.name"
    :error-message="errorMessage"
    @update:model-value="
      (e) => {
        handleChange(e);
        setter(property, e as Record<string, unknown> | string | number | boolean);
      }
    "
  >
  </VcCodeEditor-->
</template>
<script lang="ts" setup generic="T extends string | number | Date | null | undefined">
import { PropertyValueType } from "core/api/catalog";
import { DynamicPropertyValueType } from "core/api/platform";
import {
  IDisabled,
  IHasErrors,
  IHasLabel,
  IHasName,
  IHasPlaceholder,
  IHasValue,
  IRequired,
} from "../../../../../../core/types/props";

export interface Props<T> extends IHasValue<T>, IHasName, IHasLabel, IHasPlaceholder, IRequired, IDisabled, IHasErrors {
  valueType: DynamicPropertyValueType | PropertyValueType;
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
