<template>
  <VcLanguageSelector
    :multilanguage="property.multilanguage!"
    :label="displayName"
    :required="property.required"
    :disabled="disabled"
    :current-language="currentLanguage"
    :languages="languages"
  >
    <Field
      v-slot="{ errors, errorMessage, handleChange }"
      :name="property.name!"
      :label="displayName"
      :model-value="value"
      :rules="rules"
    >
      {{ displayName }}
      <VcDynamicControl
        :value-type="property.valueType!"
        :dictionary="property.dictionary!"
        :multivalue="property.multivalue!"
        :multilanguage="property.multilanguage!"
        :model-value="value"
        :name="property.name!"
        :label="displayName"
        :required="property.required"
        :disabled="disabled"
        :errors="errors"
        :error-message="errorMessage"
        @handle-change="handleChange"
      >
      </VcDynamicControl>
    </Field>
  </VcLanguageSelector>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { VcLanguageSelector } from "./../../molecules";
import { VcDynamicControl } from "./../vc-dynamic-control";
import {
  DynamicPropertyValueType,
  IDynamicProperty,
  IObjectSettingEntry,
  ObjectSettingEntryValueType,
} from "../../../../core/api/platform";
import { IProperty, PropertyValueType } from "../../../../core/api/catalog";
import { IValidationRules } from "../../../../core/types";
import { IDisabled, IMultilanguage } from "../../../../core/types/props";
import { useI18n } from "vue-i18n";
import { Field } from "vee-validate";

export interface Props extends IDisabled, IMultilanguage {
  property: IProperty;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const { locale } = useI18n({ useScope: "global" });

const value = computed({
  get: () => {
    return "";
  },
  set: () => {
    console.log("set");
  },
});

const displayName = computed(
  () =>
    props.property.displayNames?.find((displayName) => displayName.languageCode?.startsWith(locale.value as string))
      ?.name
);

const rules: IValidationRules = {};
if (props.property.required) {
  rules.required = true;
}
if (props.property.validationRule?.charCountMin) {
  rules.min = Number(props.property.validationRule.charCountMin);
}
if (props.property.validationRule?.charCountMax) {
  rules.max = Number(props.property.validationRule.charCountMax);
}
if (props.property.validationRule?.regExp) {
  rules.regex = new RegExp(props.property.validationRule?.regExp);
}
</script>
