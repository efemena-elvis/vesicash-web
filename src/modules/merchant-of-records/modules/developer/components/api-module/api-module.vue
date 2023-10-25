<template>
  <div class="api-module">
    <!-- TITLE TEXT -->
    <div class="title-text h5-text grey-900 mgb-24 mgt-12">Your API keys</div>

    <div class="mgb-32" v-if="false">
      <TabSwitcher :tabs="tab_options" @tabSelected="updateAPIView" />
    </div>

    <!-- LIVE ENVIRONMENT -->
    <template v-if="api_view === 'live'">
      <component :is="live_state" />
    </template>

    <!-- TEST ENVIRONMENT -->
    <template v-if="api_view === 'test'">
      <component :is="test_state" />
    </template>
  </div>
</template>

<script>
import APIModuleEmpty from "@/modules/merchant-of-records/modules/developer/components/api-module/api-module-empty";
import TabSwitcher from "@/shared/components/util-comps/tab-switcher";

export default {
  name: "APIModule",

  metaInfo: {
    title: "API Keys",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    APIModuleEmpty,
    TabSwitcher,
    APIModuleContent: () =>
      import(
        /* webpackChunkName: "MoR-module" */ "@/modules/merchant-of-records/modules/developer/components/api-module/api-module-content"
      ),
  },

  data: () => ({
    api_view: "live",
    live_state: "APIModuleContent",
    test_state: "APIModuleEmpty",

    tab_options: [
      {
        name: "Live Environment",
        value: "live",
        active: true,
      },
      {
        name: "Test Environment",
        value: "test",
        active: false,
      },
    ],
  }),

  methods: {
    updateAPIView(selected) {
      this.api_view = selected;
      this.tab_options.find((tab) => tab.value === selected).active = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.api-module {
}
</style>
