import {
  getRequest,
  postRequest
} from "@/utilities/micro-services";

const routes = {
  mor_countries: "countries/mor",
  mor_business_types: "business-types",
  join_waitlist: "waitlist",
};

export default {
  async fetchMORCountries({ commit }) {
    const response = await getRequest("auth", routes.mor_countries,{})
    if (response?.code == 200) commit("SAVE_MOR_COUNTRIES", response.data);
    return response;
  },

  async fetchMORBusinessTypes({ commit }) {
    const response = await getRequest("auth", routes.mor_business_types,{})
    if (response?.code == 200) commit("SAVE_MOR_BUSINESS_TYPES", response.data);
    return response;
  },

  async joinWaitlist(_, payload) {
    const response = await postRequest("auth",routes.join_waitlist, payload)
    return response;
  },
};
