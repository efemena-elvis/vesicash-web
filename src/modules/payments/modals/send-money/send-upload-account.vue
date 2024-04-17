<template>
  <div>
    <div class="body-area mgb-32 border-transparent">
      <!-- GROUP FILE INPUT -->
      <div class="form-group">
        <div class="form-label">Upload beneficiary file</div>
        <div class="label-subtitle mgt--2 mgb-20">
          You can upload an excel (xls, xlsx) file, containing all beneficiary
          accounts.
        </div>

        <div
          class="upload-card rounded-12 border-grey-100 smooth-transition overflow-hidden"
        >
          <!-- CONTENT STATE -->
          <div class="content-state wt-100" v-if="has_uploaded">
            <div class="d-flex justify-content-start align-items-center">
              <div class="file-icon rounded-circle teal-50-bg mgr-12">
                <img
                  :src="loadImage('file-icon.svg', 'dashboard')"
                  alt="transfer"
                />
              </div>

              <div>
                <div class="f-size-15 fw-semibold grey-900 mgb-2">
                  {{ file_name }}
                </div>
                <div class="f-size-13-5 grey-600">
                  {{
                    has_validated ? "Validation complete" : "Validating file..."
                  }}
                </div>
              </div>
            </div>

            <!-- VALIDATED STATE -->
            <div class="validated-state">
              <SuccessIcon v-if="has_validated" />
              <div class="loading rounded-circle" v-else></div>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div class="empty-state pointer" v-else>
            <label for="fileUpload" class="pointer">
              <!-- ICON HOLDER -->
              <div class="text-center mgb-8 pointer">
                <img
                  :src="loadImage('file-icon.svg', 'dashboard')"
                  alt="transfer"
                />
              </div>

              <!-- TITLE TEXT -->
              <div
                class="title-text grey-900 f-size-15 fw-semibold text-center mgb-4 pointer"
              >
                Click to upload a beneficiary file
              </div>

              <!-- DESCRIPTION TEXT -->
              <div
                class="description-text f-size-13-5 grey-600 text-center pointer"
              >
                You can upload an excel file
              </div>
            </label>

            <!-- FILE INPUT FIELD -->
            <input
              type="file"
              id="fileUpload"
              ref="fileUpload"
              @change="handleFileUpload"
              class="position-absolute invisible"
              accept=".xls, .xlsx"
            />
          </div>
        </div>

        <!-- SAMPLE FILE ROW -->
        <div class="sample-file-row mgt-12 f-size-13-5 fw-medium grey-600">
          Download sample file:
          <!-- <a
            href="../../files/bulk-transfer.csv"
            download="bulk-transfer.csv"
            class="btn-link"
            >CSV file</a
          > -->
          <a
            href="../../files/bulk-transfer.xlsx"
            download="bulk-transfer.xlsx"
            class="btn-link"
            >Excel file</a
          >
        </div>
      </div>
    </div>

    <div class="footer-area mgt-20 pdb-30">
      <button
        ref="btnRef"
        :disabled="isDisabled"
        class="btn btn-primary btn-md pdy-10 wt-100"
        @click="addAccountToSendMoney()"
      >
        Add uploaded account
      </button>
    </div>
  </div>
</template>
        
  <script>
import { mapActions, mapGetters } from "vuex";
import SuccessIcon from "@/shared/components/icon-comps/success-icon";

export default {
  name: "UploadBeneficiary",

  components: {
    SuccessIcon,
  },

  computed: {
    ...mapGetters({
      getRecipientAccounts: "payments/getRecipientAccounts",
    }),

    isDisabled() {
      return this.verified_account_list.length &&
        this.has_uploaded &&
        this.has_validated
        ? false
        : true;
    },
  },

  data() {
    return {
      file_name: null,
      has_uploaded: false,
      has_validated: false,

      verified_account_list: [],
      bank_list: [],
    };
  },

  mounted() {
    this.fetchAllBanks();
  },

  methods: {
    ...mapActions({
      getAllBanks: "general/getAllBanks",
      verifyBankAccount: "general/verifyBankAccount",
      createUpdateBankGroup: "settings/createUpdateBankGroup",
      fetchGroupBeneficiaryAccounts: "settings/fetchGroupBeneficiaryAccounts",
      addToAccountList: "payments/addToAccountList",
    }),

    async fetchAllBanks() {
      const response = await this.handleDataRequest({
        action: "getAllBanks",
        payload: {
          country_code: this.getUser.business_country,
        },
        show_alert: false,
      });

      if (response?.code === 200) {
        let bank_options = response.data.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });

        let filtered_banks = [];

        bank_options.map((bank) => {
          if (filtered_banks.findIndex((b) => b.code === bank.code) === -1)
            filtered_banks.push(bank);
        });

        this.bank_list = filtered_banks;
      }
    },

    updateFileValidationState(is_validating = false, completed = false) {
      if (is_validating) {
        this.has_uploaded = true;
        this.has_validated = false;
      } else {
        if (completed) {
          this.has_uploaded = true;
          this.has_validated = true;
        } else {
          this.has_uploaded = false;
          this.has_validated = false;

          this.file_name = "";

          if (this.$refs.fileUpload) {
            this.$refs.fileUpload.value = "";
          }
        }
      }
    },

    handleFileUpload($event) {
      const fileInput = $event.target;
      const file = fileInput.files[0];

      if (file) {
        this.updateFileValidationState(true);
        this.file_name = file.name;

        const file_type = this.$utils.getFileType(file.name);

        if (file_type) {
          this.$utils
            .readUploadedFile(file, file_type)
            .then((data) => {
              let parsed_data = this.$utils.extractBankIdUpdateAccountList(
                data,
                this.bank_list
              );

              if (parsed_data.message === "validation error") {
                this.pushToast(
                  `Unable to find provided bank ${parsed_data.data.bank_name}`,
                  "error"
                );
                this.updateFileValidationState();
              } else {
                // VERIFY ACCOUNTS
                this.verifyAccountList(parsed_data.data);
              }
            })
            .catch((error) => {
              console.error(error);
              this.pushToast("Unable to parse uploaded file", "error");
              this.updateFileValidationState();
            });
        }

        // IF UPLOADED FILE IS NOT EXCEL
        else {
          this.pushToast("Please upload an xlsx file", "error");
          this.updateFileValidationState();
        }
      }

      // NO FILE FOUND
      else {
        this.pushToast("File uploaded is not valid", "error");
        this.updateFileValidationState();
      }
    },

    async verifyAccountList(account_list) {
      let verified_list = [];
      let unverified_list = [];

      try {
        await Promise.all(
          account_list.map(async (account) => {
            const response = await this.verifyBankAccount({
              bank_code: account.bank_code,
              account_number: account.account_number,
            });

            if (response.status !== 400) {
              if (response.code === 200) {
                if (
                  account.account_name.toLowerCase().replace(/\s+/g, " ") ===
                  response.data.account_name.toLowerCase().replace(/\s+/g, " ")
                ) {
                  verified_list.push(account);
                } else {
                  unverified_list.push(account);
                }
              } else if (response.code === 400) {
                unverified_list.push(account);
              }
            } else {
              unverified_list.push(account);
            }
          })
        );

        if (unverified_list.length) {
          this.pushToast(
            `Unable to verify ${unverified_list[0].account_name} - ${unverified_list[0].bank_name}`,
            "error"
          );
          this.updateFileValidationState();
          return false;
        } else if (verified_list.length) {
          this.verified_account_list = verified_list;
          this.updateFileValidationState(false, true);
        }
      } catch (error) {
        console.error(error);
        this.pushToast("Unable to verify account", "error");
        this.updateFileValidationState();
        return false;
      }
    },

    addAccountToSendMoney() {
      let filtered_accounts = [];
      let duplicate_accounts = [];

      // CHECK IF DUPLICATE ACCCOUNT EXIST
      this.verified_account_list.forEach((user) => {
        let account_found = this.getRecipientAccounts.find(
          (account) => account.account_no === user.account_no
        );

        if (!account_found) filtered_accounts.push(user);
        else duplicate_accounts.push(user);
      });

      if (duplicate_accounts.length)
        this.pushToast("Duplicated account has been filtered out", "warning");

      let updated_beneficiaries = filtered_accounts.map((account) => {
        return {
          account_id: this.getAccountId,
          account_name: account.account_name,
          account_no: account.account_number,
          bank_name: account.bank_name,
          sort_code: account.bank_code,
          country: this.getUser.business_country,
          currency: this.getUser.currency,
          amount: +account.amount,
          charge_fee: 0,
        };
      });

      this.addToAccountList(updated_beneficiaries);
      this.$emit("closeTriggered");
    },
  },
};
</script>
    
  <style scoped lang="scss">
.label-subtitle {
  @include font-height(13.5, 21);
}

.sample-file-row {
  @include flex-row-nowrap("flex-start", "flex-start");
  gap: toRem(7);

  .btn-link {
    color: getColor("green-600");
    font-size: toRem(13);
    cursor: pointer;

    &:hover {
      color: getColor("green-500");
    }
  }
}

.upload-card {
  position: relative;

  .content-state {
    @include flex-row-nowrap("space-between", "center");
    padding: toRem(10);

    .file-icon {
      @include draw-shape(46);
      position: relative;

      img {
        @include center-placement();
        @include draw-shape(25);
      }
    }

    .validated-state {
      padding-right: toRem(6);

      .loading {
        @include draw-shape(24);
        background-color: getColor("green-300");
        animation: zoomInOut 0.8s ease-in-out infinite;
      }

      svg {
        @include draw-shape(30);
      }
    }
  }

  .empty-state {
    @include flex-column("center", "center");
    padding: toRem(18) toRem(12);

    &:hover {
      background: getColor("grey-10");
    }

    img {
      @include draw-shape(30);
    }

    .title-text {
      @include breakpoint-down(xs) {
        font-size: toRem(15.25);
      }
    }

    .description-text {
      @include breakpoint-down(xs) {
        font-size: toRem(13.5);
      }
    }
  }
}
</style>