import { getRequest, postRequest, deleteRequest } from "@/utilities/micro-services";

const routes = {
  mor_countries: "countries/mor",
  mor_business_types: "business-types",
  fetch_mor_onboarding: "settings/get",
  save_mor_onboarding: "settings/save",
  mor_wallets: "settings/wallets/get",

  fetch_payment_modules: "payment-module/get",
  fetch_payment_module:"payment-module/get/",
  save_payment_module: "payment-module/save",
  delete_payment_module:"payment-module/",
  publish_module:"payment-module/",
  update_module:"payment-module"
};

export default {
  async fetchMoRCountries({ commit, getters }) {
    if (getters.getMorCountries.length) {
      return {
        code: 200,
        data: getters.getMorCountries,
      };
    } else {
      const response = await getRequest("auth", routes.mor_countries);
      if (response?.code == 200) commit("SAVE_MOR_COUNTRIES", response.data);
      return response;
    }
  },

  async fetchMoRBusinessTypes({ commit, getters }) {
    if (getters.getMorBusinessTypes.length) {
      return {
        code: 200,
        data: getters.getMorBusinessTypes,
      };
    } else {
      const response = await getRequest("auth", routes.mor_business_types);
      response?.code == 200 && commit("SAVE_MOR_BUSINESS_TYPES", response.data);
      return response;
    }
  },

  async fetchMoROnboarding() {
    return await getRequest("mor", routes.fetch_mor_onboarding);
  },

  async saveMoROnboarding(_, payload) {
    return await postRequest("mor", routes.save_mor_onboarding, payload);
  },

  async fetchPaymentModules() {
    return await getRequest("mor", routes.fetch_payment_modules);
  },

  async fetchPaymentModule(_,id) {
    return await getRequest("mor", routes.fetch_payment_module+id);
  },

  async savePaymentModule(_, payload) {
    return await postRequest("mor", routes.save_payment_module, payload);
  },

  async deletePaymentModule(_, id) {
    return await deleteRequest("mor", routes.delete_payment_module+id, {});
  },

  async publishPaymentModule(_, {id,payload}) {
    return await postRequest("mor", routes.publish_module+id, payload);
  },
};
