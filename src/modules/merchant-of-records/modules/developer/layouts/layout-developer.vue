<template>
  <div>
    <!-- BACK BUTTON -->
    <PageBackBtn history_mode />

    <!-- FUND DISBURSMENT FLOW -->
    <ProgressFlowCard :flows="getComputedPageFlow" />

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import ProgressFlowCard from "@/shared/components/card-comps/progress-flow-card";

export default {
  name: "LayoutDeveloper",

  components: {
    PageBackBtn,
    ProgressFlowCard,
  },

  computed: {
    getComputedPageFlow() {
      return this.page_flows;
    },
  },

  watch: {},

  data: () => ({
    computed_page_flow: [],

    page_flows: [
      {
        id: 1,
        title: "Customer Information",
        route: "MerchantModuleCustomer",
        alias_route: "",
        state: "current",
      },
      {
        id: 2,
        title: "Payment details",
        route: "MerchantModuleOrder",
        alias_route: "",
        state: "next",
      },
    ],
  }),

  methods: {},
};
</script>

<style lang="scss"></style>
