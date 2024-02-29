<template>
  <div class="dashboard-view">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock />

    <!-- <transition name="fade" mode="out-in">
      <div class="alert-wrapper" v-if="validateUserPhone">
        <UpgradeAlertCard
          alert_message="Great news! Your account verification is almost complete. Simply verify your phone number to finish the process."
          upgrade_action="Verify phone number"
          @upgrade="show_phone_entry = true"
        />
      </div>
    </transition> -->

    <!-- <transition name="fade" mode="out-in">
      <VerificationBlock
        :verifications="relevantVerifications"
        :loading="fetching_verifications"
        @toggle="toggleVerificationModal($event, 'OPEN')"
        v-if="!validateUserPhone"
      />
    </transition> -->

    <!-- WALLET BALANCE SECTION -->
    <WalletBlock />

    <!-- ACTIONS BLOCK -->
    <ActionsBlock />

    <template>
      <div class="wrapper mgt-59 mgb-40">
        <DashboardTransactions />
      </div>
    </template>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition
        name="fade"
        v-if="
          show_phone_entry &&
          validateUserPhone &&
          !getTourData.ongoing &&
          !show_start_walkthrough_modal &&
          !show_end_walkthrough_modal
        "
      >
        <VerifyInputModal
          @continue="updateVerificationPhone"
          :input="getUserPhone"
          @closeTriggered="show_phone_entry = false"
        />
      </transition>

      <transition name="fade" v-if="show_phone_otp_entry">
        <VerifyOTPModal
          :input="verify_phone_number"
          @done="closeAndShowSuccess('phone')"
          @closeTriggered="show_phone_otp_entry = false"
        />
      </transition>

      <transition name="fade" v-if="show_success">
        <successModal
          :message="success_message"
          main_cta_title="Close"
          @done="closeModal"
        />
      </transition>

      <transition name="fade" v-if="show_bvn_modal">
        <VerifyBVNModal
          @closeTriggered="toggleVerificationModal('bvn', 'CLOSE')"
          @saved="closeAndShowSuccess('bvn')"
        />
      </transition>

      <transition name="fade" v-if="show_nin_modal">
        <VerifyIDModal
          @closeTriggered="toggleVerificationModal('nin', 'CLOSE')"
          @saved="closeAndShowSuccess('nin')"
        />
      </transition>

      <transition name="fade" v-if="show_tin_modal">
        <VerifyTINModal
          @closeTriggered="toggleVerificationModal('tin', 'CLOSE')"
          @saved="closeAndShowSuccess('tin')"
        />
      </transition>

      <transition name="fade" v-if="show_cac_modal">
        <VerifyCACModal
          @closeTriggered="toggleVerificationModal('cac', 'CLOSE')"
          @saved="closeAndShowSuccess('cac')"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import MoRDocValidate from "@/modules/merchant-of-records/modules/config/mixins/mor-docs-mixin";
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import WalletBlock from "@/shared/components/block-comps/wallet-block";
import VerificationBlock from "@/modules/dashboard/components/card-comps/verification-block";

export default {
  name: "DashboardPage",

  mixins: [MoRDocValidate],

  metaInfo: {
    title: "Overview",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    TitleTopBlock,
    WalletBlock,
    VerificationBlock,
    ActionsBlock: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/actions-block"
      ),
    DashboardTransactions: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/dashboard-transactions"
      ),
    UpgradeAlertCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/card-comps/upgrade-alert-card"
      ),
    VerifyInputModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verify-input-modal"
      ),
    VerifyOTPModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verify-otp-modal"
      ),
    VerifyBVNModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verification-bvn-modal"
      ),
    VerifyIDModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/verification-document-modal"
      ),
    VerifyTINModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/tin-verification-modal"
      ),
    VerifyCACModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/modules/settings/modals/coporation-verification-modal"
      ),
    successModal: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/modals/success-modal"
      ),
  },

  computed: {
    ...mapGetters({
      getTransactions: "transactions/getTransactions",
      getUserVerifications: "settings/getUserVerifications",
      getTourData: "general/getTourData",
      hasUserSeenTour: "auth/hasUserSeenTour",
    }),

    relevantVerifications() {
      const verification_names = {
        cac: "Business Registration Number",
        bvn: "Bank Verification Number",
        tin: "Tax Identification Number",
        nin: "Identification Document",
      };

      return ["cac", "bvn", "tin", "nin"].map((type) => {
        const verified = this.user_verifications?.find(
          (item) => item.verification_type === type
        )?.is_verified
          ? true
          : false;

        return {
          type,
          name: verification_names[type],
          verified,
        };
      });
    },

    isPhoneVerified() {
      if (!this.getUserVerifications) return false;
      const phone_verification = this.getUserVerifications.find(
        (type) => type.verification_type === "phone"
      );
      return phone_verification ? phone_verification?.is_verified : false;
    },

    getUserPhone() {
      return this.getUser?.phone;
    },
  },

  data() {
    return {
      show_phone_entry: false,
      show_phone_otp_entry: false,
      show_success: false,
      verify_phone_number: this.getUser?.phone,

      show_bvn_modal: false,
      show_nin_modal: false,
      show_cac_modal: false,
      show_tin_modal: false,

      success_message: "Your phone number has been verified successfully",
      fetching_verifications: false,
    };
  },

  async mounted() {
    this.fetching_verifications = true;
    await this.fetchVerifications();
    this.fetching_verifications = false;

    // CLEAR OUT TRANSACTION STORE
    if (this.getTransactions?.name?.length) {
      this.RESET_TRANSACTION();
      this.clearAttachedFile();
    }
  },

  methods: {
    ...mapActions({
      clearAttachedFile: "general/clearAttachedFile",
      fetchUserVerifications: "settings/fetchUserVerifications",
      saveUserProfile: "settings/saveUserProfile",
    }),

    toggleVerificationModal(type, state) {
      switch (type) {
        case "bvn":
          this.show_bvn_modal = state === "OPEN";
          break;
        case "nin":
          this.show_nin_modal = state === "OPEN";
          break;
        case "cac":
          this.show_cac_modal = state === "OPEN";
          break;
        case "tin":
          this.show_tin_modal = state === "OPEN";
          break;
        default:
          this.show_bvn_modal = state === "OPEN";
          break;
      }
    },

    updateProfile() {
      const updatedUser = {
        ...this.getUser,
        has_seen_tour: true,
      };

      this.UPDATE_AUTH_USER(updatedUser);
    },

    updateUserPhone() {
      const updatedUser = {
        ...this.getUser,
        phone: this.verify_phone_number,
        verifications: { ...this.getUser.verifications, phone: true },
      };

      this.UPDATE_AUTH_USER(updatedUser);

      this.saveUserProfile({
        phone_number: this.verify_phone_number,
      });
    },

    updateVerificationPhone(phone) {
      this.verify_phone_number = phone;
      this.closeAndVerifyOTP();
    },

    ...mapMutations({
      RESET_TRANSACTION: "transactions/RESET_TRANSACTION",
      UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER",
    }),

    // RELOAD PAGE ON COMPLETE VERIFICATION
    closeModal() {
      location.reload();
    },

    closeAndVerifyOTP() {
      this.show_phone_entry = false;
      this.show_phone_otp_entry = true;
    },

    async closeAndShowSuccess(type) {
      this.fetching_verifications = true;
      await this.fetchVerifications();
      this.fetching_verifications = false;

      const updatedUser = {
        ...this.getUser,
        verifications: { ...this.getUser.verifications, [type]: true },
      };

      this.UPDATE_AUTH_USER(updatedUser);

      switch (type) {
        case "phone":
          {
            this.success_message =
              "Your phone number has been verified successfully";
            this.show_phone_otp_entry = false;
            this.show_success = true;
            this.updateUserPhone();
          }
          break;
        case "nin":
          {
            this.success_message = "Your NIN has been verified successfully";
            this.show_nin_modal = false;
            this.show_success = true;
          }
          break;
        case "cac":
          {
            this.success_message =
              "Business’s information have been uploaded successfully and awaiting verification. This should take 3 working days.";
            this.show_cac_modal = false;
            this.show_success = true;
          }
          break;
        case "bvn":
          {
            this.success_message = "Your BVN has been verified successfully";
            this.show_bvn_modal = false;
            this.show_success = true;
          }
          break;
        case "tin":
          {
            this.success_message =
              "Your Tax Identification Number has been verified successfully";
            this.show_tin_modal = false;
            this.show_success = true;
          }
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-view {
  position: relative;
  padding-bottom: toRem(25);

  .alert-wrapper {
    width: 680px;
    max-width: 99%;
    margin-bottom: toRem(24);
  }
}
</style>
