const dashboardRoutes = [
  {
    // ====================================
    // DASHBOARD ROUTES
    // ====================================
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashDashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/dashboard"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      // =====================================
      // DISBURSEMENT DETAILS ROUTE
      // =====================================
      {
        path: "/dashboard/disbursement-details",
        name: "VesicashDisbursementDetails",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/disbursement-details"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      // =====================================
      // FUND DISBURSEMENT SETUP ROUTES
      // =====================================
      {
        path: "/dashboard/disburse-fund/details",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/layouts/layout-disbursement"
          ),

        children: [
          {
            path: "",
            name: "VesicashFundDetails",
            component: () =>
              import(
                /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/pages/fund-disbursement/fund-details"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/dashboard/disburse-fund/beneficiaries",
            name: "VesicashBeneficiaries",
            component: () =>
              import(
                /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/pages/fund-disbursement/fund-beneficiaries"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/dashboard/disburse-fund/payout",
            name: "VesicashPayoutRules",
            component: () =>
              import(
                /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/pages/fund-disbursement/fund-payout-rules"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/dashboard/disburse-fund/confirm-payout",
            name: "VesicashConfirmPayoutRules",
            component: () =>
              import(
                /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/pages/fund-disbursement/confirm-fund-payout-rules"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/dashboard/disburse-fund/payment",
            name: "VesicashPayment",
            component: () =>
              import(
                /* webpackChunkName: "dashboard-layout-disbursement" */ "@/modules/dashboard/pages/fund-disbursement/fund-payment"
              ),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },

  // ====================================
  // PLAIN AUTH BG LAYOUT ROUTES
  // ====================================
  {
    path: "/withdrawal-successful",
    component: () =>
      import(/* webpackChunkName: "auth-layout" */ "@/layouts/layout-auth"),

    children: [
      {
        path: "",
        name: "SuccessfulWithdrawal",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/withdraw-success"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/payment-successful",
        name: "SuccessfulPayment",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/fund-disbursement/fund-payment-success"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/fund-wallet-successful",
        name: "SuccessfulWalletFund",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/pages/fund-wallet-success"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default dashboardRoutes;
