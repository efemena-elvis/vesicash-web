import { mapActions } from "vuex";

const morDocValidate = {
  computed: {
    validateMoRVerification() {
      let mor_verifications = this.user_verifications.filter((data) =>
        ["cac", "bvn", "tin"].includes(data.verification_type)
      );

      let business_verified =
        this.getUser.business_name && this.getUser.business_address
          ? true
          : false;

      if (mor_verifications.length === 3) {
        return mor_verifications.every((item) => item.is_verified) &&
          business_verified
          ? true
          : false;
      } else return false;
    },

    validateUserAccount() {
      let mor_verifications = this.user_verifications.filter((data) =>
        ["cac", "bvn", "tin"].includes(data.verification_type)
      );

      if (mor_verifications.length === 3) {
        return mor_verifications.every((item) => item.is_verified);
      } else return false;
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
