<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    class="director-id-modal"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Director identity verification</div>
        <div class="tertiary-2-text grey-600">
          Verify <b>{{ director.name }}</b> identity
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <BasicInput
            :label_title="verificationTitle"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            :placeholder="verificationPlaceholder"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter verification number',
            }"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_title="Bank Verification Number"
            label_id="bvn-number"
            :input_value="form.bvn"
            is_required
            placeholder="Enter bank verification number (BVN)"
            @getInputState="updateFormState($event, 'bvn')"
            :error_handler="{
              type: 'required',
              message: 'Enter bank verification number',
            }"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100 mgt-17"
          :disabled="isDisabled"
          @click="verifyDirector"
        >
          Verify
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "DirectorVerificationDocModal",

  components: {
    ModalCover,
  },

  props: {
    director: {
      type: Object,
      default: () => ({
        name: "Rilwan",
        id: "rilwan",
        cac: "2653386",
        identity_type: "Permanent Voters' Card",
      }),
    },
    id: {
      type: String,
      default: "",
    },
    rcn: {
      type: String,
      default: "",
    },
  },

  computed: {
    verificationPlaceholder() {
      return `Enter ${this.director.id || "identity"} number`;
    },

    verificationTitle() {
      return this.director?.id || "Identity";
    },

    isDisabled() {
      return !this.form.doc_number || !this.form.bvn;
    },

    verfiyDocPayload() {
      return {
        cac: this.director.cac,
        identity_type: this.director.identity_type || "Permanent Voters' Card",
        identity_number: this.form.doc_number,
        country_code: "NG",
        verification_route: "automated",
      };
    },
  },

  data() {
    return {
      form: {
        doc_number: "",
        bvn: "",
      },
    };
  },

  methods: {
    ...mapActions({
      verifyBusinessDirector: "auth/verifyBusinessDirector",
    }),

    async verifyDirector() {
      this.handleClick("save");
      try {
        const response = await this.verifyBusinessDirector(
          this.verfiyDocPayload
        );

        this.handleClick("save", "Verify", false);
        if (response?.code === 200) {
          this.pushToast(response.message, "success");

          this.$emit("saved", response.data);

          setTimeout(() => this.$emit("closeTriggered"), 3000);
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.pushToast("Failed to verify", "error");
        this.handleClick("save", "Verify", false);
        console.log("FAILED TO VERIFY DIRECTOR", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay.director-id-modal {
  .modal-cover-body {
    max-height: 65vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 2px;
    }
  }
}
</style>
