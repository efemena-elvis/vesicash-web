<template>
  <div class="layout-disbursement">
    <!-- BACK BUTTON -->
    <PageBackBtn :history_mode="true" />

    <!-- FUND DISBURSMENT FLOW -->
    <ProgressFlowCard />

    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import ProgressFlowCard from "@/shared/components/card-comps/progress-flow-card";

export default {
  name: "LayoutDisbursement",

  components: {
    PageBackBtn,
    ProgressFlowCard,
  },
};
</script>

<style lang="scss"></style>
