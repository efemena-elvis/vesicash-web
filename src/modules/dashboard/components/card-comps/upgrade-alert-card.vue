<template>
  <div class="alert-card-wrapper">
    <div class="icon icon-info yellow-500 mgr-12"></div>

    <div>
      <div class="secondary-2-text mgb-6" v-if="title">
        {{ title }}
      </div>
      <div class="alert-msg tertiary-2-text grey-800 mgb-12">
        {{ alert_message }}
      </div>
      <router-link
        v-if="upgrade_link"
        class="btn btn-sm btn-secondary d-inline-block"
        :to="upgrade_link"
        >{{ upgrade_action }}</router-link
      >

      <button
        class="btn btn-sm btn-secondary d-inline-block"
        v-else
        @click="$emit('upgrade')"
      >
        {{ upgrade_action }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpgradeAlertCard",

  props: {
    title: {
      type: String,
      default: "",
    },
    alert_message: {
      type: String,
      default:
        "Your account is limited, please verify your account to enjoy vesicash without limits",
    },

    upgrade_link: {
      type: String,
    },

    upgrade_action: {
      type: String,
      default: "Verify Account",
    },
  },
};
</script>

<style lang="scss" scoped>
.alert-card-wrapper {
  @include flex-row-nowrap("flex-start", "flex-start");
  background: getColor("yellow-50");
  border-radius: toRem(8);
  padding: toRem(16);

  .icon-wrapper {
    @include flex-column("center", "center");
    background: getColor("yellow-500");
    @include draw-shape(24);
    border-radius: 50%;
  }

  .icon {
    position: relative;
    font-size: toRem(19);
    top: toRem(2);
  }

  .alert-msg {
    @include font-height(14.5, 24);
  }
}
</style>
