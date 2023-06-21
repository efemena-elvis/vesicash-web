import $api from "@/shared/services/service-api";
import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  user_banks: "/admin/user/fetch/bank/",
  update_user_banks: "/admin/user/update/bank",
  remove_user_bank: "/admin/user/remove/bank/",
  fetch_connected_users: "admin/fetch-users-by-business",
  delete_connected_user: "admin/user/delete",

  request_phone_otp: "phone",
  verify_phone_otp: "phone/verify",
  request_email_otp: "email",
  verify_email_otp: "email/verify",

  update_user_password: "user/security/update_password",
  update_profile: "admin/user/update/account",
  update_business_info: "/admin/business/profile/update",

  fetch_verifications: "fetch",

  verify_document: "/verification/id/verify",
  verify_bvn: "/verification/bvn/verify",
};

export default {
  // ==============================
  // FETCH BANK ACCOUNTS
  // ==============================

  async fetchAllBanks({ commit }, account_id) {
    const response = await $api.push(
      `${routes.user_banks}${account_id}?array=true`,
      {}
    );

    if (response?.code === 200) commit("SET_BANK_ACCOUNTS", response.data);
    else commit("SET_BANK_ACCOUNTS", []);

    return response;
  },

  // ==============================
  // ADD BANK ACCOUNT
  // ==============================
  async addNewBank(_, payload) {
    return await $api.push(routes.update_user_banks, { payload });
  },

  // ==============================
  // REMOVE BANK ACCOUNT
  // ==============================

  async removeUserBank(_, payload) {
    return await $api.push(routes.remove_user_bank, { payload });
  },

  // ==============================
  // UPDATE PASSWORD
  // ==============================
  async updateUserPassword(_, payload) {
    return await postRequest("auth", routes.update_user_password, payload);
  },

  // ==============================
  // REQUEST PHONE OTP
  // ==============================
  async requestOTP(_, payload) {
    return await postRequest("verification", routes.request_phone_otp, payload);
  },

  // ==============================
  // VERIFY PHONE OTP
  // ==============================
  async verifyOTP(_, payload) {
    return await postRequest("verification", routes.verify_phone_otp, payload);
  },

  // ==============================
  // REQUEST EMAIL OTP
  // ==============================
  async requestEmailOTP(_, payload) {
    return await postRequest("verification", routes.request_email_otp, payload);
  },

  // ==============================
  // VERIFY EMAIL OTP
  // ==============================
  async verifyEmailOTP(_, payload) {
    return await postRequest("verification", routes.verify_email_otp, payload);
  },

  // ==============================
  // UPDATE PROFILE
  // ==============================
  async saveUserProfile(_, payload) {
    return await postRequest("admin", routes.update_profile, payload);
  },

  // ==============================
  // FETCH USER VERIFICATIONS
  // ==============================
  async fetchUserVerifications({ commit }, payload) {
    const response = await postRequest(
      "verification",
      routes.fetch_verifications,
      payload
    );

    if (response?.code == 200) commit("SET_VERIFICATIONS", response.data);
    return response;
  },

  // ==============================
  // VERIFY DOCUMENT
  // ==============================
  async verfiyUserDocument(_, payload) {
    const response = await $api.push(routes.verify_document, { payload });
    return response;
  },

  // ==============================
  // VERIFY BVN
  // ==============================
  async verfiyUserBVN(_, payload) {
    const response = await $api.push(routes.verify_bvn, { payload });
    return response;
  },

  // ==============================
  // UPDATE BUSINESS INFO
  // ==============================
  async updateUserBusinessInfo(_, payload) {
    const response = await $api.push(routes.update_business_info, { payload });
    return response;
  },

  // ==============================
  // FETCH CONNECTED USERS
  // ==============================
  async fetchConnectedUsers({ commit }, payload) {
    const response = await postRequest(
      "admin",
      routes.fetch_connected_users,
      payload
    );

    response?.code === 200 && commit("SAVE_CONNECTED_USERS", response.data);
    return response;
  },

  // ==============================
  // DELETE CONNECTED USER
  // ==============================
  async deleteConnectedUser(_, payload) {
    return await postRequest("admin", routes.delete_connected_user, payload);
  },
};
