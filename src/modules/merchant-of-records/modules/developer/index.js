const merchantDeveloperRoutes = [
  {
    path: "/merchant/developer",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "MerchantDeveloper",
        component: () =>
          import(
            /* webpackChunkName: "merchant-module" */
            "@/modules/merchant-of-records/modules/developer/pages/merchant-developer"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/merchant/payment-module/customer",
        component: () =>
          import(
            /* webpackChunkName: "merchant-module-layout" */ "@/modules/merchant-of-records/modules/developer/layouts/layout-developer"
          ),

        children: [
          {
            path: "",
            name: "MerchantModuleCustomer",
            component: () =>
              import(
                /* webpackChunkName: "merchant-module" */
                "@/modules/merchant-of-records/modules/developer/pages/payment-module-customer"
              ),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "/merchant/payment-module/order",
            name: "MerchantModuleOrder",
            component: () =>
              import(
                /* webpackChunkName: "merchant-module" */
                "@/modules/merchant-of-records/modules/developer/pages/payment-module-order"
              ),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: "/merchant/payment-module/preview",
    name: "MerchantModulePreview",
    component: () =>
      import(
        /* webpackChunkName: "merchant-module" */
        "@/modules/merchant-of-records/modules/developer/pages/payment-module-preview"
      ),
    meta: {
      requiresAuth: true,
    },
  },
];

export default merchantDeveloperRoutes;
