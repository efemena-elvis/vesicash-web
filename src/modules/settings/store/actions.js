import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "@/utilities/micro-services";

const routes = {
  user_banks: "user/fetch/bank/",
  add_user_bank: "user/bank_details",
  update_user_banks: "user/bank_details/update",
  remove_user_bank: "user/remove/bank/",
  fetch_connected_users: "user/fetch-users-by-business",
  delete_connected_user: "user/delete",

  request_phone_otp: "phone",
  verify_phone_otp: "phone/verify",
  request_email_otp: "email",
  verify_email_otp: "email/verify",

  update_user_password: "user/security/update_password",
  update_profile: "user/account/update",
  update_business_info: "user/business/profile/update",

  fetch_verifications: "fetch",

  verify_document: "id/verify",
  verify_bvn: "bvn/verify",
};

export default {
  // ==============================
  // FETCH USER BANK ACCOUNTS
  // ==============================
  async fetchAllBanks({ commit }) {
    const response = await getRequest("auth", routes.user_banks, {});

    if (response?.code === 200) commit("SET_BANK_ACCOUNTS", response.data);
    else commit("SET_BANK_ACCOUNTS", []);

    return response;
  },

  // ==============================
  // ADD BANK ACCOUNT
  // ==============================
  async addNewBank(_, payload) {
    return await postRequest("auth", routes.add_user_bank, payload);
  },

  // ==============================
  // REMOVE BANK ACCOUNT
  // ==============================

  async removeUserBank(_, payload) {
    return await deleteRequest("auth", routes.remove_user_bank, payload);
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
    return await patchRequest("auth", routes.update_profile, payload);
  },

  // ==============================
  // FETCH USER VERIFICATIONS
  // ==============================
  async fetchUserVerifications({ commit, getters }, payload) {
    if (getters.getUserVerifications?.length) {
      return {
        code: 200,
        data: getters.getUserVerifications,
      };
    } else {
      const response = await getRequest(
        "verification",
        routes.fetch_verifications,
        payload
      );

      if (response?.code == 200) commit("SET_VERIFICATIONS", response.data);
      return response;
    }
  },

  // ==============================
  // VERIFY DOCUMENT
  // ==============================
  async verfiyUserDocument(_, payload) {
    return await postRequest("verification", routes.verify_document, payload);
  },

  // ==============================
  // VERIFY BVN
  // ==============================
  async verfiyUserBVN(_, payload) {
    return await postRequest("verification", routes.verify_bvn, payload);
  },

  // ==============================
  // UPDATE BUSINESS INFO
  // ==============================
  async updateUserBusinessInfo(_, payload) {
    return await patchRequest("auth", routes.update_business_info, payload);
  },

  // ==============================
  // FETCH CONNECTED USERS
  // ==============================
  async fetchConnectedUsers({ commit }, payload) {
    const response = await getRequest(
      "auth",
      `${routes.fetch_connected_users}/${payload.business_id}`,
      {}
    );

    response?.code === 200 && commit("SAVE_CONNECTED_USERS", response.data);
    return response;
  },

  // ==============================
  // DELETE CONNECTED USER
  // ==============================
  async deleteConnectedUser(_, payload) {
    return await deleteRequest(
      "auth",
      `${routes.delete_connected_user}/${payload.account_id}`,
      {}
    );
  },
};
