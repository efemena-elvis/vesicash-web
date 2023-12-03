<template>
  <div class="fund-payout-rules">
    <div class="disbursement-title h4-text grey-900 mgb-32">Payout Details</div>

    <div class="instruction-wrapper col-xl-8 mgb-12">
      <!-- INSTRUCTION TEXT -->
      <div class="instruction-text grey-900 primary-2-text mgr-5">
        Provide details for the Payout
      </div>

      <button
        class="btn btn-secondary btn-md"
        v-if="getTransactionType === 'milestone'"
        @click="addNewMilestone"
      >
        <div class="icon icon-plus"></div>
        <div class="text">Add new milestone</div>
      </button>
    </div>

    <!-- PAYOUT CARDS -->
    <div class="wrapper row">
      <div
        class="col-xl-8"
        v-for="(milestone, index) in getTransactionMilestones"
        :key="index"
      >
        <PayoutCard
          :milestone="milestone"
          :currency="getTransactionAmount.currency"
          :index="index"
          :charge="estimatedCharge"
        />
      </div>
    </div>

    <!-- INSTRUCTION TEXT -->
    <div class="instruction-text grey-900 primary-2-text mgb-12">
      How May Any Dispute Be Handled?
    </div>

    <div class="wrapper row mgb-32">
      <div class="col-xl-8">
        <div class="row">
          <div class="col-12 col-sm-6 dispute-wrapper">
            <RadioSelectCard
              card_name="dispute"
              label_id="disputeCard1"
              label_text="Handled by the platform"
              tooltip_text="Dispute
              resolution will be handled by Vesicash."
              :is_checked="
                getTransactionSetup.dispute_handler == 'vesicash' ? true : false
              "
              @clicked="UPDATE_TRANSACTION_DISPUTE_MGT('vesicash')"
            />
          </div>

          <div class="col-12 col-sm-6 dispute-wrapper">
            <RadioSelectCard
              card_name="dispute"
              label_id="disputeCard2"
              label_text="Arbitration"
              tooltip_text="Any dispute will be handled via arbitration. card_bank_cost of which will be borne by the transacting parties."
              :is_checked="
                getTransactionSetup.dispute_handler == 'arbitration'
                  ? true
                  : false
              "
              @clicked="UPDATE_TRANSACTION_DISPUTE_MGT('arbitration')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- SUMMATION TOTAL -->
    <div class="wrapper mgb-40">
      <div class="col-xl-8">
        <SummationCard
          :milestones="getTransactionMilestones"
          :amount_data="getTransactionAmount"
          :charge="estimatedCharge"
        />
      </div>
    </div>

    <!-- CTA ACTION ROW -->
    <div class="action-row mgt-14">
      <button class="btn btn-primary btn-md" @click="nextProgressFlow">
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: "FundPayoutRules",

  components: {
    PayoutCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/payout-card"
      ),

    RadioSelectCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/radio-select-card"
      ),

    SummationCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/summation-card"
      ),
  },

  computed: {
    ...mapGetters({
      getTransactionSetup: "transactions/getTransactionSetup",
      getTransactionBeneficiaries: "transactions/getTransactionBeneficiaries",
      getTransactionMilestones: "transactions/getTransactionMilestones",
      getTransactionAmount: "transactions/getTransactionAmount",
      getMilestoneRecipients: "transactions/getMilestoneRecipients",
      getTransactionCharges: "general/getTransactionCharges",
    }),

    escrowCharges() {
      const escrow_charges = this.getTransactionCharges?.escrow;
      if (!escrow_charges) return [];

      return escrow_charges.map((charge) => {
        charge.min_value = charge.MinValue;
        if (charge.MaxValue == 0 || charge.max_value == 0)
          charge.max_value = Number.MAX_SAFE_INTEGER;
        return charge;
      });
    },

    estimatedCharge() {
      const amount = this.getTransactionAmount?.payment_amount;
      const currency = this.getTransactionAmount?.currency?.short;

      const escrowCharge = this.escrowCharges.find((charge) => {
        return (
          charge.currency === currency &&
          amount >= charge.min_value &&
          amount <= charge.max_value
        );
      });

      let card_charge = null;
      let transfer_charge = null;
      let fee_charge = null;

      if (!escrowCharge) return { card_charge, transfer_charge, fee_charge };

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

      const total = fee_charge ? amount + fee_charge : null;

      return {
        card_charge,
        transfer_charge,
        fee_charge,
        total,
      };
    },

    // =============================================
    // GET THE TRANSACTION PARTY TYPE FROM ROUTE
    // =============================================
    getTransactionParty() {
      return this.$route.query.party ? this.$route.query.party : "single";
    },

    // ===================================================
    // GET THE TRANSACTION DISBURSEMENT TYPE FROM ROUTE
    // ===================================================
    getTransactionType() {
      return this.$route.query.type ? this.$route.query.type : "oneoff";
    },
  },

  mounted() {
    if (!this.getTransactionCharges?.escrow) this.fetchCharges("escrow");
    // this.loadMileStoneData();
    this.getTransactionMilestones.length
      ? this.loadAllCurrentMilestones()
      : this.loadMileStoneData();
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_MILESTONE: "transactions/UPDATE_TRANSACTION_MILESTONE",
      UPDATE_MILESTONE_RECIPIENT: "transactions/UPDATE_MILESTONE_RECIPIENT",
      UPDATE_TRANSACTION_DISPUTE_MGT:
        "transactions/UPDATE_TRANSACTION_DISPUTE_MGT",
      EVALUATE_TRANSACTION_FEES: "transactions/EVALUATE_TRANSACTION_FEES",
    }),

    ...mapActions({
      fetchCharges: "general/fetchCharges",
    }),

    nextProgressFlow() {
      this.checkValidState();

      // this.$router.push({
      //   name: "TransactionConfirmPayout",
      //   query: {
      //     type: this.$route.query.type,
      //     party: this.$route.query.party,
      //   },
      // });
    },

    // ========================================================
    // CHECK IF ALL INPUT AND SELECTIONS ARE MADE
    // ========================================================
    checkValidState() {
      for (
        let index = 0;
        index < this.getTransactionMilestones.length;
        index++
      ) {
        let milestone = this.getTransactionMilestones[index];
        let payout_error = [];

        let milestone_recipients = this.getMilestoneRecipients.filter(
          (user) => user.milestone_id === milestone.id
        );

        milestone_recipients.map((user) => {
          if (!user.amount) {
            let error_obj = {};

            error_obj.name = milestone.name;
            error_obj.index = index;
            error_obj.message = `is missing a payout amount for user (${user.email_address})`;

            payout_error.push(error_obj);
          }
        });

        // DUE DATE
        if (!milestone.due_date) {
          this.logErrorMessage(milestone.name, index, "is missing a due date.");
          break;
        }

        // INSPECTION PERIOD
        else if (!Object.values(milestone.inspection_period).length) {
          this.logErrorMessage(
            milestone.name,
            index,
            "is missing an inspection period."
          );
          break;
        }

        // FETCH MILESTONE RECIPIENTS
        else if (payout_error.length) {
          this.logErrorMessage(
            payout_error[0].name,
            payout_error[0].index,
            payout_error[0].message
          );
          break;
        }

        // DISPUTE HANDLING
        else if (!this.getTransactionSetup.dispute_handler) {
          this.logErrorMessage(
            milestone.name,
            index,
            "is missing a dispute handler.",
            true
          );
          break;
        }

        // CHECK MILESTONE LENGTH FOR MILESTONE TRANSACTION
        else if (
          this.getTransactionMilestones.length < 2 &&
          this.getTransactionType === "milestone"
        ) {
          this.logErrorMessage(
            milestone.name,
            index,
            "should contain more than one (1) milestone",
            true
          );
          break;
        }

        // MOVE TO CONFIRM PAYOUT PAGE
        else {
          if (index + 1 === this.getTransactionMilestones.length) {
            this.$router.push({
              name: "TransactionConfirmPayout",
              query: {
                type: this.$route.query.type,
                party: this.$route.query.party,
                pay: this.$route.query.pay,
                name: this.$route.query.name,
                parties: this.$route.query.parties,
                fee:
                  this.estimatedCharge?.total ||
                  this.getTransactionAmount.total_fee,
              },
            });
          }
        }
      }
    },

    // ==========================================================
    // LOG ERROR MESSAGE DEPENDING ON MILESTONE
    // ==========================================================
    logErrorMessage(
      milestone_name = "",
      milestone_index = 0,
      message = "",
      pass = false
    ) {
      let naming_intro =
        this.getTransactionType === "oneoff" || pass
          ? "Transaction"
          : milestone_name
          ? milestone_name
          : `Milestone ${milestone_index + 1}`;

      this.pushToast(`${naming_intro} ${message}`, "error");
    },

    // ============================================================
    // GENERATE A LIST OF BENEFICIARIES WHO ARE PAYOUT RECIPIENTS
    // ============================================================
    getBeneficiariesReceivingPay(milestone_id) {
      let milestone_recipients = [];

      this.getTransactionBeneficiaries
        .filter((user) => user.recipient.name === "Yes")
        .map((i) => {
          milestone_recipients.push({
            ...i,
            milestone_id,
            update_id: this.$utils.getRandomString(12),
          });
        });

      return milestone_recipients;
    },

    // CHECK CURRENT RECIPIENT STATE
    // checkCurrentRecipientState() {
    //   let parties_list = [];
    //   let recipient_list = [];

    //   // POPULATE PARTIES LIST
    //   this.getTransactionBeneficiaries.map((user) =>
    //     parties_list.push(user.id)
    //   );

    //   // LOOP MILESTONE RECIPIENT LIST
    //   this.getMilestoneRecipients.map((user) => {
    //     if (parties_list.includes(user.id)) {
    //       // POPULATE RECIPIENT LIST
    //       recipient_list.push(user);

    //       // POP FROM PARTIES LIST
    //     }
    //   });
    // },

    // ==============================
    // LOAD MILESTONE DATA
    // ==============================
    loadMileStoneData() {
      let milestone_data = {};

      let id_one = this.$utils.getRandomString(12);
      let id_two = this.$utils.getRandomString(12);

      // milestone_data.id = this.$utils.getRandomString(12);
      milestone_data.name = "";
      milestone_data.due_date = "";
      milestone_data.inspection_period = {};
      milestone_data.status = "Sent - Awaiting Confirmation";

      this.UPDATE_TRANSACTION_MILESTONE(
        this.getTransactionType === "oneoff"
          ? [{ ...milestone_data, id: id_one }]
          : [
              { ...milestone_data, id: id_one },
              { ...milestone_data, id: id_two },
            ]
      );

      this.UPDATE_MILESTONE_RECIPIENT(
        ...[
          this.getTransactionType === "oneoff"
            ? [...this.getBeneficiariesReceivingPay(id_one)]
            : [
                ...this.getBeneficiariesReceivingPay(id_one),
                ...this.getBeneficiariesReceivingPay(id_two),
              ],
        ]
      );
    },

    // ==============================
    // LOAD ALL CURRENT MILESTONES
    // ==============================
    loadAllCurrentMilestones() {
      // GET NON RECIPIENTS
      let non_recipients = this.getTransactionBeneficiaries.filter(
        (user) => user.recipient.name === "No"
      );

      // GET NEWLY ADDED RECIPIENTS
      let recipients = this.getTransactionBeneficiaries.filter(
        (user) => user.recipient.name === "Yes"
      );

      // FILTER OUT RECIPIENT THAT ALREADY EXIST IN MILESTONE RECIPENT LIST
      let evaluated_recipient = recipients.filter((obj1) => {
        return !this.getMilestoneRecipients.find((obj2) => obj2.id === obj1.id);
      });

      // REMOVE RECIPIENT THAT CAN NO LONGER RECEIVE FUND
      if (non_recipients.length) {
        let lean_recipient = this.getMilestoneRecipients.filter((obj1) => {
          return !non_recipients.find((obj2) => obj2.id === obj1.id);
        });

        this.UPDATE_MILESTONE_RECIPIENT([...lean_recipient]);
      }

      if (evaluated_recipient.length) {
        let bulk_recipient = [];
        this.getTransactionMilestones.map((milestone) => {
          evaluated_recipient.map((user) => {
            bulk_recipient.push({
              ...user,
              milestone_id: milestone.id,
              update_id: this.$utils.getRandomString(12),
            });
          });
        });

        let padded_recipient = [
          ...this.getMilestoneRecipients,
          ...bulk_recipient,
        ];

        this.UPDATE_MILESTONE_RECIPIENT([...padded_recipient]);
      }

      this.UPDATE_TRANSACTION_MILESTONE([...this.getTransactionMilestones]);

      if (!non_recipients.length && !evaluated_recipient.lenght) {
        this.UPDATE_MILESTONE_RECIPIENT([...this.getMilestoneRecipients]);
      }

      this.EVALUATE_TRANSACTION_FEES();
    },

    // ==============================
    // CREATE A NEW MILESTONE DATA
    // ==============================
    addNewMilestone() {
      let previous_milestone =
        this.getTransactionMilestones[this.getTransactionMilestones.length - 1];

      let new_milestone_data = {
        ...previous_milestone,
        id: this.$utils.getRandomString(12),
      };

      this.UPDATE_TRANSACTION_MILESTONE([
        ...this.getTransactionMilestones,
        new_milestone_data,
      ]);

      this.UPDATE_MILESTONE_RECIPIENT([
        ...this.getMilestoneRecipients,
        ...this.getBeneficiariesReceivingPay(new_milestone_data.id),
      ]);
    },
  },
};
</script>

<style lang="scss" scoped>
.fund-payout-rules {
  .disbursement-title {
    @include breakpoint-down(xl) {
      @include generate-font-type("h5");
    }
  }

  .instruction-wrapper {
    @include flex-row-wrap("space-between", "center");

    .btn {
      padding: toRem(8) toRem(24) toRem(8) toRem(18);

      @include breakpoint-down(xs) {
        margin-top: toRem(10);
      }

      .icon {
        font-size: toRem(14.25);
        margin-right: toRem(4);
      }
    }
  }

  .dispute-wrapper {
    @include breakpoint-down(sm) {
      &:first-of-type {
        margin-bottom: toRem(20);
      }
    }
  }

  .action-row {
    padding-bottom: toRem(55);

    .btn {
      padding: toRem(9) toRem(24);
      width: toRem(260);

      @include breakpoint-down(xs) {
        width: 100%;
      }
    }
  }
}
</style>
