<template>
  <div class="merchant-developer">
    <!-- TITLE TOP BLOCK -->
    <TitleTopBlock title="Developers" />

    <div class="mgt-30 mgb-30">
      <PageSwitcher
        :page_data="pages"
        :full_width="false"
        @swapItem="updateDeveloperView($event)"
      />
    </div>

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
    CheckoutModule: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/developer/components/checkout-module/checkout-setup"
      ),
  },

  data: () => ({
    developer_view: "APIModule",

    pages: [
      {
        title: "API Keys",
        value: "APIModule",
        slug: "api_key",
        active: true,
      },
      {
        title: "Checkout Playground",
        value: "CheckoutModule",
        slug: "checkout",
        active: false,
      },
      // {
      //   title: "Payment Modules",
      //   value: "PaymentModule",
      //   slug: "payment",
      //   active: false,
      // },
    ],
  }),

  mounted() {
    let route_type = this.$route.query.type ?? "api_key";
    this.updateDeveloperView(route_type, true);
  },

  methods: {
    updateDeveloperView(selected, is_slug = false) {
      this.pages.map((page) => (page.active = false));

      let selected_index = this.pages.findIndex((page) => {
        return is_slug ? page.slug === selected : page.value === selected;
      });

      this.developer_view = this.pages[selected_index].value;
      this.pages[selected_index].active = true;

      if (this.$route.query.type !== this.pages[selected_index].slug) {
        this.$router.replace({
          query: { type: this.pages[selected_index].slug },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-developer {
}
</style>
