<template>
  <div
    @click="actionClicked"
    class="action-card rounded-12 neutral-10-bg border-neutral-10 pointer smooth-transition"
  >
    <!-- IMAGE ICON -->
    <div class="img-icon rounded-8 border-teal-100 teal-50-bg">
      <img :src="loadImage(card_detail.icon, 'dashboard')" alt="" />
    </div>

    <!-- CONTENT AREA -->
    <div class="content-area w-100">
      <div class="text-area">
        <div class="title-text grey-900 secondary-2-text">
          {{ card_detail.title }}
        </div>

        <div class="meta-text grey-600 secondary-2-text">
          {{ card_detail.description }}
        </div>
      </div>

      <!-- <div class="icon-wrap">
        <div class="icon icon-caret-right grey-600"></div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionCard",

  props: {
    card_id: {
      type: Number,
      default: 0,
    },

    card_detail: {
      type: Object,
      default: () => ({
        title: "",
        description: "",
        icon: "",
        link: "",
        action: "",
        internal: true,
      }),
    },
  },

  methods: {
    actionClicked() {
      if (this.card_detail.internal) {
        if (this.card_detail?.action?.length) {
          this.$bus.$emit("cardActionClicked", this.card_detail.action);
        } else this.$router.push(this.card_detail.link);
      } else {
        this.$utils.createAndClickAnchor(this.card_detail.link, "_blank");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.action-card {
  box-shadow: 0px 2px 4px 0px rgba(3, 7, 18, 0.03),
    0px 1px 2px -1px rgba(3, 7, 18, 0.06), 0px 0px 0px 1px rgba(3, 7, 18, 0.06);
  @include flex-row-nowrap("flex-start", "flex-start");
  padding: toRem(12);
  position: relative;
  gap: toRem(12);

  &:hover {
    transform: scale(0.98);
  }

  .img-icon {
    @include draw-shape(36);
    position: relative;

    img {
      @include center-placement;
      @include draw-shape(23);
    }
  }

  .content-area {
    @include flex-row-nowrap("space-between", "flex-start");
    gap: toRem(4);

    .text-area {
      @include flex-column("flex-start", "flex-start");
      gap: toRem(4);

      .title-text {
      }

      .meta-text {
        font-size: toRem(13.5);
      }
    }

    .icon-wrap {
      @include draw-shape(24);
      position: relative;
      top: toRem(5);

      .icon {
        @include center-placement;
        font-size: toRem(26);
      }
    }
  }
}
</style>
