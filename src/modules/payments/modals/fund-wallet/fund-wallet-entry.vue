<template>
  <div>
    <div>
      <!-- CURRENCY SELECTION -->
      <div class="mgb-24">
        <div class="form-label">Select wallet type</div>

        <DropSelectInput
          placeholder="Select wallet"
          :options="currency_options"
          :pre_select="selected_currency"
          @selectedOption="selectDropdownOption($event)"
        />
      </div>

      <template>
        <div class="form-group">
          <BasicInput
            label_title="Amount to fund"
            label_id="amount"
            :input_value="form.amount"
            input_type="number"
            is_required
            placeholder="0.00"
            :custom_style="{ input_wrapper_style: 'form-prefix' }"
            :currency="`${selected_currency.short} (${getCurrencySign})`"
            class="form-prefix-right"
            @getInputState="updateFormState($event, 'amount')"
            :error_handler="{
              type: 'required',
              message: `Enter a minimum amount of ${getCurrencySign}${selected_currency.min_amount}`,
            }"
          />
        </div>

        <!-- FUND PAYMENT METHODS -->
        <div class="form-group">
          <div class="form-label">Select payment method</div>

          <div class="mgb-4">
            <RadioSelectCard
              label_id="card"
              label_text="Fund via card"
              card_name="payment_method"
              :is_checked="selected_payment_method == 'card' ? true : false"
              @clicked="selected_payment_method = 'card'"
            />
          </div>

          <div>
            <RadioSelectCard
              v-if="!['USD', 'GBP'].includes(selected_currency.short)"
              label_id="transfer"
              card_name="payment_method"
              label_text="Fund via bank transfer"
              :is_checked="selected_payment_method == 'transfer' ? true : false"
              @clicked="selected_payment_method = 'transfer'"
            />
          </div>

          <!-- AMOUNT DATA -->
          <div class="amount-meta mgt-16 tertiary-2-text grey-500">
            <div>
              Minimum amount:
              <span class="fw-semibold"
                >{{ getCurrencySign
                }}{{
                  $utils.formatCurrencyWithComma(selected_currency.min_amount)
                }}</span
              >
            </div>

            <div class="green-500">
              Charges:
              <span class="fw-semibold">{{ getCurrencySign }}0</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- MODAL COVER FOOTER -->
    <div class="pdb-30">
      <template>
        <button
          ref="fundBtnRef"
          class="btn btn-primary btn-md pdy-10 wt-100"
          :disabled="isValidFunding"
          @click="handleFundPayment()"
        >
          {{
            selected_payment_method === "card"
              ? "Fund Wallet"
              : "Get Transfer Details"
          }}
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
    RadioSelectCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/radio-select-card"
      ),
  },

  computed: {
    ...mapGetters({
      getWalletSize: "general/getWalletSize",
    }),

    // CHECK FORM BUTTON VALIDITY STATE
    isValidFunding() {
      return +this.form.amount >= this.selected_currency.min_amount &&
        this.selected_payment_method
        ? false
        : true;
    },

    getCurrencySign() {
      return this.$utils.formatCurrency({
        input: this.selected_currency.slug,
        output: "sign",
      });
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

      selected_payment_method: "card",

      payment_methods: [
        {
          id: 1,
          icon: "CreditCardIcon",
          title: "Fund via card",
          slug: "card",
        },
        {
          id: 2,
          icon: "ArrowRightIcon",
          title: "Fund via bank transfer",
          slug: "transfer",
        },
      ],
    };
  },

  mounted() {
    this.loadWalletCurrencyOptions();
  },

  methods: {
    ...mapActions({
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
            min_amount: ["USD", "GBP"].includes(wallet_type.short) ? 100 : 1000,
          });
        });

      this.setDefaultLocalWallet();
    },

    setDefaultLocalWallet() {
      this.selected_currency = this.currency_options[0];
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
    // HANDLE CARD FUNDING ACTION CLICK
    // ========================================
    handleFundPayment() {
      this.selected_payment_method === "card"
        ? this.handleCardFunding()
        : this.handleTransferFunding();
    },

    async handleCardFunding() {
      this.handleClick("fundBtnRef");

      const response = await this.handleDataRequest({
        action: "initiateHeadlessPayment",
        payload: {
          currency: this.selected_currency.short,
          amount: +this.form.amount,
          account_id: this.getAccountId,
          payment_gateway: constants.PAYMENT_GATEWAY,
          success_url: this.getFundingSuccessRoute,
          fail_url: this.getFundingErrorRoute,
          fund_wallet: true,
        },
        alert_handler: {
          error: "Unable to process card payment",
          request_error: "Unable to process card payment",
        },
      });

      if (response?.code === 200) {
        this.handleClick("fundBtnRef", "Fund Wallet", false);
        this.$utils.createAndClickAnchor(response?.data?.link);
      }
    },

    async handleTransferFunding() {
      this.handleClick("fundBtnRef");

      const response = await this.handleDataRequest({
        action: "fetchTransferAccountBankDetails",
        payload: {
          account_id: this.getAccountId,
          amount: +this.form.amount,
          transaction_id:
            this.$route?.query?.transaction_id ?? this.$route?.params?.id,
          gateway: constants.PAYMENT_GATEWAY,
        },
        // new: true,
        alert_handler: {
          error: "Unable to fetch transfer account",
          request_error: "Unable to fetch transfer account",
        },
      });

      if (response.code === 200) {
        this.handleClick("fundBtnRef", "Get Transfer Details", false);

        let bank_transfer_details = [
          {
            title: "Account Name",
            value: response.data.account_name,
          },
          {
            title: "Account Number",
            value: response.data.account_number,
          },
          {
            title: "Bank Name",
            value: response.data.bank_name,
          },
        ];

        this.$emit("displayBankDetails", {
          bank_transfer_details,
          amount: +this.form.amount,
          currency: this.selected_currency.short,
        });
      }
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
  