<template>
  <div
    class="vc-textarea"
    :class="[
      `vc-textarea`,
      {
        'vc-textarea_clearable': clearable,
        'vc-textarea_error': error,
        'vc-textarea_disabled': disabled,
        'tw-pb-[20px]': error || hint,
      },
    ]"
  >
    <!-- Textarea label -->
    <VcLabel
      v-if="label"
      class="tw-mb-2"
      :required="required"
    >
      <span>{{ label }}</span>
      <template
        v-if="tooltip"
        #tooltip
        >{{ tooltip }}</template
      >
    </VcLabel>

    <div class="tw-flex tw-flex-nowrap tw-items-start">
      <div class="tw-relative tw-flex tw-flex-auto tw-text-left">
        <div
          v-if="$slots['prepend']"
          class="tw-flex tw-items-center tw-flex-nowrap tw-pr-3"
        >
          <slot name="prepend"></slot>
        </div>
        <div class="tw-flex tw-flex-col tw-flex-nowrap tw-flex-auto tw-relative">
          <div class="vc-textarea__field-wrapper">
            <div class="tw-flex tw-flex-nowrap tw-flex-auto tw-h-full">
              <div
                v-if="$slots['prepend-inner']"
                class="tw-flex tw-items-center tw-flex-nowrap tw-pr-3"
              >
                <slot name="prepend-inner"></slot>
              </div>
              <div class="vc-textarea__field">
                <div
                  v-if="prefix"
                  class="tw-flex tw-items-center tw-flex-wrap tw-pr-3 tw-pointer-events-none"
                >
                  {{ prefix }}
                </div>
                <slot
                  name="control"
                  :editable="disabled"
                  :focused="autofocus"
                  :placeholder="placeholder"
                >
                  <textarea
                    ref="textareaRef"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :name="name"
                    :maxlength="maxlength"
                    :autofocus="autofocus"
                    class="vc-textarea__textarea"
                    @textarea="onTextarea"
                  />
                </slot>
                <div
                  v-if="suffix"
                  class="tw-flex tw-items-center tw-flex-wrap tw-pl-3 tw-pointer-events-none"
                >
                  {{ suffix }}
                </div>
                <div
                  v-if="clearable && modelValue && !disabled"
                  class="vc-textarea__clear"
                >
                  <VcIcon
                    size="s"
                    icon="fas fa-times"
                  ></VcIcon>
                </div>
              </div>

              <div
                v-if="$slots['append-inner']"
                class="tw-flex tw-items-center tw-flex-nowrap tw-pl-3"
              >
                <slot name="append-inner"></slot>
              </div>
              <div
                v-if="loading"
                class="tw-flex tw-items-center tw-flex-nowrap tw-pl-3"
              >
                <VcIcon
                  icon="fas fa-spinner tw-animate-spin"
                  class="tw-text-[var(--textarea-clear-color)]"
                  size="m"
                ></VcIcon>
              </div>
            </div>
          </div>
          <div class="tw-absolute tw-translate-y-full tw-left-0 tw-right-0 tw-bottom-0 tw-min-h-[20px]">
            <Transition
              name="slide-up"
              mode="out-in"
            >
              <div v-if="error">
                <slot name="error">
                  <VcHint
                    v-if="errorMessage"
                    class="vc-textarea__error"
                  >
                    {{ errorMessage }}
                  </VcHint>
                </slot>
              </div>
              <div v-else>
                <slot name="hint">
                  <VcHint
                    v-if="hint"
                    class="vc-textarea__desc"
                  >
                    {{ hint }}
                  </VcHint>
                </slot>
              </div>
            </Transition>
          </div>
        </div>

        <div
          v-if="$slots['append']"
          class="tw-flex tw-items-center tw-flex-nowrap tw-pl-3"
        >
          <slot name="append"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { VcHint, VcLabel } from "./../../";

export interface Props {
  /**
   * Model of the component; Use with a listener for 'update:model-value' event OR use v-model directive
   */
  modelValue?: string | null | undefined;
  /**
   * Input label text
   */
  label?: string;
  /**
   * Input placeholder text
   */
  placeholder?: string;
  /**
   * Input description (hint) text below input component
   */
  hint?: string;
  /**
   * Appends clearable icon when a value is set;
   * When clicked, model becomes null
   */
  clearable?: boolean;
  /**
   * Prefix
   */
  prefix?: string;
  /**
   * Suffix
   */
  suffix?: string;
  /**
   * Used to specify the name of the control; If not specified, it takes the value 'Field'
   */
  name?: string;
  /**
   * Signals the user a process is in progress by displaying a spinner
   */
  loading?: boolean;
  /**
   * Debounce amount (in milliseconds) when updating model
   */
  debounce?: string | number;
  /**
   * Put component in disabled mode
   */
  disabled?: boolean;
  /**
   * Focus field on initial component render
   */
  autofocus?: boolean;
  /**
   * Does field have validation errors?
   */
  error?: boolean;
  /**
   * Validation error message (gets displayed only if 'error' is set to 'true')
   */
  errorMessage?: string;
  /**
   * Specify a max length of model
   * Default value: 1024
   */
  maxlength?: string | number;
  /**
   * Input tooltip information
   */
  tooltip?: string;
  /**
   * Input required state
   */
  required?: boolean;
}

export interface Emits {
  (event: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  name: "Field",
  maxchars: "1024",
});

const emit = defineEmits<Emits>();

watch(
  () => props.modelValue,
  (value) => {
    emit("update:modelValue", value);
  }
);

// Handle textarea event to propertly validate value and emit changes
function onTextarea(e: Event) {
  const newValue = (e.target as HTMLTextAreaElement).value;
  emit("update:modelValue", newValue);
}
</script>

<style lang="scss">
:root {
  --textarea-height: 120px;
  --textarea-border-color: #d3dbe9;
  --textarea-border-color-error: #f14e4e;
  --textarea-border-radius: 3px;
  --textarea-background-color: #ffffff;
  --textarea-placeholder-color: #a5a5a5;
}

.vc-textarea {
  &__field-wrapper {
    @apply tw-px-3 tw-border tw-border-solid
      tw-border-[color:var(--textarea-border-color)]
      tw-rounded-[var(--textarea-border-radius)]
      tw-box-border
      tw-bg-[color:var(--textarea-background-color)] tw-flex tw-items-stretch;
  }

  &_error &__field-wrapper {
    @apply tw-border tw-border-solid tw-border-[color:var(--textarea-border-color-error)];
  }

  &__error {
    @apply tw-text-[color:var(--textarea-border-color-error)] tw-mt-1 #{!important};
  }

  &__field {
    @apply tw-w-auto tw-min-w-0 tw-max-w-full tw-relative tw-flex tw-flex-row tw-flex-auto tw-flex-nowrap [height:inherit];

    textarea {
      @apply tw-w-full tw-resize-y tw-box-border tw-border-none tw-outline-none
      tw-min-h-[var(--textarea-height)]
      placeholder:tw-text-[color:var(--textarea-placeholder-color)]
      tw-py-2;

      &::-webkit-textarea-placeholder {
        @apply tw-text-[color:var(--textarea-placeholder-color)];
      }

      &::-moz-placeholder {
        @apply tw-text-[color:var(--textarea-placeholder-color)];
      }

      &::-ms-placeholder {
        @apply tw-text-[color:var(--textarea-placeholder-color)];
      }
    }
  }

  &_disabled &__field-wrapper,
  &_disabled &__field {
    @apply tw-bg-[#fafafa] tw-text-[#424242];
  }
}
</style>
