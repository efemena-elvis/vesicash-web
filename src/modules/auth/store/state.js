import { serviceStorage } from "@/shared/services";
import { constants } from "@/utilities";

export default () => ({
  authToken:
    serviceStorage.getStorage({
      storage_name: constants.VESICASH_AUTH_TOKEN,
    }) || "",

  authUser:
    serviceStorage.getStorage({
      storage_name: constants.VESICASH_AUTH_USER,
      storage_type: "object",
    }) || "",
});
