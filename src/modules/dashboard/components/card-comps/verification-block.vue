<template>
  <div class="verification-block border-grey-100 rounded-12 mgb-32">
    <!-- TOP ROW -->
    <div class="top-row mgb-20">
      <ProgressBar class="position-absolute" :circumference="360" />
      <ProgressBar
        class="position-absolute"
        :circumference="verificationProgress"
        strokeColor="#0e89c6"
      />
      <div class="progress-bar">{{ `${verifiedCount}/4` }}</div>

      <div class="setup">
        <div class="title-text primary-1-text grey-900">Setup your account</div>
        <div class="description-text tertiary-2-text grey-600">
          Complete your account setup to explore more of vesicash’s features
        </div>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row" v-if="loading">
      <div class="skeleton-loader" v-for="index in 4" :key="index"></div>
    </div>

    <div class="bottom-row" v-else>
      <div
        class="action-card"
        v-for="(item, index) in verifications"
        :key="index"
        @click="toggleItem(item)"
      >
        <div class="action-text">{{ item.name }}</div>
        <div class="action-indicator">
          <img :src="loadImage('check-icon.png')" alt="" v-if="item.verified" />
          <div class="icon icon-info yellow-500" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/shared/components/util-comps/progress-bar.vue";

export default {
  name: "VerificationBlock",

  props: {
    verifications: {
      type: Array,
      default: () => [],
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    ProgressBar,
  },

  methods: {
    toggleItem(item) {
      if (item?.verified) return;
      this.$emit("toggle", item.type);
    },
  },

  computed: {
    verifiedCount() {
      return this.verifications?.filter((item) => item.verified)?.length || 0;
    },

    verificationProgress() {
      return (this.verifiedCount / 4) * 360;
    },
  },
};
</script>

<style lang="scss" scoped>
.verification-block {
  padding: toRem(16) toRem(24);

  .top-row {
    @include flex-row-nowrap("flex-start", "center");
    gap: toRem(12);
    .progress-bar {
      @include draw-shape(55);
      display: grid;
      place-items: center;
      position: relative;
      top: toRem(-2);
      font-weight: 600;
    }

    .setup {
      position: relative;
      top: toRem(-2);
    }
  }

  .bottom-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: toRem(24);

    .action-card {
      @include flex-row-nowrap("space-between", "center");
      border: toRem(1) solid getColor("grey-200");
      background: rgba(#f5f6ff, 0.5);
      padding: toRem(15) toRem(15);
      @include transition(0.3s);
      border-radius: toRem(8);
      width: 100%;
      cursor: pointer;
      gap: toRem(8);
      height: auto;

      &:hover {
        transform: scale(0.98);
      }

      .action-text {
        @include font-height(14, 19);
        color: getColor("grey-900");
      }

      .action-indicator {
        // border: toRem(1) solid getColor("grey-300");
        @include draw-shape(18);
        border-radius: 50%;
        display: grid;
        place-items: center;
      }
    }

    .skeleton-loader {
      width: 100%;
      height: toRem(65);
      border: toRem(1) solid getColor("grey-200");
      padding: toRem(15) toRem(10);
      border-radius: toRem(8);
    }
  }
}
</style>
