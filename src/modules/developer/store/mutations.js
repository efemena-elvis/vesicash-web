import { constants } from "@/utilities";
import { serviceUtils, serviceStorage } from "@/shared/services";

export default {
  SET_API_KEYS: (state, keys) => (state.api_keys = keys),

  SET_API_KEYS_DETAILS: (state, data) => {
    state.api_keys_details = data;

    let encoded_public_key = serviceUtils.encodeString(data.public_key);
    let encoded_private_key = serviceUtils.encodeString(data.private_key);

    serviceStorage.setStorage({
      storage_name: constants.VESICASH_USER_TOKEN,
      storage_value: { 0: encoded_public_key, 1: encoded_private_key },
      storage_type: "object",
    });
  },
};
