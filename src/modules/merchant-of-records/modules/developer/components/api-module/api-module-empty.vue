<template>
  <div class="api-module">
    <div class="icon-wrapper mgb-8">
      <img
        v-lazy="loadImage('developer-merchant-icon.png')"
        alt="payment-merchant-icon"
      />
    </div>

    <div class="title-text h5-text grey-900 mgb-8 text-center">API keys</div>

    <div class="description-text tertiary-2-text grey-600 mgb-24 text-center">
      You have not created any APi keys, Start by creating an API keys
    </div>

    <button class="btn btn-md btn-primary" @click="toggleGenerateModal">
      Generate api keys
    </button>

    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_generate_modal">
        <GenerateAPIModal @closeTriggered="toggleGenerateModal" />
      </transition>
    </portal>
  </div>
</template>

<script>
export default {
  name: "APIModuleEmpty",

  components: {
    GenerateAPIModal: () =>
      import(
        /* webpackChunkName: "MoR-modal-module" */ "@/modules/merchant-of-records/modules/developer/modals/generate-api-modal"
      ),
  },

  data: () => ({
    show_generate_modal: false,
  }),

  methods: {
    toggleGenerateModal() {
      this.show_generate_modal = !this.show_generate_modal;
    },
  },
};
</script>

<style lang="scss" scoped>
.api-module {
  @include flex-column("center", "center");
  height: 52vh;

  .icon-wrapper {
    img {
      @include draw-shape(64);
    }
  }

  .description-text {
    width: 30%;
  }
}
</style>
