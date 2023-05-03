import $api from "@/services/service-api";

const routes = {
  mor_countries: "/auth/selected-countries",
  mor_business_types: "/auth/business-types",
};

export default {
  async fetchMORCountries({ commit }) {
    const response = await $api.fetch(routes.mor_countries);
    if (response.code == 200) commit("SAVE_MOR_COUNTRIES", response.data);
    return response;
  },

  async fetchMORBusinessTypes({ commit }) {
    const response = await $api.fetch(routes.mor_business_types);
    if (response.code == 200) commit("SAVE_MOR_BUSINESS_TYPES", response.data);
    return response;
  },
};
