<template>
  <div
    class="customer-info-block rounded-8 mgb-24 pd-24 neutral-10-bg border-grey-100"
  >
    <div class="title-text grey-900 mgb-24 primary-1-text">BRAND DISPLAY</div>

    <!-- BRAND UPLOAD AREA -->
    <div class="brand-logo-area mgb-24">
      <label
        disabled
        :for="uploading_file ? '' : 'fileUpload'"
        class="upload-area grey-10-bg rounded-8 grey-800 pdx-15 pointer"
      >
        <div
          class="icon-spinner f-size-19 animate mgr-8"
          v-if="uploading_file"
        ></div>

        <div class="icon-plus f-size-20 mgr-8" v-else></div>
        <div class="text tertiary-2-text">
          {{ uploading_file ? "Uploading logo..." : "Upload brand Logo" }}
        </div>

        <input
          type="file"
          id="fileUpload"
          class="d-none"
          accept="image/*"
          ref="fileUpload"
          @change="uploadPic"
        />
      </label>

      <!-- LOGO DISPLAY -->
      <div class="logo-display h-auto">
        <img
          :src="getPaymentModuleConfig.logo_url"
          alt=""
          class="w-100 h-auto"
        />
      </div>
    </div>

    <div class="form-group" v-if="show_module_name">
      <FormFieldInput
        label_title="Checkout module name"
        label_id="moduleName"
        is_required
        placeholder="Enter checkout name"
        :input_value="getFormFieldValueMx(form, 'module_name')"
        @getInputState="updateName($event)"
        :error_handler="{
          type: 'required',
          message: 'Module name is required',
        }"
      />
    </div>

    <div :class="flex_color_setup ? 'flex-layout' : ''">
      <div class="form-group">
        <label class="form-label" for="backgroundColor">Background color</label>
        <FormColorInput
          color_id="backgroundColor"
          :default_color="bg_default"
          @colorChange="
            UPDATE_PAYMENT_MODULE({
              field: 'background_colour',
              data: $event,
            })
          "
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="buttonColor">Button color</label>
        <FormColorInput
          color_id="buttonColor"
          :default_color="btn_default"
          @colorChange="
            UPDATE_PAYMENT_MODULE({ field: 'button_colour', data: $event })
          "
        />
      </div>
    </div>

    <div class="form-group mgb--12">
      <label for="otherRequirement" class="form-label">
        Add other requirements
      </label>

      <FormCheckCard
        check_id="requirePhoneNumber"
        primary_text="Collect phone number"
        :checked="request_phone"
        @change="
          UPDATE_PAYMENT_MODULE({
            field: 'request_phone_number',
            data: $event,
          })
        "
      />

      <!-- <FormCheckCard
        check_id="requireCountry"
        primary_text="Collect country"
        :checked="request_country"
        @change="
          UPDATE_PAYMENT_MODULE({ field: 'request_country', data: $event })
        "
      /> -->

      <FormCheckCard
        check_id="requireStreetAddress"
        primary_text="Collect street address"
        :checked="request_address"
        @change="
          UPDATE_PAYMENT_MODULE({
            field: 'request_street_address',
            data: $event,
          })
        "
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import FormColorInput from "@/shared/components/form-comps/form-color-input";
import FormCheckCard from "@/shared/components/form-comps/form-check-card";

export default {
  name: "CustomerInfoBlock",

  components: {
    FormColorInput,
    FormCheckCard,
  },

  props: {
    show_module_name: {
      type: Boolean,
      default: true,
    },

    flex_color_setup: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters({
      getPaymentModuleConfig: "merchant/getPaymentModuleConfig",
    }),
  },

  data: () => ({
    uploading_file: false,

    form: {
      module_name: {
        validated: false,
        value: "",
      },
    },

    bg_default: "#F6FAF9",
    btn_default: "#043B56",

    request_phone: false,
    request_address: false,
    request_country: false,
    country: null,
  }),

  mounted() {
    const id = this.$route?.query?.id;

    id && !this.getPaymentModuleConfig?.saved
      ? this.fetchSavedModule(id)
      : this.updateSavedConfig(this.getPaymentModuleConfig);
  },

  methods: {
    ...mapActions({
      uploadToSpace: "general/uploadToSpace",
      fetchPaymentModule: "merchant/fetchPaymentModule",
    }),

    ...mapMutations({
      UPDATE_PAYMENT_MODULE: "merchant/UPDATE_PAYMENT_MODULE",
      SET_PAYMENT_MODULE: "merchant/SET_PAYMENT_MODULE",
    }),

    async fetchSavedModule(id) {
      this.showPageLoader("Loading module");
      await this.fetchMoRCountries();
      const countries = this.getMorCountries?.length
        ? [...this.getMorCountries]
        : [];

      const response = await this.fetchPaymentModule(id);

      this.hidePageLoader();
      const type = response?.code === 200 ? "success" : "warning";
      const message = response?.message;
      this.pushToast(message, type);
      if (response?.code === 200) {
        const data = response?.data;
        const config = {
          logo_url: data?.logo_url || "",
          module_name: data?.name || "",
          background_colour: data?.background_colour || "#f1f7f7",
          button_colour: data?.button_colour || "#043b56",
          request_phone_number:
            data?.other_requirements?.request_phone_number || true,
          request_country: data?.other_requirements?.request_country || false,
          request_street_address:
            data?.other_requirements?.request_street_address || false,
          country_id: data?.country_id || 0,
          country_name:
            countries?.find((cc) => cc?.id === data?.country_id)?.name || "",
          saved: true,
        };
        this.updateSavedConfig(config);
        this.SET_PAYMENT_MODULE(config);
      }
    },

    async uploadPic(event) {
      const [file] = event.target.files;
      if (!file) return;

      if (!this.processFileSize(file.size)) {
        this.pushToast("Upload a maximum file size of 1mb", "error");
        return false;
      }

      this.uploading_file = true;

      const loadedImage = await this.uploadToSpace({
        file,
        formatted_size: this.processFileSize(file.size),
      });

      this.uploading_file = false;

      const logo_url = [200, 201]?.includes(loadedImage.code)
        ? loadedImage.data.pop().file_url
        : "";

      if (logo_url)
        this.UPDATE_PAYMENT_MODULE({ field: "logo_url", data: logo_url });

      if (![200, 201]?.includes(loadedImage.code))
        this.pushToast("File upload failed", "error");
    },

    processFileSize(size) {
      if (size > 1000000) return false;

      return size.toString().length >= 6
        ? `${(size / 1000000).toFixed(1)}mb`
        : `${(size / 1000).toFixed(1)}kb`;
    },

    updateName(data) {
      this.updateFormFieldMx(data, "module_name");

      this.UPDATE_PAYMENT_MODULE({
        field: "module_name",
        data: data?.value,
      });
    },

    updateSavedConfig(config) {
      this.form = {
        module_name: {
          validated: !!config?.module_name,
          value: config?.module_name || "",
        },
      };

      this.bg_default = config.background_colour;
      this.btn_default = config.button_colour;
      this.request_address = config.request_street_address;
      this.request_country = config.request_country;
      this.request_phone = config.request_phone_number;
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-info-block {
  .brand-logo-area {
    @include flex-row-nowrap("flex-start", "center");
    gap: toRem(18);

    .upload-area {
      border: toRem(1) dashed getColor("grey-300");
      @include flex-row-nowrap("center", "center");
      min-height: toRem(50);
      height: auto;
    }

    .logo-display {
      width: toRem(120);
    }
  }

  .flex-layout {
    @include flex-row-wrap("space-between", "flex-start");
    gap: toRem(10);

    .form-group {
      width: 48%;

      @include breakpoint-down(md) {
        width: 100%;
      }
    }
  }
}
</style>
