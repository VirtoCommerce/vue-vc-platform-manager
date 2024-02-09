import { Component, ExtractPropTypes, computed, h, unref } from "vue";
import { Button } from "../factories";
import componentProps from "./props";
import { ButtonSchema } from "../../types";
import { useI18n } from "vue-i18n";
import { unrefNested } from "../../helpers/unrefNested";

export default {
  name: "ButtonEl",
  props: componentProps,
  setup(props: ExtractPropTypes<typeof componentProps> & { element: ButtonSchema }) {
    const { t } = useI18n({ useScope: "global" });
    return () => {
      const field = Button({
        props: Object.assign(
          {},
          {
            small: props.element.small,
            icon: props.element?.icon,
            iconSize: props.element?.iconSize,
            text: props.element?.text,
            onClick: () => {
              unref(props.bladeContext.scope)?.[props.element.method]();
            },
          },
          unrefNested(props.baseProps),
          {
            class: unrefNested(props.baseProps).classNames ?? "",
          },
        ),
        slots: {
          default: () => unref(computed(() => t(props.element.content))),
        },
      });

      return h(field.component as Component, field.props, field.slots);
    };
  },
};
