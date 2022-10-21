const transactionRoutes = [{
    path: "/transactions",
    component: () =>
        import ( /* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [{
        path: "",
        name: "TransactionPage",
        component: () =>
            import (
                /* webpackChunkName: "disbursements-module" */
                "@/modules/transactions/pages/transactions"
            ),
        meta: {
            requiresAuth: true,
        },
    }, ],
}, ];

export default transactionRoutes;