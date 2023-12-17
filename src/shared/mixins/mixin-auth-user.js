import { mapGetters } from "vuex";
import { serviceUtils, serviceStorage } from "@/shared/services";

const MixinAuthUser = {
  computed: {
    ...mapGetters({
      getAuthUser: "auth/getAuthUser",
      getAuthToken: "auth/getAuthToken",
      getMerchantData: "general/getMerchantData",
      getOnboardingData: "general/getOnboardingData",
      getTaxRate: "merchantTransactions/getTaxRate",
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

    // GET BUSINESS NAME WHEN A USER IS NOT LOGGED IN
    getBusinessName() {
      let business_name = serviceStorage.getStorage({
        storage_name: "identifier_token",
      });

      return business_name ? serviceUtils.decodeString(business_name) : null;
    },

    isMoRSetupEnabled() {
      return this.getMerchantData;
    },

    getOnboardingState() {
      return this.getOnboardingData;
    },

    getMoRTaxRates() {
      return this.getTaxRate;
    },
  },
};

export default MixinAuthUser;
