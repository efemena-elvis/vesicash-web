import axios from "axios";
import { constants } from "@/utilities";
import { getServiceRoute } from "@/utilities/micro-services";
import { serviceStorage, serviceApi as $api } from "@/shared/services";
import { getRequest, postRequest } from "@/utilities/micro-services";

const routes = {
  location: "https://ip2c.org/s",
  upload_file: "files",
  country_bank_list: "banks",
  verify_bank_account: "bank_account/verify",
  verify_wallet: "/auth/user/bank-details",
};

let formData = new FormData();
let axiosSource = axios.CancelToken.source();

export default {
  // ==============================
  // GET CURRENT USER LOCATION
  // ==============================
  async getMyLocation() {
    return await $api.fetchRaw(routes.location);
  },

  // ================================
  // UPLOAD FILE ATTACHMENT
  // ================================
  async uploadFile(_, payload) {
    formData.append("files[0]", payload);
    return await $api.push(routes.upload_file, { formData, is_attach: true });
  },

  // ======================================
  // UPLOAD FILE TO DIGITAL SPACE
  // ======================================
  async uploadToSpace({ commit }, { file, formatted_size, type = null }) {
    const authUserToken =
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) || null;

    formData.append("files", file);
    let file_payload = [];

    try {
      const response = await axios.post(
        getServiceRoute("upload", routes.upload_file),
        formData,
        {
          headers: {
            Authorization: `Bearer ${authUserToken}`,
            "Content-Type": "multipart/form-data",
            "V-PUBLIC-KEY": constants.VESICASH_PUBLIC_KEY_TOKEN,
            "V-PRIVATE-KEY": constants.VESICASH_PRIVATE_KEY_TOKEN,
          },
          onUploadProgress: function (progressEvent) {
            let progress_count = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );

            commit("UPDATE_FILE_PROGRESS", {
              name: file.name,
              size: formatted_size,
              progress: progress_count,
              uploading: true,
            });
          }.bind(this),

          cancelToken: axiosSource.token,
        }
      );

      let file_response = response.data;

      // UPDATE FILE STATE
      if (file_response.code === 201) {
        file_response.data.map((item) => {
          file_payload.push({ name: item.original_name, url: item.file_url });
        });

        type === "escrow" &&
          commit("transactions/UPDATE_TRANSACTION_ATTACHMENT", file_payload, {
            root: true,
          });

        commit("UPDATE_FILE_PROGRESS", {
          name: file.name,
          size: formatted_size,
          progress: 0,
          uploading: false,
        });
      } else {
        commit("UPDATE_FILE_PROGRESS", {
          name: "",
          size: "",
          progress: 0,
          uploading: false,
        });
      }

      let response_payload = {
        code: 201,
        data: file_payload,
      };

      return type === "escrow" ? response_payload : response.data;
    } catch (error) {
      return error;
    }
  },

  // ======================================
  // UPLOAD FILE TO DIGITAL CLOUD [MULTIPLE FILES]
  // ======================================
  async uploadToCloud({ commit }, { files, id }) {
    const authUserToken =
      serviceStorage.getStorage({
        storage_name: constants.VESICASH_AUTH_TOKEN,
      }) || null;

    let form_data = new FormData();

    files.forEach((file, index) => {
      form_data.append(`files[${index}]`, file);
    });

    try {
      const response = await axios.post(
        `${constants.VESICASH_API_URL}${routes.upload_file}`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${authUserToken}`,
            "Content-Type": "multipart/form-data",
            "V-PUBLIC-KEY": constants.VESICASH_PUBLIC_KEY_TOKEN,
            "V-PRIVATE-KEY": constants.VESICASH_PRIVATE_KEY_TOKEN,
          },

          onUploadProgress: function (progressEvent) {
            let progress_count = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );

            const updated_files_state = files.map((file) => {
              return {
                name: file.name,
                size: file.formatted_size,
                progress: progress_count,
                uploading: true,
              };
            });

            commit("UPDATE_ALL_FILES_PROGRESS", {
              id,
              files: updated_files_state,
            });
          }.bind(this),

          cancelToken: axiosSource.token,
        }
      );

      // UPDATE FILE STATE

      if (response.data.code === 200) {
        const updated_files_state = files.map((file, index) => {
          const formatted_file = {
            name: file.name,
            size: file.formatted_size,
            progress: 0,
            uploading: false,
            url: response.data.data.urls[index],
          };
          return formatted_file;
        });

        commit("UPDATE_ALL_FILES_PROGRESS", { id, files: updated_files_state });
      } else {
        commit("UPDATE_ALL_FILES_PROGRESS", { id, files: [] });
      }

      return response.data;
    } catch (error) {
      return error;
    }
  },

  // ======================================
  // CLEAR OUT UPLOAADED FILE ATTACHMENT
  // =======================================
  clearAttachedFile({ commit }) {
    // commit("transactions/UPDATE_TRANSACTION_ATTACHMENT", [], { root: true });
    commit("UPDATE_FILE_PROGRESS", {
      name: "",
      size: "",
      progress: 0,
      uploading: false,
    });
  },

  // ======================================
  // CLEAR OUT ALL FILES ATTACHMENT
  // =======================================
  clearAllAttachedFiles({ commit }) {
    commit("UPDATE_ALL_FILES_PROGRESS", [
      {
        name: "",
        size: "",
        progress: 0,
        uploading: false,
      },
    ]);
  },

  // ==============================
  // GET ALL BANKS IN A COUNTRY
  // ==============================
  async getAllBanks(_, payload) {
    return await postRequest("payment", routes.country_bank_list, payload);
  },

  // ==============================
  // VERIFY BANK ACCOUNT
  // ==============================
  async verifyBankAccount(_, payload) {
    return await postRequest(
      "verification",
      routes.verify_bank_account,
      payload
    );
  },

  // ==============================
  // VERIFY WALLET ACCOUNT ID
  // ==============================
  async verifyWalletAccountID(_, account_id) {
    return await $api.fetch(`${routes.verify_wallet}/${account_id}`);
  },

  updateWalletListSize({ commit }, wallet_size) {
    commit("UPDATE_WALLET_SIZE", wallet_size);
  },
};
