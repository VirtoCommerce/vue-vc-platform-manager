<template>
  <VcLanguageSelector
    v-if="multilanguage"
    v-bind="props"
  >
    <slot />
  </VcLanguageSelector>
  <template v-else>
    <slot />
  </template>
</template>
<script lang="ts" setup>
import { IDisabled, IHasLabel, IRequired, IMultilanguage } from "../../../../../../core/types/props";
import { VcLanguageSelector } from "./../../../..";

export interface Props extends IHasLabel, IRequired, IDisabled, IMultilanguage {
  multilanguage: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>
