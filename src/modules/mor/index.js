const morRoutes = [
  {
    path: "/mor",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashMOR",
        component: () =>
          import(
            /* webpackChunkName: "mor-module" */
            "@/modules/mor/pages/index"
          ),
        meta: {
          requiresAuth: true,
          name: "Merchants of Record",
        },
      },
    ],
  },
];

export default morRoutes;
