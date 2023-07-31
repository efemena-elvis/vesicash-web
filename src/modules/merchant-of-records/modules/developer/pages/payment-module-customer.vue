<template>
  <div class="module-customer">
    <div class="row">
      <div class="col-12 col-md-5">
        <ModuleCustomerSetup />
      </div>

      <div class="col-12 col-md-7">
        <PreviewWrapper>
          <template slot="preview-area">
            <ModuleCustomerPreview />
          </template>
        </PreviewWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleCustomerSetup from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-customer-setup";
import ModuleCustomerPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-customer-preview";
import PreviewWrapper from "@/modules/merchant-of-records/modules/developer/components/payment-module/preview-wrapper";

export default {
  name: "ModuleCustomer",

  metaInfo: {
    title: "Customer Information",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    ModuleCustomerSetup,
    ModuleCustomerPreview,
    PreviewWrapper,
  },
};
</script>

<style lang="scss" scoped>
.module-customer {
}
</style>
