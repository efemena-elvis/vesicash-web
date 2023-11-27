<template>
  <div>
    <!-- MODAL COVER BODY -->
    <div>
      <!-- CURRENCY SELECTION -->
      <div class="mgb-24">
        <div class="form-label">Select wallet type</div>

        <DropSelectInput
          placeholder="Select wallet"
          :options="getCurrencyOptions"
          @selectedOption="selectDropdownOption($event)"
        />
      </div>

      <!-- CARD OPTION VIEW -->
      <template v-if="selected_currency.slug">
        <!-- AMOUNT TO WITHDRAW -->
        <div class="form-group">
          <BasicInput
            label_title="Amount to fund"
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
              message: 'Enter a minimum amount of 1000',
            }"
          />

          <!-- AMOUNT DATA -->
          <div class="amount-meta mgt-8 tertiary-2-text grey-600">
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
                }}{{ $utils.formatCurrencyWithComma(estimatedCharge) }}</span
              >
            </div>
          </div>
        </div>
      </template>

      <!-- TRANSFER OPTION VIEW -->
      <template
        v-if="payment_type.slug === 'transfer' && selected_currency.slug"
      >
        <!-- TITLE TEXT -->
        <div class="description-text mgb-10 grey-600 tertiary-2-text">
          Please send the amount to fund to the bank account below.
        </div>

        <!-- LOADING TRANSFER DETAILS -->
        <div class="modal-items-wrapper rounded-4 green-50-bg mgb-20">
          <template v-if="info_loading">
            <ModalListItem v-for="(_, index) in 3" :key="index" loading />
          </template>

          <template v-else>
            <ModalListItem
              v-for="(data, index) in transfer_info"
              :title="data.title"
              :value="data.value"
              :key="index"
            />
          </template>
        </div>
      </template>
    </div>

    <!-- MODAL COVER FOOTER -->
    <div class="pdb-30">
      <template v-if="payment_type.slug === 'card'">
        <button
          class="btn btn-primary btn-md wt-100"
          @click="handleCardFunding"
        >
          Fund Wallet
        </button>
      </template>

      <template v-else>
        <button
          :disabled="isValidTransfer"
          class="btn btn-primary btn-md wt-100"
          @click="handleFundSuccess"
        >
          I have funded
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { constants } from "@/utilities";

export default {
  name: "FundWalletEntryModal",

  components: {
    ModalListItem: () =>
      import(
        /* webpackChunkName: "dashboard-modal-module" */ "@/modules/dashboard/components/modal-comps/modal-list-item"
      ),
  },

  props: {
    wallet_type: {
      type: String,
      default: "naira",
    },

    payment_type: {
      type: Object,
    },

    gateway: {
      type: String,
      default: "rave",
    },
  },

  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
      getTransactionCharges: "general/getTransactionCharges",
    }),

    fundingCharges() {
      const funding_charges = this.getTransactionCharges?.wallet_funding;
      if (!funding_charges) return [];

      return funding_charges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });
    },

    estimatedCharge() {
      const amount = Number(this.form?.amount) || 0;
      const currency = this.selected_currency.short;

      const foundCharge = this.fundingCharges.find((charge) => {
        return (
          charge.currency === currency &&
          amount >= charge.min_value &&
          amount <= charge.max_value
        );
      });

      if (!foundCharge) return "0";

      const payment_type = this.payment_type?.slug;

      switch (payment_type) {
        case "card": {
          const card_cap = foundCharge?.value?.card_fee_capped_at;
          const card_fee = foundCharge?.value?.card_fee;
          const is_capped = card_cap > 0;
          const is_percentage = foundCharge?.value?.is_percentage_card_fee;
          const cost = is_percentage ? (card_fee / 100) * amount : card_fee;
          return is_capped ? Math.min(card_cap, cost) : cost;
        }
        case "transfer": {
          const bank_cap = foundCharge?.value?.bank_fee_capped_at;
          const bank_fee = foundCharge?.value?.bank_fee;
          const is_capped = bank_cap > 0;
          const is_percentage = foundCharge?.value?.is_percentage_bank_fee;
          const cost = is_percentage ? (bank_fee / 100) * amount : bank_fee;
          return is_capped ? Math.min(bank_cap, cost) : cost;
        }
        default:
          return "0";
      }
    },

    // CHECK FORM BUTTON VALIDITY STATE
    isValidTransfer() {
      return +this.form.amount > 1000 ? false : true;
    },

    getCurrencyOptions() {
      return this.payment_type.slug === "transfer"
        ? this.currency_options.slice(0, 1)
        : this.currency_options;
    },

    getFundingCharge() {
      let amount = Number(this.form.amount);

      if (amount < 600) return 0.5 * amount;
      else if (amount <= 500000) return 500;
      else if (amount <= 1000000) return 1000;
      else if (amount > 1000000) return 2000;
      else return 0;
    },

    getFundingSuccessRoute() {
      return `${constants.VESICASH_APP_URL}/fund-wallet-success?type=funding&currency=${this.selected_currency.short}&amount=${this.form.amount}`;
    },

    getFundingErrorRoute() {
      return `${constants.VESICASH_APP_URL}/fund-wallet-error?type=funding&currency=${this.selected_currency.short}&amount=${this.form.amount}`;
    },
  },

  data() {
    return {
      currency_options: [],

      selected_currency: {
        slug: "", // naira
        short: "", // NGN
      },

      form: {
        amount: "",
      },

      validity: {
        amount: true,
      },

      info_loading: true,
      displayed_bank_details: ["account number", "bank name", "account name"],
      account_reference_id: "",
      transfer_info_repo: [],
      transfer_info: [],
    };
  },

  mounted() {
    this.loadWalletCurrencyOptions();
    this.handleFetchingOfTransferDetails();
  },

  methods: {
    ...mapActions({
      initiateDollarFunds: "dashboard/initiateDollarFunds",
      verifyPaymentAccount: "dashboard/verifyPaymentAccount",
      fetchTransferAccountBankDetails:
        "dashboard/fetchTransferAccountBankDetails",
      initiateHeadlessPayment: "transactions/initiateHeadlessPayment",
    }),

    loadWalletCurrencyOptions() {
      this.getWalletSize
        .filter(
          (wallet) =>
            wallet.enabled && !wallet.short.includes("ESCROW") && !wallet?.mor
        )
        .map((wallet_type) => {
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

    // ========================================
    // SELECT OPTION FROM OPTION LIST
    // ========================================
    selectDropdownOption(value) {
      this.form.amount = "";

      this.selected_currency = this.currency_options.find(
        (option) => option.id === value
      );
    },

    // ========================================
    // HANDLE FETCHING OF BANK TRANSFER DETAILS
    // ========================================
    handleFetchingOfTransferDetails() {
      let request_payload = {
        account_id: this.getAccountId,
        transaction_id:
          this.$route?.query?.transaction_id ?? this.$route?.params?.id,
        gateway: this.gateway,
      };

      if (!this.gateway) delete request_payload?.gateway;

      this.fetchTransferAccountBankDetails(request_payload)
        .then((response) => {
          this.info_loading = false;

          if (response?.code === 200) {
            let account = response?.data ?? {};
            this.account_reference_id = account.payment_account_id;

            for (const prop in account) {
              let prop_obj = {};
              prop_obj.title = prop.split("_").join(" ");
              prop_obj.value = account[prop];
              this.transfer_info_repo.push(prop_obj);
            }

            this.transfer_info_repo.map((detail) => {
              if (this.displayed_bank_details.includes(detail.title))
                this.transfer_info.push(detail);
            });

            let account_name = this.transfer_info.at(-1).value;
            this.transfer_info.at(-1).value = `Vesicash-${account_name}`;
          }
          // else if (response?.code === 500) {
          //   this.handleFetchingOfTransferDetails();
          // }
        })
        .catch(() => (this.info_loading = false));
    },

    // ========================================
    // HANDLE CARD FUNDING INITIATION
    // ========================================
    handleCardFunding() {
      let request_payload = {
        currency: this.selected_currency.short,
        amount: +this.form.amount,
        account_id: this.getAccountId,
        payment_gateway: "rave",
        success_url: this.getFundingSuccessRoute,
        fail_url: this.getFundingErrorRoute,
        fund_wallet: true,
      };

      this.initiateHeadlessPayment(request_payload).then((response) => {
        if (response?.code === 200) location.href = response?.data?.link;
      });
    },

    // ===============================
    // VERIFY USER WALLET PAYMENT
    // ===============================
    async handleFundSuccess() {
      const response = await this.handleDataRequest({
        action: "verifyPaymentAccount",
        payload: { reference: this.account_reference_id },
        alert_handler: {
          error: "Unable to verify account payment",
        },
      });

      if (response.code === 200) {
        this.$router.push({
          name: "SuccessfulWalletFund",
          query: {
            type: "transfer",
            currency: this.selected_currency.short,
            amount: +this.form.amount,
          },
        });
      }
    },

    // =======================================
    // HANDLE PROCESSING OF DOLLAR FUNDING
    // =======================================
    handleDollarFunding() {
      this.handleClick("fundBtn");

      let request_payload = {
        account_id: this.getAccountId,
        currency: "USD",
        country: "US",
        amount: this.form.dollar_amount,
        fund_wallet: true,
        success_url: `${constants.VESICASH_APP_URL}/fund-wallet-success`,
        fail_url: `${constants.VESICASH_APP_URL}/fund-wallet-error`,
      };

      this.initiateDollarFunds(request_payload)
        .then((response) => {
          if (response?.code === 200) {
            // REDIRECT USER TO PAYMENT GATEWAY
            this.handleClick("fundBtn", "Make payment", false);
            location.href = response.data.link;
          }

          // HANDLE NON 200 RESPONSE
          else this.handlePaymentError(response.message);
        })
        .catch(() =>
          this.handlePaymentError("Unable to make payment at this time")
        );
    },

    handlePaymentError(message) {
      this.pushToast(message, "error");
      this.handleClick("fundBtn", "Make payment", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.amount-meta {
  @include flex-row-nowrap("space-between", "center");
}

.modal-items-wrapper {
  border: toRem(1) dashed getColor("green-500");
  padding: toRem(2) toRem(18);
}
</style>
