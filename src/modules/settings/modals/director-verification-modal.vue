<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title h5-text">Director information</div>

        <div class="modal-cover-meta">
          Select number of business directors and enter their verification
          details.
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="mgb-24">
          <div class="form-label">Select number of director(s)</div>

          <DropSelectInput
            placeholder="Select number of directors"
            :options="directorsRange"
            @selectedOption="director_count = $event"
          />
        </div>

        <!-- DIRECTORS SECTION -->
        <div class="director-section" v-if="director_count > 0">
          <DirectorRow
            v-for="(_, index) in director_count"
            :key="index"
            :rowKey="index"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100">Submit</button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import DropSelectInput from "@/shared/components/drop-select-input";
import DirectorRow from "@/modules/settings/components/director-row";

export default {
  name: "FundWalletEntryModal",

  components: {
    ModalCover,
    DropSelectInput,
    DirectorRow,
  },

  computed: {
    directorsRange() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => ({
        name: `${i} ${i > 1 ? "Directors" : "Director"}`,
        id: i,
      }));
    },

    getCurrencyOptions() {
      return this.payment_type.slug === "transfer"
        ? this.currency_options.slice(0, 1)
        : this.currency_options;
    },
  },

  data() {
    return {
      director_count: 0,
      director_data: [],
    };
  },

  methods: {
    ...mapActions({}),
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  min-height: toRem(100);
  height: auto;

  .director-section {
    max-height: 50vh;
    overflow: auto;
  }
}
</style>