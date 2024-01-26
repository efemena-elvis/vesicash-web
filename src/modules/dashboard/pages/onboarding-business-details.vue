<template>
  <div class="">
    <div class="title-text h4-text mgb-8 grey-900">Business details</div>
    <div class="grey-600">Tell us about your business</div>
    <form class="mgt-35 business-form">
      <div class="form-group">
        <FormFieldInput
          label_title="Registered Business name"
          label_subtitle="Enter a government registered business name"
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
            label_title="Business Location"
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
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";
import CountryHelper from "@/shared/mixins/mixin-country-helper";

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
  },

  computed: {
    isDisabled() {
      return this.business_type && this.form.business_name.validated
        ? false
        : true;
    },
  },

  data: () => ({
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

    business_type: null,
    other_business_type: "",
    others_selected: false,

    use_case: null,

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
</style>
