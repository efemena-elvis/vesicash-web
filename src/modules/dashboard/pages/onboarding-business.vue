<template>
  <div class="col-12 col-md-10 col-xl-8 business-onboarding">
    <div class="description-text grey-800 mgb-40 tertiary-1-text">
      Complete your business account verification in the following steps.
    </div>

    <!-- VERIFICATION CARDS -->
    <div class="verification-cards">
      <div class="row">
        <template v-if="loading_verification">
          <div v-for="i in 3" :key="i">
            <div class="cards-container">
              <div class="skeleton-loader card-skeleton rounded-12"></div>
            </div>
          </div>
        </template>

        <template v-else>
          <div>
            <div class="mgb-24">
              <verification-card
                title="Bank verification number (BVN)"
                subtitle="Verify your BVN details"
                cta_title="Verify BVN details"
                :verified="isBvnVerified"
                @action="toggleBvnModal"
              >
                <BvnIcon />
              </verification-card>
            </div>

            <div class="mgb-24">
              <verification-card
                title="Company registration document"
                subtitle="Upload your business registration document for verification."
                cta_title="Verify business"
                :verification_state="isCACDocVerified.verification_state"
                :verified="isCACDocVerified.is_verified"
                :check_verification_state="false"
                @action="toggleCACRegistrationModal"
                :disable_verify="disableCACVerification"
              >
                <FileIcon active />
              </verification-card>
            </div>

            <div class="mgb-24">
              <verification-card
                title="Tax identification number"
                subtitle="Validate your business tax identification number."
                cta_title="Verify TIN"
                :verified="isTinVerified.is_verified"
                :verification_state="isTinVerified.verification_state"
                :check_verification_state="false"
                @action="toggleTinVerificationModal"
                :disable_verify="disableTINVerification"
              >
                <FileIcon active />
              </verification-card>
            </div>
          </div>
        </template>
      </div>

      <div class="action-row mgt-20">
        <button
          @click="moveToNextOnboarding"
          ref="btnRef"
          class="btn btn-md btn-primary"
          :disabled="isDisabled"
        >
          Next
        </button>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_cac_registration_modal">
        <CoporationVerificationModal
          @saved="showSuccessModal('show_cac_registration_modal', $event)"
          @closeTriggered="toggleCACRegistrationModal"
        />
      </transition>

      <transition name="fade" v-if="show_tin_verification_modal">
        <TinVerificationModal
          @saved="showSuccessModal('show_tin_verification_modal', $event)"
          @closeTriggered="toggleTinVerificationModal"
        />
      </transition>

      <transition name="fade" v-if="show_bvn_modal">
        <VerificationBvnModal
          @saved="showSuccessModal('show_bvn_modal', $event)"
          @closeTriggered="toggleBvnModal"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <SuccessModal
          main_cta_title="Continue onboarding"
          @closeTriggered="toggleSuccessModal"
          @done="toggleSuccessModal"
          :message="response_message"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";
import CoporationVerificationModal from "@/modules/settings/modals/coporation-verification-modal";
import TinVerificationModal from "@/modules/settings/modals/tin-verification-modal";
import VerificationBvnModal from "@/modules/settings/modals/verification-bvn-modal";
import VerificationCard from "@/modules/settings/components/card-comps/verification-card";
import SuccessModal from "@/shared/modals/success-modal";

export default {
  name: "onboardingBusiness",

  metaInfo: {
    title: "Business verification",
    titleTemplate: "%s - Vesicash",
  },

  mixins: [onboardingMixin],

  components: {
    CoporationVerificationModal,
    TinVerificationModal,
    VerificationCard,
    VerificationBvnModal,
    SuccessModal,
    BusinessIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/business-icon"
      ),
    BvnIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/bvn-icon"
      ),
    FileIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/file-icon"
      ),
  },

  computed: {
    isDisabled() {
      return this.isTinVerified.is_verified ? false : true;
      // return this.isCACDocVerified.is_verified ? false : true;
    },

    isBvnVerified() {
      if (!this.user_verifications) return false;
      const bvn_verification = this.user_verifications.find(
        (type) => type.verification_type === "bvn"
      );
      return bvn_verification ? bvn_verification?.is_verified : false;
    },

    isCACDocVerified() {
      if (!this.user_verifications) return false;
      const cac_verification = this.user_verifications.find(
        (type) => type.verification_type === "cac"
      );

      if (cac_verification) {
        return {
          is_verified: cac_verification?.is_verified,
          verification_state: this.getVerificationState(cac_verification),
        };
      } else
        return {
          is_verified: cac_verification?.is_verified,
          verification_state: "not_uploaded",
        };
    },

    isTinVerified() {
      if (!this.user_verifications) return false;
      const tin_verification = this.user_verifications.find(
        (type) => type.verification_type === "tin"
      );

      if (tin_verification) {
        return {
          is_verified: tin_verification?.is_verified,
          verification_state: this.getVerificationState(tin_verification),
        };
      } else
        return {
          is_verified: tin_verification?.is_verified,
          verification_state: "not_uploaded",
        };
    },

    disableCACVerification() {
      return this.isBvnVerified ? false : true;
    },

    disableTINVerification() {
      return this.isCACDocVerified.is_verified ? false : true;
    },
  },

  watch: {
    isTinVerified: {
      handler(tinData) {
        if (tinData.is_verified) {
          this.updateUserVerifiedData();
          this.updateBusinessVerifiedData();
        }
      },
      immediate: true,
    },
  },

  data: () => ({
    bvn_verified: false,

    show_success_modal: false,
    show_cac_registration_modal: false,
    show_bvn_modal: false,
    show_tin_verification_modal: false,

    user_verifications: [],
    response_message: "",
    loading_verification: true,
    base_timestamp: "0001-01-01T00:00:00Z",
  }),

  mounted() {
    this.fetchVerifications();
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      updateUserBusinessInfo: "settings/updateUserBusinessInfo",
      fetchUserVerifications: "settings/fetchUserVerifications",
    }),

    ...mapMutations({ UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER" }),

    async fetchVerifications() {
      const response = await this.handleDataRequest({
        action: "fetchUserVerifications",
        payload: { account_id: this.getAccountId },
        alert_handler: {
          error: "Unable to fetch user verification details",
        },
      });

      this.loading_verification = false;

      if (response.code === 200) {
        this.user_verifications = response.data;
      }
    },

    async updateUserVerifiedData() {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: {},
      });

      if (response.code === 200) {
        let { firstname, lastname } = response.data.user;

        this.UPDATE_AUTH_USER({
          ...this.getUser,
          fullname: `${firstname} ${lastname}`,
        });
      }
    },

    async updateBusinessVerifiedData() {
      const response = await this.handleDataRequest({
        action: "updateUserBusinessInfo",
        payload: {},
      });

      if (response.code === 200) {
        let { business_name, business_address, business_type } = response.data;

        this.UPDATE_AUTH_USER({
          ...this.getUser,
          business_name,
          business_address,
          business_type,
        });
      }
    },

    async moveToNextOnboarding() {
      this.handleButtonStateOnRequest("btnRef", "start");
      await this.handleOnboardingUpdate("VesicashIdentityOnboarding");
    },

    getVerificationState(payload) {
      if (payload?.is_verified) return "verified";
      else {
        if (this.base_timestamp === payload?.verified_at) return "pending";
        else return "declined";
      }
    },

    toggleBvnModal() {
      this.show_bvn_modal = !this.show_bvn_modal;
    },

    toggleSuccessModal() {
      this.show_success_modal = !this.show_success_modal;
    },

    toggleCACRegistrationModal() {
      this.show_cac_registration_modal = !this.show_cac_registration_modal;
    },

    toggleTinVerificationModal() {
      this.show_tin_verification_modal = !this.show_tin_verification_modal;
    },

    showSuccessModal(modal, message) {
      this.fetchVerifications();
      this[modal] = false;
      this.response_message = message;
      this.show_success_modal = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.business-onboarding {
  .description-text {
    @include font-height(15, 25);
  }

  .cards-container {
    display: grid;
    gap: toRem(32) 0;
    padding-bottom: toRem(24);

    @include breakpoint-down(sm) {
      gap: toRem(24) 0;
    }

    .card-skeleton {
      width: 100%;
      height: toRem(65);
    }
  }

  .action-row {
    .btn {
      width: max-content;
      padding: toRem(9.75) toRem(52);
    }
  }
}
</style>
