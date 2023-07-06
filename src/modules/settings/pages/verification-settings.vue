<template>
  <div>
    <!-- PAGE TITLE -->
    <div class="page-title primary-1-text grey-900 mgb-4">Verification</div>

    <!-- PAGE META -->
    <div class="page-meta tertiary-2-text grey-600">
      Verify your bvn, business documents and settlements documents here to be
      able to carry out transactions
    </div>

    <div class="cards-container" v-if="loading_verification">
      <div
        class="skeleton-loader card-skeleton rounded-12"
        v-for="i in 5"
        :key="i"
      ></div>
    </div>

    <div class="cards-container" v-else>
      <verification-card
        v-if="isBusiness"
        title="Business information"
        subtitle="Provide information about your business."
        cta_title="Update business information"
        @action="toggleBusinessInfoModal"
        :verified="false"
      >
        <BusinessIcon />
      </verification-card>

      <verification-card
        v-if="isBusiness"
        title="Company registration document"
        subtitle="Upload your business registration document for verification."
        cta_title="Verify business"
        @action="toggleCACRegistrationModal"
        :verified="isBusinessVerified"
      >
        <FileIcon active />
      </verification-card>

      <verification-card
        title="Other documents"
        subtitle="Choose and upload a document for verification."
        cta_title="Verify document"
        @action="toggleDocUploadModal"
        :verified="isDocVerified"
        :verified_docs="[1, 2]"
      >
        <FileIcon active />
      </verification-card>

      <verification-card
        v-if="isBusiness"
        title="Directors Information"
        subtitle="Confirm directors count and identification details."
        cta_title="Verify directors"
        @action="toggleDirectorVerifyModal"
        :verified="isDocVerified"
      >
        <UserIcon />
      </verification-card>

      <verification-card
        title="Phone number verification"
        subtitle="Verify your phone number."
        cta_title="Verify phone number"
        @action="toggleInputModal"
        :verified="isPhoneVerified"
      >
        <TelephoneIcon />
      </verification-card>

      <verification-card
        title="BVN details"
        subtitle="Confirm your BVN details."
        cta_title="Verify BVN details"
        @action="toggleBvnModal"
        :verified="isBvnVerified"
      >
        <BvnIcon />
      </verification-card>

      <verification-card
        title="Settlement account"
        subtitle="Provide your bank account details for withdrawals and settlements"
        cta_title="Add bank account"
        @action="$router.push({ name: 'AccountSettings' })"
        :verified="hasSettlementAccount"
      >
        <SettlementIcon />
      </verification-card>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_input_modal">
        <VerifyInputModal
          @continue="initiateOTPRequest"
          @closeTriggered="toggleInputModal"
        />
      </transition>

      <transition name="fade" v-if="show_otp_modal">
        <VerifyOtpModal @done="updateUserProfile" />
      </transition>

      <transition name="fade" v-if="show_business_info_modal">
        <BusinessInfoModal
          @saved="
            showSuccessModal(
              'show_business_info_modal',
              'business_info_verified',
              $event
            )
          "
          @closeTriggered="toggleBusinessInfoModal"
        />
      </transition>

      <transition name="fade" v-if="show_doc_upload_modal">
        <VerificationDocumentModal
          @saved="
            showSuccessModal(
              'show_doc_upload_modal',
              'document_verified',
              $event
            )
          "
          @closeTriggered="toggleDocUploadModal"
        />
      </transition>

      <transition name="fade" v-if="show_director_verify_modal">
        <DirectorVerificationModal
          @saved="showSuccessModal('show_doc_upload_modal', '_', $event)"
          @closeTriggered="toggleDirectorVerifyModal"
        />
      </transition>

      <transition name="fade" v-if="show_cac_registration_modal">
        <CoporationVerificationModal
          @saved="
            showSuccessModal(
              'show_doc_upload_modal',
              'document_verified',
              $event
            )
          "
          @closeTriggered="toggleCACRegistrationModal"
        />
      </transition>

      <transition name="fade" v-if="show_bvn_modal">
        <VerificationBvnModal
          @saved="showSuccessModal('show_bvn_modal', 'bvn_verified', $event)"
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
import { mapActions, mapMutations } from "vuex";
import VerificationCard from "@/modules/settings/components/card-comps/verification-card";
import VerifyInputModal from "@/modules/settings/modals/verify-input-modal";
import VerifyOtpModal from "@/modules/settings/modals/verify-otp-modal";
import BusinessInfoModal from "@/modules/settings/modals/business-info-modal";
import VerificationDocumentModal from "@/modules/settings/modals/verification-document-modal";
import DirectorVerificationModal from "@/modules/settings/modals/director-verification-modal";
import CoporationVerificationModal from "@/modules/settings/modals/coporation-verification-modal";
import VerificationBvnModal from "@/modules/settings/modals/verification-bvn-modal";
import SuccessModal from "@/shared/modals/success-modal";

export default {
  name: "VerificationSettings",

  components: {
    VerificationCard,
    VerifyInputModal,
    VerifyOtpModal,
    BusinessInfoModal,
    DirectorVerificationModal,
    VerificationDocumentModal,
    CoporationVerificationModal,
    VerificationBvnModal,
    SuccessModal,

    TelephoneIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/telephone-icon"
      ),
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
    UserIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/user-icon"
      ),
    SettlementIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/settlement-icon"
      ),
  },

  computed: {
    isBusiness() {
      return this.getAccountType === "business" ? true : false;
    },

    isPhoneVerified() {
      if (!this.user_verifications) return false;
      const phone_verification = this.user_verifications.find(
        (type) => type.verification_type === "phone"
      );
      return phone_verification ? phone_verification?.is_verified : false;
    },

    isBvnVerified() {
      if (!this.user_verifications) return false;
      const bvn_verification = this.user_verifications.find(
        (type) => type.verification_type === "bvn"
      );
      return bvn_verification ? bvn_verification?.is_verified : false;
    },

    isBusinessVerified() {
      if (!this.user_verifications) return false;
      const business_verification = this.user_verifications.find(
        (type) => type.verification_type === "cac"
      );
      return business_verification ? business_verification?.is_verified : false;
    },

    isDocVerified() {
      if (!this.user_verifications) return false;
      const doc_verification = this.user_verifications.find(
        (type) => type.verification_type === "cac"
      );
      return doc_verification ? doc_verification?.is_verified : false;
    },

    hasSettlementAccount() {
      return this.has_settlement_account;
    },
  },

  watch: {
    $route: {
      handler(value) {
        if (value?.query?.verify_doc) {
          this.show_doc_upload_modal = true;
          this.$router.replace({ name: this.$route.name });
        }
      },
      immediate: true,
    },
  },

  data() {
    return {
      show_input_modal: false,
      show_otp_modal: false,
      show_success_modal: false,
      show_doc_upload_modal: false,
      show_director_verify_modal: false,
      show_cac_registration_modal: false,
      show_bvn_modal: false,
      show_business_info_modal: false,

      phone_verified: false,
      business_info_verified: false,
      document_verified: false,
      bvn_verified: false,
      response_message: "",
      loading_verification: true,
      updated_phone: "",
      has_settlement_account: false,

      user_verifications: [
        {
          is_verified: false,
          verification_type: "phone",
        },
        {
          is_verified: false,
          verification_type: "email",
        },
      ],
    };
  },

  mounted() {
    this.checkSettlementAccount();
    this.fetchVerifications();
  },

  methods: {
    ...mapActions({
      fetchUserVerifications: "settings/fetchUserVerifications",
      saveUserProfile: "settings/saveUserProfile",
      fetchAllBanks: "settings/fetchAllBanks",
    }),

    ...mapMutations({ UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER" }),

    async checkSettlementAccount() {
      const response = await this.fetchAllBanks(this.getAccountId);
      this.has_settlement_account = response?.data?.some(
        (bank) => bank.category === "settlement"
      );
    },

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
        console.log(response);
        this.user_verifications = response.data;
      }
    },

    toggleInputModal() {
      this.show_input_modal = !this.show_input_modal;
    },

    toggleOtpModal() {
      this.show_otp_modal = !this.show_otp_modal;
    },

    initiateOTPRequest(phone) {
      this.updated_phone = phone;
      this.toggleInputModal();
      this.toggleOtpModal();
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

    toggleDocUploadModal() {
      this.show_doc_upload_modal = !this.show_doc_upload_modal;
    },

    toggleDirectorVerifyModal() {
      this.show_director_verify_modal = !this.show_director_verify_modal;
    },

    toggleCACRegistrationModal() {
      this.show_cac_registration_modal = !this.show_cac_registration_modal;
    },

    async showSuccessModal(modal, verified, message) {
      await this.fetchVerifications();
      this[modal] = false;
      // this[verified] = true;
      this.response_message = message;
      this.show_success_modal = true;
    },

    updateProfile() {
      const updatedUser = {
        ...this.getUser,
        phone: this.updated_phone,
      };

      this.UPDATE_AUTH_USER(updatedUser);

      this.saveUserProfile({
        account_id: this.getAccountId,
        updates: {
          phone_number: this.updated_phone,
        },
      });
    },

    updateUserProfile() {
      const phone_verification_message =
        "Your phone number has been verified successfully";
      this.showSuccessModal(
        "show_otp_modal",
        "phone_verified",
        phone_verification_message
      );

      this.updateProfile();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-meta {
  border-bottom: toRem(0.5) solid getColor("grey-200");
  padding-bottom: toRem(24);
  margin-bottom: toRem(32);
}

.cards-container {
  display: grid;
  gap: toRem(32) 0;
  padding-bottom: toRem(100);

  @include breakpoint-down(sm) {
    gap: toRem(24) 0;
  }

  .card-skeleton {
    width: 100%;
    height: toRem(65);
  }
}
</style>
