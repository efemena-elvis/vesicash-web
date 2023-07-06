import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  mor_countries: "countries/mor",
  mor_business_types: "business-types",
  fetch_mor_onboarding: "settings/get",
  save_mor_onboarding: "settings/save",
  mor_wallets: "settings/wallets/get",
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
};
