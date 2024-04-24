export default {
  UPDATE_RECIPIENT_ACCOUNT: (state, account) =>
    (state.recipient_accounts = account),

  UPDATE_TEMP_ACCOUNT: (state, account) => (state.temp_accounts = account),

  UPDATE_CHARGES: (state, account) => (state.charges = account),
};
