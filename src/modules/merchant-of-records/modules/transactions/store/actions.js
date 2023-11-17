import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  mor_transactions: "transactions/get",
};

export default {
  async getMoRTransactions() {
    return await getRequest("mor", `${routes.mor_transactions}?is_paid_out=true&limit=30`);
  },
};
