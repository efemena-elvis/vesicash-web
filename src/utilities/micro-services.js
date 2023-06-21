import axios from "axios";
import { serviceApi as $api } from "@/shared/services";

const APP_ENVIRONMENT = process.env.VUE_APP_VESICASH_ENVIRONMENT;
const API_VERSION = process.env.VUE_APP_VESICASH_API_VERSION;

const getServiceRoute = (service, url) => {
  //   const base_route =
  //     (axios.defaults.baseURL = `https://${service}.cn.vesicash.com/${API_VERSION}`);

  if (service !== "admin") {
    const base_route =
      (axios.defaults.baseURL = `https://${service}-vesicash.onrender.com/${API_VERSION}`);
    return `${base_route}/${url}`;
  } else {
    const base_route =
      (axios.defaults.baseURL = `https://sandbox.api.vesicash.com/v1`);
    return `${base_route}/${url}`;
  }
};

// REQUEST ENCAPSULATORS
const getRequest = async (service_name, route) => {
  const api_route = getServiceRoute(service_name, route);
  return await $api.fetch(api_route);
};

const postRequest = async (service_name, route, payload = {}) => {
  const api_route = getServiceRoute(service_name, route);
  return await $api.push(api_route, { payload });
};

export { getServiceRoute, getRequest, postRequest };
