import { getRequest } from "@/utilities/micro-services";

const routes = {
  // generate_api_keys: "tokens/generate",
  fetch_api_keys: "user/security/get_access_token",
};

export default {
  // ==============================
  // GENERATE API KEYS
  // ==============================
  // async generateAPIkeys({ commit }, payload) {
  //   const response = await getRequest(
  //     "admin",
  //     routes.generate_api_keys,
  //     payload
  //   );

  //   [201, 200].includes(response?.code) &&
  //     commit("SET_API_KEYS", response.data.V_PUBLIC_KEY);
  //   return response;
  // },

  // ==============================
  // FETCH API KEYS
  // ==============================
  async fetchAPIkeys({ commit }, { regenerate }) {
    let api_url = regenerate
      ? `${routes.fetch_api_keys}?new=true`
      : routes.fetch_api_keys;

    const response = await getRequest("auth", api_url);

    [201, 200].includes(response?.code) &&
      commit("SET_API_KEYS_DETAILS", response.data);
    return response;
  },
};
