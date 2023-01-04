export default {
  getAuthUser: (state) => state.authUser,
  getAuthToken: (state) => state.authToken,
  hasUserSeenTour: (state) => state?.authUser?.has_seen_tour,
};
