import $api from "@/shared/services/service-api";
import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  wallet_balance: "account/wallet",
  dollar_funding: "/payment/pay/headless",
  transfer_account_list: "payment_account/list",
  verify_payment: "payment_account/verify",
  wallet_transactions: "/payment/list/wallet_funding",
  wallet_withdrawals: "/payment/list/wallet_withdrawals",
  bank_details: "user/fetch/bank",
  withdraw_fund: "disbursement/wallet/withdraw",
  transaction_payments: "list",
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
  // INITIATE AYMENT GATEWAY FOR DOLLAR FUNDING
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

  // =====================================
  // FETCH ALL USER WALLET FUNDING TRANSACTIONS
  // =====================================
  async fetchWalletTransactions(_, { account_id, page }) {
    return await $api.push(
      `${routes.wallet_transactions}/${account_id}?page=${page}`,
      {}
    );
  },

  // =====================================
  // FETCH ALL USER WALLET WITHDRAWALS TRANSACTIONS
  // =====================================
  async fetchWalletWithdrawals(_, { account_id, page }) {
    return await $api.push(
      `${routes.wallet_withdrawals}/${account_id}?page=${page}`,
      {}
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
