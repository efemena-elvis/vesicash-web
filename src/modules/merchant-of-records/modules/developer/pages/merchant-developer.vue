<template>
  <div class="merchant-developer">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="Developers" />

    <PageSwitcher
      :page_data="pages"
      :full_width="false"
      @swapItem="updateDeveloperView($event)"
    />

    <template>
      <component :is="developer_view" />
    </template>
  </div>
</template>

<script>
import TitleTopBlock from "@/shared/components/block-comps/title-top-block";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "MerchantDeveloper",

  components: {
    TitleTopBlock,
    PageSwitcher,
    PaymentModule: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/developer/components/payment-module/payment-module"
      ),
    APIModule: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/developer/components/api-module/api-module"
      ),
  },

  data: () => ({
    developer_view: "PaymentModule",

    pages: [
      {
        title: "Payment Modules",
        value: "PaymentModule",
        active: true,
      },
      {
        title: "API Keys",
        value: "APIModule",
        active: false,
      },
    ],
  }),

  methods: {
    updateDeveloperView(selected) {
      this.developer_view = selected;
      this.pages.find((page) => page.value === selected).active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-developer {
}
</style>
