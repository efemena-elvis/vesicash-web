<template>
  <div class="col-12 col-lg-10 col-xl-8 business-onboarding">
    <div class="page-title mgb-4 grey-900 h5-text">
      Tell us about your business
    </div>

    <div class="page-meta grey-600 tertiary-2-text mgb-30">
      Share your business type with us today, let's embark on a journey of
      growth and innovation together!
    </div>

    <div class="row mgb-40">
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

    <!-- <div class="label-row">
      <div class="count-wrapper">
        <div class="count">2</div>
      </div>
      <div class="mgl-2">Select your business use case on Vesicash</div>
    </div> -->

    <!-- <div class="row mgt-20 mgb-20">
      <div
        class="col-12 col-sm-6"
        v-for="(item, index) in use_cases"
        :key="index"
      >
        <SelectDialogCard
          :option="item"
          select_type="checkbox"
          @dialogSelected="handleCheckboxSelection($event)"
        />
      </div>
    </div> -->

    <div class="action-row mgb-40">
      <button
        @click="handleBusinessTypeSelection"
        ref="btnRef"
        class="btn btn-md btn-primary"
        :disabled="isDisabled"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import onboardingMixin from "@/modules/dashboard/mixins/onboarding-mixin";

export default {
  name: "onboardingBusinessInformation",

  metaInfo: {
    title: "Business information",
    titleTemplate: "%s - Vesicash",
  },

  mixins: [onboardingMixin],

  components: {
    SelectDialogCard: () =>
      import(
        /* webpackChunkName: "onboarding-module" */ "@/shared/components/card-comps/select-dialog-card"
      ),
  },

  computed: {
    isDisabled() {
      return this.business_type ? false : true;
    },
  },

  data: () => ({
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

  mounted() {
    // this.fetchBusinessTypes();
  },

  methods: {
    ...mapActions({
      getBusinessTypes: "auth/getBusinessTypes",
      updateUserBusinessInfo: "settings/updateUserBusinessInfo",
    }),

    // ===========================================
    // HANDLE FETCHING OF AVAILABLE BUSINESS TYPES
    // ===========================================
    // async fetchBusinessTypes() {
    //   const response = await this.handleDataRequest({
    //     action: "getBusinessTypes",
    //   });

    //   this.business_type_options = response?.code === 200 ? response.data : [];
    // },

    // UPDATE BUSINESS TYPE DATA
    async handleBusinessTypeSelection() {
      const response = await this.handleDataRequest({
        action: "updateUserBusinessInfo",
        payload: { business_type: this.business_type },
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
.business-onboarding {
  .page-meta {
    line-height: toRem(21);
  }

  .label-row {
    @include flex-row-nowrap("flex-start", "center");
    @include font-height(14.5, 21);
    color: getColor("grey-800");
    margin-bottom: toRem(15);

    .count-wrapper {
      border: toRem(1) solid getColor("grey-300");
      @include draw-shape(26);
      margin-right: toRem(8);
      position: relative;
      border-radius: 50%;

      .count {
        @include center-placement;
        font-size: toRem(12);
      }
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
