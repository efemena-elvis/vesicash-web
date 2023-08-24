import { serviceStorage, serviceUtils } from "@/shared/services";
import { constants } from "@/utilities";

class routeGuard {
  session_time = 90;
  login_route = "VesicashLogin";
  dashboard_route = "VesicashDashboard";
  upgrade_route = "MerchantUpgrade";
  excluded_routes = ["/dashboard", "/settings", "/merchant/introduction"];
  user = serviceStorage.getStorage({storage_name:constants.VESICASH_AUTH_USER, storage_type:'object'})
  is_upgraded = this.user && this.user?.is_upgraded

  isExcludedRoutes(route){
    return this.excluded_routes.some(_route=>route?.path?.includes(_route))
  }

  verifyAuthRoutes(to, next) {
    if (
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) === null
    ) {
      next({
        name: this.login_route,
      });
      
    } 
    else if(!this.is_upgraded && to.name !== this.upgrade_route && !this.isExcludedRoutes(to)){
      next({name:this.upgrade_route})
    }
    else (
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
