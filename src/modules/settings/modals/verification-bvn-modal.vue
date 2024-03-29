<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    class="bvn-form-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Bank Verification</div>
        <div class="tertiary-2-text grey-600 wt-75">
          Enter Your bank verificaton number to verify your identity
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            label_title="Enter your BVN number"
            label_id="bvn-details"
            :input_value="form.bvn"
            is_required
            placeholder="Enter Number"
            @getInputState="updateFormState($event, 'bvn')"
            :error_handler="{
              type: 'minimum',
              message: 'Enter a valid bvn',
              minimum: 10,
            }"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="dob">Date of birth</label>
          <input
            type="date"
            name="dob"
            id="dob"
            class="form-control"
            v-model="dob"
          />
        </div>

        <InfoAlertCard />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100 mgt-17"
          @click="save"
        >
          Submit
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "VerificationBvnModal",

  components: {
    ModalCover,
    InfoAlertCard: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/card-comps/info-alert-card"
      ),
  },

  computed: {
    getPayload() {
      return {
        bvn: this.form.bvn,
        dob: this.dob,
        account_id: this.getAccountId,
      };
    },
  },

  data() {
    return {
      form: {
        bvn: "",
      },

      dob: "",

      validity: {
        bvn: true,
      },
    };
  },

  methods: {
    ...mapActions({
      verfiyUserBVN: "settings/verfiyUserBVN",
    }),

    async save() {
      this.handleClick("save");

      try {
        const response = await this.verfiyUserBVN(this.getPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.$emit("saved", "Your BVN has been verified successfully");
        } else this.pushToast(response.message, "error");
      } catch (err) {
        console.log("ERROR VERIFYING BVN INFO", err);
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to verify BVN", "error");
      }
    },
  },
};
</script>

<style lang="scss">
.bvn-form-modal.modal-overlay {
  .modal-outer-container {
    top: toRem(50);
  }
}
</style>
