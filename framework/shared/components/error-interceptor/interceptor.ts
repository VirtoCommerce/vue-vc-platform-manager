import { useErrorHandler } from "./../../../core/composables";
import { defineComponent, VNode } from "vue";

export interface Props {
  capture?: boolean;
}

export interface Emits {
  (event: "error", value: string): void;
  (event: "reset"): void;
}

export type Slots = {
  slots: {
    default: (args: { error: string | null; reset: () => void }) => VNode[];
  };
};

export default defineComponent({
  props: {
    capture: {
      default: false,
      type: Boolean,
    },
  },
  emits: {
    error(value: Error | string) {
      return (value && value instanceof Error) || typeof value === "string";
    },
    reset() {
      return true;
    },
  },
  setup(props, { slots }) {
    const { error, reset } = useErrorHandler(props.capture);

    return () =>
      slots.default?.({
        error: error.value,
        reset,
      });
  },
});
