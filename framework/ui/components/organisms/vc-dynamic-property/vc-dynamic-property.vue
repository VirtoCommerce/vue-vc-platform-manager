<template>
  <VcDynamicPropertyContainer
    :multilanguage="computedProperty.multilanguage"
    :label="computedProperty.displayName"
    :required="computedProperty.required"
    :disabled="disabled"
    :current-language="currentLanguage"
    :languages="languages"
  >
    <Field
      v-slot="{ errors, errorMessage, handleChange }"
      :name="computedProperty.name"
      :label="computedProperty.displayName"
      :model-value="value"
      :rules="computedProperty.rules"
    >
      {{ computedProperty.displayName }}
      <VcDynamicPropertyControl
        :value-type="computedProperty.valueType"
        :dictionary="computedProperty.dictionary"
        :multivalue="computedProperty.multivalue"
        :multilanguage="computedProperty.multilanguage"
        :model-value="value"
        :name="computedProperty.name"
        :label="computedProperty.displayName"
        :required="computedProperty.required"
        :disabled="disabled"
        :errors="errors"
        :error-message="errorMessage"
        @handle-change="handleChange"
      />
    </Field>
  </VcDynamicPropertyContainer>
</template>

<script lang="ts" setup generic="T extends IDynamicProperty | IProperty">
import { computed } from "vue";
import VcDynamicPropertyContainer from "./_internal/vc-dynamic-property-container/vc-dynamic-property-container.vue";
import VcDynamicPropertyControl from "./_internal/vc-dynamic-property-control/vc-dynamic-property-control.vue";
import { DynamicPropertyValueType, IDynamicProperty } from "../../../../core/api/platform";
import { IProperty, PropertyValueType } from "../../../../core/api/catalog";
import { IValidationRules } from "../../../../core/types";
import { IDisabled, IMultilanguage } from "../../../../core/types/props";
import { useI18n } from "vue-i18n";
import { Field } from "vee-validate";

export interface Props<T extends IDynamicProperty | IProperty> extends IDisabled, IMultilanguage {
  property: T;
}

const props = withDefaults(defineProps<Props<T>>(), {
  disabled: false,
});

const { locale } = useI18n({ useScope: "global" });

const computedProperty = computed(() => {
  const dynamicProperty = "isRequired" in props.property ? (props.property as IDynamicProperty) : null;
  const catalogProperty = "required" in props.property ? (props.property as IProperty) : null;

  const rules: IValidationRules = {};
  if (catalogProperty?.required || dynamicProperty?.isRequired) {
    rules.required = true;
  }
  if (catalogProperty?.validationRule?.charCountMin) {
    rules.min = Number(catalogProperty.validationRule.charCountMin);
  }
  if (catalogProperty?.validationRule?.charCountMax) {
    rules.max = Number(catalogProperty.validationRule.charCountMax);
  }
  if (catalogProperty?.validationRule?.regExp) {
    rules.regex = new RegExp(catalogProperty.validationRule?.regExp);
  }

  // TODO: Fix API: dictionary, multilanguage, multivalue & name shouldn't be nullable
  return {
    valueType: props.property.valueType as unknown as DynamicPropertyValueType | PropertyValueType,
    dictionary: dynamicProperty?.isDictionary || catalogProperty?.dictionary || false,
    multivalue: dynamicProperty?.isArray || catalogProperty?.multivalue || false,
    multilanguage: dynamicProperty?.isMultilingual || catalogProperty?.multilanguage || false,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: props.property.name!,
    displayName:
      dynamicProperty?.displayNames?.find((displayName) => displayName.locale?.startsWith(locale.value as string))
        ?.name ||
      catalogProperty?.displayNames?.find((displayName) => displayName.languageCode?.startsWith(locale.value as string))
        ?.name,
    required: dynamicProperty?.isRequired || catalogProperty?.required,
    rules,
  };
});

const value = computed({
  get: () => {
    return "";
  },
  set: () => {
    console.log("set");
  },
});
</script>
