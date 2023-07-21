<template>
  <VcSelect
    v-if="multilanguage"
    :options="languages"
    :label="label"
    :required="required"
    :model-value="currentLanguage"
    @update:model-value="$emit('update:currentLanguage', $event)"
  >
    <slot />
  </VcSelect>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
import { IDisabled, IHasLabel, IRequired, IMultilanguage } from "core/types/props";
import { VcSelect } from "./../../";

export interface Props extends IHasLabel, IRequired, IDisabled, IMultilanguage {}

export interface Emits {
  (event: "update:currentLanguage", value: string | number | null): void;
}

withDefaults(defineProps<Props>(), { disabled: false });

defineEmits<Emits>();
</script>
