<template>
  <tr @click="viewTransactionDetails">
    <td class="body-data" :class="`${table_name}-1`">
      <div class="text mgb-6 text-no-wrap">{{ getCreatedDate }}</div>
      <!-- <div class="meta tertiary-3-text grey-600">{{ getTransactionType }}</div> -->
    </td>

    <td class="body-data" :class="`${table_name}-2`">
      <!-- <div class="text mgb-6 text-no-wrap">{{ getPartyType }} party</div> -->
      <div class="meta">
        {{ data.title }}
      </div>
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      {{ getTransactionType }}
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <div class="text mgb-6 text-no-wrap">
        {{ $money.getSign(data.currency)
        }}{{
          $utils.formatCurrencyWithComma(
            data.total_amount ? data.total_amount : data.amount
          )
        }}
      </div>
      <!-- <div class="meta tertiary-3-text grey-600">
          {{ $money.getSign(data.currency)
          }}{{ $utils.formatCurrencyWithComma(getTotalAmountPaid || 0) }} paid
        </div> -->
    </td>

    <td class="body-data" :class="`${table_name}-5`">
      <TagCard
        :card_text="getCurrentTransactionStatus"
        :card_type="getCurrentTransactionStatus | getStatusColor(status_colors)"
      />
    </td>

    <td class="body-data" :class="`${table_name}-6`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>
  </tr>
</template>

<script>
import { mapMutations } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "EscrowTransactionTableRow",

  components: {
    TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    getCreatedDate() {
      const created_date = this.$date?.formatDate(
        new Date(this.data?.created_at),
        false
      );

      return created_date?.getSimpleFormatDate();
    },

    getTransactionType() {
      return this.data.type === "oneoff"
        ? "One-off disbursement"
        : "Milestone disbursement";
    },

    getPartyType() {
      return this.data?.members?.parties === 2 ? "1 on 1" : "Multi";
    },

    getPartyCount() {
      return this.data?.perties?.length ?? 0;
    },

    getTotalTransactionAmount() {
      return this.data.milestones.length
        ? this.data.milestones.reduce(
            (total, count) => (total += Number(count.amount)),
            0
          )
        : this.data.amount;
    },

    getSortedMilestones() {
      return this.data?.milestones;
    },

    getCurrentTransactionStatus() {
      // return this.data.status;
      let MS = this.getSortedMilestones;
      const milestone_active = MS?.every(
        (item) => item?.status?.toLowerCase() !== "draft"
      );
      if (!milestone_active) return this.data.status;

      // CHECK IF MILESTONE HAS LENGTH
      if (!MS.length) return this.status.cls;

      // CHECK FOR ONEOFF TYPE
      if (this.data.type === "oneoff") {
        return MS[0]?.status ?? this.status.cls;
      }

      // CHECK FOR MILESTONE TYPE
      else {
        // CHECK IF FIRST MILESTONE IS SENT AWAITING
        if (MS[0]?.status === this.status.sac) {
          return MS[0]?.status ?? this.status.sac;
        }

        // CHECK IF LAST MILESTONE CONTAINS A CLOSED STATUS
        else if (MS.at(-1)?.status?.toLowerCase().includes("closed")) {
          return MS.at(-1)?.status ?? this.status.sac;
        }

        // CHECK OTHER STATUS
        else {
          return this.getCurrentStatus(MS);
        }
      }
    },

    getTotalAmountPaid() {
      return +this.data?.amount_paid;
    },
  },

  filters: {
    getStatusColor(status, status_colors) {
      return status_colors[status?.toLowerCase()] || "error";
    },
  },

  data() {
    return {
      status: {
        sac: "Sent - Awaiting Confirmation",
        cls: "Closed",
      },

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
    };
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_DETAILS: "transactions/UPDATE_TRANSACTION_DETAILS",
    }),

    // RUN A LOOP ON MULTIPLE MILESTONE DATA
    getCurrentStatus(MS) {
      let status = "";

      for (let index = 0; index < MS.length; index++) {
        if (MS.length === index + 1) {
          status = MS[index]?.status;
          break;
        } else if (!MS[index].status.toLowerCase().includes("closed")) {
          status = MS[index]?.status;
          break;
        } else {
          status = MS[index + 1]?.status;
          break;
        }
      }

      return status;
    },

    viewTransactionDetails() {
      // this.updateTransactionDetails(this.data);

      this.$router.push({
        name: "EscrowTransactionDetailsPage",
        params: { id: this.data.transaction_id },
        query: {
          type: this.data.type,
          party: this.data?.parties.length === 2 ? "single" : "multiple",
        },
      });
    },

    // UPDATE TRANSACTION DETAILS STATE
    updateTransactionDetails(payload) {
      this.UPDATE_TRANSACTION_DETAILS(payload);
    },
  },
};
</script>

<style></style>
