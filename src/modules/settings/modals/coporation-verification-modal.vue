<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Company Registration</div>
        <div class="tertiary-2-text grey-600">
          Verify your company registration number
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <FormFieldInput
            label_title="Business registration number"
            label_id="doc-number"
            :input_value="getFormFieldValueMx(form, 'doc_number')"
            is_required
            prefix_value="RC"
            :custom_style="{ input_wrapper_style: 'form-prefix' }"
            placeholder="1234567"
            @getInputState="updateFormFieldMx($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter business registration number',
            }"
          />
        </div>

        <ContractUploadCard
          v-if="false"
          titleText="Select company registration document"
          @fileUploaded="uploaded_doc = $event"
          @clearTransactionFile="uploaded_doc = null"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100"
          :disabled="isDisabled"
          @click="verifyRC"
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
  name: "CoporationVerificationModal",

  components: {
    ModalCover,
  },

  computed: {
    isDisabled() {
      return this.validateFormFieldMx(this.form);
    },

    verfiyDocPayload() {
      let form_payload = this.getFormPayloadMx(this.form);

      return {
        type: form_payload.type,
        id: form_payload.doc_number,
        meta: form_payload.file_url,
      };
    },
  },

  watch: {
    // uploaded_doc: {
    //   handler(value) {
    //     if (Array.isArray(value)) {
    //       this.form.file_url = value[0].file_url;
    //     } else {
    //       this.form.file_url = value.file_url;
    //     }
    //   },
    // },
  },

  data() {
    return {
      uploaded_doc: null,

      form: {
        type: {
          validated: true,
          value: "cac",
        },
        doc_number: {
          validated: false,
          value: "",
        },
        file_url: {
          validated: true,
          value: "",
        },
      },

      validity: {
        doc_number: true,
      },
    };
  },

  mounted() {
    this.clearAttachedFile();
  },

  methods: {
    ...mapActions({
      clearAttachedFile: "general/clearAttachedFile",
      verfiyUserDocument: "settings/verfiyUserDocument",
      verifyRcNumber: "auth/verifyRcNumber",
    }),

    async verifyRC() {
      this.handleClick("save");

      try {
        const response = await this.verifyRcNumber(this.form.doc_number.value);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.$emit("saved", {
            data: response.data,
            rcn: this.form.doc_number.value,
          });
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to verify registration number", "error");
      }
    },

    async save() {
      this.handleClick("save");

      try {
        const response = await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.pushToast(
            "Your business registration number has been submitted",
            "success"
          );

          this.$emit(
            "saved",
            "Your business registration number has been submitted successfully"
          );

          setTimeout(() => this.$emit("closeTriggered"), 3000);
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to verify registration number", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: 6vh !important;
  max-height: 50vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }
}
</style>
