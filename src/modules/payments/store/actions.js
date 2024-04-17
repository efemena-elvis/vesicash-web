import $api from "@/shared/services/service-api";

const routes = {
  bulk_transfer: "disbursement/wallet/withdraw/bulk",
};

export default {
  // INITIATE A BULK TRANSFER PAYMENT
  async initiateBulkTransfer(_, payload) {
    return await $api
      .service("payment")
      .push(routes.bulk_transfer, { payload });
  },

  // Add new transfer account to the recipient list
  addToAccountList({ commit, getters }, accounts = []) {
    let current_recipients = [...getters.getRecipientAccounts];

    setTimeout(
      () =>
        commit("UPDATE_RECIPIENT_ACCOUNT", [
          ...current_recipients,
          ...accounts,
        ]),
      500
    );
  },

  // Update recipient account amount on the list
  updateAmountOnAccount(
    { commit, getters },
    { account_no, amount, total_amount = 0 }
  ) {
    let current_recipients = [...getters.getRecipientAccounts];

    // Find the index of the account to be updated
    const indexToUpdate = current_recipients.findIndex(
      (account) => account.account_no === account_no
    );

    if (indexToUpdate !== -1) {
      const updatedAccount = {
        ...current_recipients[indexToUpdate],
        amount,
        total_transfer_amount: total_amount,
      };

      current_recipients.splice(indexToUpdate, 1, updatedAccount);
      commit("UPDATE_RECIPIENT_ACCOUNT", current_recipients);
    }
  },

  updateCharges({ commit, getters }, { account_no, amount }) {
    let current_charges = [...getters.getAccountCharges];

    // Find the index of the account to be updated
    const indexToUpdate = current_charges.findIndex(
      (account) => account.account_no === account_no
    );

    if (indexToUpdate !== -1) {
      const updatedCharges = {
        ...current_charges[indexToUpdate],
        amount,
      };

      current_charges.splice(indexToUpdate, 1, updatedCharges);
      commit("UPDATE_CHARGES", current_charges);
    } else {
      commit("UPDATE_CHARGES", [...current_charges, { account_no, amount }]);
    }
  },

  // Remove a selected account from the list of account
  removeAccountFromList({ commit, getters }, account_index) {
    let current_recipients = [...getters.getRecipientAccounts];
    let current_charges = [...getters.getAccountCharges];

    let filtered_account = current_recipients.filter(
      (_, index) => index !== account_index
    );

    let filtered_charges = current_charges.filter(
      (_, index) => index !== account_index
    );

    commit("UPDATE_RECIPIENT_ACCOUNT", [...filtered_account]);
    commit("UPDATE_CHARGES", [...filtered_charges]);
  },

  // Action to clear out all account from list
  clearOutAccountList({ commit }) {
    commit("UPDATE_RECIPIENT_ACCOUNT", []);
  },

  updateTempAccount({ commit, getters }, account) {
    let current_accounts = [...getters.getTempAccounts];

    let account_found = current_accounts.findIndex(
      (acc) => acc.account_no === account.account_no
    );

    if (account_found === -1)
      commit("UPDATE_TEMP_ACCOUNT", [...current_accounts, account]);
    else {
      commit("UPDATE_TEMP_ACCOUNT", [
        ...current_accounts.splice(account_found, 1),
      ]);
    }
  },

  clearOutTempAccount({ commit }) {
    commit("UPDATE_TEMP_ACCOUNT", []);
  },
};
