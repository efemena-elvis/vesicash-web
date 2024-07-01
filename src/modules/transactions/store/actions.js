import {
  getRequest,
  postRequest,
  patchRequest,
} from "@/utilities/micro-services";

const routes = {
  all_transactions: "listByUser",
  fetch_single_transaction: "listById",
  create_transaction: "create",
  create_escrow: "create",
  send_transaction: "send",
  head_payment: "pay",
  headless_payment: "pay/headless",
  confirm_payment_status: "pay/new-status",
  update_party_status: "parties/update-status",
  update_milestone_status: "api/updateStatus",
  renew_milestone_date: "approve/due_date_extension",
  wallet_to_wallet_transfer: "disbursement/wallet/wallet-transfer",
  get_charges: "charges",
  escrow_pay: "pay/wallet-transfer",
  all_escrow: "transaction/list",
  escrow: (id) => `transaction/get/${id}`,
  accept_transaction: (transaction_id, party_id) =>
    `transaction/accept/${transaction_id}/${party_id}`,
  reject_transaction: (party_id) => `transaction/reject/${party_id}`,
  send_escrow_transaction: (id) => `transaction/send/${id}`,
  mark_milestone_as_done: (milestone_id, id) =>
    `delivery/delivered/${milestone_id}/${id}`,
  approve_milestone: (milestone_id, id) =>
    `delivery/accept/${milestone_id}/${id}`,
  reject_milestone: (milestone_id, id) =>
    `delivery/reject/${milestone_id}/${id}`,
  extend_milestone_due_date: "due-date/extension",
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
  // FETCH ALL USER ESCROW TRANSACTIONS
  // ==================================
  async fetchEscrowTransactions(_, { page, statuses, limit = 20, id }) {
    return await postRequest(
      "escrow",
      `${routes.all_escrow}/${id}?limit=${limit}&page=${page}`,
      { statuses }
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
  // ACCEPT TRANSACTION
  // ==================================
  async acceptTransaction(_, { transaction_id, party_id }) {
    return await postRequest(
      "escrow",
      routes.accept_transaction(transaction_id, party_id)
    );
  },

  // ==================================
  // REJECT TRANSACTION
  // ==================================
  async rejectTransaction(_, { transaction_id, party_id, reason }) {
    return await postRequest("escrow", routes.reject_transaction(party_id), {
      transaction_id,
      reason,
    });
  },

  // ==================================
  // SEND TRANSACTION
  // ==================================
  async sendTransaction(_, { id }) {
    return await postRequest("escrow", routes.send_escrow_transaction(id));
  },

  // ==================================
  // MARK AS DONE TRANSACTION
  // ==================================
  async markMilestoneAsDone(_, { milestone_id, id }) {
    return await postRequest(
      "escrow",
      routes.mark_milestone_as_done(milestone_id, id)
    );
  },

  // ==================================
  // APPROVE MILESTONE
  // ==================================
  async approveMilestone(_, { milestone_id, id }) {
    return await postRequest(
      "escrow",
      routes.approve_milestone(milestone_id, id)
    );
  },

  // ==================================
  // REJECT MILESTONE
  // ==================================
  async rejectMilestone(_, { milestone_id, id, reason }) {
    return await postRequest(
      "escrow",
      routes.reject_milestone(milestone_id, id),
      { reason }
    );
  },

  // ==================================
  // EXTEND DUE DATE MILESTONE
  // ==================================
  async extendMilestoneDueDate(_, { milestone_id, id, reason, due_date }) {
    return await postRequest("escrow", routes.extend_milestone_due_date, {
      account_id: id,
      note: reason,
      milestone_id,
      due_date,
    });
  },

  // ==================================
  // FETCH ESCROW TRANSACTION BY ID
  // ==================================
  async fetchEscrowTransactionById(_, { id }) {
    return await getRequest("escrow", routes.escrow(id));
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
  // CREATE ESCROW TRANSACTION
  // ==================================
  async createEscrowTransaction(_, payload) {
    return await postRequest("escrow", `${routes.create_escrow}`, payload);
  },

  // ==================================
  // GET ESCROW CHARGE
  // ==================================

  async getEscrowCharge(_, payload) {
    return await postRequest("payment", `${routes.get_charges}`, payload);
  },

  // ==================================
  // PAY FOR ESCROW TRANSACTION
  // ==================================
  async makePayment(_, payload) {
    console.log({ payload });
    return await postRequest("escrow", `${routes.escrow_pay}`, payload);
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
    return await patchRequest(
      "transactions",
      `${routes.update_party_status}`,
      payload
    );
  },

  // ======================================
  // UPDATE MILESTONE TRANSACTION STATUS
  // ======================================
  async updateMilestoneTransaction(_, payload) {
    return await patchRequest(
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
