<template>
  <div class="payout-card rounded-16 border-grey-100">
    <!-- CARD TITLE -->
    <div
      class="card-title primary-2-text grey-900 mgb-24"
      v-if="getTransactionType === 'milestone'"
    >
      {{ getMilestoneName }}
    </div>

    <div class="close-wrapper" v-if="index > 1">
      <div
        class="close-btn rounded-16 pointer smooth-transition"
        title="Remove milestone"
        @click="removeSelectedMilestone"
      >
        <div class="icon icon-close grey-600"></div>
      </div>
    </div>

    <!-- PAYOUT INPUTS -->
    <div class="payout-inputs">
      <div class="row" style="align-items: flex-start">
        <!-- PAYMENT CURRENCY -->
        <div class="col-12 col-sm-6" v-if="index === 0">
          <div class="form-group">
            <label class="form-label"> Select payment currency </label>
            <DropSelectInput
              :pre_select="currency"
              @selectedOption="
                updateUserSelection('currency', $event, currency_options, true)
              "
              placeholder="Select currency"
              :options="currency_options"
            />
          </div>
        </div>

        <!-- MILESTONE NAME -->
        <div
          class="col-12 col-sm-6"
          :class="getTransactionType === 'oneoff' && 'invisible'"
        >
          <div class="form-group">
            <BasicInput
              label_title="Milestone name"
              label_id="milestoneName"
              :input_value="milestone.name || form.milestone_name"
              placeholder="What milestone is this?"
              @getInputState="updateUserInput('name', $event.value)"
            />
          </div>
        </div>

        <!-- HOLDING INVISIBLE SPACE -->
        <div
          class="col-12 col-sm-6"
          :class="index > 0 ? 'invisible' : 'd-none'"
        ></div>

        <!-- RECIPIENTS DATA -->
        <template v-for="(user, user_index) in loadCurrentMilestoneRecipients">
          <div class="col-12 col-sm-6" :key="`${user_index}a`">
            <div class="form-group">
              <BasicInput
                label_title="Recipient’s email"
                label_id="userEmail1"
                input_type="email"
                :input_value="user.email_address"
                is_disabled
              />
            </div>
          </div>

          <div class="col-12 col-sm-6" :key="`${user_index}b`">
            <div class="form-group">
              <BasicInput
                label_title="Amount"
                label_id="amount"
                input_type="number"
                is_required
                placeholder="0.00"
                :currency="currency.name"
                :input_value="user.amount"
                :custom_style="{
                  input_wrapper_style: 'form-prefix form-prefix-right',
                }"
                @getInputState="
                  updateUserRecipientAmount($event.value, user.update_id)
                "
                :error_handler="{
                  type: 'required',
                  message: 'Amount field is required',
                }"
              />
            </div>
          </div>
        </template>

        <!-- PAYMENT DUE DATE -->
        <div class="col-12 col-sm-6">
          <div class="form-group">
            <BasicInput
              label_title="Due date"
              label_id="dueDate"
              input_type="date"
              :input_value="milestone.due_date || form.due_date"
              placeholder="Select date"
              is_required
              :minimum_date="min_date"
              @getInputState="updateUserInput('due_date', $event.value)"
            />
          </div>
        </div>

        <div class="col-12 col-sm-6">
          <div class="form-group">
            <label class="form-label"> Inspection period (Days) </label>
            <DropSelectInput
              :pre_select="milestone.inspection_period"
              @selectedOption="
                updateUserSelection(
                  'inspection_period',
                  $event,
                  inspection_options
                )
              "
              placeholder="Select inspection period"
              :options="inspection_options"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { INSPECTION_OPTIONS } from "@/modules/transactions/constants";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "PayoutCard",

  components: {},

  props: {
    index: {
      type: Number,
    },

    milestone: {
      type: Object,
      default: () => ({}),
    },

    currency: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters({
      getTransactionMilestones: "transactions/getTransactionMilestones",
      getMilestoneRecipients: "transactions/getMilestoneRecipients",
      getWalletSize: "general/getWalletSize",
    }),

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

    // ===================================================
    // GET THE TRANSACTION MILESTONE NAME
    // ===================================================
    getMilestoneName() {
      return this.milestone.name
        ? this.milestone.name
        : `Milestone ${this.index + 1}`;
    },

    loadCurrentMilestoneRecipients() {
      return this.getMilestoneRecipients.filter(
        (recipient) => recipient.milestone_id === this.milestone.id
      );
    },
  },

  data: () => ({
    currency_options: [],
    inspection_options: INSPECTION_OPTIONS,
    min_date: "",

    form: {
      milestone_name: "",
      due_date: "",
      inspection_period: "",
    },
  }),

  created() {
    // GET WALLET OPTIONS
    this.getWalletSize
      .filter(
        (wallet) =>
          wallet.enabled && !wallet.short.includes("ESCROW") && !wallet?.mor
      )
      .map((wallet_type) => {
        this.currency_options.push({
          id: wallet_type.id,
          name: `${wallet_type.short} (${wallet_type.sign})`,
          slug: wallet_type.long.toLowerCase(),
          short: wallet_type.short,
        });
      });
  },

  mounted() {
    this.hidePastDate();
  },

  methods: {
    ...mapMutations({
      UPDATE_TRANSACTION_MILESTONE: "transactions/UPDATE_TRANSACTION_MILESTONE",
      UPDATE_MILESTONE_RECIPIENT: "transactions/UPDATE_MILESTONE_RECIPIENT",
      UPDATE_MILESTONE_DATA: "transactions/UPDATE_MILESTONE_DATA",
      UPDATE_RECIPIENT_AMOUNT: "transactions/UPDATE_RECIPIENT_AMOUNT",
      EVALUATE_TRANSACTION_FEES: "transactions/EVALUATE_TRANSACTION_FEES",
    }),

    hidePastDate() {
      let open = new Date();
      let year = open.getFullYear(),
        month =
          open.getMonth() + 1 > 9
            ? open.getMonth() + 1
            : `0${open.getMonth() + 1}`,
        day = open.getDate() > 9 ? open.getDate() : `0${open.getDate()}`;

      this.min_date = `${year}-${month}-${day}`;
    },

    updateUserSelection(type, value, options, outer = false) {
      let selected = options.find((option) => option.id === value);

      let milestone_data = { ...this.milestone };
      milestone_data[type] = selected;

      let outer_data = outer ? { type, selected } : {};

      this.UPDATE_MILESTONE_DATA({
        milestone_index: this.index,
        milestone_data,
        outer_data,
      });
    },

    updateUserInput(type, value) {
      let milestone_data = { ...this.milestone };
      milestone_data[type] = value;

      this.UPDATE_MILESTONE_DATA({
        milestone_index: this.index,
        milestone_data,
      });
    },

    updateUserRecipientAmount(value, update_id) {
      let recipient_index = this.getMilestoneRecipients.findIndex(
        (user) => user.update_id == update_id
      );

      let recipient_payload = {
        ...this.getMilestoneRecipients[recipient_index],
      };
      recipient_payload.amount = value;

      this.UPDATE_RECIPIENT_AMOUNT({ recipient_payload, recipient_index });

      // RE-EVALUATE TOTAL FEE
      this.EVALUATE_TRANSACTION_FEES();
    },

    // REMOVE SELECTED MILESTONE DATA
    removeSelectedMilestone() {
      // UPDATE TRANSACTION MILESTONE LIST
      let updated_milestone = this.getTransactionMilestones.filter(
        (milestone) => milestone.id !== this.milestone.id
      );

      // UPDATE TRANSACTION RECIPIENT LIST
      let updated_recipients = this.getMilestoneRecipients.filter(
        (recipient) => recipient.milestone_id !== this.milestone.id
      );

      this.UPDATE_TRANSACTION_MILESTONE(updated_milestone);
      this.UPDATE_MILESTONE_RECIPIENT(updated_recipients);
    },
  },
};
</script>

<style lang="scss" scoped>
.payout-card {
  position: relative;
  margin-bottom: toRem(15);
  padding: toRem(24);
  padding-bottom: toRem(5);

  @include breakpoint-down(sm) {
    padding: toRem(16);
  }

  &:last-of-type {
    margin-bottom: toRem(32);
  }

  .close-wrapper {
    position: absolute;
    top: toRem(28);
    right: toRem(24);

    .close-btn {
      background: getColor("grey-50");
      @include draw-shape(24);

      .icon {
        @include center-placement;
        font-size: toRem(18);
      }

      &:hover {
        background: getColor("red-100");
      }
    }
  }

  .payout-inputs {
    .row {
      @include flex-row-wrap("space-between", "center");
    }
  }
}
</style>
