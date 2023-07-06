import $api from "@/shared/services/service-api";
import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  all_transactions: "listByUser",
  fetch_single_transaction: "listById",
  create_transaction: "create",
  send_transaction: "send",
  head_payment: "pay",
  headless_payment: "pay/headless",
  confirm_payment_status: "pay/new-status",
  update_party_status: "parties/update-status",
  update_milestone_status: "api/updateStatus",
  renew_milestone_date: "approve/due_date_extension",
  wallet_to_wallet_transfer: "disbursement/wallet/wallet-transfer",
};

export default {
  // ==================================
  // FETCH ALL USER TRANSACTIONS
  // ==================================
  async fetchTransactionsByUser(_, { payload, page, limit = 20 }) {
    return await postRequest(
      "transactions",
      `${routes.all_transactions}?limit=${limit}&page=${page}`,
      payload
    );
  },

  // ==================================
  // FETCH TRANSACTION BY ID
  // ==================================
  async fetchTransactionById(_, { transaction_id }) {
    return await getRequest(
      "transactions",
      `${routes.fetch_single_transaction}/${transaction_id}`
    );
  },

  // ==================================
  // CREATE A USER TRANSACTION
  // ==================================
  async createUserTransaction(_, payload) {
    return await postRequest(
      "transactions",
      `${routes.create_transaction}`,
      payload
    );
  },

  // ==================================
  // SEND CREATED TRANSACTION TO USER
  // ==================================
  async sendUserTransaction(_, payload) {
    return await postRequest(
      "transactions",
      `${routes.send_transaction}`,
      payload
    );
  },

  // ==================================
  // START CARD PAYMENT
  // ==================================
  async startCardPayment(_, payload) {
    return await postRequest("payment", `${routes.head_payment}`, payload);
  },

  // ==================================
  // INITIATE AN HEADLESS CARD PAYMENT
  // ==================================
  async initiateHeadlessPayment(_, payload) {
    return await postRequest("payment", `${routes.headless_payment}`, payload);
  },

  // ==================================
  // CONFIRM PAYMENT STATUS
  // ==================================
  async confirmPaymentStatus(_, payload) {
    return await postRequest(
      "payment",
      `${routes.confirm_payment_status}`,
      payload
    );
  },

  // ==================================
  // UPDATE TRANSACTION PARTY STATUS
  // ==================================
  async updateTransactionParty(_, payload) {
    return await postRequest(
      "transactions",
      `${routes.update_party_status}`,
      payload
    );
  },

  // ======================================
  // UPDATE MILESTONE TRANSACTION STATUS
  // ======================================
  async updateMilestoneTransaction(_, payload) {
    return await postRequest(
      "transactions",
      `${routes.update_milestone_status}`,
      payload
    );
  },

  // ======================================
  // RENEW MILESTONE TRANSACTION DATE
  // ======================================
  async renewMilestoneDate(_, payload) {
    return await postRequest(
      "transactions",
      `${routes.renew_milestone_date}`,
      payload
    );
  },

  // ======================================
  // TRANSFER MONEY FROM WALLET TO WALLET
  // ======================================
  async walletToWalletTransfer(_, payload) {
    return await postRequest(
      "payment",
      routes.wallet_to_wallet_transfer,
      payload
    );
  },
};
