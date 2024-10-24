import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  login: "login",
  register: "signup",
  invite_user: "invite-user",
  send_user_otp: "send_otp",
  verify_user_otp: "is_otp_valid",
  request_password: "reset-password",
  reset_password: "reset-password/change-password",
  update_tour_status: "user/update_tour_status",
  business_types: "business-types",
  verify_rc_number: "cac/get-verifications/",
  verify_business_director: "cac/verify",
  search_business: "global-business-search/verify",
  logout: "logout",
  fetch_verifications: "fetch",
};

export default {
  // ============================================
  // LOGIN A USER INTO VESICASH ACCOUNT
  // ============================================
  async loginUser({ commit }, payload) {
    const response = await postRequest("auth", routes.login, payload);
    response?.code === 200 && commit("AUTH_SUCCESS", response.data);
    return response;
  },

  // ============================================
  // REGISTER A USER (PERSONAL / BUSINESS)
  // ============================================
  async registerUser(_, payload) {
    return await postRequest("auth", routes.register, payload);
  },

  // ============================================
  // REGISTER BULK USERS (PERSONAL/BUSINESS)
  // ============================================
  async registerBulkUsers(_, payload) {
    return await postRequest("auth", `${routes.register}/bulk`, payload);
  },

  // ============================================
  // INVITE USERS TO YOUR BUSINESS ACCOUNT
  // ============================================
  async inviteUser(_, payload) {
    return await postRequest("auth", `${routes.invite_user}`, payload);
  },

  // ============================================
  // SEND OTP TO REGISTERED USER
  // ============================================
  async sendUserOTP(_, payload) {
    return await postRequest("auth", routes.send_user_otp, payload);
  },

  // ============================================
  // VERIFY OTP TO SENT TP REGISTERED USER
  // ============================================
  async verifyUserOTP(_, payload) {
    return await postRequest("auth", routes.verify_user_otp, payload);
  },

  // ============================================
  // REQUEST A USER PASSWORD UPDATE
  // ============================================
  async requestUserPassword(_, payload) {
    return await postRequest("auth", routes.request_password, payload);
  },

  // ============================================
  // RESET A USER PASSWORD
  // ============================================
  async resetUserPassword(_, payload) {
    return await postRequest("auth", routes.reset_password, payload);
  },

  // ============================================
  // UPDATE USER TOUR STATUS
  // ============================================
  async updateUserTourStatus(_, payload) {
    return await postRequest("auth", routes.update_tour_status, payload);
  },

  // ============================================
  // LOGOUT A USER FROM VESICASH ACCOUNT
  // ============================================
  async logOutUser({ commit }) {
    await postRequest("auth", routes.logout);
    setTimeout(() => commit("AUTH_LOGOUT"), 300);
  },

  // ============================================
  // GET BUSINESS TYPES
  // ============================================
  async getBusinessTypes() {
    return await getRequest("auth", routes.business_types);
  },

  // ============================================
  // GET VERIFCATIONS
  // ============================================
  async fetchVerifications() {
    return await getRequest("verification", routes.fetch_verifications);
  },

  // ============================================
  // VERIFY RC NUMBER
  // ============================================
  async verifyRcNumber(_, rc_number) {
    return await getRequest(
      "verification",
      routes.verify_rc_number + rc_number
    );
  },

  // ============================================
  // VERIFY DIRECTOR IDENTITY
  // ============================================
  async verifyBusinessDirector(_, payload) {
    return await postRequest(
      "verification",
      routes.verify_business_director,
      payload
    );
  },

  // ============================================
  // SEARCH BUSINESS
  // ============================================
  async searchBusinessDetails(_, payload) {
    return await postRequest("verification", routes.search_business, payload);
  },
};
