// ======================================================
// ALL APPLICATION METHODS RELATED TO API HANDLING
// ======================================================
import axios from "axios";
import { serviceStorage, serviceUtils } from "@/shared/services";
import { constants } from "@/utilities";

// ===============================
// SERVICE API CLSS
// ===============================
class serviceApi {
  API_BASE_URL = constants.VESICASH_API_URL;
  API_VERSION = constants.VESICASH_API_VERSION;

  // INSTANTIATE BASE API URL
  constructor() {
    this.injectTokenInterceptor();
  }

  // ===============================
  // SETUP SERVICE NAME AND BASE URL
  // ===============================
  service(service_name) {
    const BASE_API_ROUTE = `https://${service_name}${this.API_BASE_URL}/${this.API_VERSION}/`;
    axios.defaults.baseURL = BASE_API_ROUTE;
    return this;
  }

  // ===============================
  // GET API REQUEST
  // ===============================
  async fetch(url, option = { resolve: true, payload: null }) {
    const hashed_url = serviceUtils.urlHash(url);

    try {
      const response = await axios.get(hashed_url, this.getHeaders());
      return option.resolve ? response.data : response;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ========================================
  // GET API REQUEST FROM A CUSTOM BASE_URL
  // ========================================
  async fetchRaw(url) {
    try {
      const response = await axios.get(url);
      return response?.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // POST API REQUEST
  // ===============================
  async push(url, { payload = {}, resolve = true, is_attach = false }) {
    try {
      let response = await axios.post(url, payload, this.getHeaders(is_attach));
      return resolve ? response.data : response;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // UPDATE API REQUEST
  // ===============================
  async update(url, { payload = {}, resolve = true, is_attach = false }) {
    try {
      let response = await axios.put(url, payload, this.getHeaders(is_attach));
      return resolve ? response.data : response;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // PATCH API REQUEST
  // ===============================
  async patch(url, { payload = {}, resolve = true, is_attach = false }) {
    try {
      let response = await axios.patch(
        url,
        payload,
        this.getHeaders(is_attach)
      );
      return resolve ? response.data : response;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // DELETE API REQUEST
  // ===============================
  async remove(url, option = { payload: {}, resolve: true }) {
    try {
      let response = await axios.delete(url, {
        data: option.payload,
        ...this.getHeaders(),
      });

      return option.resolve ? response.data : response;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  // ===============================
  // HANDLE API REQUEST ERRORS
  // ===============================
  async handleErrors(err) {
    return await err.response;
  }

  // ===============================
  // SETUP REQUEST HEADERS
  // ===============================
  getHeaders(attach = false) {
    const authUserToken =
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) || null;

    const api_keys = serviceStorage.getStorage({
      storage_name: constants.VESICASH_USER_TOKEN,
      storage_type: "object",
    }) || { 0: "", 1: "" };

    return attach
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authUserToken}`,
            "V-PUBLIC-KEY": serviceUtils.decodeString(api_keys[0]),
            "V-PRIVATE-KEY": serviceUtils.decodeString(api_keys[1]),
            // "v-app": constants.VUE_APP_VESICASH_APP_KEY,
          },
        }
      : {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authUserToken}`,
            "V-PUBLIC-KEY": serviceUtils.decodeString(api_keys[0]),
            "V-PRIVATE-KEY": serviceUtils.decodeString(api_keys[1]),
            // "v-app": constants.VUE_AsPP_VESICASH_APP_KEY,
          },
        };
  }

  // ===============================
  // REQUEST AXIOS INTERCEPTOR
  // ===============================
  async injectTokenInterceptor() {
    axios.interceptors.request.use((config) => config);

    axios.interceptors.response.use(
      async (response) => response,

      // ERROR RESPONSE
      async (error) => {
        const originalConfig = error.config;

        if (error.response) {
          if ([401].includes(error.response.status) && !originalConfig._retry) {
            originalConfig._retry = true;
            serviceUtils.logOutUser();

            return axios(originalConfig);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

export default new serviceApi();
