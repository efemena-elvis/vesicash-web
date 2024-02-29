import $api from "@/shared/services/service-api";

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "@/utilities/micro-services";

const routes = {
  user_banks: "user/fetch/bank?array=true",
  add_user_bank: "user/bank_detail",
  update_user_banks: "user/bank_details/update",

  fetch_group_accounts: "user/groups/bank-details",
  fetch_group_account_beneficiary: "user/group/bank-details",
  create_update_group: "user/bank_details",

  remove_user_bank: "user/bank_details",
  remove_user_bank_group: "user/group/bank_details",
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
  // FETCH BENEFICIARY GROUP
  // ==============================
  async fetchGroupAccounts() {
    return await $api.service("auth").fetch(routes.fetch_group_accounts);
  },

  // ===================================
  // FETCH BENEFICIARY GROUP ACCOUNTS
  // ===================================
  async fetchGroupBeneficiaryAccounts(_, payload) {
    return await $api
      .service("auth")
      .fetch(`${routes.fetch_group_account_beneficiary}/${payload.group_id}`);
  },

  // ==============================
  // ADD BENEFICIARY GROUP
  // ==============================
  async createUpdateBankGroup(_, payload) {
    return await $api
      .service("auth")
      .push(routes.create_update_group, { payload });
  },

  // ======================================
  // UPDATE A BENEFICIARY ACCOUNT DETAILS
  // ======================================
  async updateBeneficiaryAccount(_, { id, payload }) {
    return await $api
      .service("auth")
      .patch(`${routes.create_update_group}/${id}`, { payload });
  },

  // ==============================
  // REMOVE BANK BENEFICIARY
  // ==============================
  async removeUserBank(_, payload) {
    return await $api
      .service("auth")
      .remove(`${routes.remove_user_bank}/${payload.id}`);
  },

  // ================================
  // REMOVE BANK BENEFICIARY GROUP
  // ================================
  async removeUserBankGroup(_, payload) {
    return await $api
      .service("auth")
      .remove(`${routes.remove_user_bank_group}/${payload.id}`);
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
  async fetchUserVerifications({ commit }, payload) {
    const response = await getRequest(
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
