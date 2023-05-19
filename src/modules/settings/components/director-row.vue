<template>
  <div class="director-row mgb-20">
    <label for="" class="grey-900 mgb-8 secondary-2-text"
      >Director {{ rowKey + 1 }} document info</label
    >
    <div class="director-group">
      <div class="document-select">
        <DropSelectInput
          placeholder="Select document"
          :options="verification_docs"
          @selectedOption="selectDropdownOption($event)"
        />
      </div>

      <div class="document-id">
        <BasicInput
          label_title=""
          label_id="id"
          :input_value="form.doc_id"
          is_required
          placeholder="Enter document id"
          @getInputState="updateFormState($event, 'doc_id')"
          :error_handler="{
            type: 'required',
            message: 'Document id is required',
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BasicInput from "@/shared/components/form-comps/basic-input";
import DropSelectInput from "@/shared/components/drop-select-input";

export default {
  name: "DirectorRow",

  components: {
    BasicInput,
    DropSelectInput,
  },

  props: {
    rowKey: {
      type: Number,
    },
  },

  data() {
    return {
      form: {
        doc_id: "",
      },

      validity: {
        doc_id: true,
      },

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
          id: "national_id",
        },
      ],
    };
  },

  methods: {
    selectDropdownOption(value) {
      console.log(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.director-row {
  label {
  }

  .director-group {
    @include flex-row-between-wrap;
    align-items: flex-start;

    .document-select {
      width: 46%;
    }

    .document-id {
      width: 52%;
    }
  }
}
</style>