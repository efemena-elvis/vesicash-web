<template>
  <div class="col-12 col-lg-10 col-xl-8 identity-onboarding mgb-40">
    <!-- VERIFICATION CARDS -->
    <div class="verification-cards">
      <div class="row mgb-40">
        <!-- <div class="title-text grey-900 mgb-4 h7-text fw-semibold">
          Verify business owner(s) identity
        </div> -->

        <div class="meta-text grey-600 tertiary-2-text mgb-40">
          Complete identity verification by verifying a personal identification number
          of the business owner
        </div>

        <!-- DIRECTOR CARDS -->
        <div class="director-cards mgb-30">
          <div class="mgb-10" v-for="(item, index) in directors" :key="index">
            <verification-card
              :title="`Director identity verification`"
              subtitle="Verify director personal identification document."
              cta_title="Verify director"
              :verified="item.verified"
              :show_remove_btn="item.id > 1 ? true : false"
              @action="toggleDocUploadModal(item.id)"
              @removeCard="directors.pop()"
            >
              <UserIcon />
            </verification-card>
          </div>
        </div>

        <button
          v-if="false"
          class="btn btn-md btn-tertiary mgl-12"
          style="width: max-content"
          @click="addDirectorCard"
          :disabled="isLastDirectorVerified"
        >
          <span class="icon-plus mgr-6"></span>
          Add another director
        </button>
      </div>

      <div class="action-row">
        <button
          @click="moveToNextOnboarding"
          ref="btnRef"
          :disabled="firstDirectorIsVerified"
          class="btn btn-md btn-primary"
        >
          Complete onboarding
        </button>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_doc_upload_modal">
        <!-- :director_count="director_count" -->
        <!-- :is_director_type="false" -->
        <VerificationDocumentModal
          @saved="showSuccessModal('show_doc_upload_modal', $event)"
          @closeTriggered="toggleDocUploadModal"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <SuccessModal
          main_cta_title="Continue onboarding"
          @closeTriggered="toggleSuccessModal"
          @done="toggleSuccessModal"
          message="Director identity document has been successfully submitted for verification"
        />
      </transition>

      <transition name="fade" v-if="show_congrat_dialog">
        <congratModal @closeTriggered="toggleCongratDialog" />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";
import VerificationCard from "@/modules/settings/components/card-comps/verification-card";
import VerificationDocumentModal from "@/modules/settings/modals/verification-document-modal";
import SuccessModal from "@/shared/modals/success-modal";

export default {
  name: "onboardingIdentity",

  metaInfo: {
    title: "Identity verification",
    titleTemplate: "%s - Vesicash",
  },

  mixins: [onboardingMixin],

  components: {
    VerificationCard,
    VerificationDocumentModal,
    SuccessModal,
    UserIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/user-icon"
      ),
    congratModal: () =>
      import(
        /* webpackChunkName: "onboarding-module" */ "@/modules/dashboard/modals/congrat-modal"
      ),
  },

  computed: {
    firstDirectorIsVerified() {
      return this.directors[0].verified ? false : true;
    },

    isLastDirectorVerified() {
      return this.directors.at(-1).verified ? false : true;
    },
  },

  data: () => ({
    show_congrat_dialog: false,
    show_success_modal: false,
    user_verifications: [],

    show_doc_upload_modal: false,

    director_count: 1,
    directors: [
      {
        id: 1,
        slug: "",
        verified: false,
      },
    ],

    form: {
      countries: [],
      wallet_currency_codes: [],
      business_type_id: 1,
      usage_type: "online",
      documents: [],
    },
  }),

  mounted() {
    this.enableMerchantPayment();
    this.fetchVerifications();
  },

  methods: {
    ...mapActions({
      saveMoROnboarding: "merchant/saveMoROnboarding",
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
        this.checkDirectorsVerification(response.data);
      }
    },

    async enableMerchantPayment() {
      await this.handleDataRequest({
        action: "saveMoROnboarding",
        payload: this.form,
        alert_handler: {
          error: "Unable to configure MoR at the moment",
        },
      });
    },

    checkDirectorsVerification(verifications) {
      let director_list = verifications.filter((item) =>
        item.verification_type.includes("nin")
      );

      if (director_list.length) {
        this.directors = [];

        director_list.map((item, index) => {
          let director_data = {};
          director_data.id = index + 1;
          director_data.slug = item.verification_type;
          director_data.verified = item.is_verified;

          this.directors.push(director_data);
        });
      }
    },

    async moveToNextOnboarding() {
      this.handleButtonStateOnRequest("btnRef", "start");
      await this.handleOnboardingUpdate("", true);
    },

    toggleCongratDialog() {
      this.show_congrat_dialog = !this.show_congrat_dialog;
    },

    toggleDocUploadModal(director_id = null) {
      this.director_count = director_id ?? 0;
      this.show_doc_upload_modal = !this.show_doc_upload_modal;
    },

    toggleSuccessModal() {
      this.show_success_modal = !this.show_success_modal;
      if (!this.show_success_modal) this.fetchVerifications();
    },

    showSuccessModal(modal) {
      this.fetchVerifications();
      this[modal] = false;
      this.show_success_modal = true;
    },

    addDirectorCard() {
      this.directors = [
        ...this.directors,
        { id: this.directors.length + 1, verified: false },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.identity-onboarding {
  .description-text {
    @include font-height(15, 25);
  }

  .card-wrapper {
    margin-bottom: toRem(24);

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .action-row {
    .btn {
      width: max-content;
      padding: toRem(9.5) toRem(52);
    }
  }
}
</style>
