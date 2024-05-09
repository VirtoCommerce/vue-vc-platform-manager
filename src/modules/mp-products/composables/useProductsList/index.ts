import { DynamicBladeList, useBladeNavigation, TOpenBladeArgs } from "@vc-shell/framework";
import { useProductsList } from "../../../products/composables/useProductsList";
import { Ref, computed, ref } from "vue";
import * as _ from "lodash-es";
import { ISearchProductsQuery } from "@vcmp-vendor-portal/api/marketplacevendor";

export const useProductsListExtended = (args: {
  props: InstanceType<typeof DynamicBladeList>["$props"];
  emit: InstanceType<typeof DynamicBladeList>["$emit"];
  mounted: Ref<boolean>;
}): ReturnType<typeof useProductsList> => {
  const { items, load, loading, query, pagination, remove, scope } = useProductsList(args);
  const { openBlade, resolveBladeByName } = useBladeNavigation();

  const loadWrap = async (loadQuery?: ISearchProductsQuery) => {
    query.value = Object.assign(query.value, loadQuery, { isPublished: true, searchFromAllSellers: true });

    await load(query.value);
  };

  async function openDetailsBlade(args?: TOpenBladeArgs) {
    await openBlade({
      blade: resolveBladeByName("MpProduct"),
      ...args,
    });
  }

  const extendedScope = _.merge(
    ref({}),
    ref(scope?.value),
    ref({
      openDetailsBlade,
    }),
  );

  return { items, load: loadWrap, loading, query, pagination, remove, scope: computed(() => extendedScope.value) };
};