import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  fx_rate: "rates",
  exchange_history: "exchange-transaction",
};

export default {
  // ==================================
  // FETCH ALL FX RATES
  // ==================================
  async fetchAllFxRates({ commit }) {
    const response = await getRequest("transactions", routes.fx_rate);

    response?.code === 200 && commit("UPDATE_FX_RATES", response.data);
    return response;
  },

  // ==================================
  // FETCH EXCHANGE TXNs
  // ==================================
  async fetchAllFxTransactions({ commit }, payload) {
    const response = await getRequest(
      "transactions",
      `${routes.exchange_history}/${payload.account_id}`,
      {}
    );

    response?.code === 200 && commit("UPDATE_FX_TABLE", response.data);
    return response;
  },
};
