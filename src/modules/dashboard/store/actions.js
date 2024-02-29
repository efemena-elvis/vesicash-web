import $api from "@/shared/services/service-api";
import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  wallet_balance: "account/wallet",
  transfer_account_list: "payment_account/list",
  verify_payment: "payment_account/verify",

  wallet_funding: "records/funding",
  wallet_withdrawal: "records/withdrawal",

  bank_details: "user/fetch/bank?array=true",
  withdraw_fund: "disbursement/wallet/withdraw",
  transaction_payments: "list",

  // !! REVIEW
  dollar_funding: "/payment/pay/headless",
};

export default {
  // ==================================
  // GET APPLICATION WALLET BALANCE
  // ==================================
  async getWalletBalance({ commit }, payload) {
    const response = await getRequest("auth", routes.wallet_balance, payload);

    response?.code === 200 &&
      commit("SET_WALLET_BALANCES", response.data.wallets);

    return response;
  },

  // =============================================
  // !! INITIATE AYMENT GATEWAY FOR DOLLAR FUNDING
  // =============================================
  async initiateDollarFunds(_, payload) {
    return await $api.push(routes.dollar_funding, { payload });
  },

  // ====================================
  // FETCH NAIRA WALLET BANK DETAILS
  // ====================================
  async fetchTransferAccountBankDetails(_, payload) {
    return await postRequest("payment", routes.transfer_account_list, payload);
  },

  // ====================================
  // VERIFY USER ACCOUNT PAYMENT
  // ====================================
  async verifyPaymentAccount(_, payload) {
    return await postRequest("payment", routes.verify_payment, payload);
  },

  // ============================================
  // FETCH ALL USER WALLET FUNDING TRANSACTIONS
  // ============================================
  async fetchAllFundings(
    _,
    { account_id, page = 1, start_date = "", end_date = "", currency = "" }
  ) {
    return await $api
      .service("payment")
      .fetch(
        `${routes.wallet_funding}/${account_id}?status=true&page=${page}&start_date=${start_date}&end_date=${end_date}&currency=${currency}`
      );
  },

  async fetchAllWithdrawals(
    _,
    { account_id, page = 1, start_date = "", end_date = "", currency = "" }
  ) {
    return await $api
      .service("payment")
      .fetch(
        `${routes.wallet_withdrawal}/${account_id}?status=true&page=${page}&start_date=${start_date}&end_date=${end_date}&currency=${currency}`
      );
  },

  // =====================================
  // FETCH USER BANK DETAILS
  // =====================================
  async fetchBankDetails() {
    return await getRequest("auth", routes.bank_details, {});
  },

  // =====================================
  // WIDTHDRAW FUND FROM WALLET
  // =====================================
  async withdrawWalletFund(_, payload) {
    return await postRequest("payment", routes.withdraw_fund, payload);
  },

  // ========================================================
  // GET ALL POSSIBLE TRANSACTIN PAYMENTS TYPE AND SOURCES
  // ========================================================
  async getTransactionPayments(_, payload) {
    return await postRequest(
      "transactions",
      routes.transaction_payments,
      payload
    );
  },
};
