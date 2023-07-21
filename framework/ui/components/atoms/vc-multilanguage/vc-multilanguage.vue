<template>
  <div
    v-for="language in languages"
    v-show="currentLanguage === language"
    :key="language"
  >
    <slot :model="getModel(language)" />
  </div>
</template>
<script lang="ts" setup generic="T extends IHasLanguage">
import { IHasValue, IMultilingual, IHasLanguage } from "../../../../core/types/props";
import { IUpdateValue } from "../../../../core/types/emits";
import { IDefaultSlot } from "../../../../core/types/slots";

export interface Props<T extends IHasLanguage> extends IHasValue<T[] | undefined>, IMultilingual {}
export type Emits<T> = IUpdateValue<T[]>;
export type Slots<T> = IDefaultSlot<{ model: T }>;

const props = defineProps<Props<T>>();
const emit = defineEmits<Emits<T>>();
defineSlots<Slots<T>>();

function getModel(language: string): T {
  let model = props.modelValue?.find((x) => x.languageCode === language);
  if (model == null || model === undefined) {
    model = { languageCode: language } as T;
    emit("update:modelValue", [...(props.modelValue || []), model]);
  }
  return model;
}
</script>
