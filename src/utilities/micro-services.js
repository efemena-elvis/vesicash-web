import axios from "axios";
import { serviceApi as $api } from "@/shared/services";
import constants from "./constants";

const API_BASE_URL = constants.VESICASH_API_URL;
const API_VERSION = constants.VESICASH_API_VERSION;

function getServiceRoute(service, url) {
  const BASE_API_ROUTE = `https://${service}${API_BASE_URL}/${API_VERSION}`;
  axios.defaults.baseURL = BASE_API_ROUTE;
  return `${BASE_API_ROUTE}/${url}`;
}

// REQUEST ENCAPSULATORS
async function getRequest(service_name, route) {
  const api_route = getServiceRoute(service_name, route);
  return await $api.fetch(api_route);
}

async function postRequest(service_name, route, payload = {}) {
  const api_route = getServiceRoute(service_name, route);
  return await $api.push(api_route, { payload });
}

async function patchRequest(service_name, route, payload = {}) {
  const api_route = getServiceRoute(service_name, route);
  return await $api.patch(api_route, { payload });
}

async function deleteRequest(service_name, route, payload = {}) {
  const api_route = getServiceRoute(service_name, route);
  return await $api.remove(api_route, { payload });
}

export {
  getServiceRoute,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
};
