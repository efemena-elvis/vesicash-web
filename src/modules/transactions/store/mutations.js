import { CURRENCY_OPTIONS } from "@/modules/transactions/constants";

export default {
  UPDATE_CACHED_TRANSACTION: (state, payload) => {
    state.transaction = { ...payload };
  },

  UPDATE_TRANSACTION_SETUP: (state, payload) => {
    state.transaction.name = payload.transaction_name;
    state.transaction.type = payload.transaction_type;
    state.transaction.parties = payload.transaction_party;

    if (payload.transaction_files.length)
      state.transaction.files = payload.transaction_files;
  },

  UPDATE_TRANSACTION_ATTACHMENT: (state, payload) => {
    state.transaction.files = payload;
  },

  UPDATE_TRANSACTION_BENEFICIARIES: (state, payload) => {
    state.transaction.beneficiaries = payload;
  },

  UPDATE_TRANSACTION_MILESTONE: (state, payload) => {
    state.transaction.milestones = payload;
  },

  UPDATE_TRANSACTION_DISPUTE_MGT: (state, payload) => {
    state.transaction.dispute_handler = payload;
  },

  UPDATE_MILESTONE_DATA: (
    state,
    { milestone_index, milestone_data, outer_data = {} }
  ) => {
    Object.values(outer_data).length
      ? (state.transaction[outer_data.type] = outer_data.selected)
      : state.transaction.milestones.splice(milestone_index, 1, milestone_data);
  },

  UPDATE_MILESTONE_RECIPIENT: (state, payload) => {
    state.transaction.milestone_recipients = payload;
  },

  UPDATE_RECIPIENT_AMOUNT: (state, { recipient_payload, recipient_index }) => {
    state.transaction.milestone_recipients.splice(
      recipient_index,
      1,
      recipient_payload
    );
  },

  EVALUATE_TRANSACTION_FEES: (state) => {
    let amount_list = [];

    // LOOP THROUGH ALL MILESTONES RECIPIENTS AND EXTRACT THEIR AMOUNT
    state.transaction.milestones.map((milestone) => {
      let amount = [];

      state.transaction.milestone_recipients.map((user) => {
        if (user.milestone_id === milestone.id)
          amount.push(Number(user.amount));
      });

      // REDUCE AMOUNT
      amount_list.push(amount.reduce((prev, next) => (prev += next), 0));
    });

    let sum_total = amount_list.reduce((prev, next) => (prev += next), 0);

    state.transaction.milestone_amounts = amount_list;
    state.transaction.escrow_fee = sum_total * 0.05;
    state.transaction.total_fee = sum_total + state.transaction.escrow_fee;
    state.transaction.payment_amount = sum_total;
  },

  RESET_TRANSACTION: (state) => {
    state.transaction = {
      name: "",
      type: "",
      parties: "",
      file: [],
      dispute_handler: "",

      currency: CURRENCY_OPTIONS[0],
      milestone_amounts: [],
      escrow_fee: 0,
      total_fee: 0,

      beneficiaries: [],
      milestones: [],
      milestone_recipients: [],
    };
  },

  UPDATE_TRANSACTION_DETAILS: (state, payload) => {
    state.transaction_details = payload;
  },
};
