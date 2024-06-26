import { mapActions } from "vuex";
import { serviceUtils } from "@/shared/services";

const morDocValidate = {
  computed: {
    validateMoRVerification() {
      let mor_verifications = this.user_verifications.filter((data) =>
        ["cac", "bvn", "tin", "nin"].includes(data.verification_type)
      );

      let business_verified =
        this.getUser.business_name && this.getUser.business_address
          ? true
          : false;

      if (mor_verifications.length === 4) {
        return mor_verifications.every((item) => item.is_verified) &&
          business_verified
          ? true
          : false;
      } else return false;
    },

    validateUserAccount() {
      return serviceUtils?.checkAccountStatus([...this.user_verifications]);
    },

    validateUserPhone() {
      return false; // DISABLE FOR NOW
      if (!this.user_verifications?.length) return false;
      let phone_verification = this.user_verifications.find(
        (item) => item.verification_type === "phone"
      );

      return phone_verification?.is_verified ? false : true;
    },

    validateUserBVN() {
      if (!this.user_verifications?.length) return false;
      return !this.validateUserPhone;
    },
  },

  data() {
    return {
      user_verifications: [],
    };
  },

  methods: {
    ...mapActions({
      fetchUserVerifications: "settings/fetchUserVerifications",
    }),

    async fetchVerifications() {
      const response = await this.handleDataRequest({
        action: "fetchUserVerifications",
        payload: { account_id: this.getAccountId },
        alert_handler: {
          error: "Unable to fetch user verification details",
        },
      });

      if (response.code === 200) {
        this.user_verifications = response.data;
      }
    },
  },
};

export default morDocValidate;
