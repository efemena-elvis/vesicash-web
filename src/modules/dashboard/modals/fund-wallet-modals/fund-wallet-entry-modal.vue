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
          {{ payment_type.title }}
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
              :currency="`${selected_currency.short} (${$money.getSign(
                selected_currency.slug
              )})`"
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
                  }}{{ $money.addComma(selected_currency.min_amount) }}</span
                >
              </div>

              <div class="green-500">
                Charges:
                <span class="fw-bold"
                  >{{ $money.getSign(selected_currency.slug)
                  }}{{ $money.addComma(getFundingCharge) }}</span
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
          <div class="modal-items-wrapper rounded-4 green-50-bg">
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
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
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
            class="btn btn-primary btn-md wt-100"
            @click="handleFundSuccess"
          >
            I have funded
          </button>
        </template>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import PageBackBtn from "@/shared/components/page-back-btn";
import BasicInput from "@/shared/components/form-comps/basic-input";
import DropSelectInput from "@/shared/components/drop-select-input";
import { VESICASH_APP_URL } from "@/utilities/constant";

export default {
  name: "FundWalletEntryModal",

  components: {
    ModalCover,
    PageBackBtn,
    BasicInput,
    DropSelectInput,
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
      default: "",
    },
  },

  computed: {
    // CHECK FORM BUTTON VALIDITY STATE
    isValidState() {
      return Object.values(this.validity).every((valid) => !valid)
        ? false
        : true;
    },

    getFundingCharge() {
      let amount = Number(this.form.amount);

      if (amount < 600) return 0.5 * amount;
      else if (amount <= 500000) return 500;
      else if (amount <= 1000000) return 1000;
      else if (amount > 1000000) return 2000;
      else return 0;
    },
  },

  data() {
    return {
      currency_options: [
        {
          id: 1,
          name: "Naira wallet (NGN)",
          slug: "naira",
          short: "NGN",
          min_amount: 1000,
        },
        {
          id: 2,
          name: "Dollar wallet (USD)",
          slug: "dollar",
          short: "USD",
          min_amount: 100,
        },
        // { id: 3, name: "GBP (£)", slug: "pound", short: "GPB" },
      ],

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
    this.handleFetchingOfTransferDetails();
  },

  methods: {
    ...mapActions({
      initiateDollarFunds: "dashboard/initiateDollarFunds",
      verifyPaymentAccount: "dashboard/verifyPaymentAccount",
      fetchTransferAccountBankDetails:
        "dashboard/fetchTransferAccountBankDetails",
      startCardPayment: "transactions/startCardPayment",
    }),

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

          if (response.code === 200) {
            let account = response?.data?.payment_account ?? {};
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
          } else if (response.code === 500) {
            this.handleFetchingOfTransferDetails();
          }
        })
        .catch(() => (this.info_loading = false));
    },

    // ========================================
    // HANDLE CARD FUNDING INITIATION
    // ========================================
    handleCardFunding() {
      let request_payload = {
        currency: this.selected_currency.short,
        amount: this.form.amount,
        account_id: this.getAccountId,
        payment_gateway: "rave",
        success_page: `${VESICASH_APP_URL}/dashboard`,
      };

      this.startCardPayment(request_payload)
        .then((response) => {
          if (response?.code === 200) location.href = response?.data?.link;
        })
        .catch((err) => {});
    },

    // ===============================
    // VERIFY USER WALLET PAYMENT
    // ===============================
    handleFundSuccess() {
      this.verifyPaymentAccount({
        reference: this.account_reference_id,
      });

      setTimeout(() => this.$emit("walletFunded"), 1500);
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
        success_url: `${VESICASH_APP_URL}/fund-wallet-success`,
        fail_url: `${VESICASH_APP_URL}/fund-wallet-error`,
      };

      this.initiateDollarFunds(request_payload)
        .then((response) => {
          if (response.code === 200) {
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
.modal-cover-body {
  min-height: toRem(110);
  height: auto;

  .amount-meta {
    @include flex-row-between-nowrap;
  }

  .modal-items-wrapper {
    border: toRem(1) dashed getColor("green-500");
    padding: toRem(2) toRem(18);
  }
}
</style>