<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Identity verification</div>
        <div class="tertiary-2-text grey-600">
          Select any available document type to verify.
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <div class="form-label">Select document type</div>

          <!-- SELECT INPUT FIELD -->
          <DropSelectInput
            placeholder="Choose verificatiom file"
            :options="verification_docs"
            @optionSelected="updateSelectedDocument"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_title="Document verification number"
            label_id="doc-number"
            :input_value="form.doc_number"
            is_required
            placeholder="Enter verification number"
            @getInputState="updateFormState($event, 'doc_number')"
            :error_handler="{
              type: 'required',
              message: 'Enter document verification number',
            }"
          />
        </div>

        <!-- <ContractUploadCard
          titleText="Select document to upload"
          @fileUploaded="uploaded_doc = $event"
          @clearTransactionFile="uploaded_doc = null"
        /> -->
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100 mgt-17"
          :disabled="isDisabled"
          @click="save"
        >
          Verify document
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "VerificationDocModal",

  components: {
    ModalCover,
  },

  props: {
    is_director_type: {
      type: Boolean,
      default: false,
    },

    director_count: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    ...mapGetters({
      getFileData: "general/getFileData",
      getAllFilesData: "general/getAllFilesData",
    }),

    isDisabled() {
      return (this.form.type && this.form.doc_number) || this.form.file_url
        ? false
        : true;
    },

    verfiyDocPayload() {
      return {
        type: this.form.type,
        id: this.form.doc_number,
        meta: this.form.file_url,
      };
    },
  },

  watch: {
    uploaded_doc: {
      handler(value) {
        if (Array.isArray(value)) {
          this.form.file_url = value[0].file_url;
        } else {
          this.form.file_url = value.file_url;
        }
      },
    },
  },

  data() {
    return {
      verification_docs: [
        {
          name: "National ID",
          id: "nin",
        },
        // {
        //   name: "Passport",
        //   id: "passport",
        // },
        // {
        //   name: "Driver License",
        //   id: "drivers_license",
        // },
      ],

      uploaded_doc: null,

      form: {
        type: "",
        doc_number: "",
        file_url: "",
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
    }),

    updateSelectedDocument(document) {
      if (this.is_director_type) {
        this.form.type = `director@${document.id}@${this.director_count}`;
      } else this.form.type = document.id;
    },

    async save() {
      this.handleClick("save");

      try {
        const response = await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.pushToast(response.message, "success");
          if (this.is_director_type) {
            this.$emit("saved");
          } else
            this.$emit("saved", "Your document has been uploaded successfully");

          setTimeout(() => this.$emit("closeTriggered"), 3000);
        } else {
          this.pushToast(response.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to verify document", "error");
      }
    },
  },
};
</script>

<style lang="scss">
.modal-overlay.doc-verification-overlay {
  .modal-cover-body {
    max-height: 65vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 2px;
    }
  }
}
</style>
