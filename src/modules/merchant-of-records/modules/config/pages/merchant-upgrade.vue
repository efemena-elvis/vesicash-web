<template>
  <div class="merchant-upgrade">
    <PageBackBtn history_mode />

    <div class="vesicash-container mgt-24">
      <div class="title-text h4-text mgb-8 grey-900 text-center">
        Upgrade your account
      </div>

      <div class="description-text h7-text grey-800 text-center mgb-40">
        Let’s help you upgrade your account so you can succesfully deploy your
        business to new markets across the world
      </div>
    </div>

    <div class="container">
      <div class="row">
        <template v-if="loading_verification">
          <div
            class="col-12 col-md-10 col-lg-8 mx-auto"
            v-for="i in 4"
            :key="i"
          >
            <div class="cards-container">
              <div class="skeleton-loader card-skeleton rounded-12"></div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="col-12 col-md-10 col-lg-8 mx-auto">
            <div class="mgb-24">
              <verification-card
                title="Business information"
                subtitle="Provide information about your business."
                cta_title="Update business information"
                :verified="isBusinessVerified"
                :check_verification_state="true"
                @action="toggleBusinessInfoModal"
              >
                <BusinessIcon />
              </verification-card>
            </div>

            <div class="mgb-24">
              <verification-card
                title="Company registration document"
                subtitle="Upload your business registration document for verification."
                cta_title="Verify business"
                :verified="isCACDocVerified.is_verified"
                :verification_state="isCACDocVerified.verification_state"
                :check_verification_state="true"
                @action="toggleCACRegistrationModal"
              >
                <FileIcon active />
              </verification-card>
            </div>

            <div class="mgb-24">
              <verification-card
                title="Tax identification number"
                subtitle="Validate your business tax identification."
                cta_title="Verify TIN"
                :verified="isTinVerified.is_verified"
                :verification_state="isTinVerified.verification_state"
                :check_verification_state="true"
                @action="toggleTinVerificationModal"
              >
                <FileIcon active />
              </verification-card>
            </div>

            <div class="mgb-24">
              <verification-card
                title="BVN details"
                subtitle="Confirm your BVN details."
                cta_title="Verify BVN details"
                :verified="isBvnVerified"
                @action="toggleBvnModal"
              >
                <BvnIcon />
              </verification-card>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_business_info_modal">
        <BusinessInfoModal
          @saved="showSuccessModal('show_business_info_modal', $event)"
          @closeTriggered="toggleBusinessInfoModal"
        />
      </transition>

      <transition name="fade" v-if="show_cac_registration_modal">
        <CoporationVerificationModal
          @saved="showSuccessModal('show_doc_upload_modal', $event)"
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
          @closeTriggered="toggleSuccessModal"
          @done="toggleSuccessModal"
          :message="response_message"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MoRDocValidate from "@/modules/merchant-of-records/modules/config/mixins/mor-docs-mixin";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import VerificationCard from "@/modules/settings/components/card-comps/verification-card";
import BusinessInfoModal from "@/modules/settings/modals/business-info-modal";
import VerificationDocumentModal from "@/modules/settings/modals/verification-document-modal";
import CoporationVerificationModal from "@/modules/settings/modals/coporation-verification-modal";
import TinVerificationModal from "@/modules/settings/modals/tin-verification-modal";
import VerificationBvnModal from "@/modules/settings/modals/verification-bvn-modal";
import SuccessModal from "@/shared/modals/success-modal";

export default {
  name: "MerchantUpgrade",

  mixins: [MoRDocValidate],

  components: {
    PageBackBtn,
    VerificationCard,
    BusinessInfoModal,
    VerificationDocumentModal,
    CoporationVerificationModal,
    TinVerificationModal,
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
    isBusinessVerified() {
      return this.getUser.business_name && this.getUser.business_address
        ? true
        : false;
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
  },

  data: () => ({
    show_success_modal: false,
    show_cac_registration_modal: false,
    show_bvn_modal: false,
    show_business_info_modal: false,
    show_tin_verification_modal: false,

    business_info_verified: false,
    document_verified: false,
    bvn_verified: false,

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

      this.loading_verification = false;

      if (response.code === 200) {
        this.user_verifications = response.data;

        if (this.validateMoRVerification) {
          this.$router.push("/settings/mor-setup");
        }
      }
    },

    getVerificationState(payload) {
      if (payload?.is_verified) return "verified";
      else {
        if (this.base_timestamp === payload?.verified_at) return "pending";
        else return "declined";
      }
    },

    toggleBusinessInfoModal() {
      this.show_business_info_modal = !this.show_business_info_modal;
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
.merchant-upgrade {
  .description-text {
    font-size: toRem(17);
    margin: 0 auto;
    width: 60%;
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
}
</style>
