import { getRequest } from "@/utilities/micro-services";

const routes = {
  mor_countries: "countries/mor",
  mor_business_types: "business-types",
};

export default {
  async fetchMoRCountries({ commit }) {
    const response = await getRequest("auth", routes.mor_countries);
    if (response?.code == 200) commit("SAVE_MOR_COUNTRIES", response.data);
    return response;
  },

  async fetchMoRBusinessTypes({ commit }) {
    const response = await getRequest("auth", routes.mor_business_types);
    response?.code == 200 && commit("SAVE_MOR_BUSINESS_TYPES", response.data);
    return response;
  },
};
