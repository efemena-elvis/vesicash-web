<template>
  <div class="dashboard-disbursement-view">
    <!-- BACK BUTTON -->
    <PageBackBtn back_link="/escrow/transactions" />

    <InfoAlertCard
      v-if="
        transactionOwner &&
        escrowParty &&
        !escrowParty.has_accepted &&
        transaction_details.status.toLowerCase() !== 'closed'
      "
      class="mgb-20"
      key="invitation-card"
    >
      <div slot="info" class="tertiary-2-text grey-900" key="invitation-slot">
        <b>{{ transactionOwner ? transactionOwner.email : "" }}</b> invited you
        to
        <b>{{ transaction_details ? transaction_details.title : "" }}</b>
        transaction
      </div>

      <div class="invite-actions-row mgt-15" slot="actions">
        <button
          class="btn btn-sm btn-primary"
          ref="accept"
          @click="acceptOrRejectTransaction('accept')"
          key="invitation-accept-button"
        >
          Accept
        </button>
        <button
          class="btn btn-sm btn-alert"
          ref="reject"
          @click="show_reject_modal = true"
          key="invitation-reject-button"
        >
          Reject
        </button>
      </div>
    </InfoAlertCard>

    <InfoAlertCard
      v-else-if="
        transaction_details &&
        escrowParty &&
        escrowParty.role === 'buyer' &&
        amountLeft > 0 &&
        escrowParty.has_accepted
      "
      class="mgb-20"
      key="payment-card"
    >
      <div slot="info" class="tertiary-2-text grey-900" key="payment-slot">
        You have
        <b>
          {{ totalAmount }}
        </b>
        left to pay for this transaction
      </div>

      <div class="invite-actions-row mgt-15" slot="actions">
        <button
          class="btn btn-sm btn-primary"
          ref="pay"
          @click="show_summary_modal = true"
          key="payment-button"
        >
          Make payment
        </button>
      </div>
    </InfoAlertCard>

    <InfoAlertCard
      v-else-if="partiesYetToAccept.length"
      class="mgb-20"
      key="notification-card"
    >
      <div slot="info" class="tertiary-2-text grey-900" key="notification-slot">
        Transaction pending,
        <b v-for="email in partiesYetToAccept" :key="email">{{ email }} </b>
        yet to accept invite
      </div>

      <div
        :class="[
          'tertiary-2-text mgt-10 resend-link',
          resend_text !== 'Resend invite'
            ? 'resend-link__disabled'
            : 'green-600',
        ]"
        slot="actions"
        @click="resendTransaction"
        key="notification-action"
      >
        {{ resend_text }}
      </div>
    </InfoAlertCard>

    <template v-if="transaction_details">
      <!-- PAGE TITILE -->
      <div class="page-title grey-900 h4-text mgb-5">
        {{ transaction_details ? transaction_details.title : "" }}
      </div>

      <div class="primary-1-text mgb-25">
        {{
          `${$money.getSign(
            transaction_details.currency
          )}${$utils.formatCurrencyWithComma(transaction_details.amount)}`
        }}
      </div>

      <!-- FUND DETAILS SECTION -->
      <template name="fund-details-section">
        <div class="fund-details-section row">
          <!-- DISBURSEMENT DETAILS -->
          <div class="col-12 col-xl-6">
            <FundInfoCard
              card_title="Disbursement details"
              :card_items="[
                {
                  title: 'Disbursement Type',
                  value:
                    getTransactionType === 'oneoff'
                      ? 'One-off disbursement type'
                      : 'Milestone disbursement type',
                },
                {
                  title: 'Transacting Parties',
                  value:
                    getTransactionParty === 'single'
                      ? 'Two parties'
                      : 'Multiple parties',
                },
              ]"
            />
          </div>

          <!-- DISPUTE HANDLING -->
          <div class="col-12 col-xl-5">
            <FundInfoCard
              card_title="Dispute handling"
              :card_items="[
                {
                  title: 'Dispute Type',
                  value:
                    getTransaction?.dispute_handler === 'vesicash'
                      ? 'Vesicash handles dispute'
                      : 'Arbitration',
                },
                {
                  title: 'Attached Document(s)',
                  value: 'No file attached',
                  files: attachedFiles,
                  file: getTransaction?.files?.length
                    ? {
                        name: 'Docs',
                        url: getTransaction.files[0].url,
                      }
                    : null,
                },
              ]"
            />
          </div>
        </div>
      </template>

      <!-- USERS INVOLVED SECTION -->
      <template name="users-involved-section">
        <div class="section-wrapper">
          <div class="section-title mgb-20">Users Involved</div>

          <div class="party-card">
            <div class="party-row">
              <div class="party-meta grey-800">USER DETAILS</div>
              <div class="party-meta grey-800 role">ROLE</div>
              <div class="party-meta grey-800 cost">AMOUNT TO RECEIVE</div>
            </div>
            <div
              class="party-row"
              v-for="(party, index) in transaction_details.parties"
              :key="party.user_id + index"
            >
              <div class="party-meta grey-600">
                {{ party.email
                }}{{ escrowParty.user_id === party.user_id ? " (You)" : "" }}
              </div>
              <div class="party-meta grey-600 role">{{ party.role }}</div>
              <div
                :class="[
                  'party-meta text-capitalize cost',
                  party.role === 'buyer' ? 'grey-800' : 'grey-800',
                ]"
              >
                {{ party.role === "buyer" ? "" : ""
                }}{{
                  party.role === "buyer"
                    ? "----"
                    : `${$money.getSign(
                        transaction_details.currency
                      )}${$utils.formatCurrencyWithComma(
                        partyShare(party.role)
                      )}`
                }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- PAYMENT RULES SECTION -->
      <template name="payment-rules-section">
        <div class="section-wrapper">
          <div class="section-title mgb-10">Payment Rules</div>

          <!-- PAYMENT RULES CARD -->
          <div class="milestone-wrapper">
            <MilestoneRuleCard
              v-for="(milestone, index) in getSortedMilestones"
              :key="index"
              :index="index + 1"
              :milestone="milestone"
              :transaction="getTransaction"
              has_actions
              :transaction_status="getTransactionStatus"
              @refresh="refresh({}, true)"
            />
          </div>
        </div>
      </template>

      <!-- TRANSACTIONS SECTION -->
      <template v-if="false">
        <div class="section-wrapper">
          <div class="section-title">Transactions</div>

          <!-- TRANSACTIONS TABLE -->
          <DashboardTransactions />
        </div>
      </template>

      <!-- ACTIVITY SECTION -->
      <template v-if="false">
        <div class="section-wrapper">
          <div class="section-title">Activity</div>

          <div class="activity-wrapper wt-50">
            <ActivityCard :activities="getTransactionActivities" />
          </div>
        </div>
      </template>
    </template>
    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_reject_modal">
        <RejectModal
          @closeTriggered="show_reject_modal = false"
          @rejected="rejectTxn"
          placeholder="...not satisfied"
        />
      </transition>

      <transition name="fade" v-if="show_summary_modal">
        <SummaryModal
          @closeTriggered="show_summary_modal = false"
          :amount="totalAmount"
          @action="payForEscrow"
          :summary="paymentSummary"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PageBackBtn from "@/shared/components/util-comps/page-back-btn";
import InfoAlertCard from "../../../../shared/components/card-comps/info-alert-card.vue";

export default {
  name: "EscrowTransactionDetails",

  metaInfo: {
    title: "Transaction Details",
    titleTemplate: "%s - Vesicash",
  },

  components: {
    PageBackBtn,
    InfoAlertCard,
    FundInfoCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/fund-info-card"
      ),

    MilestoneRuleCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/milestone-rule-card"
      ),

    ActivityCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/activity-card"
      ),

    UsersTable: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/table-comps/users-table"
      ),

    DashboardTransactions: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/modules/dashboard/components/dashboard-transactions"
      ),

    RejectModal: () =>
      import(
        /* webpackChunkName: "transactions-modal-module" */ "@/modules/transactions/modals/reject-modal"
      ),
    SummaryModal: () =>
      import(
        /* webpackChunkName: "transactions-modal-module" */ "@/modules/transactions/modals/transaction-summary-modal"
      ),

    PaymentActionModal: () =>
      import(
        /* webpackChunkName: "transactions-modal-module" */ "@/modules/transactions/modals/payment-action-modal"
      ),

    FailedWalletTransferModal: () =>
      import(
        /* webpackChunkName: "transactions-modal-module" */ "@/modules/transactions/modals/failed-wallet-transfer-modal"
      ),
  },

  computed: {
    ...mapGetters({
      getTransactionDetails: "transactions/getTransactionDetails",
      getTransactionCharges: "general/getTransactionCharges",
    }),

    getTransactionStatus() {
      // return this.data.status;
      let MS = this.getSortedMilestones;
      const milestone_active = MS?.every(
        (item) => item?.status?.toLowerCase() !== "draft"
      );
      if (!milestone_active) return this.transaction_details?.status;
      return "";
    },

    milestoneCount() {
      return this.transaction_details
        ? this.transaction_details?.milestones?.length
        : 1;
    },

    escrowCharge() {
      const charges = this.allEscrowCharges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });

      const amount = this.transaction_details?.amount || 0;
      const currency = this.transaction_details?.currency;
      const charge = this.estimateCharge(charges, amount, currency);

      return charge;
    },

    escrowFee() {
      const fee = this.escrowCharge?.fee_charge || 0;
      return `${this.$money.getSign(
        this.transaction_details.currency
      )}${this.$utils.formatCurrencyWithComma(fee)}`;
    },

    allEscrowCharges() {
      const all_charges = this.getTransactionCharges?.escrow
        ? [...this.getTransactionCharges?.escrow]
        : [];
      return all_charges;
    },

    allDisbursementCharges() {
      const all_charges = this.getTransactionCharges?.wallet_withdrawal
        ? [...this.getTransactionCharges?.wallet_withdrawal]
        : [];
      return all_charges;
    },

    disbursementCharge() {
      const charges = this.allDisbursementCharges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });

      const amount = this.transaction_details?.amount || 0;
      const currency = this.transaction_details?.currency;
      if (currency === "NGN")
        return {
          card_charge: 100,
          transfer_charge: 100,
          processing_fee: 100,
          fee_charge: 100,
        };
      if (currency === "USD")
        return {
          card_charge: 1,
          transfer_charge: 1,
          processing_fee: 1,
          fee_charge: 1,
        };
      const charge = this.estimateCharge(charges, amount, currency);

      return charge;
    },

    disbursementFee() {
      const fee =
        (this.disbursementCharge?.fee_charge || 0) * this.milestoneCount;
      return `${this.$money.getSign(
        this.transaction_details.currency
      )}${this.$utils.formatCurrencyWithComma(fee)}`;
    },

    totalAmount() {
      const total = this.total;
      return `${this.$money.getSign(
        this.transaction_details.currency
      )}${this.$utils.formatCurrencyWithComma(total)}`;
    },

    total() {
      const total =
        (this.amountLeft || 0) +
        (this.escrowCharge?.fee_charge || 0) +
        (this.disbursementCharge?.fee_charge || 0) * this.milestoneCount;
      return total;
    },

    paymentSummary() {
      return [
        {
          title: "Amount",
          value: this.amountLeftToPay,
        },
        {
          title: "Escrow fee",
          value: this.escrowFee,
        },
        {
          title: "Disbursement fee",
          value: this.disbursementFee,
        },
      ];
    },

    amountLeftToPay() {
      return `${this.$money.getSign(
        this.transaction_details.currency
      )}${this.$utils.formatCurrencyWithComma(this.amountLeft)}`;
    },

    attachedFiles() {
      if (!this.transaction_details) return [];
      return this.transaction_details?.files?.map((file) => ({
        ...file,
        name: `${this.transaction_details.title}-ATTACHED-FILE`,
      }));
    },

    amountLeft() {
      if (!this.transaction_details) return 0;
      return (
        this.transaction_details.amount - this.transaction_details.amount_paid
      );
    },

    transactionOwner() {
      if (!this.transaction_details) return null;
      return this.transaction_details?.parties?.find(
        (party) => party.is_initiator
      );
    },

    partiesYetToAccept() {
      if (!this.transaction_details) return [];
      return this.transaction_details?.parties
        ?.filter(
          (party) =>
            !party.is_initiator &&
            !party.has_accepted &&
            this.transaction_details.status.toLowerCase() !== "closed"
        )
        ?.map((party) => party?.email);
    },

    escrowParty() {
      const userEmail = this.getUser?.email;
      const account_id = `${this.getAccountId}`;
      if (!this.transaction_details) return null;
      return this.transaction_details?.parties?.find(
        (party) => party.email === userEmail || party.user_id === account_id
      );
    },

    // ===================================================
    // GET THE TRANSACTION DISBURSEMENT TYPE FROM ROUTE
    // ===================================================
    getTransactionType() {
      return this.$route.query.type ? this.$route.query.type : "oneoff";
    },

    // =============================================
    // GET THE TRANSACTION PARTY TYPE FROM ROUTE
    // =============================================
    getTransactionParty() {
      return this.$route.query.party ? this.$route.query.party : "single";
    },

    getTransaction() {
      return this.transaction_details;
    },

    getSortedMilestones() {
      return this.transaction_details
        ? this.transaction_details?.milestones
        : [];
    },
  },

  data() {
    return {
      show_accept_modal: false,
      show_payment_modal: false,
      show_reject_modal: false,
      show_summary_modal: false,
      accept_action: "",
      reason: "",
      resend_text: "Resend invite",

      status: {
        sac: "Sent - Awaiting Confirmation",
        cls: "Closed",
      },

      ms_key: {
        "sent-rejected": "sr",
        "accepted-funded": "af",
        "accepted-not-funded": "anf",
        "in-progress": "ip",
        delivered: "d",
        "delivered-accepted": "da",
        "delivered-rejected": "dr",
        "closed-disbursement-complete": "cdc",
        "closed-disputed": "cd",
        "closed-refunded": "cr",
        closed: "closed",
      },

      transaction_details: null,
    };
  },

  mounted() {
    this.fetchCharges("escrow");
    this.fetchCharges("wallet_withdrawal");
    this.fetchSingleEscrowTransaction();
  },

  methods: {
    ...mapActions({
      fetchEscrowTransactionById: "transactions/fetchEscrowTransactionById",
      acceptTransaction: "transactions/acceptTransaction",
      rejectTransaction: "transactions/rejectTransaction",
      sendTransaction: "transactions/sendTransaction",
      makePayment: "transactions/makePayment",
      fetchCharges: "general/fetchCharges",
    }),

    estimateCharge(charges, amount, currency) {
      const escrowCharge = charges.find((charge) => {
        return (
          charge.currency === currency &&
          amount >= charge.min_value &&
          amount <= charge.max_value
        );
      });

      let card_charge = null;
      let transfer_charge = null;
      let fee_charge = null;
      let processing_fee = null;

      if (!escrowCharge)
        return { card_charge, transfer_charge, processing_fee, fee_charge };

      const card_cap = escrowCharge?.value?.card_fee_capped_at;
      const card_fee = escrowCharge?.value?.card_fee;
      const is_card_capped = card_cap > 0;

      const is_card_percentage = escrowCharge?.value?.is_percentage_card_fee;

      const card_bank_cost = is_card_percentage
        ? (card_fee / 100) * amount
        : card_fee;

      card_charge = is_card_capped
        ? Math.min(card_cap, card_bank_cost)
        : card_bank_cost;

      const bank_cap = escrowCharge?.value?.bank_fee_capped_at;
      const bank_fee = escrowCharge?.value?.bank_fee;
      const is_bank_capped = bank_cap > 0;
      const is_bank_percentage = escrowCharge?.value?.is_percentage_bank_fee;
      const bank_cost = is_bank_percentage
        ? (bank_fee / 100) * amount
        : bank_fee;
      transfer_charge = is_bank_capped
        ? Math.min(bank_cap, bank_cost)
        : bank_cost;

      const fee_cap = escrowCharge?.value?.fee_capped_at;
      const fee = escrowCharge?.value?.fee;
      const is_fee_capped = fee_cap > 0;
      const is_fee_percentage = escrowCharge?.value?.is_percentage_fee;
      const fee_cost = is_fee_percentage ? (fee / 100) * amount : fee;
      fee_charge = is_fee_capped ? Math.min(fee_cap, fee_cost) : fee_cost;

      processing_fee = escrowCharge?.processingFee || 0;

      const total = fee_charge
        ? amount +
          fee_charge +
          (processing_fee * this.getTransactionMilestones?.length || 1)
        : null;

      return {
        card_charge,
        transfer_charge,
        fee_charge,
        processing_fee,
        amount,
        total,
      };
    },

    async payForEscrow() {
      try {
        this.show_summary_modal = false;
        this.handleClick("pay");
        const response = await this.makePayment({
          transaction_id: this.$route?.params?.id,
        });
        this.handleClick("pay", "Make payment", false);
        const _message = response?.data?.message || response?.message;
        const message =
          _message == "insufficient balance"
            ? "Insufficient balance, top up your wallet and try again."
            : _message;
        const type = [200, 201].includes(response?.code)
          ? "success"
          : "warning";

        this.pushToast(message, type);
        this.refresh(response);
      } catch (err) {
        this.handleClick("pay", "Make payment", false);
        console.log("FAILED TO PAY FOR ESCROW", err);
        this.pushToast("Payment failed", "error");
      }
    },

    partyShare(role) {
      const amount = this.transaction_details?.amount;

      const broker = this.transaction_details?.parties?.find(
        (party) => party.role === "broker"
      );

      const brokerShare =
        broker && broker?.percentage ? Number(broker.percentage) / 100 : 0;

      if (role === "buyer") return 0;
      if (role === "seller")
        return Number(amount) - Number(amount) * brokerShare;
      if (role === "broker") return Number(amount) * brokerShare;
      return amount;
    },

    async resendTransaction() {
      if (["Resending...", "Resent"].includes(this.resend_text)) return;
      this.resend_text = "Resending...";
      try {
        const response = await this.sendTransaction({
          id: this.$route?.params?.id,
        });
        const type = response?.code == 200 ? "success" : "warning";
        const message =
          response?.code == 200 ? "Invite sent" : response?.message;
        this.resend_text = response?.code == 200 ? "Resent" : "Resend invite";
        this.pushToast(message, type);
        this.refresh(response);
      } catch (err) {
        this.handleClick(btnRef, text, false);
        this.pushToast("Failed to resend invite", "error");
        this.resend_text = "Resend invite";
        console.log("ERROR", err);
      }
    },

    rejectTxn(reason) {
      this.show_reject_modal = false;
      this.reason = reason;
      this.acceptOrRejectTransaction("reject");
    },

    refresh(response, force = false) {
      if (response?.code == 200 || force) {
        setTimeout(() => {
          this.fetchSingleEscrowTransaction();
        }, 500);
      }
    },

    async acceptOrRejectTransaction(status) {
      const btnRef = status;
      this.handleClick(btnRef);
      const text = status === "accept" ? "Accept" : "Reject";

      const payload = {
        transaction_id: this.$route?.params?.id,
        party_id: this.escrowParty?.user_id,
        reason: this.reason,
      };

      try {
        const response =
          status === "accept"
            ? await this.acceptTransaction(payload)
            : await this.rejectTransaction(payload);
        this.handleClick(btnRef, text, false);
        const type = response?.code == 200 ? "success" : "warning";
        const message =
          response?.code == 200
            ? status === "accept"
              ? "Transaction has been accepted"
              : "Transaction has been rejected"
            : response?.message;

        this.pushToast(message, type);
        this.refresh(response);
      } catch (err) {
        this.handleClick(btnRef, text, false);
        this.pushToast("Action failed", "error");
        console.log("ERROR", err);
      }
    },

    // FETCH SINGLE TRANSACTION
    fetchSingleEscrowTransaction() {
      this.togglePageLoader();

      this.fetchEscrowTransactionById({ id: this.$route.params.id })
        .then((response) => {
          if (response?.code === 200) {
            this.transaction_details = response?.data;
            this.togglePageLoader();
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-disbursement-view {
  padding-bottom: toRem(200);
  .party-card {
    background: getColor("green-10");
    padding: toRem(20);
    border: toRem(1) solid getColor("grey-100");
    border-radius: toRem(20);
    position: relative;

    .party-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: toRem(15) 0;
      border-bottom: toRem(0.3) solid getColor("grey-200");
      &:last-child {
        border-bottom: 0;
      }

      .party-meta {
        font-size: 0.9rem;
      }

      .role {
        justify-self: center;
      }

      .cost {
        justify-self: end;
      }
    }
  }

  .milestone-wrapper {
    display: grid;
    gap: toRem(30);
  }

  .page-title {
    font-size: toRem(22.5);

    @include breakpoint-down(md) {
      font-size: toRem(20.75);
    }

    @include breakpoint-down(xs) {
      font-size: toRem(19);
    }
  }

  .resend-link {
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      text-decoration: none;
    }

    &__disabled {
      text-decoration: none;
      font-weight: 600;
      color: getColor("grey-600");
    }
  }

  .invite-actions-row {
    @include flex-row-nowrap("flex-start", "center");
    gap: 0 toRem(10);
  }

  .fund-details-section {
    @include flex-row-wrap("flex-start", "center");
  }

  .section-wrapper {
    margin-bottom: toRem(34);

    .section-title {
      @include generate-font-type("primary-1");
      color: getColor("grey-900");
      margin-bottom: toRem(8);
    }
  }

  .activity-wrapper {
    @include breakpoint-down(xl) {
      width: 65%;
    }

    @include breakpoint-down(lg) {
      padding-bottom: toRem(40);
      width: 75%;
    }

    @include breakpoint-down(sm) {
      width: 100%;
    }
  }
}
</style>
