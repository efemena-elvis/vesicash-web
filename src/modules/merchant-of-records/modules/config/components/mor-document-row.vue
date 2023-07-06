<template>
  <div class="document-row rounded-8">
    <div class="title-row secondary-2-text mgb-12 grey-900">
      MoR DOCUMENT FOR KENYA
    </div>

    <div class="bottom-row">
      <div class="left-section">
        <div class="title-text secondary-2-text grey-900 mgb-8">
          MoR doc for Kenya.pdf
        </div>

        <TagCard card_text="Pending upload" card_type="progress" />
      </div>

      <div class="right-section">
        <button
          class="btn btn-md btn-secondary"
          v-if="card_type === 'download'"
        >
          Download PDF
        </button>

        <button class="btn btn-md btn-secondary" v-if="card_type === 'upload'">
          Upload PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "MoRDocumentRow",

  components: {
    TagCard,
    ContractUploadCard: () =>
      import(
        /* webpackChunkName: "transactions-module" */ "@/modules/transactions/components/card-comps/contract-upload-card"
      ),
  },

  props: {
    card_type: {
      type: String,
    },
  },

  methods: {
    updateTransactionFile() {},

    removeUploadedFile() {},
  },
};
</script>

<style lang="scss" scoped>
.document-row {
  border: toRem(1) solid getColor("grey-200");
  background: rgba(getColor("grey-10"), 0.2);
  margin-bottom: toRem(16);
  padding: toRem(15);

  &:last-of-type {
    margin-bottom: 0;
  }

  .title-row {
    @include breakpoint-down(sm) {
      font-size: toRem(13);
    }
  }

  .bottom-row {
    @include flex-row-nowrap("space-between", "center");

    @include breakpoint-custom-down(400) {
      @include flex-column("flex-start", "flex-start");
      gap: toRem(20);
    }

    .btn {
      @include breakpoint-down(sm) {
        font-size: toRem(13.5);
      }
    }
  }
}
</style>
