<template>
  <div class="milestone-card">
    <div class="milestone-actions span-full">
      <div class="primary-1-text">
        {{ milestone.saved ? milestone.name : "" }}
      </div>
      <div class="buttons">
        <div
          class="delete"
          @click="$emit('delete', milestone)"
          v-if="deletable"
        >
          Delete
        </div>
        <button
          class="btn btn-sm btn-primary"
          v-if="!milestone.saved"
          @click="saveMilestone"
          :disabled="disableSaveButton"
        >
          Save
        </button>
        <button
          class="btn btn-sm btn-secondary"
          v-else-if="editable"
          @click="editMilestone"
        >
          Edit
        </button>
      </div>
    </div>
    <BasicInput
      label_title="Milestone name"
      label_id="milestone_name"
      input_type="text"
      is_required
      placeholder="Milestone 1"
      :input_value="milestone.name"
      @getInputState="setMilestoneName"
      :error_handler="{
        type: 'required',
        message: 'Milestone name is required',
      }"
      v-if="!milestone.saved"
    />

    <template v-if="milestone.saved">
      <!-- <div class="secondary-2-text span-full milestone-desc">
        {{ milestone.description }}
      </div> -->
      <div class="milestone-metas span-full">
        <div class="meta">
          <div class="meta-key">Due date:</div>
          <div class="meta-value">{{ milestoneDueDate }}</div>
        </div>
        <div class="meta">
          <div class="meta-key">Inspection period:</div>
          <div class="meta-value">
            {{ milestone?.inspection_period }}
          </div>
        </div>
        <div class="meta">
          <div class="meta-key">Amount:</div>
          <div class="meta-value">
            {{ milestoneAmount }}
          </div>
        </div>
      </div>
      <div class="span-full">
        <div
          class="party-row"
          v-for="(party, index) in milestone.parties"
          :key="party.user_id + index"
        >
          <div class="party-meta grey-600">
            {{ party.email }}{{ party.is_initiator ? " (You)" : "" }}
          </div>
          <div class="party-meta grey-600">{{ party.role }}</div>
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
                : formattedAmount(currencySign, party.amount)
            }}
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <BasicInput
        label_title="Amount"
        label_id="amount"
        input_type="number"
        is_required
        placeholder="0.00"
        :currency="currency"
        :input_value="milestone.amount"
        :custom_style="{
          input_wrapper_style: 'form-prefix form-prefix-right',
        }"
        @getInputState="setMilestoneAmount"
        :error_handler="{
          type: 'required',
          message: 'Amount field is required',
        }"
      />

      <BasicInput
        label_title="Due date"
        label_id="due_date"
        input_type="date"
        is_required
        placeholder=""
        :input_value="milestone.due_date"
        :minimum_date="minDate"
        @getInputState="setDueDate"
        :error_handler="{
          type: 'required',
          message: 'Due date is required',
        }"
      />

      <BasicInput
        label_title="Inspection period (in days)"
        label_id="inspection_period"
        input_type="number"
        is_required
        placeholder="2"
        :input_value="milestone.inspection_period"
        @getInputState="setInspectionPeriod"
        :error_handler="{
          type: 'required',
          message: 'Inspection period is required',
        }"
      />

      <div class="span-full" v-if="false">
        <div class="form-label">Milestone description</div>
        <textarea
          name="description"
          cols="30"
          rows="4"
          class="form-control"
          id="milestone-description"
          v-model="milestone.description"
        />
      </div>

      <!-- <div>

        <div class="form-label">Inspection period (in days)</div>

        <DropSelectInput
          placeholder="Select inspection period"
          :options="inspection_period"
          @optionSelected="setInspectionPeriod"
          :pre_select="milestone.inspection_period"
        />
      </div> -->
    </template>
  </div>
</template>

<script>
export default {
  name: "MilestoneCard",

  props: {
    txn_milestone: {
      type: Object,
      default: () => ({
        name: "",
        title: "",
        description: "",
        due_date: "",
        currency: {
          sign: "₦",
          short: "NGN",
          long: "Naira",
          description: "Nigerian Naira",
        },
        amount: "",
        inspection_period: "",
        saved: false,
      }),
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    txn_milestone: {
      handler(milestone) {
        if (milestone) this.milestone = milestone;
      },
      immediate: true,
    },
  },

  data() {
    return {
      saved: false,
      milestone: {
        name: "",
        description: "",
        due_date: "",
        currency: {
          sign: "₦",
          short: "NGN",
          long: "Naira",
          description: "Nigerian Naira",
        },
        amount: "",
        title: "",
        inspection_period: "",
        saved: false,
      },

      form: {
        milestone_name: "Milestone 1",
        due_date: "",
        amount: "",
        inspection_period: "",
      },
      inspection_period: [
        { id: 1, name: "1 day" },
        { id: 2, name: "2 days" },
        { id: 3, name: "3 days" },
        { id: 4, name: "4 days" },
        { id: 5, name: "5 days" },
        { id: 6, name: "6 days" },
        { id: 7, name: "7 days" },
      ],
    };
  },

  computed: {
    currency() {
      return `${this.milestone.currency.short}(${this.milestone.currency.sign})`;
    },

    currencySign() {
      return this.milestone.currency.sign;
    },

    milestoneAmount() {
      return `${this.currencySign}${this.$utils.formatCurrencyWithComma(
        this.milestone.amount
      )}`;
    },

    minDate() {
      const today = this.$date?.formatDate(new Date(), false);
      return today.getSimpleDate();
    },

    disableBrokerButton() {
      return (
        this.milestone.brokers?.length &&
        this.milestone.brokers?.every((broker) => {
          return !broker.email || !broker.amount;
        })
      );
    },

    milestoneDueDate() {
      const due_date = this.$date?.formatDate(
        new Date(this.milestone.due_date || this.minDate),
        false
      );

      return due_date?.getSimpleFormatDate();
    },

    disableSaveButton() {
      return (
        !this.milestone.title ||
        !this.milestone.due_date ||
        !this.milestone.inspection_period ||
        !this.milestone.amount
      );
    },

    hasBrokers() {
      return this.milestone?.brokers?.length;
    },
  },

  methods: {
    formattedAmount(currency, cost) {
      return `${currency}${this.$utils.formatCurrencyWithComma(cost, true)}`;
    },

    saveMilestone() {
      this.milestone.saved = true;
      this.$emit("saved", this.milestone);
    },
    editMilestone() {
      this.milestone.saved = false;
      this.$emit("saved", this.milestone);
    },
    setMilestoneName({ value: name }) {
      this.milestone.name = name;
      this.milestone.title = name;
    },
    setMilestoneAmount({ value: amount }) {
      this.milestone.amount = amount;
    },
    setDueDate({ value: date }) {
      this.milestone.due_date = date;
    },

    setInspectionPeriod({ value: period }) {
      this.milestone.inspection_period = period;
      this.milestone.grace_period = period;
    },
  },
};
</script>

<style lang="scss" scoped>
.milestone-card {
  display: grid;
  gap: toRem(25) toRem(30);
  grid-template-columns: repeat(auto-fill, minmax(toRem(310), 1fr));
  align-items: center;
  max-width: 100%;
  background: getColor("green-10");
  padding: toRem(20);
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(20);
  position: relative;

  .span-full {
    grid-column: 1/-1;
  }

  .milestone-desc {
    margin-top: -20px;
    color: getColor("grey-500");
  }

  .broker-row {
    display: grid;
    gap: toRem(25) toRem(30);
    grid-template-columns: repeat(auto-fill, minmax(toRem(310), 1fr));
    align-items: center;
    position: relative;
  }

  &__broker {
    background: transparent;

    .broker-btn {
      max-width: max-content;
    }
  }

  .delete-broker {
    font-size: 0.8rem;
    color: getColor("grey-700");
    text-decoration: underline;
    margin-bottom: toRem(-80);
    transition: all ease 0.25s;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;

    &:hover {
      color: getColor("red-400");
      text-decoration: none;
    }
  }

  .milestone-actions {
    @include flex-row-nowrap("space-between", "center");
    gap: 0 toRem(10);

    .buttons {
      @include flex-row-nowrap("flex-start", "center");
      gap: 0 toRem(8);
    }

    .delete {
      font-size: 0.8rem;
      color: getColor("grey-700");
      transition: color ease 0.25s;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        text-decoration: none;
        color: getColor("red-400");
      }
    }
  }

  .milestone-metas {
    @include flex-row-wrap("flex-start", "center");
    gap: toRem(20);

    .meta {
      display: inline-flex;
      align-items: center;

      .meta-key {
        color: getColor("grey-500");
        font-size: 0.9rem;
        margin-right: toRem(4);
      }

      .meta-value {
        color: getColor("grey-900");
        font-size: 0.9rem;
      }
    }
  }

  .party-row {
    display: grid;
    grid-template-columns: 1fr 150px 200px;
    padding: toRem(15) 0;
    border-bottom: toRem(0.3) solid getColor("grey-200");
    &:last-child {
      border-bottom: 0;
    }

    .party-meta {
      font-size: 0.9rem;
    }

    .cost {
      justify-self: end;
    }
  }
}
</style>
