<template>
  <div :class="['card', selected && 'card__selected']">
    <UserIcon class="user-icon" />
    <div class="secondary-2-text text-center">{{ title }}</div>
    <div class="icon-check"></div>
  </div>
</template>

<script>
export default {
  name: "OptionCard",

  props: {
    title: {
      type: String,
      default: "Option 1",
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    UserIcon: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/icon-comps/user-icon"
      ),
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(10);
  padding: toRem(15);
  display: grid;
  place-items: center;
  position: relative;
  cursor: pointer;
  transition: all ease 0.25s;
  &:hover {
    border-color: getColor("green-400");
    background: getColor("green-50");
  }

  .user-icon {
    transform: scale(2);
  }

  .icon-check {
    @include draw-shape(15);
    border-radius: 50%;
    background: transparent;
    position: absolute;
    top: toRem(10);
    right: toRem(10);
    transition: background ease 0.25s;
  }

  &__selected {
    border-color: getColor("green-400");
    background: getColor("green-50");

    .icon-check {
      background: getColor("green-400");
    }
  }
}
</style>
