import Vue from "vue";
import Vuex from "vuex";

// =========================
// MODULES STORE POINT
// =========================
import general from "./general";
import auth from "@/modules/auth/store";
import dashboard from "@/modules/dashboard/store";
import transactions from "@/modules/transactions/store";
import settings from "@/modules/settings/store";
import payments from "@/modules/payments/store";
import exchange from "@/modules/exchange/store";
import developer from "@/modules/developer/store";
import mor from "@/modules/mor/store";

// MERCHANT OF RECORD STORE
import merchant from "@/modules/merchant-of-records/modules/config/store";
import merchantDashboard from "@/modules/merchant-of-records/modules/dashboard/store";
import merchantDeveloper from "@/modules/merchant-of-records/modules/developer/store";
import merchantTransactions from "@/modules/merchant-of-records/modules/transactions/store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    general,
    auth,
    dashboard,
    transactions,
    settings,
    payments,
    exchange,
    developer,
    mor,
    merchant,
    merchantDashboard,
    merchantDeveloper,
    merchantTransactions,
  },
});
