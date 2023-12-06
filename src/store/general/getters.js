export default {
  getFileData: (state) => state.file,
  getAllFilesData: (state) => state.all_files,
  getTourData: (state) => state.tour,
  getWalletSize: (state) => state.wallets,
  getOnboardingData: (state) => state.onboarding,
  getMerchantData: (state) => state.is_merchant,
  getWalletTransferDetails: (state) => state.wallet_transfer_details,
  getTransactionCharges: (state) => state.transaction_charges,
  getEscrowCharge: (state) => state.escrow_charge,
};
