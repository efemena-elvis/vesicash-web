export default {
  isPaymentInfoCompleted: (state) => state.info_entry_completed,
  getUserPaymentInfo: (state) => state.user_payment_info,
  getSelectedPaymentMethod: (state) => state.selected_payment_method,
  getSelectedShippingType: (state) => state.selected_shipping_type,
};
