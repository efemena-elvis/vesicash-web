<template>
  <div class="payment-rule-card rounded-16 teal-10-bg border-grey-100">
    <!-- CARD TITLE -->
    <div class="card-title grey-900 primary-2-text" v-if="getMilestoneName">
      {{ getMilestoneName }}
    </div>

    <!-- PAYMENT ITEMS -->
    <div class="payment-items">
      <div class="item" v-for="item in metas" :key="item.title">
        <div class="title grey-600">{{ item.title }}</div>

        <div class="value grey-900 text-wrap">
          <TagCard
            v-if="item.title === 'STATUS'"
            :card_text="item.value"
            :card_type="item.value | getStatusColor(status_colors)"
          />

          <div v-html="item.value" v-else></div>
        </div>
      </div>
    </div>

    <!-- USER PAYMENT DETAILS -->
    <div class="user-payment-details" v-if="parties.length > 1">
      <div class="wrapper border" v-for="(user, index) in parties" :key="index">
        <PaymentUserCard
          :payment_details="[
            {
              title: 'User Details',
              value: user.email,
              has_sign: false,
            },
            { title: 'Amount', value: user.amount, has_sign: true },
          ]"
          :currency="transaction.currency"
        />
      </div>
    </div>

    <!-- ACTIONS ROW -->
    <template v-if="has_actions && party">
      <!-- APPROVAL ROLE -->
      <template v-if="party.role === 'buyer'">
        <!-- APPROVAL OPTIONS -->
        <template
          v-if="['in progress', 'delivered'].includes(getMilestoneStatus)"
        >
          <div class="actions-row">
            <button
              class="btn btn-primary btn-md"
              ref="approveBtn"
              :disabled="getMilestoneStatus === 'delivered' ? false : true"
              @click="approveTransaction"
            >
              Approve
            </button>

            <button
              class="btn btn-secondary btn-md"
              ref="rejectBtn"
              :disabled="getMilestoneStatus === 'delivered' ? false : true"
              @click="show_reject_modal = true"
            >
              Reject
            </button>
          </div>
        </template>

        <!-- CLOSE OPTIONS -->
        <template v-if="getMilestoneStatus === 'delivered - rejected'">
          <!-- <button
              class="btn btn-secondary btn-md"
              @click="closeTransaction"
              ref="closeBtn"
            >
              Close
            </button> -->
        </template>
      </template>

      <!-- MARK AS DONE ROLE -->
      <template v-if="party.role === 'seller'">
        <template
          v-if="
            ['in progress', 'delivered - rejected'].includes(getMilestoneStatus)
          "
        >
          <div class="actions-row">
            <button
              class="btn btn-primary btn-md"
              ref="markAsDoneBtn"
              @click="markTransaction"
            >
              Mark as done
            </button>

            <button
              class="btn btn-secondary btn-md"
              ref="extendBtn"
              @click="show_renew_modal = true"
            >
              Extend due date
            </button>
          </div>
        </template>
      </template>
    </template>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_renew_modal">
        <RenewDateModal
          :data="{
            milestone_id: milestone.milestone_id,
            due_date: milestone.due_date,
            inspection_period: milestone.inspection_period,
          }"
          @closeTriggered="show_renew_modal = false"
          @extend="extendDueDate"
        />
      </transition>

      <transition name="fade" v-if="show_reject_modal">
        <RejectModal
          @rejected="rejectTransaction"
          title="Why do you want to reject this milestone?"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";
import PaymentUserCard from "@/modules/transactions/components/card-comps/payment-user-card";
import RejectModal from "../../modals/reject-modal.vue";

export default {
  name: "MilestoneRuleCard",

  components: {
    TagCard,
    PaymentUserCard,
    RejectModal,

    RenewDateModal: () =>
      import(
        /* webpackChunkName: "transactions-modal-module" */ "@/modules/transactions/modals/extend-due-date-modal"
      ),
  },

  props: {
    index: {
      type: Number,
    },

    transaction: {
      type: Object,
      default: () => ({}),
    },

    milestone: {
      type: Object,
      default: () => ({}),
    },

    transaction_status: {
      type: String,
      default: "",
    },

    has_actions: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    getMilestoneStatus() {
      return (this.milestone?.status ?? this.status.SAC).toLowerCase();
    },

    metas() {
      const partyEmail =
        this.parties?.length === 1 ? this.parties[0]?.email : "";
      const due_date = this.$date
        ?.formatDate(new Date(this.milestone.due_date), false)
        .getSimpleFormatDate();
      const inspection_period = `${this.milestone.inspection_period} ${
        Number(this.milestone.inspection_period) > 1 ? "hours" : "hour"
      }`;
      const status =
        this.transaction_status &&
        this.milestone?.status?.toLowerCase() === "draft"
          ? this.transaction_status
          : this.milestone?.status;

      return [
        {
          title: "USER DETAILS",
          value: partyEmail,
        },
        {
          title: "DUE DATE",
          value: due_date,
        },
        {
          title: "INSPECTION PERIOD",
          value: inspection_period,
        },
        {
          title: "STATUS",
          value: status,
        },
      ].filter((item) => item.value);
    },

    parties() {
      return this.transaction?.parties
        ?.filter((party) => party.role !== "buyer")
        .map((party) => {
          const amount = this.partyShare(party.role, this.milestone.amount);
          return {
            ...party,
            amount,
          };
        });
    },

    party() {
      const userEmail = this.getUser?.email;
      const account_id = `${this.getAccountId}`;
      return this.transaction?.parties?.find(
        (party) => party.email === userEmail || party.user_id === account_id
      );
    },

    getMilestoneName() {
      return this.transaction?.milestones?.length > 1
        ? `Milestone ${this.index}: ${this.milestone.title}`
        : "";
    },
  },

  filters: {
    getStatusColor(status, status_colors) {
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  data: () => ({
    show_renew_modal: false,
    show_reject_modal: false,
    status: {
      SAC: "Sent - Awaiting Confirmation",
    },
    new_due_date: "",
    extension_reason: "",
    rejection_reason: "",

    status_colors: {
      "sent - awaiting confirmation": "progress",
      "sent - Rejected": "error",
      "accepted - not funded": "error",
      "accepted - funded": "okay",
      draft: "okay",
      "in progress": "progress",
      delivered: "okay",
      "delivered - accepted": "success",
      "delivered - rejected": "error",
      "closed - disbursement complete": "success",
      completed: "success",
      "closed - refunded": "error",
      "closed - not funded": "error",
      closed: "error",
      "funded - awaiting confirmation": "progress",
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
  }),

  methods: {
    ...mapActions({
      markMilestoneAsDone: "transactions/markMilestoneAsDone",
      approveMilestone: "transactions/approveMilestone",
      rejectMilestone: "transactions/rejectMilestone",
      extendMilestoneDueDate: "transactions/extendMilestoneDueDate",
    }),

    partyShare(role, amount) {
      const broker = this.transaction?.parties?.find(
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

    async extendDueDate({ date, reason }) {
      this.new_due_date = date;
      this.extension_reason = reason;
      this.show_renew_modal = false;

      try {
        this.handleClick("extendBtn");
        const response = await this.extendMilestoneDueDate({
          id: this.getAccountId,
          milestone_id: this.milestone.milestone_id,
          due_date: date,
          reason,
        });
        this.handleClick("extendBtn", "Extend due date", false);

        const message = response?.data?.message || response?.message;
        const type = response?.code == 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response.code === 200) {
          this.$emit("refresh");
        }
      } catch (err) {
        this.handleClick("extendBtn", "Extend due date", false);
        console.log("ERROR EXTENDING", err);
        this.pushToast("Action failed", "error");
      }
    },

    // TOGGLE RENEWAL DATE MODAL
    toggleRenewDateModal() {
      this.show_renew_modal = !this.show_renew_modal;
    },

    async approveTransaction() {
      try {
        this.handleClick("approveBtn");
        const response = await this.approveMilestone({
          id: this.getAccountId,
          milestone_id: this.milestone.milestone_id,
        });
        this.handleClick("approveBtn", "Approve", false);

        const message = response?.data?.message || response?.message;
        const type = response?.code == 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response.code === 200) {
          this.$emit("refresh");
        }
      } catch (err) {
        this.handleClick("approveBtn", "Approve", false);
        console.log("ERROR APPROVING", err);
        this.pushToast("Action failed", "error");
      }
    },

    // REJECT DELIVERED TRANSACTION BY A BUYER
    async rejectTransaction(reason) {
      this.rejection_reason = reason;
      this.show_reject_modal = false;

      try {
        this.handleClick("rejectBtn");
        const response = await this.rejectMilestone({
          id: this.getAccountId,
          milestone_id: this.milestone.milestone_id,
          reason,
        });
        this.handleClick("rejectBtn", "Reject", false);

        const message = response?.data?.message || response?.message;
        const type = response?.code == 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response.code === 200) {
          this.$emit("refresh");
        }
      } catch (err) {
        this.handleClick("rejectBtn", "Reject", false);
        console.log("ERROR REJECTING", err);
        this.pushToast("Action failed", "error");
      }
    },

    // MARK A TRANSACTION AS DONE BY A SELLER
    async markTransaction() {
      try {
        this.handleClick("markAsDoneBtn");
        const response = await this.markMilestoneAsDone({
          id: this.getAccountId,
          milestone_id: this.milestone.milestone_id,
        });
        this.handleClick("markAsDoneBtn", "Mark as done", false);

        const message = response?.data?.message || response?.message;
        const type = response?.code == 200 ? "success" : "warning";
        this.pushToast(message, type);
        if (response.code === 200) {
          this.$emit("refresh");
        }
      } catch (err) {
        this.handleClick("markAsDoneBtn", "Mark as done", false);
        console.log("ERROR MARKING AS DONE", err);
        this.pushToast("Action failed", "error");
      }
    },

    closeTransaction() {},

    // CLOSE MILESTONE TRANSACTION
    closeMilestoneTransaction() {},
  },
};
</script>

<style lang="scss" scoped>
.payment-rule-card {
  padding: toRem(24);
  display: grid;
  gap: toRem(25);

  @include breakpoint-down(md) {
    padding: toRem(16);
  }

  .payment-items {
    @include flex-row-wrap("flex-start", "flex-start");
    gap: toRem(20) toRem(50);

    .item {
      min-width: toRem(150);

      .title {
        @include generate-font-type("tertiary-3");
        text-transform: uppercase;
        margin-bottom: toRem(8);

        @include breakpoint-down(sm) {
          font-size: toRem(11.75);
        }

        @include breakpoint-down(xs) {
          font-size: toRem(11.5);
        }
      }

      .value {
        @include generate-font-type("secondary-2");

        @include breakpoint-down(sm) {
          font-size: toRem(13.5);
        }
      }
    }
  }

  .user-payment-details {
    @include flex-row-wrap("space-between", "flex-start");

    .wrapper {
      margin-bottom: toRem(24);
      width: 48%;

      @include breakpoint-down(md) {
        width: 100%;
      }
    }
  }

  .actions-row {
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(15) toRem(25);
  }
}
</style>
