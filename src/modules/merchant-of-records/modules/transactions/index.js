const merchantTransactionRoutes = [
  {
    path: "/merchant/mor-transaction",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "MerchantTransaction",
        component: () =>
          import(
            /* webpackChunkName: "merchant-module" */
            "@/modules/merchant-of-records/modules/transactions/pages/mor-transaction"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/merchant/tax-record",
        name: "MerchantTaxRecord",
        component: () =>
          import(
            /* webpackChunkName: "merchant-module" */
            "@/modules/merchant-of-records/modules/transactions/pages/mor-taxes"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default merchantTransactionRoutes;
