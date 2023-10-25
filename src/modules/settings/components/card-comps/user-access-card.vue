<template>
  <label
    :for="level.title"
    class="user-access-card rounded-8 border-grey-200 w-100 smooth-transition pointer"
    :class="level.selected && 'selected'"
  >
    <div class="card-top border-bottom-grey-100">
      <input
        type="radio"
        name="access_levels"
        class="sm-size"
        :id="level.title"
        :checked="level.selected"
        @change="$emit('updateSelection')"
      />
      <div class="card-title grey-900 secondary-2-text">{{ level.title }}</div>
    </div>

    <div class="card-bottom">
      <div class="row">
        <div
          class="col-12 col-sm-6 col-md-4"
          v-for="(type, index) in level.types"
          :key="index"
        >
          <div class="level-type">
            <SuccessIcon backgroundColor="#043b56" />
            <div class="level-title grey-900 tertiary-2-text">
              {{ type }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </label>
</template>

<script>
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "UserAccessCard",

  components: {
    SuccessIcon,
  },

  props: {
    level: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.user-access-card {
  padding: toRem(16);

  &:hover {
    border: toRem(1) solid getColor("green-200");
    background: getColor("green-50");
  }

  .card-top {
    @include flex-row-nowrap("flex-start", "center");
    padding-bottom: toRem(12);
    gap: toRem(10);
  }

  .card-bottom {
    padding-top: toRem(14);

    .row {
      row-gap: toRem(12);

      .level-type {
        @include flex-row-nowrap("flex-start", "flex-start");
        gap: toRem(10);

        svg {
          @include draw-shape(20);
        }
      }
    }
  }

  &.selected {
    border: toRem(1) solid getColor("green-200");
    background: getColor("green-50");
  }
}
</style>
