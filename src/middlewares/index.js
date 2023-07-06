// =============================================
// APPLICATION AUTHENTICATION MIDDLEWARE
// =============================================
import routeGuard from "./route-guard";

export default (to, from, next) => {
  /***********************************************************
   * Verify if user accessing route is an authenticated user
   *************************************************************/
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    routeGuard.verifyAuthRoutes(to, next);
  } else if (to.matched.some((record) => record.meta.guest)) {
    /***********************************************************
     * Verify if user accessing route is just a guest user
     *************************************************************/
    routeGuard.verifyGuestRoutes(to, next);
  }

  // FALLBACK
  else next();
};
