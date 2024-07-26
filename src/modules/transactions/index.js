const transactionRoutes = [
  {
    path: "/transactions",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "AllTransactions",
        component: () =>
          import(
            /* webpackChunkName: "transactions-module" */
            "@/modules/transactions/pages/transactions"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      // =====================================
      // TRANSACTION DETAILS ROUTE
      // =====================================
      {
        path: "/transactions/escrow-details/:id",
        name: "TransactionDetails",
        component: () =>
          import(
            /* webpackChunkName: "transaction-module" */
            "@/modules/transactions/pages/transaction-details"
          ),
        meta: {
          requiresAuth: true,
        },
        // beforeEnter(to, from, next) {
        //   let back_route = from?.name ?? "VesicashDashboard";
        //   sessionStorage.setItem("back_link", back_route);
        //   next();
        // },
      },

      // =====================================
      // TRANSACTION CREATION FLOW
      // =====================================
      {
        path: "/transactions/setup",
        component: () =>
          import(
            /* webpackChunkName: "transaction-layout" */
            "@/modules/transactions/layouts/layout-transactions"
          ),

        children: [
          {
            path: "",
            name: "TransactionSetup",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-transactions/transaction-setup"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/transactions/parties",
            name: "TransactionParties",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-transactions/transaction-parties"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/transactions/payout-rules",
            name: "TransactionPayoutRules",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-transactions/transaction-payout-rules"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/transactions/confirm-transaction",
            name: "TransactionConfirmPayout",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-transactions/transaction-confirmation"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "/transactions/payment",
            name: "TransactionPayment",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-transactions/transaction-payment"
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
    path: "/escrow",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "transactions",
        name: "EscrowTransactions",
        component: () =>
          import(
            /* webpackChunkName: "transactions-module" */
            "@/modules/transactions/pages/escrow-details/transactions"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "transactions/:id",
        name: "EscrowTransactionDetailsPage",
        component: () =>
          import(
            /* webpackChunkName: "transactions-module" */
            "@/modules/transactions/pages/escrow-details/transaction-details"
          ),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "transaction-layout" */
            "@/modules/transactions/layouts/escrow-layout"
          ),

        children: [
          {
            path: "create",
            name: "CreateEscrowPage",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-escrow/create-transaction"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "transaction-details",
            name: "EscrowDetailsPage",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-escrow/transaction-details"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "disbursement-details",
            name: "EscrowDisbursementDetailsPage",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-escrow/disbursement-details"
              ),
            meta: {
              requiresAuth: true,
            },
          },

          {
            path: "payment",
            name: "EscrowPaymentPage",
            component: () =>
              import(
                /* webpackChunkName: "transaction-layout" */
                "@/modules/transactions/pages/create-escrow/escrow-payment"
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
    path: "/transaction/payment-successful",
    component: () =>
      import(/* webpackChunkName: "auth-layout" */ "@/layouts/layout-dialog"),

    children: [
      {
        path: "",
        name: "SuccessfulPayment",
        component: () =>
          import(
            /* webpackChunkName: "transaction-module" */
            "@/modules/transactions/pages/create-transactions/transaction-payment-success"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default transactionRoutes;
