const APP_URL = process.env.VUE_APP_VESICASH_APP_BASE_URL;
const API_BASE_URL = process.env.VUE_APP_VESICASH_API_BASE_URL;
const API_VERSION = process.env.VUE_APP_VESICASH_API_VERSION;
const VESICASH_PRIVATE_KEY_TOKEN = process.env.VUE_APP_VESICASH_PRIVATE_KEY;
const VESICASH_PUBLIC_KEY_TOKEN = process.env.VUE_APP_VESICASH_PUBLIC_KEY;
const VUE_APP_VESICASH_APP_KEY = process.env.VUE_APP_VESICASH_APP_KEY;

const LOCAL_DOMAIN = "http://localhost:8060";
const IS_LOCAL_HOST = window.location.hostname === "localhost" ? true : false;

const FORBIDDEN_TLDS = ["gmail.com", "hotmail.com", "yahoo.com"];
const PAYMENT_GATEWAY = "rave";

const constants = {
  VESICASH_AUTH_USER: "VESICASH_AUTH_USER",
  VESICASH_AUTH_TOKEN: "VESICASH_AUTH_TOKEN",
  VESICASH_USER_TOKEN: "VESICASH_USER_TOKEN",
  VESICASH_APP_URL: IS_LOCAL_HOST ? LOCAL_DOMAIN : APP_URL,
  VESICASH_API_URL: API_BASE_URL,
  VESICASH_API_VERSION: API_VERSION,
  VESICASH_PRIVATE_KEY_TOKEN,
  VESICASH_PUBLIC_KEY_TOKEN,
  VUE_APP_VESICASH_APP_KEY,
  FORBIDDEN_TLDS,
  PAYMENT_GATEWAY,
};

export default constants;
