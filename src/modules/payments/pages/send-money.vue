<template>
  <div>
    <PageBackBtn :history_mode="true" btn_text="Back" />

    <!-- TOP ROW -->
    <div class="top-row mgb-32">
      <div class="h4-text">Send Money</div>
    </div>

    <!-- BODY AREA -->
    <div class="body-area">
      <div class="body-content body-content-active">
        <div class="counter-wrapper">
          <div class="counter">1</div>
        </div>

        <div class="col-12 col-md-5">
          <div class="mgb-24">
            <div class="form-label">Select wallet account</div>

            <DropSelectInput
              placeholder="Select wallet"
              :options="currency_options"
              :pre_select="selected_currency"
              @selectedOption="selectDropdownOption($event)"
            />
          </div>
        </div>
      </div>

      <div class="body-content">
        <div class="counter-wrapper">
          <div class="counter">2</div>
        </div>

        <div>
          <div class="body-top-row mgb-26">
            <div class="left-row">
              <button
                class="btn btn-md btn-tertiary"
                @click="setAccountView('SendMultipleAccount')"
              >
                <span class="icon-plus mgl--8 mgr-6 f-size-14"></span> Select
                Beneficiary
              </button>

              <button
                class="btn btn-md btn-secondary"
                @click="setAccountView('SendUploadAccount')"
              >
                Import beneficiary
              </button>

              <div class="tooltip-guide mgl--6">
                <span class="icon icon-info green-400 pointer f-size-18"></span>

                <!-- TOOLTIP DATA -->
                <div class="tooltip-wrapper wt-100 position-absolute">
                  <div
                    class="tooltip-data wt-100 green-50-bg rounded-8 grey-800"
                    v-html="tooltip_text"
                  ></div>
                </div>
              </div>
            </div>

            <div class="right-row">
              <button
                class="btn btn-md btn-tertiary"
                @click="setAccountView('SendSingleAccount')"
              >
                <span class="icon-plus mgl--8 mgr-6 f-size-14"></span> Add
                account
              </button>
            </div>
          </div>

          <!-- BENEFICIARY CONTENT BLOCK -->
          <template v-if="getRecipientAccounts.length">
            <div class="table-wrapper">
              <table class="table rounded-corners">
                <!-- TABLE HEADER -->
                <thead>
                  <tr>
                    <td>#Account Number</td>
                    <td>Bank</td>
                    <td>Account Name</td>
                    <td>
                      Amount
                      <span
                        class="icon-edit-pen mgl-4 f-size-12 green-500"
                      ></span>
                    </td>
                    <td>Charges</td>
                  </tr>
                </thead>

                <tbody>
                  <SendMoneyTableRow
                    v-for="(account, index) in getRecipientAccounts"
                    :key="index"
                    :account_index="index"
                    :account="account"
                  />
                </tbody>
              </table>
            </div>

            <!-- NARRATION INPUT -->
            <div class="col-12 col-md-5">
              <div class="form-group">
                <FormFieldInput
                  label_title="Narration"
                  label_id="narration"
                  is_required
                  placeholder="Enter narration here..."
                  :input_value="getFormFieldValueMx(form, 'narration')"
                  @getInputState="updateFormFieldMx($event, 'narration')"
                />
              </div>
            </div>
          </template>

          <!-- BENEFICIARY EMPTY BLOCK -->
          <template v-else>
            <div
              class="beneficiary-empty-block rounded-12 pointer"
              @click="setAccountView('SendSingleAccount')"
            >
              <img
                :src="loadImage('cash-icon.svg', 'dashboard')"
                alt="wallet"
                class="mgb-4"
              />

              <div class="title-text grey-700">Add Transfer Account</div>
              <div class="description-text grey-500">
                Add a new transfer account or select from beneficiary
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- SEND MONEY ACTION -->
      <div class="form-group">
        <button
          ref="btnRef"
          class="btn btn-primary btn-md"
          :disabled="isDisabled"
          @click="prepareTransferAccount()"
        >
          Send Money
        </button>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_account_modal">
        <SendMoneyModal
          :show_page_switcher="
            base_account_view === 'SendMultipleAccount' ? true : false
          "
          :default_active_view="base_account_view"
          @closeTriggered="toggleAccountModal()"
        />
      </transition>

      <transition name="fade" v-if="show_otp_modal">
        <BulkTransferOtpModal
          :currency="selected_currency.short"
          :total_amount="getTotalAmount"
          @closeTriggered="toggleOTPModal()"
          @processTransfer="processTransferRequest()"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <BulkTransferSuccessModal
          :currency="selected_currency.short"
          :total_amount="getTotalAmount"
          @viewPayments="closeTransaction($event)"
          @closeTriggered="closeTransaction($event)"
          @processTransfer="processTransferRequest()"
        />
      </transition>
    </portal>
  </div>
</template>
    
<script>
import { mapActions, mapGetters } from "vuex";
import { constants } from "@/utilities";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";

export default {
  name: "SendMoney",

  components: {
    PageBackBtn,

    SendMoneyTableRow: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/components/send-money-table-row"
      ),

    SendMoneyModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/send-money/send-money-modal"
      ),

    BulkTransferOtpModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/bulk-transfer-otp-modal"
      ),

    BulkTransferSuccessModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/bulk-transfer-success-modal"
      ),
  },

  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
      getRecipientAccounts: "payments/getRecipientAccounts",
      getTransactionCharges: "general/getTransactionCharges",
    }),

    isDisabled() {
      return this.getRecipientAccounts.length ? false : true;
    },

    getTotalAmount() {
      return this.getRecipientAccounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue?.amount || 0;
      }, 0);
    },

    getSelectedWalletBalance() {
      return this.selected_currency.balance;
    },

    isTransferAmountFilled() {
      const found_unfilled_amount = this.getRecipientAccounts.find((account) =>
        [0, null, ""].includes(account.amount)
      );

      return !!found_unfilled_amount === false ? true : false;
    },

    getProcessedAccountList() {
      return this.getRecipientAccounts.map((account) => {
        return {
          amount: account.amount,
          currency: this.selected_currency.short,
          beneficiary_name: account.account_name,
          bank_account_number: account.account_no,
          bank_code: account.sort_code,
          bank_name: account.bank_name,
        };
      });
    },

    getBulkTransferPayload() {
      return {
        account_id: this.getAccountId,
        accounts: [...this.getProcessedAccountList],
        debit_currency: this.selected_currency.short,
        gateway: constants.PAYMENT_GATEWAY,
        narration: this.form.narration.value,
        escrow_wallet: "no",
      };
    },
  },

  data() {
    return {
      show_otp_modal: false,
      show_account_modal: false,
      show_success_modal: false,

      base_account_view: "",

      currency_options: [],

      selected_currency: {
        slug: "", // naira
        short: "", // NGN
      },

      form: {
        narration: {
          validated: false,
          value: "",
        },
      },

      tooltip_text:
        "Easily send money to multiple accounts, by uploading a beneficiary data file (CSV or Excel).",
    };
  },

  async mounted() {
    this.loadWalletCurrencyOptions();

    if (!this.getTransactionCharges?.wallet_withdrawal)
      await this.fetchCharges("wallet_withdrawal");
  },

  methods: {
    ...mapActions({
      sendUserOTP: "auth/sendUserOTP",
      fetchCharges: "general/fetchCharges",
      initiateBulkTransfer: "payments/initiateBulkTransfer",
      clearOutAccountList: "payments/clearOutAccountList",
    }),

    setAccountView(view) {
      this.base_account_view = view;
      this.toggleAccountModal();
    },

    toggleAccountModal() {
      this.show_account_modal = !this.show_account_modal;
    },

    toggleOTPModal() {
      this.show_otp_modal = !this.show_otp_modal;
    },

    toggleTransferSuccessModal() {
      this.show_success_modal = !this.show_success_modal;
    },

    loadWalletCurrencyOptions() {
      this.getWalletSize
        .filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && !wallet?.mor
        )
        .map((wallet_type) => {
          this.currency_options.push({
            id: wallet_type.id,
            name: `${wallet_type.description} (${
              wallet_type.short
            } ${this.$utils.formatCurrencyWithComma(
              wallet_type?.balance || "0",
              true
            )})`,
            slug: wallet_type.long.toLowerCase(),
            short: wallet_type.short,
            country: wallet_type.code.toUpperCase(),
            balance: +wallet_type?.balance ?? 0,
          });
        });

      this.setDefaultLocalWallet();
    },

    setDefaultLocalWallet() {
      this.selected_currency = this.currency_options[0];
    },

    // SELECT OPTION FROM OPTION LIST
    selectDropdownOption(value) {
      this.form.amount = "";

      this.selected_currency = this.currency_options.find(
        (option) => option.id === value
      );
    },

    async sendOutOTPVerificationCode() {
      const response = await this.handleDataRequest({
        action: "sendUserOTP",
        payload: { account_id: this.getAccountId, is_withdrawal: true },
        btn_text: "Send Money",
        alert_handler: {
          success: "Transfer OTP code sent successfully",
          error: "Unable to send transfer OTP code",
          request_error: "Unable to send transfer OTP code",
        },
      });

      if (response?.code === 200) this.toggleOTPModal();
    },

    async prepareTransferAccount() {
      if (this.getTotalAmount > this.getSelectedWalletBalance) {
        this.pushToast(
          "Total amount entered excceds your wallet balance",
          "warning"
        );
        return false;
      }

      if (this.isTransferAmountFilled) {
        this.sendOutOTPVerificationCode();
      } else {
        this.pushToast("A transfer account is missing an amount", "warning");
        return false;
      }
    },

    async processTransferRequest() {
      this.toggleOTPModal();
      this.$bus.$emit("show-page-loader", "Processing your transfer");

      const response = await this.handleDataRequest({
        action: "initiateBulkTransfer",
        payload: this.getBulkTransferPayload,
        alert_handler: {
          error: "Unable to process transfer at the moment",
          request_error: "Unable to process transfer at the moment",
        },
      });

      if (response.code == 200) {
        this.$bus.$emit("hide-page-loader");
        this.toggleTransferSuccessModal();
      }
    },

    closeTransaction(type) {
      this.clearOutAccountList();
      this.form.narration.value = "";
      this.toggleTransferSuccessModal();

      if (type === "payments") this.$router.push("/payments");
    },
  },
};
</script>
    
<style scoped lang="scss">
.body-area {
  margin-bottom: toRem(60);

  .body-content {
    position: relative;
    padding-top: toRem(6);
    padding-left: toRem(64);
    margin-bottom: toRem(48);

    &:after {
      content: "";
      position: absolute;
      left: toRem(18);
      top: 0;
      height: 100%;
      width: toRem(1);
      background: getColor("grey-400");
    }

    .counter-wrapper {
      position: absolute;
      @include flex-column("center", "center");
      @include draw-shape(38);
      background: getColor("neutral-10");
      top: 0;
      left: 0;
      z-index: 1;

      .counter {
        @include flex-column("center", "center");
        background: getColor("grey-600");
        color: getColor("neutral-10");
        @include draw-shape(26);
        font-size: toRem(12);
        position: relative;
        border-radius: 50%;
      }
    }

    &-active {
      &:after {
        background: getColor("green-500");
      }

      .counter-wrapper {
        .counter {
          background: getColor("green-500");
          font-weight: 500;
        }
      }
    }
  }

  .body-top-row {
    @include flex-row-nowrap("space-between", "center");

    .left-row {
      @include flex-row-nowrap("flex-start", "center");
      gap: toRem(16);

      .tooltip-guide {
        position: relative;

        .icon-info {
          &:hover ~ .tooltip-wrapper {
            top: 117%;
            visibility: visible;
          }
        }

        .tooltip-wrapper {
          width: toRem(240);
          left: toRem(-204);
          top: toRem(30) !important;

          @include breakpoint-down(md) {
            width: toRem(200);
            left: toRem(-165);
          }

          @include breakpoint-down(sm) {
            width: toRem(190);
            left: toRem(-155);
          }
        }
      }
    }

    .right-row {
    }
  }

  .beneficiary-empty-block {
    border: toRem(1) solid getColor("grey-200");
    @include flex-column("center", "center");
    padding: toRem(26) toRem(20) toRem(36);
    gap: toRem(5);

    .title-text {
      @include font-height(15.5, 22, 600);
      text-align: center;
    }

    .description-text {
      @include font-height(14, 18);
      text-align: center;
    }

    &:hover {
      background: getColor("green-10");
    }
  }
}
</style>

