import { Component, ExtractPropTypes, computed, h, unref } from "vue";
import { InputCurrency } from "../factories";
import componentProps from "./props";
import ValidationField from "./ValidationField";
import { getModel } from "../../helpers/getters";
import { setModel } from "../../helpers/setters";
import { InputCurrencySchema } from "../../types";
import { unrefNested } from "../../helpers/unrefNested";
import { toValue } from "@vueuse/core";
import { safeIn } from "../../helpers/safeIn";
import { useI18n } from "vue-i18n";

export default {
  name: "InputCurrency",
  props: componentProps,
  setup(props: ExtractPropTypes<typeof componentProps> & { element: InputCurrencySchema }) {
    const { t } = useI18n({ useScope: "global" });
    return () => {
      const options =
        toValue(getModel(props.element.options, props.fieldContext ?? {})) ||
        toValue(unref(props.bladeContext.scope)?.[props.element.options]);

      const contextProperty =
        safeIn("optionProperty", props.element) &&
        props.element.optionProperty &&
        getModel(props.element.optionProperty, props.fieldContext ?? {});

      const scopedProperty =
        safeIn("optionProperty", props.element) &&
        props.element.optionProperty &&
        props.bladeContext.scope &&
        getModel(props.element.optionProperty, props.bladeContext.scope);

      const field = InputCurrency({
        props: Object.assign(
          {},
          {
            hint: props.element.hint ? toValue(computed(() => t(props.element.hint ?? ""))) : undefined,
            option: toValue(scopedProperty ?? contextProperty),
            optionLabel: props.element.optionLabel,
            optionValue: props.element.optionValue,
            options,
            "onUpdate:option": (e: string | number | Record<string, unknown>) => {
              setModel({
                value: e,
                property: props.element.optionProperty,
                context: props.fieldContext ?? {},
                scope: props.bladeContext.scope,
              });
            },
            clearable: props.element.clearable || false,
          },
          unrefNested(props.baseProps),
          {
            class: unrefNested(props.baseProps).classNames ?? "",
          },
        ),
      });
      const render = h(field.component as Component, field.props);

      if (field.props.rules) {
        return h(
          ValidationField,
          {
            props: field.props,
            index: props.elIndex,
            rows: props.rows,
            key: `${String(field.props.key)}_validation`,
          },
          () => render,
        );
      } else {
        return render;
      }
    };
  },
};
