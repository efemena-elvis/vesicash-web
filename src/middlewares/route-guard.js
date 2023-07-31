import { serviceStorage, serviceUtils } from "@/shared/services";
import { constants } from "@/utilities";

class routeGuard {
  session_time = 90;
  login_route = "VesicashLogin";
  dashboard_route = "VesicashDashboard";

  verifyAuthRoutes(to, next) {
    if (
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) === null
    ) {
      next({
        name: this.login_route,
      });
    } else if (
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) !== null
    )
      this.checkUserTimeoutSession(next);
  }

  verifyGuestRoutes(to, next) {
    if (
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) === null
    )
      next();
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
