import { Ref, h, inject, toRefs, ExtractPropTypes, toValue } from "vue";
import componentProps from "./props";
import * as _ from "lodash-es";
import { VcButton, VcCol, VcRow } from "../../../../../ui/components";
import { FieldsetSchema } from "../../types";
import { unrefNested } from "../../helpers/unrefNested";

export default {
  name: "Fieldset",
  props: componentProps,
  setup(props: ExtractPropTypes<typeof componentProps> & { element: FieldsetSchema }) {
    const isMobile = inject("isMobile") as Ref<boolean>;

    const { fields: fieldsetFields } = toRefs(props);

    return () =>
      toValue(fieldsetFields.value).map((fields, index, arr) => {
        const divideByCols = _.chunk(fields, props.element.columns || 1) ?? [];

        return h(
          "div",
          {
            class: `tw-flex tw-row tw-relative ${unrefNested(props.baseProps).classNames ?? ""}`,
            key: `fieldset-${index}`,
          },
          [
            h("div", { class: "tw-flex-1 tw-gap-4 tw-flex tw-flex-col tw-min-w-0" }, [
              divideByCols.map((itemsArr, colIndex) => {
                return h(
                  VcRow,
                  {
                    key: `col-${colIndex}-${index}`,
                    class: {
                      "tw-relative": true,
                      "tw-gap-4": true,
                      "!tw-flex-wrap": true,
                      "!tw-flex !tw-flex-row": !!props.element.aspectRatio,
                    },
                  },
                  () => [
                    ...itemsArr.map((item, itemIndex) => {
                      return h(
                        VcCol,
                        {
                          key: `col-${itemIndex}-${colIndex}-${index}`,
                          size: "aspectRatio" in props.element ? props.element.aspectRatio?.[itemIndex] : 1,
                        },
                        () => {
                          if (typeof item === "object") {
                            return h(item, {
                              elIndex: index,
                              rows: arr.length,
                              key: `item-${itemIndex}-${colIndex}-${index}`,
                            });
                          }
                        },
                      );
                    }),
                  ],
                );
              }),
            ]),
            props.element.remove
              ? h(VcButton, {
                  iconSize: "m",
                  icon: "fas fa-times-circle",
                  text: true,
                  class: {
                    "tw-m-2": !isMobile.value,
                    "tw-absolute tw-top-0 tw-right-0": isMobile.value,
                    "!tw-hidden": arr.length === 1,
                  },
                  onClick: () => {
                    if (props.element.remove?.method) props.bladeContext.scope?.[props.element.remove?.method](index);
                  },
                })
              : undefined,
          ],
        );
      });
  },
};
