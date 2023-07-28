<template>
  <div class="verification-card-wrapper rounded-12">
    <div class="description-area">
      <div class="icon-wrapper" :class="[verified && 'icon-wrapper--verified']">
        <CheckIcon v-if="verified" small />
        <slot v-else></slot>
      </div>

      <div>
        <div class="primary-2-text grey-900 mgb-4">{{ title }}</div>
        <div class="tertiary-3-text grey-600">{{ subtitle }}</div>

        <!-- VERIFIED DOC ROW -->
        <div class="verified-doc-row mgt-10" v-if="verified_docs.length">
          <div
            class="doc-item"
            :class="`doc-item--${doc.verification_state}`"
            v-for="(doc, index) in verified_docs"
            :key="index"
          >
            &#8226;
            <span class="text-capitalize">
              {{ doc.verification_type | removeUnderscore }}</span
            >
            -
            <span class="text-capitalize">{{ doc.verification_state }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="action-area">
      <!-- CHECK VERIFICATION -->
      <template v-if="check_verification_state">
        <button
          class="btn btn-primary btn-sm"
          v-if="['not_uploaded', 'declined'].includes(verification_state)"
          @click="$emit('action')"
        >
          {{ cta_title }}
        </button>

        <div
          class="error-message-wrapper mgl-10"
          v-if="verification_state === 'declined'"
        >
          <div class="icon-info red-400 f-size-18 pointer"></div>

          <!-- BOTTOM TOOLTIP -->
          <div class="tooltip-wrapper wt-100 position-absolute">
            <div
              class="tooltip-data wt-100 grey-10-bg rounded-8 grey-700"
              v-html="tooltip_text"
            ></div>
          </div>
        </div>

        <button
          class="btn yellow-100-bg yellow-900 btn-sm"
          disabled
          v-if="verification_state === 'pending'"
        >
          Pending approval
        </button>
      </template>

      <!-- NO VERIFICATION CHECK -->
      <template v-else>
        <button
          class="btn btn-primary btn-sm"
          v-if="!verified"
          @click="$emit('action')"
        >
          {{ cta_title }}
        </button>
      </template>
    </div>
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

    check_verification_state: {
      type: Boolean,
      default: false,
    },

    verification_state: {
      type: String,
      default: "not_uploaded",
    },

    verified: {
      type: Boolean,
    },

    verified_docs: {
      type: Array,
      default: () => [],
    },
  },

  filters: {
    removeUnderscore(value) {
      return value.split("_").join(" ");
    },
  },

  data: () => ({
    tooltip_text: "Document uploaded has been declined, please try again.",
  }),
};
</script>

<style lang="scss" scoped>
.verification-card-wrapper {
  border: toRem(1) solid getColor("grey-100");
  padding: toRem(14) toRem(16);
  @include flex-row-wrap("space-between", "center");
  gap: toRem(16);

  .description-area {
    @include flex-row-nowrap("flex-start", "center");
    gap: toRem(12);

    .icon-wrapper {
      @include draw-shape(48);
      @include flex-column("center", "center");
      background: getColor("teal-50");
      border-radius: 50%;
    }

    .icon-wrapper--verified {
      background: getColor("green-500");
    }
  }

  .action-area {
    @include flex-row-nowrap("flex-end", "center");
    width: max-content;

    .error-message-wrapper {
      position: relative;

      .icon-info {
        &:hover ~ .tooltip-wrapper {
          top: 117%;
          visibility: visible;
        }
      }

      .tooltip-wrapper {
        width: toRem(240);
        left: toRem(-204);
        top: toRem(30) !important;

        @include breakpoint-down(md) {
          width: toRem(200);
          left: toRem(-165);
        }

        @include breakpoint-down(sm) {
          width: toRem(190);
          left: toRem(-155);
        }
      }
    }
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
        color: getColor("green-900");
      }

      &--pending {
        background: getColor("yellow-100");
        color: getColor("yellow-900");
      }

      &--declined {
        background: getColor("red-100");
        color: getColor("red-900");
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
