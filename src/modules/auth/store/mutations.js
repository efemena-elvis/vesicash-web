import axios from "axios";
import { constants } from "@/utilities";
import { serviceUtils, serviceStorage } from "@/shared/services";

export default {
  AUTH_SUCCESS: (state, response_payload) => {
    let { user, access_token } = response_payload;

    axios.defaults.headers.common["Authorization"] = access_token;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_TOKEN,
      storage_value: access_token,
    });

    serviceStorage.setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });

    let userData = {};

    userData.id = user.id;
    userData.fullname = user.firstname
      ? `${user.firstname} ${user.lastname}`
      : null;
    userData.email = user.email_address;
    userData.phone = user.phone_number;
    userData.username = user.username;
    userData.meta = user.meta;
    userData.is_merchant = user.is_mor_enabled;

    let { country, currency, bio } = response_payload.profile.user;
    userData.country = country ?? "NG";
    userData.currency = currency ?? "NGN";
    userData.bio = bio;

    // userData.dob = response_payload.profile.user.dob;
    // userData.has_seen_tour = response_payload.user.has_seen_tour;
    // userData.has_seen_mor_introduction =
    //   response_payload.user.has_seen_mor_introduction;

    // BUSINESS ACCOUNT DATA
    let { business } = response_payload.profile;
    userData.business_name = business?.business_name ?? null;
    userData.business_address = business?.business_address ?? null;
    userData.business_country = business.country ?? null;
    userData.business_email = business?.business_email ?? null;
    userData.website = business?.website ?? null;
    userData.business_type = business?.business_type ?? null;
    userData.business_id = business?.id ?? null;
    userData.flutterwave_merchant_id = business?.flutterwave_merchant_id;
    userData.business_charge = business?.escrow_charge ?? {
      type: "percentage",
      value: "0.05",
    };

    // STRINGIFY BUSINESS CHARGE AND ENCODE IT
    userData.business_charge = serviceUtils.encodeString(
      JSON.stringify(userData.business_charge)
    );

    // ENDCODED ACCOUNT TYPE, ACCOUNT ID AND BUSINESS ID
    userData.account_type = serviceUtils.encodeString(user.account_type);
    userData.account_token = serviceUtils.encodeString(user.account_id);
    userData.business_token = serviceUtils.encodeString(user.business_id);

    // USER VERIFICATIONS
    let user_verifications = {};
    let verifications = response_payload.profile?.verifications ?? [];
    const uploaded_verifications = verifications.map(
      (item) => item.verification_type
    );

    verifications.map(
      (verification) =>
        (user_verifications[verification.verification_type] =
          verification.is_verified)
    );

    userData.verifications = user_verifications;
    userData.uploaded_verifications = uploaded_verifications;

    // UPDATE AUTH STATE
    state.authUser = userData;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_USER,
      storage_value: state.authUser,
      storage_type: "object",
    });

    // ENCRYPT THE USER BUSINESS NAME AS IDENTIFIER TOKEN
    // TO BE USED ON LOGIN COPY
    serviceStorage.setStorage({
      storage_name: "identifier_token",
      storage_value: serviceUtils.encodeString(business?.business_name ?? ""),
    });
  },

  AUTH_RESET_TOKEN: (_, response_payload) => {
    let { access_token } = response_payload;

    axios.defaults.headers.common["Authorization"] = access_token;

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_AUTH_TOKEN,
      storage_value: access_token,
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
    serviceUtils.logOutUser();
  },
};
