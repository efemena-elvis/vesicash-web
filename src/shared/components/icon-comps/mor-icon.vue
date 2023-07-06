<template>
  <svg
    v-if="big"
    xmlns="http://www.w3.org/2000/svg"
    width="67"
    height="67"
    viewBox="0 0 67 67"
    fill="none"
  >
    <path
      d="M10.7777 13.8861C10.7777 9.2836 14.5088 5.55248 19.1114 5.55248H46.8907C51.4933 5.55248 55.2244 9.28359 55.2244 13.8861V38.8867H10.7777V13.8861Z"
      fill="#EEF9FD"
      stroke="#043B56"
      stroke-width="4.16683"
    />
    <rect
      x="5.22144"
      y="38.8875"
      width="55.5583"
      height="22.2228"
      rx="8.33366"
      fill="#043B56"
      stroke="#043B56"
      stroke-width="4.16683"
    />
    <path
      d="M44.1119 13.887L21.8886 13.887"
      stroke="#043B56"
      stroke-width="4.16683"
      stroke-linecap="round"
    />
    <path
      d="M44.1119 22.2215H21.8886"
      stroke="#043B56"
      stroke-width="4.16683"
      stroke-linecap="round"
    />
    <path
      d="M44.1116 30.556H21.8882"
      stroke="#043B56"
      stroke-width="4.16683"
      stroke-linecap="round"
    />
  </svg>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
  >
    <path
      d="M5.33377 6.66502C5.33377 4.45591 7.12461 2.66506 9.33373 2.66506H22.6671C24.8763 2.66506 26.6671 4.4559 26.6671 6.66502V18.6647H5.33377V6.66502Z"
      fill=""
      class="light-theme"
      stroke="#043B56"
      stroke-width="1.99998"
    />
    <rect
      x="2.66702"
      y="18.6651"
      width="26.6667"
      height="10.6664"
      rx="3.99996"
      fill=""
      class="dark-theme"
      stroke="#043B56"
      stroke-width="1.99998"
    />
    <path
      d="M21.3334 6.66543L10.6667 6.66543"
      stroke="#043B56"
      stroke-width="1.99998"
      stroke-linecap="round"
    />
    <path
      d="M21.3334 10.6658H10.6667"
      stroke="#043B56"
      stroke-width="1.99998"
      stroke-linecap="round"
    />
    <path
      d="M21.3333 14.6662H10.6667"
      stroke="#043B56"
      stroke-width="1.99998"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  name: "MorIcon",

  props: {
    big: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped></style>
