import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  login: "login",
  register: "signup",
  send_user_otp: "send_otp",
  verify_user_otp: "is_otp_valid",
  request_password: "reset-password",
  reset_password: "reset-password/change-password",
  update_tour_status: "user/update_tour_status",
  business_types: "business-types",
  logout: "logout",
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
    setTimeout(() => commit("AUTH_LOGOUT"), 500);
  },

  // ============================================
  // GET BUSINESS TYPES
  // ============================================
  async getBusinessTypes() {
    return await getRequest("auth", routes.business_types);
  },
};
