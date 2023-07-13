<template>
  <div class="director-row mgb-20">
    <label for="" class="grey-900 mgb-8 secondary-2-text"
      >Director {{ rowKey + 1 }} document info</label
    >
    <div class="director-group">
      <div class="document-select mgb-10">
        <DropSelectInput
          placeholder="Select document"
          :options="verification_docs"
          @selectedOption="selectDropdownOption($event)"
        />
      </div>

      <div class="document-id">
        <DocUploadCard
          @uploaded="uploaded_doc = $event"
          titleText="Select director document"
          docID="director_doc"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DirectorRow",

  components: {},

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
  .director-group {
  }
}
</style>
