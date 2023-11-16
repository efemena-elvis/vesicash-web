export default {
  UPDATE_PAYMENT_COMPLETED_STATE: (state, status) => {
    state.info_entry_completed = status;
  },

  UPDATE_PAYMENT_INFO: (state, info) => {
    state.user_payment_info = { ...state.user_payment_info, ...info };
  },

  UPDATE_SELECTED_PAYMENT: (state, data) => {
    state.selected_payment_method = data;
  },

  UPDATE_SELECTED_SHIPPING: (state, data) => {
    state.selected_shipping_type = data;
  },
};
