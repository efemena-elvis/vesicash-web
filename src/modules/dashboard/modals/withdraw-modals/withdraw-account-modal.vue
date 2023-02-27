<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    :show_close_btn="false"
    :trigger_self_close="false"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <!-- BACK BUTTON -->
        <PageBackBtn custom_mode @clicked="processBackButtonClicks" />

        <div class="modal-cover-title h5-text mgt--4">
          {{ account_type.title }}
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
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
              :total_value="`${$money.getSign(
                selected_currency.slug
              )}${$money.addComma(selected_currency_balance)}`"
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
              :currency="`${selected_currency.short} (${$money.getSign(
                selected_currency.slug
              )})`"
              class="form-prefix-right"
              @getInputState="updateFormState($event, 'amount')"
              :error_handler="{
                type: 'required',
                message: 'Enter an amount',
              }"
            />
          </div>

          <template v-if="!create_new_account">
            <!--ACCOUNT DISPLAY DETAILS -->
            <div class="form-group mgb-20">
              <div class="form-label">
                {{ getBeneficiaryLabel }}
              </div>

              <DropSelectInput
                :placeholder="getBeneficiaryLabel"
                :options="beneficiary_account_options"
                :allow_search="true"
                :pre_select="account_pre_select"
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
            <div v-if="account_type.slug !== 'settlement'">
              <RadioSelectCard
                label_id="account1"
                label_text="Add new account details"
                card_name="account"
                :single_type="true"
                @clicked="addNewAccountBeneficiary"
              />
            </div>
          </template>

          <!-- NEW ACCOUNT VIEW -->
          <template v-if="create_new_account">
            <transition name="fade" mode="out-in">
              <component
                :is="getNewAccountCreateView"
                @bankDetailsUpdated="validateNewBankAccountPayload"
              />
            </transition>
          </template>
        </template>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-primary btn-md wt-100"
          @click="handleAccountSelection"
          :disabled="isFormFieldsValid"
          ref="continue"
        >
          Continue
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import PageBackBtn from "@/shared/components/page-back-btn";
import FormHelper from "@/modules/auth/mixins/auth-helper";
import DropSelectInput from "@/shared/components/drop-select-input";

export default {
  name: "WithdrawAccountModal",

  mixins: [FormHelper],

  components: {
    ModalCover,
    PageBackBtn,
    DropSelectInput,
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

    AccountDisplayCard: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/account-display-card"
      ),

    NewNairaAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-naira-account"
      ),

    NewWalletAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-wallet-account"
      ),

    NewForeignAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-foreign-account"
      ),

    BasicInput: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/form-comps/basic-input"
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
        return this.getWalletType?.slug === "naira"
          ? "NewNairaAccount"
          : "NewForeignAccount";
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
      return this.form.amount && this.form.selected_beneficiary.selected
        ? false
        : true;
    },
  },

  async mounted() {
    await this.fetchUserSavedAccountList();
  },

  data: () => ({
    currency_options: [
      { id: 1, name: "Naira wallet (NGN)", slug: "naira", short: "NGN" },
      { id: 2, name: "Dollar wallet (USD)", slug: "dollar", short: "USD" },
      // { id: 3, name: "GBP (£)", slug: "pound", short: "GPB" },
    ],
    selected_currency: {
      slug: "", // naira
      short: "", // NGN
    },
    selected_currency_balance: "0.00",
    beneficiary_account_options: [],
    withdrawal_charge: 50,

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

    create_new_account: false,
  }),

  methods: {
    ...mapActions({
      fetchBankDetails: "dashboard/fetchBankDetails",
      addNewBank: "settings/addNewBank",
    }),

    ...mapMutations({
      setWalletType: "dashboard/SET_WALLET_TYPE",
      setWithrawalMeta: "dashboard/SET_WITHDRAWAL_META",
    }),

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
      return (
        this.getWalletBalances.find((wallet) => wallet.currency == currency)
          ?.available ?? "0.00"
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
    async fetchUserSavedAccountList() {
      this.beneficiary_account_options = [];

      try {
        const response = await this.fetchBankDetails(this.getAccountId);
        let accounts =
          response.code === 200
            ? response.data.map((account) => {
                // FORMAT BANK CODE
                let bank_code = account.bank?.id.toString();
                let formatted_bank_code =
                  bank_code.length < 3 ? `0${bank_code}` : bank_code;

                return {
                  ...account,
                  bank_code: formatted_bank_code,
                };
              })
            : [];

        // ! Filter accounts base on currency and account type
        console.log(accounts);

        // CHECK IF ACCOUNT HAS LENGTH AND POPULATE BENEFICIARY LIST
        if (accounts.length) {
          accounts.map((account) =>
            this.beneficiary_account_options.push({
              id: account.id,
              name: `${account.account_name} &bull; ${account.bank_name} &bull; ${account.account_no}`,
              options: account,
            })
          );
        }
      } catch {
        console.log("ERROR: Failed to load bank details");
      }
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
        withdrawal_charge: this.withdrawal_charge,
      };

      if (this.create_new_account) {
        this.handleClick("continue", "Adding new account");

        // REMOVE THE SELECTED KEY FROM SELECTED BENEFICIARY
        delete this.form.selected_beneficiary.selected;

        const response = await this.addNewBank({
          account_id: this.getAccountId,
          updates: this.form.selected_beneficiary,
        });

        this.handleClick("continue", "Continue", false);

        if (response.code === 200) {
          this.setWithrawalMeta(withdrawal_details);
          this.$emit("accountSelected");
        }
      } else {
        this.setWithrawalMeta(withdrawal_details);
        this.$emit("accountSelected");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: toRem(110);
  height: auto;
}
</style>