import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  withdrawal_request: "withdrawal/request",
  mor_transaction_summary: "transactions/summary/",
};

export default {
  async processWithdrawalRequest(_, payload) {
    return await postRequest("mor", routes.withdrawal_request, payload);
  },

  async getMoRTransactionSummary(_, { account_id }) {
    return await getRequest(
      "mor",
      `${routes.mor_transaction_summary}${account_id}`
    );
  },
};
