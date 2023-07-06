import Vue from "vue";

// ===========================
// APPLICATION MIXINS
// ===========================
import {
  MixinGlobal,
  MixinAuthUser,
  MixinAssets,
  MixinEvents,
} from "@/shared/mixins";

// ===========================
// APPLICATION SERVICES
// ===========================
import {
  serviceUtils,
  serviceCurrency,
  serviceStorage,
  serviceValidators,
  serviceDate,
} from "@/shared/services";

// ==============================
// APPLICATION FORM COMPONENTS
// ==============================
import BasicInput from "@/shared/components/form-comps/basic-input";
import FormFieldInput from "@/shared/components/form-comps/form-field-input";
import CountryDropSelect from "@/shared/components/form-comps/country-drop-select";
import DocUploadCard from "@/shared/components/form-comps/doc-upload-card";
import DropDownSelect from "@/shared/components/form-comps/drop-down-select";
import DropSelectInput from "@/shared/components/form-comps/drop-select-input";

Vue.component("BasicInput", BasicInput);
Vue.component("FormFieldInput", FormFieldInput);
Vue.component("CountryDropSelect", CountryDropSelect);
Vue.component("DocUploadCard", DocUploadCard);
Vue.component("DropDownSelect", DropDownSelect);
Vue.component("DropSelectInput", DropSelectInput);

Vue.mixin(MixinAssets);
Vue.mixin(MixinEvents);
Vue.mixin(MixinGlobal);
Vue.mixin(MixinAuthUser);

Vue.mixin({
  computed: {
    $utils: () => serviceUtils,
    $storage: () => serviceStorage,
    $date: () => serviceDate,
    $validate: () => serviceValidators,
    $money: () => serviceCurrency,
  },
});

// ==============================
// SETUP APPLICATION EVENT BUS
// ==============================
Vue.prototype.$bus = new Vue();
