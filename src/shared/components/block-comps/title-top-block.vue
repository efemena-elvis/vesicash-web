<template>
  <div class="top-block">
    <!-- WELCOME MESSAGE -->
    <div class="welcome-message h4-text grey-900">
      <template v-if="title.length">{{ title }}</template>
      <template v-else>
        Welcome <span>{{ businessName }}</span>
      </template>
    </div>

    <!-- DISBURSE MONEY BUTTON -->
    <template v-if="type === 'escrow'">
      <router-link
        :to="{ name: 'TransactionSetup' }"
        class="btn btn-primary btn-md"
        >Create Escrow</router-link
      >
    </template>
    <!-- :class="show_escrow_btn ? 'tour-index' : null" -->
  </div>
</template>

<script>
export default {
  name: "TitleTopBlock",

  props: {
    title: {
      type: String,
      default: "",
    },

    type: {
      type: String,
    },
  },

  computed: {
    displayUserFirstname() {
      return this.getUser?.fullname?.split(" ")[0] ?? this.getUser.email;
    },

    businessName() {
      return this.getUser?.business_name || this.displayUserFirstname;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-block {
  @include flex-row-wrap("space-between", "center");
  gap: toRem(24);
  margin-bottom: toRem(24);

  @include breakpoint-down(lg) {
    margin-bottom: toRem(16);
  }

  .welcome-message {
    font-size: toRem(22);

    @include breakpoint-down(sm) {
      font-size: toRem(18.75);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(18.5);
    }
  }

  .btn {
    padding: toRem(10) toRem(19.5);
    font-size: toRem(14.5);

    @include breakpoint-custom-down(1220) {
      @include get-btn-size("md");
      margin-top: toRem(16);
    }

    @include breakpoint-down(sm) {
      padding: toRem(8.5) toRem(19);
      font-size: toRem(13.5);
      margin-top: toRem(16);
    }
  }
}
</style>
