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
  updateAmountOnAccount({ commit, getters }, { account_no, amount }) {
    let current_recipients = [...getters.getRecipientAccounts];

    // Find the index of the account to be updated
    const indexToUpdate = current_recipients.findIndex(
      (account) => account.account_no === account_no
    );

    if (indexToUpdate !== -1) {
      const updatedAccount = {
        ...current_recipients[indexToUpdate],
        amount: amount,
      };

      current_recipients.splice(indexToUpdate, 1, updatedAccount);
      commit("UPDATE_RECIPIENT_ACCOUNT", current_recipients);
    }
  },

  // Remove a selected account from the list of account
  removeAccountFromList({ commit, getters }, account_index) {
    let current_recipients = [...getters.getRecipientAccounts];

    let filtered_account = current_recipients.filter(
      (_, index) => index !== account_index
    );

    commit("UPDATE_RECIPIENT_ACCOUNT", [...filtered_account]);
  },

  // Action to clear out all account from list
  clearOutAccountList({ commit }) {
    commit("UPDATE_RECIPIENT_ACCOUNT", []);
  },
};
