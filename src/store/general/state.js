import { serviceStorage } from "@/shared/services";

export default () => ({
  file: {
    name: "",
    size: "",
    progress: 0,
    uploading: false,
  },

  all_files: [],

  tour: {
    count: 0,
    total: 8,
    ongoing: false,
  },

  wallets:
    serviceStorage.getStorage({
      storage_name: "user_wallet_size",
      storage_type: "object",
    }) || [],

  onboarding: {
    is_completed: false,
    completed_routes: [],
  },

  is_merchant: false,
});
