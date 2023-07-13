import axios from "axios";
import { constants } from "@/utilities";
import { serviceUtils, serviceStorage } from "@/shared/services";

export default {
  AUTH_SUCCESS: (state, response_payload) => {
    axios.defaults.headers.common["Authorization"] =
      response_payload.access_token;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_TOKEN,
      storage_value: response_payload.access_token,
    });

    serviceStorage.setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });

    let userData = {};

    userData.id = response_payload.user.id;
    userData.fullname = response_payload.user.firstname
      ? `${response_payload.user.firstname} ${response_payload.user.lastname}`
      : null;
    userData.email = response_payload.user.email_address;
    userData.phone = response_payload.user.phone_number;
    userData.username = response_payload.user.username;
    userData.flutterwave_merchant_id =
      response_payload?.profile?.business?.flutterwave_merchant_id;
    userData.country = response_payload.profile.user.country ?? "NG";
    userData.currency = response_payload.profile.user.currency ?? "NGN";
    userData.meta = response_payload.user.meta;
    userData.bio = response_payload.profile.user.bio;
    userData.has_seen_tour = response_payload.user.has_seen_tour;
    userData.is_merchant = response_payload.user.is_mor_enabled;

    // BUSINESS ACCOUNT DATA
    userData.business_name =
      response_payload.profile?.business?.business_name ?? null;
    userData.business_type =
      response_payload.profile?.business?.business_type ?? null;
    userData.business_charge = response_payload.profile?.business
      ?.escrow_charge ?? { type: "percentage", value: "0.05" };

    // STRINGIFY BUSINESS CHARGE AND ENCODE IT
    userData.business_charge = serviceUtils.encodeString(
      JSON.stringify(userData.business_charge)
    );

    // ENDCODED LOGIN COUNT ACCOUNT TYPE, ACCOUNT ID AND BUSINESS ID
    userData.total_entry = serviceUtils.encodeString(
      response_payload.login_count
    );

    userData.account_type = serviceUtils.encodeString(
      response_payload.user.account_type
    );
    userData.account_token = serviceUtils.encodeString(
      response_payload.user.account_id
    );
    userData.business_token = serviceUtils.encodeString(
      response_payload.user.business_id
    );

    // USER VERIFICATIONS
    let user_verifications = {};
    let verifications = response_payload.profile?.verifications ?? [];

    verifications.map(
      (verification) =>
        (user_verifications[verification.verification_type] =
          verification.is_verified)
    );

    userData.verifications = user_verifications;

    // UPDATE AUTH STATE
    state.authUser = userData;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_USER,
      storage_value: state.authUser,
      storage_type: "object",
    });
  },

  AUTH_RESET_TOKEN: (_, response_payload) => {
    axios.defaults.headers.common["Authorization"] =
      response_payload.access_token;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_TOKEN,
      storage_value: response_payload.access_token,
    });

    serviceStorage.setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });
  },

  UPDATE_AUTH_USER: (state, data) => {
    state.authUser = data;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_USER,
      storage_value: state.authUser,
      storage_type: "object",
    });
  },

  AUTH_LOGOUT: () => {
    localStorage.clear();
    location.href = "/login";
  },
};
