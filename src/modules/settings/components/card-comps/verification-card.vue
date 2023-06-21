<template>
  <div class="verification-card-wrapper rounded-12">
    <div class="icon-wrapper" :class="[verified && 'icon-wrapper--verified']">
      <CheckIcon v-if="verified" small />
      <slot v-else></slot>
    </div>

    <div>
      <div class="primary-2-text grey-900 mgb-4">{{ title }}</div>
      <div class="tertiary-3-text grey-600">{{ subtitle }}</div>

      <!-- VERIFIED DOC ROW -->
      <div class="verified-doc-row mgt-10" v-if="verified_docs.length">
        <div class="doc-item doc-item--verified">
          &#8226; Passport - Verified
        </div>

        <div class="doc-item doc-item--pending">
          &#8226; Driver's Licence - Pending
        </div>
      </div>
    </div>

    <button
      class="btn btn-primary btn-sm"
      v-if="!verified"
      @click="$emit('action')"
    >
      {{ cta_title }}
    </button>
  </div>
</template>

<script>
import CheckIcon from "@/shared/components/icon-comps/check-icon";
export default {
  name: "VerificationCard",

  components: {
    CheckIcon,
  },

  props: {
    title: {
      type: String,
    },

    subtitle: {
      type: String,
    },

    cta_title: {
      type: String,
    },

    verified: {
      type: Boolean,
    },

    verified_docs: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.verification-card-wrapper {
  border: toRem(1) solid getColor("grey-100");
  padding: toRem(14) toRem(16);
  display: grid;
  grid-template-columns: toRem(48) 1fr toRem(220);
  gap: toRem(16);
  align-items: center;

  @include breakpoint-down(sm) {
    grid-template-columns: toRem(48) 1fr;
  }

  .icon-wrapper {
    @include draw-shape(48);
    @include flex-column("center", "center");
    background: getColor("teal-50");
    border-radius: 50%;
  }

  .icon-wrapper--verified {
    background: getColor("green-500");
  }

  .verified-doc-row {
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(6);

    .doc-item {
      background: getColor("green-100");
      @include font-height(12, 16);
      padding: toRem(4) toRem(8);
      border-radius: toRem(24);
      width: max-content;

      &--verifed {
        background: getColor("green-100");
        color: getColor("green-800");
      }

      &--pending {
        background: getColor("yellow-100");
        color: getColor("yellow-800");
      }
    }
  }

  .btn-sm {
    justify-self: flex-end;

    @include breakpoint-down(sm) {
      justify-self: flex-start;
      grid-column: 1/3;
    }
  }
}
</style>
