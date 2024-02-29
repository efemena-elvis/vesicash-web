<template>
  <div
    class="beneficiary-card rounded-12 border-grey-200 neutral-10-bg pointer smooth-transition soft-shadow-effect"
  >
    <div
      class="user-profile rounded-circle border neutral-10 f-size-15"
      :class="$colors.getProfileBgColor(beneficiary_name)"
    >
      {{ $utils.getStringInitials(beneficiary_name) }}
    </div>

    <div>
      <div
        class="account-name primary-2-text grey-800 text-wrap wt-100"
        :title="beneficiary_name"
      >
        {{ beneficiary_name }}
      </div>
      <div class="account-number tertiary-3-text grey-500">
        {{
          is_group
            ? `${beneficiary_account}  ${
                beneficiary_account == 1 ? "account" : "accounts"
              }`
            : beneficiary_account
        }}
      </div>
    </div>
  </div>
</template>
    
  <script>
export default {
  name: "BeneficiaryCard",

  props: {
    beneficiary_name: {
      type: String,
      default: null,
    },
    beneficiary_account: {
      type: String | Number,
    },
    is_group: {
      type: Boolean,
    },
  },
};
</script>
    
  <style lang="scss" scoped>
.beneficiary-card {
  @include flex-row-nowrap("flex-start", "center");
  padding: toRem(12) toRem(16);
  gap: toRem(12);
  min-width: toRem(200);
  width: auto;
  max-width: toRem(280);

  &:hover {
    background: getColor("green-50");
  }

  .user-profile {
    @include flex-column("center", "center");
    @include draw-shape(40);
  }

  .account-name {
    @include line-clamp(1);
  }

  .account-number {
    @include font-height(12.5, 17);
  }
}
</style>