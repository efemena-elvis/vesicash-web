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
    >
      <div slot="info" class="tertiary-2-text grey-900">
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
        >
          Accept
        </button>
        <button
          class="btn btn-sm btn-alert"
          ref="reject"
          @click="show_reject_modal = true"
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
    >
      <div slot="info" class="tertiary-2-text grey-900">
        You have
        <b>
          {{
            `${$money.getSign(
              transaction_details.currency
            )}${$utils.formatCurrencyWithComma(amountLeft)}`
          }}
        </b>
        left to pay for this transaction
      </div>

      <div class="invite-actions-row mgt-15" slot="actions">
        <button class="btn btn-sm btn-primary" ref="pay" @click="payForEscrow">
          Make payment
        </button>
      </div>
    </InfoAlertCard>

    <InfoAlertCard v-else-if="partiesYetToAccept.length" class="mgb-20">
      <div slot="info" class="tertiary-2-text grey-900">
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
    }),

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
      accept_action: "",
      reason: "",
      resend_text: "Resend invite",

      status: {
        sac: "sent - awaiting confirmation",
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
    this.fetchSingleEscrowTransaction();
  },

  methods: {
    ...mapActions({
      fetchEscrowTransactionById: "transactions/fetchEscrowTransactionById",
      acceptTransaction: "transactions/acceptTransaction",
      rejectTransaction: "transactions/rejectTransaction",
      sendTransaction: "transactions/sendTransaction",
      makePayment: "transactions/makePayment",
    }),

    async payForEscrow() {
      try {
        this.handleClick("pay");
        const response = await this.makePayment({
          transaction_id: this.$route?.params?.id,
        });
        this.handleClick("pay", "Make payment", false);
        const message = response?.data?.message || response?.message;
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
        }, 1500);
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
