<template>
  <div class="page-container">
    <div class="d-flex justify-content-between">
      <div class="page-title h5-text">Merchant of Records</div>
      <a
        href="mailto:support@vesicash.com"
        class="btn btn-secondary btn-sm mgl-auto"
        >Contact support</a
      >
    </div>

    <div class="empty-state">
      <div class="icon-wrapper mgb-24">
        <MorIcon big />
      </div>

      <div class="primary-1-text mgb-8">
        Want to get started with Vesicash MOR?
      </div>

      <div class="tertiary-2-text grey-600 mgb-40">Request early access</div>

      <button class="btn btn-primary btn-md" @click="toggleWaitlistModal">
        Get early access
      </button>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_waitlist_modal">
        <MorWaitlistModal @closeTriggered="toggleWaitlistModal" />
      </transition>
    </portal>
  </div>
</template>

<script>
import MorIcon from "@/shared/components/icon-comps/mor-icon";
import MorWaitlistModal from "@/modules/mor/modals/mor-waitlist-modal";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MorPage",

  components: {
    MorIcon,
    MorWaitlistModal,
  },

  computed: {
    ...mapGetters({
      getMorCountries: "mor/getMorCountries",
      getMorBusinessTypes: "mor/getMorBusinessTypes",
    }),
  },

  data() {
    return {
      show_waitlist_modal: false,
    };
  },

  mounted() {
    this.fetchBusinessTypes();
    this.fetchCountries();
  },

  methods: {
    ...mapActions({
      fetchMORBusinessTypes: "mor/fetchMORBusinessTypes",
      fetchMORCountries: "mor/fetchMORCountries",
    }),

    async fetchBusinessTypes() {
      if (!this.getMorBusinessTypes?.length) this.fetchMORBusinessTypes();
    },

    async fetchCountries() {
      if (!this.getMorCountries?.length) this.fetchMORCountries();
    },

    toggleWaitlistModal() {
      this.show_waitlist_modal = !this.show_waitlist_modal;
    },
  },
};
</script>

<style lang="scss" scoped>
// .page-container {
//   padding-bottom: toRem(250);
// }
.page-title {
  @include breakpoint-down(lg) {
    display: none;
  }
}

.empty-state {
  @include flex-column-center;
  padding-top: toRem(80);

  .icon-wrapper {
    @include draw-shape(100);
    @include flex-column-center;
    border-radius: 50%;
    background: getColor("teal-50");
  }
}

.mgl-auto {
  margin-left: auto;
}
</style>
