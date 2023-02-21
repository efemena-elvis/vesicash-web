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
        <PageBackBtn custom_mode @clicked="$emit('goBackWalletSelection')" />

        <div class="modal-cover-title h5-text mgt--4">
          <span class="text-capitalize">{{ account_type }}</span> account
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <!-- CURRENCY SELECTION -->
        <div class="mgb-24">
          <div class="form-label">Select currency</div>

          <DropSelectInput
            placeholder="Select currency"
            :options="currency_options"
            @selectedOption="selectDropdownOption('currency', $event)"
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

          <template v-if="!initiate_new_account">
            <!--ACCOUNT DISPLAY DETAILS -->
            <div class="form-group mgb-20">
              <div class="form-label">Select beneficiary account</div>

              <DropSelectInput
                placeholder="Select beneficiary account"
                :options="beneficiary_account_options"
                :allow_search="true"
                :pre_select="account_pre_select"
                @selectedOption="selectDropdownOption('account', $event)"
              />
            </div>

            <!-- RADIO SELECT -->
            <div v-if="account_type !== 'settlement'">
              <RadioSelectCard
                label_id="account1"
                label_text="Add new bank details"
                card_name="account"
                :single_type="true"
                @clicked="createNewAccount"
              />
            </div>
          </template>

          <!-- NEW ACCOUNT VIEW -->
          <template v-if="initiate_new_account">
            <transition name="fade" mode="out-in">
              <component
                :is="getAccountType"
                @nairaBankUpdated="new_naira_account = $event"
                @dollarBankUpdated="updateDollarAccount"
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
          :disabled="continueDisabled"
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

    NewDollarAccount: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/modal-comps/new-dollar-account"
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
      type: String,
      default: "settlement",
    },
  },

  computed: {
    ...mapGetters({
      getWalletType: "dashboard/getWalletType",
      getWalletBalances: "dashboard/getWalletBalances",
    }),

    getAccountType() {
      return this.getWalletType === "naira"
        ? "NewNairaAccount"
        : "NewDollarAccount";
    },

    getSelectedAccount() {
      return this.accounts.find((account) => account.selected);
    },

    getNewAccount() {
      if (!this.initiate_new_account) return this.getSelectedAccount;
      return this.getWalletType === "naira"
        ? this.new_naira_account
        : this.new_dollar_account;
    },

    getFirstName() {
      if (!this.getNewAccount) return "";
      return this.getNewAccount?.account_name?.trim().split(/\s+/)[1];
    },

    getLastName() {
      if (!this.getNewAccount) return "";
      return this.getNewAccount?.account_name?.trim().split(/\s+/)[0];
    },

    nairaWithdrawalDetails() {
      return {
        amount: Number(this.form.amount),
        fee: this.withdrawal_charge,
        total: Number(this.form.amount),
        country: "Nigeria",
        phone: this.phone,
        first_name: this.getFirstName,
        last_name: this.getLastName,
        name: this.getNewAccount?.account_name || "",
        bank_name: this.getNewAccount?.bank_name || "",
        account_no: this.getNewAccount?.account_no || "",
        bank_code:
          this.getNewAccount?.bank?.code || this.getNewAccount?.bank_code,
      };
    },

    dollarWithdrawalDetails() {
      return {
        amount: Number(Number(this.form.amount)),
        fee: this.withdrawal_charge,
        total: Number(this.form.amount),
        country: "United States",
        phone: this.phone,
        first_name: this.getFirstName,
        last_name: this.getLastName,
        name: this.getNewAccount?.account_name || "",
        bank_name: this.getNewAccount?.bank_name || "",
        iban: this.getNewAccount?.account_no || "",
        account_no: this.getNewAccount?.account_no || "",
        swift_code: this.getNewAccount?.swift_code || "",
        sort_code: this.getNewAccount?.sort_code || "",
        bank_address: this.getNewAccount?.bank_address || "",
        bank_code:
          this.getNewAccount?.bank.code || this.getNewAccount?.bank_code,
      };
    },

    continueDisabled() {
      if (!this.form.amount) return true;
      if (this.initiate_new_account) {
        return this.getAccountType === "NewNairaAccount"
          ? !this.new_naira_account
          : !this.new_dollar_account;
      } else {
        return this.getSelectedAccount ? false : true;
      }
    },
  },

  watch: {
    getWalletType: {
      handler(currency) {},
      deep: true,
    },
  },

  async mounted() {
    await this.fetchUserSavedBankList();
  },

  data: () => ({
    currency_options: [
      { id: 1, name: "NGN (₦)", slug: "naira", short: "NGN" },
      { id: 2, name: "USD ($)", slug: "dollar", short: "USD" },
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
      selected_beneficiary: {},
    },

    initiate_new_account: false,
    new_account_type: "NewDollarAccount",
    new_naira_account: null,
    new_dollar_account: null,
    phone: "",
    amount: "",
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

    // SELECT OPTION FROM OPTION LIST
    selectDropdownOption(type, value) {
      if (type === "currency") {
        let currency = this.currency_options.find(
          (option) => option.id === value
        );

        this.setWalletType(currency.slug);
        this.selected_currency = currency;

        this.selected_currency_balance = this.getSelectedCurrencyBalance(
          currency.short
        );
      }

      if (type === "account") {
        let beneficiary = this.beneficiary_account_options.find(
          (option) => option.id === value
        );

        this.form.selected_beneficiary = beneficiary?.options;
        console.log(this.form.selected_beneficiary);
      }
    },

    // GET CURRENT CURRENCY ACCOUNT BALANCE
    getSelectedCurrencyBalance(currency) {
      return (
        this.getWalletBalances.find((wallet) => wallet.currency == currency)
          ?.available ?? "0.00"
      );
    },

    // FETCH ALL SAVED USER BENEFICIARY BANK ACCOUNTS
    async fetchUserSavedBankList() {
      this.beneficiary_account_options = [];

      try {
        const response = await this.fetchBankDetails(this.getAccountId);
        let accounts =
          response.code === 200
            ? response.data.map((account, index) => ({
                ...account,
                bank_id: account.bank?.code ?? "-",
                index,
                selected: false,
              }))
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

    updateDollarAccount(account) {
      this.phone = account?.phone;
      const dollar_account = account;
      delete dollar_account?.phone;
      this.new_dollar_account = dollar_account;
    },

    toggleSelection(index) {
      this.accounts.map((account) => (account.selected = false));
      this.accounts[index].selected = true;
    },

    createNewAccount() {
      this.initiate_new_account = true;
    },

    async handleAccountSelection() {
      const withdrawalMeta =
        this.getAccountType === "NewNairaAccount"
          ? this.nairaWithdrawalDetails
          : this.dollarWithdrawalDetails;

      if (this.initiate_new_account) {
        this.handleClick("continue", "Adding new account");

        const response = await this.addNewBank({
          account_id: this.getAccountId,
          updates:
            this.getAccountType === "NewNairaAccount"
              ? this.new_naira_account
              : this.new_dollar_account,
        });

        this.handleClick("continue", "Continue", false);

        if (response.code === 200) {
          this.setWithrawalMeta(withdrawalMeta);
          this.$emit("accountSelected");
        }
      } else {
        this.setWithrawalMeta(withdrawalMeta);
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