import { mapGetters } from "vuex";
import { serviceUtils } from "@/shared/services";

const MixinAuthUser = {
  computed: {
    ...mapGetters({
      getAuthUser: "auth/getAuthUser",
      getAuthToken: "auth/getAuthToken",
    }),

    // ==============================
    // GET AUTH USER OBJECT
    // ==============================
    getUser() {
      return Object.keys(this.getAuthUser).length ? this.getAuthUser : {};
    },

    // ==============================
    // GET AUTH USER OBJECT
    // ==============================
    getUserToken() {
      return this.getAuthToken ?? null;
    },

    // ==============================
    // GET USER LOGIN COUNT
    // ==============================
    getUserLoginCount() {
      return (
        Object.keys(this.getAuthUser).length &&
        Number(serviceUtils.decodeString(this.getAuthUser.total_entry))
      );
    },

    // ==============================
    // GET USER ACCOUNT TYPE
    // ==============================
    getAccountType() {
      return (
        Object.keys(this.getAuthUser).length &&
        serviceUtils.decodeString(this.getAuthUser.account_type)
      );
    },

    // ==============================
    // GET USER ACCOUNT ID
    // ==============================
    getAccountId() {
      return (
        Object.keys(this.getAuthUser).length &&
        Number(serviceUtils.decodeString(this.getAuthUser.account_token))
      );
    },

    // ==============================
    // GET USER BUSINESS ID
    // ==============================
    getBusinessId() {
      return (
        Object.keys(this.getAuthUser).length &&
        Number(serviceUtils.decodeString(this.getAuthUser.business_token))
      );
    },

    getBusinessData() {
      let business_name =
        Object.keys(this.getAuthUser).length && this.getAuthUser.business_name;

      let escrow_charge =
        Object.keys(this.getAuthUser).length &&
        JSON.parse(serviceUtils.decodeString(this.getAuthUser.business_charge));

      return {
        business_id: this.getBusinessId,
        business_name,
        escrow_charge,
      };
    },

    isMoRSetupEnabled() {
      return this.getAuthUser.is_merchant ?? false;
      // return true;
    },
  },
};

export default MixinAuthUser;
