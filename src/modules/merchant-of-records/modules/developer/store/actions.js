import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  initialize_payment: "pay/init",
  payment_info: "pay",
  payment_link: "pay/payment-info",
  verify_payment: "pay/verify",
};

export default {
  async initializeCheckoutPayment(_, payload) {
    return await postRequest("mor", routes.initialize_payment, payload);
  },

  async getPaymentInfo(_, { reference }) {
    return await getRequest("mor", `${routes.payment_info}/${reference}`);
  },

  async generatePaymentLink(_, payload) {
    return await postRequest("mor", routes.payment_link, payload);
  },

  async verifyPaymentInfo(_, { reference }) {
    return await getRequest("mor", `${routes.verify_payment}/${reference}`);
  },
};
