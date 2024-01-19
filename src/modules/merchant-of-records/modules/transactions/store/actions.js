import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  mor_transactions: "transactions/get",
  mor_tax_rate: "transaction/tax-rates",
};

export default {
  async getMoRTransactions() {
    return await getRequest(
      "mor",
      `${routes.mor_transactions}?is_paid_out=true&limit=30`
    );
  },

  async getMoRTaxRate({ commit }) {
    const response = await getRequest("mor", `${routes.mor_tax_rate}`);
    response.code === 200 && commit("UPDATE_TAX_RATE", response.data);

    return response;
  },
};
