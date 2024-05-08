<template>
  <div class="pdb-40">
    <transition name="fade" mode="out-in">
      <div v-if="show_business_info">
        <div class="title-text h4-text mgb-8 grey-900">Business details</div>
        <div class="grey-600">Tell us about your business</div>
        <div class="mgt-35 business-form">
          <div class="form-group">
            <FormFieldInput
              label_title="Registered Business name"
              label_subtitle="A government registered business name"
              label_id="businessName"
              placeholder="Enter a government registered business name"
              :input_value="getFormFieldValueMx(form, 'business_name')"
              @getInputState="updateFormFieldMx($event, 'business_name')"
              :error_handler="{
                type: 'required',
                message: 'Business name is a required field',
              }"
            />
          </div>

          <div class="form-group position-relative">
            <div v-on-clickaway="determineTargetArea" @click="toggleDropdown">
              <FormFieldInput
                label_title="Where is your business registered?"
                label_subtitle="In which country is your business registered?"
                label_id="businessLocation"
                placeholder="Select business primary location"
                :is_readonly="true"
                :input_value="getFormFieldValueMx(form, 'country')"
              />
            </div>

            <template v-if="show_dropdown">
              <CountryDropSelect
                :countries="countries_data"
                is_country_only
                @countrySelected="updateFormFieldMx($event, 'country', true)"
              />
            </template>
          </div>

          <button
            class="btn btn-md btn-primary action-button"
            @click="show_business_info = false"
            :disabled="nextDisabled"
          >
            Next
          </button>
        </div>
      </div>

      <div v-if="hasBusinessType">
        <div class="title-text h4-text mgb-6 grey-900">
          Business verification
        </div>
        <div class="grey-600">Tell us about your business</div>

        <div class="verification-block">
          <div class="verification-width">
            <verification-card
              title="RC Number"
              subtitle="Company Registered Code Number"
              cta_title="Verify RC Number"
              @action="toggleRcModal"
            >
              <BusinessIcon />
            </verification-card>
          </div>

          <div class="tertiary-3-text error-text" v-if="show_error">
            No directors associated with the RC number. Please update and retry
          </div>

          <div class="mgt-40" v-if="show_directors">
            <div class="h5-text mgb-8 grey-900 font-semibold">
              Verify director’s credential
            </div>
            <div class="grey-600 tertiary-2-text verification-width">
              We have displayed below a list of your directors below with the
              type of verification associated with them. Please select one.
            </div>
            <div class="director-cards">
              <div
                class="card"
                v-for="director in directors"
                :key="director.name + director.email"
                @click="verifyDirector(director)"
              >
                <div class="grey-500">
                  <div class="secondary-2-text">{{ director.name }}</div>
                  <div class="tertiary-3-text mgt-2">{{ director.email }}</div>
                  <div class="secondary-3-text grey-700 mgt-8">
                    {{ director.id || "------" }}
                  </div>
                  <div class="secondary-3-text grey-700 mgt-2">
                    Bank Verification Number
                  </div>
                </div>
                <span class="icon icon-caret-right"></span>
              </div>
            </div>
          </div>

          <div class="form-group" v-if="false">
            <div class="form-label">Verify director identity</div>

            <!-- SELECT INPUT FIELD -->
            <DropSelectInput
              placeholder="Choose director id type to verify"
              :options="directors"
              @optionSelected="updateSelectedDirector"
            />
          </div>
          <!-- 
          <verification-card
            title="Bank Verification Number"
            subtitle="BVN of one of your founders"
            cta_title="Verify BVN details"
            @action="toggleBvnModal"
          >
            <BvnIcon />
          </verification-card> -->
          <button
            class="btn btn-md btn-primary finish-button"
            :disabled="!selected_id"
            @click="toggleDirectorModal"
            v-if="false"
          >
            Verifiy director
          </button>
          <router-link
            to="/dashboard"
            class="btn btn-md btn-primary finish-button dash-btn"
            v-if="false"
          >
            Skip to Dashboard
          </router-link>
        </div>
      </div>

      <div v-else>
        <!-- <PageBackBtn custom_mode @clicked="switchView" /> -->
        <div class="row mgb-40 business-type-wrapper">
          <div class="col-12">
            <div class="title-text h4-text mgb-30 grey-900">
              Select your business type
            </div>
          </div>

          <div
            class="col-12 col-sm-6"
            v-for="(item, index) in business_types"
            :key="index"
          >
            <SelectDialogCard
              :option="item"
              @dialogSelected="handleRadioSelection($event)"
            />
          </div>

          <div class="col-12 col-sm-6" v-if="others_selected">
            <label class="form-label">Specify business type</label>
            <textarea
              placeholder="Specify your business type here"
              rows="2"
              class="form-control"
              v-model="business_type"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-md btn-primary action-button"
          :disabled="finishDisabled"
          @click="updateUserBusinessDetails"
          ref="btnRef"
        >
          Next
        </button>
      </div>
    </transition>
    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_bvn_modal">
        <VerificationBvnModal
          @saved="show_bvn_modal = false"
          @closeTriggered="toggleBvnModal"
        />
      </transition>

      <transition name="fade" v-if="show_rc_modal">
        <CoporationVerificationModal
          @saved="rcSaved"
          @closeTriggered="toggleRcModal"
        />
      </transition>

      <transition name="fade" v-if="show_director_modal">
        <DirectorIdentityModal
          @saved="completeOnboarding"
          @closeTriggered="toggleDirectorModal"
          :director="selected_director"
          :id="selected_id"
          :rcn="provided_rcn"
        />
      </transition>
      <!-- 466011 -->
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";
import CountryHelper from "@/shared/mixins/mixin-country-helper";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import VerificationCard from "@/modules/settings/components/card-comps/verification-card";
import VerificationBvnModal from "@/modules/settings/modals/verification-bvn-modal";
import CoporationVerificationModal from "@/modules/settings/modals/coporation-verification-modal";
import DirectorIdentityModal from "../../settings/modals/director-identity-modal";

export default {
  name: "onboardingBusinessDetails",

  metaInfo: {
    title: "Business information",
    titleTemplate: "%s - Vesicash",
  },

  mixins: [onboardingMixin, CountryHelper],

  components: {
    SelectDialogCard: () =>
      import(
        /* webpackChunkName: "onboarding-module" */ "@/shared/components/card-comps/select-dialog-card"
      ),
    BusinessIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/business-icon"
      ),
    BvnIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/bvn-icon"
      ),
    PageBackBtn,
    VerificationBvnModal,
    CoporationVerificationModal,
    VerificationCard,
    DirectorIdentityModal,
  },

  computed: {
    isDisabled() {
      return this.business_type && this.form.business_name.validated
        ? false
        : true;
    },

    nextDisabled() {
      return !this.form.business_name.validated || !this.form.country.validated;
    },

    finishDisabled() {
      return !this.business_type;
    },

    businessDetails() {
      return {
        // business_name: this.form.business_name.value,
        business_type: this.business_type,
        // country: this.form.country.value,
      };
    },

    hasBusinessType() {
      return !!this.getUser?.business_type;
    },
  },

  data: () => ({
    show_bvn_modal: false,
    show_rc_modal: false,
    show_director_modal: false,
    form: {
      business_name: {
        validated: false,
        value: "",
      },
      country: {
        validated: false,
        value: "",
      },
    },

    show_business_info: false,

    business_type: null,
    other_business_type: "",
    others_selected: false,

    use_case: null,

    selected_director: null,
    selected_id: null,
    provided_rcn: "",
    show_directors: false,
    show_error: false,
    directors: [],

    business_types: [
      {
        id: 1,
        title: "Digital product",
        slug: "digital products",
        description:
          "Products like software applications, e-books, streaming services, online courses and more.",
        selected: false,
      },
      {
        id: 2,
        title: "Physical product",
        slug: "physical products",
        description:
          "These cut across electronics, clothing, furniture, vehicles, consumables, and others.",
        selected: false,
      },
      {
        id: 3,
        title: "Ecommerce service",
        slug: "ecommerce services",
        description:
          "Facilitate online transactions, making it easy for people to buy and sell via the internet.",
        selected: false,
      },
      {
        id: 4,
        title: "Procurement and logistics",
        slug: "procurement & logistics services",
        description:
          "Ensures the efficient flow of goods and services from suppliers to consumers.",
        selected: false,
      },
      {
        id: 5,
        title: "Legal and professional service",
        slug: "legal & professional",
        description:
          "Encompasses legal advice, consulting, and expert counsel across various domains",
        selected: false,
      },
      {
        id: 6,
        title: "Others",
        slug: "others",
        description:
          "Specify the type of service or product your business offers, if not listed.",
        selected: false,
      },
    ],

    use_cases: [
      {
        id: 1,
        title: "Funding & Payment service",
        description:
          "Easily initiate single or bulk transfers to bank accounts anywhere in the world.",
        selected: true,
      },
      {
        id: 2,
        title: "Escrow service",
        description:
          "Ensure a secure and neutral platform, during high-value transactions.",
        selected: true,
      },
      {
        id: 3,
        title: "Merchant of Records service",
        description:
          "Expand sales and grow revenue with our Merchant of Record (MoR) infrastructure.",
        selected: true,
      },
    ],

    business_type_options: [],
  }),

  methods: {
    ...mapActions({
      updateUserBusinessInfo: "settings/updateUserBusinessInfo",
    }),

    ...mapMutations({ updateAuthUser: "auth/UPDATE_AUTH_USER" }),

    switchView() {
      this.show_business_info = true;
    },

    verifyDirector(director) {
      this.updateSelectedDirector(director);
      this.toggleDirectorModal();
    },

    completeOnboarding() {
      let updatedUser = {
        ...this.getUser,
      };

      updatedUser.verifications.cac = true;

      this.updateAuthUser(updatedUser);
    },

    rcSaved({ data, rcn }) {
      this.show_rc_modal = false;
      this.show_error = !data?.length;

      if (!data.length) {
        return;
      }
      this.provided_rcn = rcn;
      this.pushToast(
        "Your business registration number has been submitted",
        "success"
      );
      this.directors = data.map((doc) => ({
        name: doc?.director_name,
        id: doc?.identity_type,
        email: doc?.director_Email || doc?.director_email,
      }));
      this.show_directors = true;
    },

    updateSelectedDirector({ id, name }) {
      this.selected_id = id;
      this.selected_director = {
        name: director?.name,
        id,
        cac: this.provided_rcn,
        identity_type: id,
      };
    },

    toggleBvnModal() {
      this.show_bvn_modal = !this.show_bvn_modal;
    },

    toggleRcModal() {
      this.show_error = false;
      this.show_rc_modal = !this.show_rc_modal;
    },

    toggleDirectorModal() {
      this.show_director_modal = !this.show_director_modal;
    },

    async updateUserBusinessDetails() {
      const response = await this.handleDataRequest({
        action: "updateUserBusinessInfo",
        payload: this.businessDetails,
        btn_text: "Next",
        alert_handler: {
          success: "Business details updated successfully",
        },
      });

      if (response.code === 200) {
        let user = {
          ...this.getUser,
          // business_name: this.form.business_name.value,
          // business_country: this.form.country.value,
          business_type: this.business_type,
        };

        this.updateAuthUser(user);

        // setTimeout(() => {
        //   this.$router.push("/dashboard");
        // }, 1000);
      }
    },

    // UPDATE BUSINESS TYPE DATA
    async handleBusinessTypeSelection() {
      const response = await this.handleDataRequest({
        action: "updateUserBusinessInfo",
        payload: {
          business_type: this.business_type,
          business_name: this.form.business_name.value,
        },
        btn_text: "Next",
        alert_handler: {
          success: "Business type added successfully",
        },
      });

      if (response.code === 200) {
        await this.handleOnboardingUpdate("VesicashBusinessOnboarding");
      }
    },

    handleRadioSelection(item_id) {
      this.business_types.map((type) => (type.selected = false));
      let selected_business = this.business_types.find(
        (data) => data.id === item_id
      );

      selected_business.selected = true;

      if (selected_business.slug === "others") {
        this.business_type = "";
        this.others_selected = true;
      } else {
        this.business_type = selected_business.slug;
        this.others_selected = false;
      }
    },

    handleCheckboxSelection(item_id) {
      let business_case = this.use_cases.find((data) => data.id === item_id);
      business_case.selected = !business_case.selected;
    },
  },
};
</script>

<style lang="scss" scoped>
.business-form {
  width: toRem(500);
  max-width: 100%;
}

.action-button {
  margin-top: toRem(50);
  padding: 0.7rem 4rem;
}

.business-type-wrapper {
  width: toRem(850);
  max-width: 100%;
}

.verification-block {
  display: grid;
  gap: toRem(30);
  margin: toRem(50) 0;

  .verification-width {
    max-width: toRem(735);
  }

  .finish-button {
    max-width: max-content;
    margin-left: auto;
    margin-top: toRem(-30);
  }

  .error-text {
    margin-top: -20px;
  }

  .dash-btn {
    margin-top: toRem(40);
  }

  .director-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(toRem(204.8), 1fr));
    margin-top: toRem(20);
    gap: toRem(30);

    .card {
      box-shadow: 0px 2px 4px 0px rgba(3, 7, 18, 0.03),
        0px 1px 2px -1px rgba(3, 7, 18, 0.06),
        0px 0px 0px 1px rgba(3, 7, 18, 0.06);
      padding: toRem(16) toRem(14);
      border-radius: toRem(12);
      border: toRem(1) solid getColor("grey-100");
      @include flex-setup("row", "now-wrap");
      @include flex-alignment("space-between", "flex-start");
      cursor: pointer;
      transition: all ease-in-out 0.25s;
      &:hover {
        border-color: getColor("grey-400");
      }
    }
  }
}
</style>
