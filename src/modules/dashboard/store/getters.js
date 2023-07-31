export default {
  getWallet: (state) => state.wallet,

  getWalletType: (state) => state.wallet.type,

  getWalletBalances: (state) => state.wallet.balances,

  getNairaBalance: (state) => {
    const naira_balance = state.wallet.balances.find(
      (balance) => balance.currency === "NGN"
    );
    return naira_balance ? naira_balance?.available : "0.00";
  },

  getDollarBalance: (state) => {
    const dollar_balance = state.wallet.balances.find(
      (balance) => balance.currency === "USD"
    );
    return dollar_balance ? dollar_balance?.available : "0.00";
  },

  getWithdrawalMeta: (state) => state.withdrawal_meta,
  getWithdrawalRequest: (state) => state.withdrawal_request ?? {},
};
