const merchantConfigRoutes = [
  {
    path: "/merchant/introduction",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "MerchantIntroduction",
        component: () =>
          import(
            /* webpackChunkName: "merchant-module" */
            "@/modules/merchant-of-records/modules/config/pages/merchant-introduction"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/settings/mor-setup",
        component: () =>
          import(
            /* webpackChunkName: "settings-module" */ "@/modules/settings/pages/settings"
          ),
        children: [
          {
            path: "",
            name: "MerchantConfig",
            component: () =>
              import(
                /* webpackChunkName: "merchant-module" */
                "@/modules/merchant-of-records/modules/config/pages/merchant-config"
              ),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
];

export default merchantConfigRoutes;
