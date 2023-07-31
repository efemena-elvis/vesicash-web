const developerRoute = [
  {
    // ====================================
    // DEVELOPER ROUTES
    // ====================================
    path: "/developer",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashEscrowDeveloper",
        component: () =>
          import(
            /* webpackChunkName: "developer-module" */
            "@/modules/developer/pages/escrow-developer"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default developerRoute;
