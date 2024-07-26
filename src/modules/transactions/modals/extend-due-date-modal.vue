<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Extend due date</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <!-- PAYMENT DUE DATE -->
        <div class="col-12">
          <div class="form-group">
            <BasicInput
              label_title="Due date"
              label_id="dueDate"
              input_type="date"
              :input_value="form.due_date"
              placeholder="Select date"
              is_required
              :minimum_date="min_date"
              @getInputState="updateUserInput('due_date', $event.value)"
            />
          </div>
        </div>

        <div class="col-12">
          <div class="form-group">
            <label class="form-label">Reason(optional)</label>
            <textarea
              name="reason"
              id="reason"
              cols="30"
              rows="4"
              class="form-control"
              v-model="reason"
              placeholder="...need more time"
            ></textarea>
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          class="btn btn-primary btn-md wt-100"
          ref="renewBtn"
          @click="renewTransactionDate"
        >
          Renew date
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import { INSPECTION_OPTIONS } from "@/modules/transactions/constants";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "RenewDateModal",

  components: {
    ModalCover,
  },

  props: {
    data: {
      type: Object,
    },
  },

  computed: {
    getSelectedInspectionPeriod() {
      return this.inspection_options.find(
        (data) => data.id === +this.data.inspection_period
      );
    },
  },

  data() {
    return {
      inspection_options: INSPECTION_OPTIONS,
      min_date: "",
      reason: "",

      form: {
        due_date: this.data.due_date.split(" ")[0],
        inspection_period: this.data.inspection_period,
      },
    };
  },

  mounted() {
    this.hidePastDate();
  },

  methods: {
    ...mapActions({
      renewMilestoneDate: "transactions/renewMilestoneDate",
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

    updateUserInput(type, value) {
      this.form[type] = value;
    },

    // RENEW MILESTONE TRANSACTION DATE
    renewTransactionDate() {
      this.$emit("extend", {
        date: `${this.form.due_date} 00:00:00`,
        reason: this.reason,
      });
    },
  },
};
</script>

<style></style>
