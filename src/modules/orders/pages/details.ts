import { DynamicDetailsSchema } from "@vc-shell/framework";

export const details: DynamicDetailsSchema = {
  settings: {
    id: "OrderDetails",
    url: "/order",
    component: "DynamicBladeForm",
    localizationPrefix: "ORDERS",
    composable: "useOrder",
    width: "70%",
  },
  content: [
    {
      id: "orderForm",
      component: "vc-form",
      children: [
        {
          id: "orderInfoFieldset",
          component: "vc-fieldset",
          columns: 2,
          fields: [
            {
              id: "orderInfoCard",
              component: "vc-card",
              label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.TITLE",
              fields: [
                {
                  id: "orderRefNum",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.ORDER_REF",
                  property: "number",
                  orientation: "horizontal",
                },
                {
                  id: "createdDate",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.CREATED_DATE",
                  property: "createdDate",
                  orientation: "horizontal",
                },
                {
                  id: "store",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.STORE",
                  property: "storeId",
                  orientation: "horizontal",
                  tooltip: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.STORE_TOOLTIP",
                },
                {
                  id: "orderStatus",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.ORDER_STATUS",
                  property: "status",
                  orientation: "horizontal",
                  horizontalSeparator: true,
                },
                {
                  id: "orderSubTotal",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.SUBTOTAL",
                  property: "subTotal",
                  orientation: "horizontal",
                },
                {
                  id: "orderDiscountTotal",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.DISCOUNT_TOTAL",
                  property: "discountTotal",
                  orientation: "horizontal",
                },
                {
                  id: "orderComissionsTotal",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.COMMISSIONS_TOTAL",
                  property: "feeTotal",
                  orientation: "horizontal",
                },
                {
                  id: "orderTotal",
                  component: "vc-field",
                  label: "ORDERS.PAGES.DETAILS.FORM.ORDER_INFO.TOTAL",
                  property: "total",
                  orientation: "horizontal",
                },
              ],
            },
            {
              id: "buyerInfoCard",
              component: "vc-card",
              label: "ORDERS.PAGES.DETAILS.FORM.BUYER_RECIPIENT.TITLE",
              fields: [
                {
                  id: "buyerInfoFieldset",
                  component: "vc-fieldset",
                  property: "shippingInfo",
                  fields: [
                    {
                      id: "name",
                      component: "vc-field",
                      label: "{label}",
                      property: "name",
                      orientation: "horizontal",
                      aspectRatio: [1, 2],
                    },
                    {
                      id: "address",
                      component: "vc-field",
                      property: "address",
                      orientation: "horizontal",
                      aspectRatio: [1, 2],
                      visibility: {
                        method: "addressVisibility",
                      },
                    },
                    {
                      id: "phone",
                      component: "vc-field",
                      property: "phone",
                      orientation: "horizontal",
                      aspectRatio: [1, 2],
                      visibility: {
                        method: "phoneVisibility",
                      },
                    },
                    {
                      id: "email",
                      component: "vc-field",
                      property: "email",
                      orientation: "horizontal",
                      aspectRatio: [1, 2],
                      variant: "email",
                      visibility: {
                        method: "emailVisibility",
                      },
                      horizontalSeparator: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "itemsListCard",
          component: "vc-card",
          label: "ORDERS.PAGES.DETAILS.FORM.ITEMS_LIST.TITLE",
          removePadding: true,
          fields: [
            {
              id: "orderItemsList",
              component: "vc-table",
              header: false,
              multiselect: false,
              property: "items",
              footer: false,
              mobileTemplate: {
                component: "OrderOfferMobileGridView",
              },
              columns: [
                {
                  id: "imageUrl",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.PIC",
                  width: 60,
                  class: "pr-0",
                  type: "image",
                },
                {
                  id: "name",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.NAME",
                  customTemplate: {
                    component: "OrderGridName",
                  },
                },
                {
                  id: "quantity",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.QUANTITY",
                  width: 100,
                  type: "number",
                },
                {
                  id: "price",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.UNIT_PRICE",
                  width: 100,
                  type: "money",
                },
                {
                  id: "extendedPrice",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.TOTAL",
                  width: 100,
                  type: "money",
                },
                {
                  id: "fee",
                  title: "ORDERS.PAGES.DETAILS.FORM.TABLE.COMMISSION",
                  customTemplate: {
                    component: "OrderGridFee",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
