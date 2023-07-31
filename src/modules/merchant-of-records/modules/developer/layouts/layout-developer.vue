<template>
  <div class="layout-disbursement">
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
import { serviceStorage } from "@/shared/services";
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

  data: () => ({
    page_flows: [
      {
        id: 1,
        title: "Customer Information",
        route: "TransactionSetup",
        alias_route: "",
        state: "current",
      },
      {
        id: 2,
        title: "Order details",
        route: "TransactionParties",
        alias_route: "",
        state: "next",
      },
    ],
  }),

  methods: {},
};
</script>

<style lang="scss"></style>
