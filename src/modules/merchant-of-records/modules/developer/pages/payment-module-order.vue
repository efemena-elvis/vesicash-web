<template>
  <div class="module-order">
    <div class="row">
      <div class="col-12 col-md-5">
        <ModuleOrderSetup />
      </div>

      <div class="col-12 col-md-7">
        <PreviewWrapper>
          <template slot="preview-area">
            <ModuleOrderPreview />
          </template>
        </PreviewWrapper>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleOrderSetup from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-order-setup";
import ModuleOrderPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-order-preview";
import PreviewWrapper from "@/modules/merchant-of-records/modules/developer/components/payment-module/preview-wrapper";

export default {
  name: "ModuleOrder",

  metaInfo: {
    title: "Order details",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    ModuleOrderSetup,
    ModuleOrderPreview,
    PreviewWrapper,
  },
};
</script>

<style lang="scss" scoped>
.module-order {
  padding-bottom: toRem(60);
}
</style>
