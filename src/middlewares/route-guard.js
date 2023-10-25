import { serviceStorage, serviceUtils } from "@/shared/services";
import { constants } from "@/utilities";

class routeGuard {
  session_time = 90;
  login_route = "VesicashLogin";
  dashboard_route = "VesicashDashboard";

  auth_token = serviceStorage.getStorage({
    storage_name: constants.VESICASH_AUTH_TOKEN,
  });

  verifyAuthRoutes(to, next) {
    if (this.auth_token === null) {
      next({
        name: this.login_route,
      });
    } else this.checkUserTimeoutSession(next);
  }

  verifyGuestRoutes(to, next) {
    if (this.auth_token === null) next();
    else this.checkUserTimeoutSession(next, true);
  }

  checkUserTimeoutSession(next, is_guest = false) {
    const is_timed_out = serviceUtils.checkAuthTimeout(this.session_time);

    if (is_timed_out) serviceUtils.logOutUser();
    else {
      is_guest ? next({ name: this.dashboard_route }) : next();
    }
  }
}

export default new routeGuard();
