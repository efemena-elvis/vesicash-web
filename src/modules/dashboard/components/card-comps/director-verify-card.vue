<template>
  <div class="director-verify-card row">
    <div class="col-12 col-md-4">
      <div class="title secondary-2-text grey-900">Director 1</div>
    </div>

    <div class="col-12 col-md-8">
      <!-- SELECT INPUT FIELD -->
      <!-- <div class="form-label">Select document type</div> -->

      <DropSelectInput
        placeholder="Choose document file"
        :options="verification_docs"
        @optionSelected="updateSelectedDocument"
      />

      <div class="form-group mgt-24">
        <!-- label_title="Document registration number" -->
        <BasicInput
          label_id="doc-number"
          :input_value="form.doc_number"
          is_required
          placeholder="Enter document registration number"
          @getInputState="updateFormState($event, 'doc_number')"
          :error_handler="{
            type: 'required',
            message: 'Enter document registration number',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "directorVerifyCard",

  data() {
    return {
      verification_docs: [
        {
          name: "Passport",
          id: "passport",
        },
        {
          name: "Driver License",
          id: "drivers_license",
        },
        {
          name: "National ID",
          id: "nin",
        },
      ],

      uploaded_doc: null,

      form: {
        type: "",
        doc_number: "",
        file_url: "",
      },
    };
  },

  methods: {
    updateSelectedDocument(document) {
      this.form.type = document.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.director-verify-card {
}
</style>
