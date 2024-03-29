import Vue from "vue";
import VueRouter from "vue-router";
import middlewares from "@/middlewares";

Vue.use(VueRouter);

// =======================================================
// IMPORTED ROUTES FROM RESPECTIVE APPLICATION MODULES
// =======================================================
import authRoutes from "@/modules/auth";
import dashboardRoutes from "@/modules/dashboard";
import exchangeRoutes from "@/modules/exchange";
import transactionsRoutes from "@/modules/transactions";
import developerRoute from "@/modules/developer";
import paymentsRoutes from "@/modules/payments";
import settingsRoutes from "@/modules/settings";

// MERCHANTS OF RECORDS ROUTES
import {
  merchantConfigRoutes,
  merchantDeveloperRoutes,
  merchantTransactionRoutes,
} from "@/modules/merchant-of-records";

// =======================================================
// SETTING UP A ROUTES ARRAY TO HOLD ALL ROUTE MODULES
// INCLUDING A FALLBACK ERROR (404) PAGE
// =======================================================
const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...transactionsRoutes,
  ...exchangeRoutes,
  ...paymentsRoutes,
  ...developerRoute,
  ...settingsRoutes,
  ...merchantConfigRoutes,
  ...merchantDeveloperRoutes,
  ...merchantTransactionRoutes,
  {
    path: "/*",
    name: "NotFoundError",
    component: () =>
      import(
        /* webpackChunkName: "errorRoute" */
        "@/modules/error/pages/not-found"
      ),
    meta: {
      guest: true,
    },
  },
];

// =======================================================
// CONFIGURING OUR VUE ROUTER WITH SOME CONFIGURATIONS
// TO ENSURE SMOOTH SCROLLING ACROSS PAGES
// =======================================================
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  duplicateNavigationPolicy: "reload",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { selector: to.hash };
    else if (savedPosition) return savedPosition;
    else
      return {
        x: 0,
        y: 0,
      };
  },
});

// =============================================================
// WRAPPING OUR APPLICATION ENTRY POINTS INSIDE OUR MIDDLEWARE
// TO VERIFY A USER AUTHENTICATION STATE AND AUTHORIZATION
// =============================================================
router.beforeEach(async (to, from, next) => middlewares(to, from, next));
export default router;
