const paymentsRoutes = [
  {
    path: "/payments",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "PaymentsPage",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */
            "@/modules/payments/pages/payments"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/payments/send-money",
        name: "SendMoney",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */
            "@/modules/payments/pages/send-money"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/payments/beneficiary-list",
        name: "PaymentBeneficiary",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */
            "@/modules/payments/pages/beneficiary-list"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "/payments/group-beneficiary",
        name: "GroupBeneficiary",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */
            "@/modules/payments/pages/group-beneficiary"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    name: "WireTransferPaymentPage",
    path: "/complete-payment/:reference",
    component: () =>
      import(
        /* webpackChunkName: "payments-module" */
        "@/modules/payments/pages/wire-transfer-payment"
      ),
    meta: {
      requiresAuth: false,
    },
  },
];

export default paymentsRoutes;
