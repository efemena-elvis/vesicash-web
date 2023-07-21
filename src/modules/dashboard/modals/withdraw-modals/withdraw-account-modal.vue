<template>
  <div>
    <!-- MODAL COVER BODY -->
    <div>
      <!-- CURRENCY SELECTION -->
      <div class="mgb-24">
        <div class="form-label">Select wallet type</div>

        <DropSelectInput
          placeholder="Select wallet"
          :options="currency_options"
          @selectedOption="selectDropdownOption('wallet', $event)"
        />
      </div>

      <!-- TOTAL DISPLAY CARDS -->
      <template v-if="selected_currency.slug">
        <div class="mgb-24">
          <SumTotalDisplayCard
            :total_text="`${selected_currency.slug} balance`"
            :total_value="`${$utils.formatCurrency({
              input: selected_currency.slug,
              output: 'sign',
            })}${$utils.formatCurrencyWithComma(selected_currency_balance)}`"
            use_custom_style
          />
        </div>

        <!-- AMOUNT TO WITHDRAW -->
        <div class="form-group">
          <BasicInput
            label_title="Amount to withdraw"
            label_id="amount"
            :input_value="form.amount"
            input_type="number"
            is_required
            placeholder="0.00"
            :custom_style="{ input_wrapper_style: 'form-prefix' }"
            :currency="`${selected_currency.short} (${$utils.formatCurrency({
              input: selected_currency.slug,
              output: 'sign',
            })})`"
            class="form-prefix-right"
            @getInputState="updateFormState($event, 'amount')"
            :error_handler="{
              type: 'required',
              message: 'Enter an amount',
            }"
          />

          <!-- AMOUNT DATA -->
          <div
            v-if="account_type.slug !== 'transfer_request'"
            class="amount-meta mgt-8 tertiary-2-text grey-600"
          >
            <div>
              Minimum amount:
              <span class="fw-bold"
                >{{ $money.getSign(selected_currency.slug)
                }}{{
                  $utils.formatCurrencyWithComma(selected_currency.min_amount)
                }}</span
              >
            </div>

            <div class="green-500">
              Charges:
              <span class="fw-bold"
                >{{ $money.getSign(selected_currency.slug)
                }}{{
                  $utils.formatCurrencyWithComma(getWithdrawalCharge)
                }}</span
              >
            </div>
          </div>
        </div>

        <template v-if="account_type.slug === 'transfer_request'">
          <!-- INFO CARD -->
          <div class="info-card grey-10 border-grey-100 rounded-8 mgb-24">
            <div
              class="icon-info green-600 f-size-18 mgr-8"
              style="position: relative; top: 1px"
            ></div>

            <div class="text grey-700 tertiary-2-text">
              On confirmation of your withdrawal request, your requested amount
              would be processed within 1-3 business working days.
            </div>
          </div>

          <!-- <div class="form-group">
            <BasicInput
              label_title="Withdrawal date"
              label_id="withdrawalDate"
              input_type="date"
              :input_value="mor_withdrawal_date"
              placeholder="Select date"
              is_required
              :minimum_date="minimum_date"
              @getInputState="updateWithdrawalInput($event.value)"
            />
          </div> -->
        </template>

        <template v-else>
          <!-- TOGGLE BENEFICIARY ENTRY -->
          <div class="mgb-10" v-if="account_type.slug !== 'settlement'">
            <PageSwitcher
              :page_data="pages"
              :full_width="false"
              @swapItem="updateBeneficiaryState($event)"
            />
          </div>

          <template v-if="beneficiary_state === 'saved'">
            <!--ACCOUNT DISPLAY DETAILS -->
            <div class="form-group mgb-20">
              <div class="form-label">
                {{ getBeneficiaryLabel }}
              </div>

              <DropSelectInput
                :placeholder="getBeneficiaryLabel"
                :options="beneficiary_account_options"
                :allow_search="
                  beneficiary_account_options.length > 5 ? true : false
                "
                :pre_select="account_pre_select"
                empty_text="No beneficiary account available"
                @selectedOption="selectDropdownOption('account', $event)"
              />

              <div
                class="account-display-area mgt-10"
                v-if="form.selected_beneficiary.selected"
              >
                <AccountDisplayCard :card_detail="form.selected_beneficiary" />
              </div>
            </div>

            <!-- ADD NEW BANK BENEFICIARY -->
            <div v-if="false">
              <RadioSelectCard
                label_id="account1"
                label_text="Add new account details"
                card_name="account"
                :single_type="true"
                @clicked="addNewAccountBeneficiary"
              />
            </div>
          </template>
        </template>

        <!-- NEW ACCOUNT VIEW -->
        <template v-if="beneficiary_state === 'new'">
          <transition name="fade" mode="out-in">
            <component
              :is="getNewAccountCreateView"
              :selected_country="getWalletType"
              @bankDetailsUpdated="validateNewBankAccountPayload"
            />
          </transition>
        </template>
      </template>
    </div>

    <!-- MODAL COVER FOOTER -->
    <div class="pdb-30">
      <button
        class="btn btn-primary btn-md wt-100"
        @click="handleButtonClick"
        :disabled="isFormFieldsValid"
        ref="btnRef"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import PageSwitcher from "@/shared/components/util-comps/page-switcher";

export default {
  name: "WithdrawAccountModal",

  components: {
    PageSwitcher,
    AccountDisplayCard: () =>
      import(
        /* webpackChunkName: "dashboard-module" */
        "@/modules/dashboard/components/modal-comps/account-display-card"
      ),

    RadioSelectCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/radio-select-card"
      ),

    SumTotalDisplayCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/sum-total-display-card"
      ),

    NewLocalAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-local-account"
      ),

    NewWalletAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-wallet-account"
      ),

    NewForeignAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-foreign-account"
      ),
  },

  props: {
    type: {
      type: String,
      default: "single",
    },

    account_type: {
      type: Object,
    },
  },

  computed: {
    ...mapGetters({
      getWalletType: "dashboard/getWalletType",
      getWalletBalances: "dashboard/getWalletBalances",
      getWalletSize: "general/getWalletSize",
    }),

    // GET ACCOUNT BENEFICIARY INPUT FILED LABEL
    getBeneficiaryLabel() {
      return `Select ${
        this.account_type.slug === "wallet" ? "wallet" : "beneficiary"
      } account`;
    },

    // GET DISPLAY COMPONENTS VIEW
    getNewAccountCreateView() {
      if (this.account_type.slug === "wallet") return "NewWalletAccount";
      else
        return this.getWalletType?.slug === "dollar"
          ? "NewForeignAccount"
          : "NewLocalAccount";
    },

    getWithdrawalCharge() {
      let account_type = this.account_type.slug;
      return account_type === "wallet" ? 0 : 50;
    },

    // dollarWithdrawalDetails() {
    //   return {
    //     amount: Number(Number(this.form.amount)),
    //     fee: this.withdrawal_charge,
    //     total: Number(this.form.amount),
    //     country: "United States",
    //     phone: this.phone,
    //     first_name: this.getFirstName,
    //     last_name: this.getLastName,
    //     name: this.getNewAccount?.account_name || "",
    //     bank_name: this.getNewAccount?.bank_name || "",
    //     iban: this.getNewAccount?.account_no || "",
    //     account_no: this.getNewAccount?.account_no || "",
    //     swift_code: this.getNewAccount?.swift_code || "",
    //     sort_code: this.getNewAccount?.sort_code || "",
    //     bank_address: this.getNewAccount?.bank_address || "",
    //     bank_code:
    //       this.getNewAccount?.bank.code || this.getNewAccount?.bank_code,
    //   };
    // },

    // CHECK AMOUNT AND BANK ACCOUNT SELECTED
    isFormFieldsValid() {
      if (this.account_type.slug === "transfer_request") {
        return this.form.amount ? false : true;
      }

      return this.form.amount && this.form.selected_beneficiary.selected
        ? false
        : true;
    },
  },

  async mounted() {
    this.loadWalletCurrencyOptions();
    await this.fetchUserSavedAccountList(this.account_type.slug);
  },

  data: () => ({
    currency_options: [],

    selected_currency: {
      slug: "", // naira
      short: "", // NGN
    },

    selected_currency_balance: "0.00",
    beneficiary_account_options: [],

    account_pre_select: null,

    form: {
      amount: "",
      selected_beneficiary: {
        selected: false,
      },
    },

    validity: {
      amount: true,
    },

    mor_withdrawal_date: "",

    create_new_account: false,

    pages: [
      {
        title: "Saved Beneficiary",
        value: "saved",
        active: true,
      },
      {
        title: "New Beneficiary",
        value: "new",
        active: false,
      },
    ],

    beneficiary_state: "saved",
  }),

  methods: {
    ...mapActions({
      fetchBankDetails: "dashboard/fetchBankDetails",
      addNewBank: "settings/addNewBank",
      sendUserOTP: "auth/sendUserOTP",
    }),

    ...mapMutations({
      setWalletType: "dashboard/SET_WALLET_TYPE",
      setWithdrawalMeta: "dashboard/SET_WITHDRAWAL_META",
      saveWithdrawalRequest: "dashboard/SAVE_WITHDRAWAL_REQUEST_DATA",
    }),

    updateWithdrawalInput(value) {
      // console.log("Date", value);
    },

    loadWalletCurrencyOptions() {
      let get_wallets = [];

      if (this.account_type.slug === "transfer_request") {
        get_wallets = this.getWalletSize.filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && wallet?.mor
        );
      } else {
        get_wallets = this.getWalletSize.filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && !wallet?.mor
        );
      }

      get_wallets.map((wallet_type) => {
        this.currency_options.push({
          id: wallet_type.id,
          name: `${wallet_type.description} (${wallet_type.short})`,
          slug: wallet_type.long.toLowerCase(),
          short: wallet_type.short,
          country: wallet_type.code.toUpperCase(),
          min_amount: wallet_type.short === "USD" ? 100 : 1000,
        });
      });
    },

    updateBeneficiaryState($event) {
      this.beneficiary_state = $event;
    },

    // CHECK STATE OF CREATE NEW ACCOUNT
    // IF STATE IS TRUE TOGGLE ELSE GO BACK
    processBackButtonClicks() {
      if (this.create_new_account) {
        this.create_new_account = false;
        return true;
      } else {
        this.$emit("goBackWalletSelection");
      }
    },

    // RESET PREVIOUS FORM STATE VALUE
    resetPreviousFormState() {
      this.form.amount = "";
      this.form.selected_beneficiary = { selected: false };
      this.account_pre_select = {};
    },

    // SELECT OPTION FROM OPTION LIST
    selectDropdownOption(type, value) {
      if (type === "wallet") {
        this.resetPreviousFormState();

        let currency = this.currency_options.find(
          (option) => option.id === value
        );

        this.setWalletType(currency);
        this.selected_currency = currency;

        this.selected_currency_balance = this.getSelectedCurrencyBalance(
          currency.short
        );
      }

      if (type === "account") {
        this.account_pre_select = {};

        let beneficiary = this.beneficiary_account_options.find(
          (option) => option.id === value
        );

        this.form.selected_beneficiary = {
          ...beneficiary?.options,
          selected: true,
        };
      }
    },

    // GET CURRENT CURRENCY ACCOUNT BALANCE
    getSelectedCurrencyBalance(currency) {
      let currency_value = currency;

      if (this.account_type.slug === "transfer_request") {
        currency_value = `MOR_${currency}`;
      }

      return (
        this.getWalletBalances.find(
          (wallet) => wallet.currency == currency_value
        )?.available ?? "0.00"
      );
    },

    // RESET ANY PREVIOUS SELECTED ACOUNT DATA
    // AND CHANGE NEW ACCOUNT VIEW
    addNewAccountBeneficiary() {
      this.form.selected_beneficiary = { selected: false };
      this.create_new_account = true;
    },

    // VALIDATES NEW ACCOUNT PAYLOAD
    validateNewBankAccountPayload(payload) {
      if (payload?.account_name) {
        this.form.selected_beneficiary = {
          ...payload,
          selected: true,
        };

        // SWAP BACK TO INITIAL VIEW
        this.create_new_account = false;
      }
    },

    // CHECK ACCOUNT BALANCE BEFORE PROCEEDING ON WITHDRAWAL
    accountBalanceNotSufficient() {
      let account_balance = Number(this.selected_currency_balance);
      let withdrawal_amount = Number(this.form.amount);

      return withdrawal_amount > Number(account_balance) ? true : false;
    },

    // FETCH ALL SAVED USER BENEFICIARY ACCOUNTS
    async fetchUserSavedAccountList(filter_type) {
      this.beneficiary_account_options = [];

      try {
        const response = await this.fetchBankDetails(this.getAccountId);

        let accounts =
          response?.code === 200
            ? response.data.map((account) => {
                // FORMAT BANK CODE
                let bank_code = account?.bank?.id.toString();
                let formatted_bank_code =
                  bank_code?.length < 3 ? `0${bank_code}` : bank_code;

                return {
                  ...account,
                  bank_code: formatted_bank_code,
                };
              })
            : [];

        // ! Filter accounts base on currency and account type
        accounts = accounts.filter(
          (account) => account.category === filter_type
        );

        // CHECK IF ACCOUNT HAS LENGTH AND POPULATE BENEFICIARY LIST
        if (accounts.length) {
          accounts.map((account) =>
            this.beneficiary_account_options.push({
              id: account.id,
              name: `${account.account_name} ${
                account.bank_name !== null ? "&bull; " + account.bank_name : ""
              } &bull; ${account.account_no}`,
              options: account,
            })
          );
        }
      } catch {
        console.log("ERROR: Failed to load bank details");
      }
    },

    handleButtonClick() {
      this.account_type.slug === "transfer_request"
        ? this.handleWithdrawalRequest()
        : this.handleAccountSelection();
    },

    async handleAccountSelection() {
      // CHECK ACCOUNT BALANCE
      if (this.accountBalanceNotSufficient()) {
        this.form.amount = "";
        this.pushToast(
          "Your wallet account balance is not sufficient",
          "error"
        );
        return true;
      }

      // SETUP WITHDRAWAL CHARGE
      let withdrawal_details = {
        ...this.form,
        withdrawal_charge: this.getWithdrawalCharge,
      };

      if (this.beneficiary_state === "new") {
        this.handleClick("btnRef", "Adding new account");

        // REMOVE THE SELECTED KEY FROM SELECTED BENEFICIARY
        delete this.form.selected_beneficiary.selected;

        const response = await this.addNewBank({
          account_id: this.getAccountId,
          ...this.form.selected_beneficiary,
        });

        this.handleClick("btnRef", "Continue", false);

        if ([200, 201].includes(response.code)) {
          this.setWithdrawalMeta(withdrawal_details);
          this.$emit("confirmAccountSelected", {
            title: "Confirm transaction",
          });
        }
      } else {
        this.setWithdrawalMeta(withdrawal_details);
        this.$emit("confirmAccountSelected", {
          title: "Confirm transaction",
        });
      }
    },

    async handleWithdrawalRequest() {
      if (this.accountBalanceNotSufficient()) {
        this.form.amount = "";
        this.pushToast(
          "Your wallet account balance is not sufficient",
          "error"
        );
        return true;
      }

      const requestPayload = {
        currency: this.selected_currency.short,
        amount: +this.form.amount,
        withdrawal_date: this.$utils.getTimestampInSeconds(),
      };

      this.saveWithdrawalRequest(requestPayload);

      const response = await this.handleDataRequest({
        action: "sendUserOTP",
        payload: {
          account_id: this.getAccountId,
        },
        btn_text: "Continue",
        alert_handler: {
          error: "Failed to generate OTP for this withdarwal. Try again.",
          request_error: "Unable to generate OTP",
        },
      });

      if (response?.code === 200) {
        this.$emit("verifyWithdrawalOTP");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-meta {
  @include flex-row-nowrap("space-between", "center");
}

.info-card {
  padding: toRem(10);
  @include flex-row-nowrap("flex-start", "flex-start");
}
</style>
