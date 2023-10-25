import Vue from "vue";

// =======================================
// IMPORT THIRD PARTY PLUGINS
// =======================================
import VueLazyload from "vue-lazyload";
import Meta from "vue-meta";
import PortalVue from "portal-vue";
import DisableAutocomplete from "vue-disable-autocomplete";
import VueConfetti from "vue-confetti";
import { mixin as clickaway } from "vue-clickaway";

Vue.use(Meta);
Vue.use(VueLazyload);
Vue.use(PortalVue);
Vue.mixin(clickaway);
Vue.use(VueConfetti);
// Vue.use(DisableAutocomplete);
