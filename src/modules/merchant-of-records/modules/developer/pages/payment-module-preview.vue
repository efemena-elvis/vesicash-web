<template>
  <div class="module-preview">
    <div class="app-container">
      <div class="row">
        <div class="col-12 col-lg-10 mx-auto">
          <div class="preview-area">
            <PageBackBtn history_mode />
            <!-- BRAND LOGO -->
            <div class="brand-logo position-relative mgb-40 h-auto mx-auto">
              <img :src="loadImage('vesicash-svg.svg')" alt="" />
            </div>

            <!-- DISPLAY SECTION -->
            <div class="display-section grey-50-bg">
              <div class="title-text h4-text grey-900 mgb-28">
                Checkout page
              </div>

              <div class="row">
                <div class="col-12 col-md-6">
                  <ModuleCustomerPreview
                    :show_cta="false"
                    @shippingTypeSelected="updateShippingCost"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <ModuleOrderPreview :shipping_cost="shipping_cost" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleCustomerPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-customer-preview";
import ModuleOrderPreview from "@/modules/merchant-of-records/modules/developer/components/payment-module/module-order-preview";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";

export default {
  name: "ModulePreview",

  components: {
    ModuleCustomerPreview,
    ModuleOrderPreview,
    PageBackBtn,
  },

  data() {
    return {
      shipping_cost: 0,
    };
  },

  methods: {
    updateShippingCost(shipping_data) {
      this.shipping_cost = shipping_data.amount;
    },
  },
};
</script>

<style lang="scss" scoped>
.module-preview {
  padding-bottom: toRem(50);

  .preview-area {
    padding-top: toRem(32);

    .brand-logo {
      width: toRem(170);

      img {
        width: 100%;
        height: auto;
      }
    }

    .display-section {
      padding: toRem(24);
    }
  }
}
</style>
