<template>
  <div class="txn-details">
    <div class="card">
      <BasicInput
        label_title="Transaction name"
        label_id="txn_name"
        :input_value="form.txn_name"
        input_type="text"
        is_required
        placeholder="Enter transaction name"
        @getInputState="updateFormState($event, 'txn_name')"
        :error_handler="{
          type: 'required',
          message: 'Enter transaction name',
        }"
      />
      <div>
        <div class="form-label">Select payment currency</div>

        <!-- SELECT INPUT FIELD -->
        <DropSelectInput
          placeholder="Currency"
          :options="currencies"
          :pre_select="configCurrency"
          @optionSelected="currency = $event"
        />
      </div>
    </div>

    <div class="card mgt-40">
      <div class="secondary-2-text dispute-title">
        How may any dispute be handled?
      </div>

      <RadioSelectCard
        label_id="vesicash_dispute"
        label_text="Vesicash handles dispute"
        card_name="dispute"
        :is_checked="dispute_handler == 'vesicash'"
        @checked="updateDisputeHandler('vesicash')"
      />

      <RadioSelectCard
        label_id="arbitrator_dispute"
        label_text="Arbitrator handles dispute"
        card_name="dispute"
        :is_checked="dispute_handler == 'arbitrator'"
        @checked="updateDisputeHandler('arbitrator')"
      />
    </div>

    <div class="grey-500 tertiary-2-text mgt-20" v-if="false">
      Note: Make sure your account is funded with the right amount for the
      escrow transaction before you click on Proceed. To fund, go to Dashboard
      on the side panel and click on Fund wallet.
    </div>

    <div class="mgt-20">
      <div class="secondary-2-text dispute-title mgb-10">
        Attach a contract or document (optional)
      </div>

      <div :class="['upload-card', uploading ? 'upload-card__disabled' : '']">
        <div v-if="agreementFiles.length" class="agreement-files">
          <div class="trash-wrapper" @click.stop="removeUploadedFiles">
            <div class="icon icon-trash"></div>
          </div>
          <div
            class="secondary-2-text grey-700 mb-1"
            v-for="file in agreementFiles"
            :key="file.original_name"
          >
            <FileIcon />
            {{ file.original_name }}
          </div>
        </div>

        <label v-else for="agreement-doc" class="d-block pointer">
          <div class="d-flex justify-content-center my-2">
            <div class="icon-spinner f-size-19 animate" v-if="uploading"></div>
            <FileIcon v-else />
          </div>

          <!-- TITLE TEXT -->
          <div class="title-text grey-900 primary-1-text text-center mgb-4">
            Click to upload agreement file
          </div>

          <!-- DESCRIPTION TEXT -->
          <div class="description-text tertiary-2-text grey-600 text-center">
            You can upload a doc or PDF file
          </div>
          <input
            type="file"
            name="agreement-doc"
            id="agreement-doc"
            class="d-none"
            accept="image/*,.doc,.docx,.pdf"
            @change="handleFileUpload"
            ref="fileUpload"
            multiple
          />
        </label>
      </div>
    </div>
    <button
      class="btn btn-md btn-primary mgt-40"
      :disabled="disabled || uploading"
      @click="proceed"
    >
      Proceed
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import countries from "@/utilities/countries";
import FileIcon from "../../../../shared/components/icon-comps/file-icon.vue";
export default {
  name: "EscrowDetailsPage",

  computed: {
    ...mapGetters({
      getTransactionConfig: "transactions/getTransactionConfig",
    }),

    agreementFiles() {
      return this.getTransactionConfig?.files || [];
    },

    isBuyer() {
      const initiator = this.getTransactionConfig?.parties?.find(
        (party) => party?.is_initiator
      );
      return initiator && initiator.role === "buyer";
    },

    currencies() {
      return countries.map((country) => ({
        ...country,
        id: country.code,
        name: `${country.currency.short} (${country.currency.sign})`,
      }));
    },

    configCurrency() {
      const config = this.getTransactionConfig;
      if (!config) return null;
      const currency = this.currencies?.find(
        (cc) => config.currency === cc.currency.short
      );
      return currency;
    },

    disabled() {
      return !this.form.txn_name || !this.currency || !this.dispute_handler;
    },
  },

  watch: {
    getTransactionConfig: {
      handler(config) {
        if (!config) return;
        this.form.txn_name = config?.title || "";
        this.dispute_handler = config?.dispute_handler;
        if (!this.currency) this.currency = this.configCurrency;
      },
      immediate: true,
    },
  },

  components: {
    RadioSelectCard: () =>
      import(
        /* webpackChunkName: "shared-module" */ "@/shared/components/card-comps/radio-select-card"
      ),
    FileIcon,
  },

  data() {
    return {
      currency: null,
      dispute_handler: null,
      form: {
        txn_name: "",
      },
      uploading: false,
    };
  },

  methods: {
    ...mapActions({
      upload: "general/uploadToCloud",
    }),

    processFileSize(size) {
      return size.toString().length >= 6
        ? `${(size / 1000000).toFixed(1)}mb`
        : `${(size / 1000).toFixed(1)}kb`;
    },

    async handleFileUpload(event) {
      const files = [...event?.target?.files];
      files.forEach((file) => {
        if (file?.size > 1048576) {
          this.pushToast("Upload a maximum file size of 1mb", "warning");
          this.$refs.fileUpload.value = "";
          return;
        }
      });

      this.uploading = true;

      const uploads = { files, id: "ESCROW-AGREEMENT-FILES" };

      const response = await this.upload(uploads);

      this.uploading = false;

      if (response.data?.length) {
        const {
          currency: { short },
        } = this.currency;
        const saved_config = this.getTransactionConfig;

        const updated_config = {
          ...saved_config,
          title: this.form.txn_name,
          description: this.form.txn_name,
          currency: short,
          dispute_handler: this.dispute_handler,
          files: response?.data?.map((item) => ({
            ...item,
            url: item.file_url,
          })),
        };

        this.UPDATE_TRANSACTION_CONFIG(updated_config);
      } else {
        this.pushToast("Failed to upload. retry", "warning");
      }

      this.$refs.fileUpload.value = "";
    },

    ...mapMutations({
      UPDATE_TRANSACTION_CONFIG: "transactions/UPDATE_TRANSACTION_CONFIG",
    }),

    removeUploadedFiles() {
      const saved_config = this.getTransactionConfig;
      const updated_config = {
        ...saved_config,
        files: [],
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },

    proceed() {
      const saved_config = this.getTransactionConfig;
      const {
        currency: { short },
      } = this.currency;

      const updated_config = {
        ...saved_config,
        title: this.form.txn_name,
        description: this.form.txn_name,
        currency: short,
        dispute_handler: this.dispute_handler,
      };

      this.UPDATE_TRANSACTION_CONFIG(updated_config);
      this.$router?.push("/escrow/disbursement-details");
    },

    updateDisputeHandler(handler) {
      this.dispute_handler = handler;
      // const saved_config = this.getTransactionConfig;
      // const updated_config = {
      //   ...saved_config,
      //   dispute_handler: handler,
      // };

      // this.UPDATE_TRANSACTION_CONFIG(updated_config);
    },
  },
};
</script>

<style lang="scss" scoped>
.txn-details {
  max-width: toRem(900);
  margin-top: toRem(40);
  padding-bottom: toRem(60);

  .card {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(toRem(352), 1fr));
    gap: toRem(30);
    border-radius: toRem(15);
    padding: toRem(20);
    border: toRem(1) solid getColor("grey-100");
  }
  .dispute-title {
    grid-column: 1/-1;
  }

  .upload-card {
    border-radius: toRem(15);
    padding: toRem(20);
    border: toRem(1) solid getColor("grey-100");
    display: block;
    cursor: pointer;
    transition: all ease-in-out 0.3s;

    svg {
      @include draw-shape(25);
      fill: getColor("grey-500");
    }

    .title-text {
      @include breakpoint-down(xs) {
        font-size: toRem(15.25);
      }
    }

    .description-text {
      @include breakpoint-down(xs) {
        font-size: toRem(13.5);
      }
    }
  }

  .upload-card__disabled {
    background-color: getColor("grey-10");
  }

  .agreement-files {
    position: relative;
    display: grid;
    gap: toRem(10);

    .trash-wrapper {
      display: grid;
      place-items: center;
      // @include draw-shape(40);
      border-radius: 50%;
      // background: getColor("red-500");
      position: absolute;
      right: toRem(-5);
      top: toRem(-5);

      .icon {
        color: getColor("red-500");
        font-size: 1.3rem;
        transition: color ease-in-out 0.3s;
        &:hover {
          color: getColor("red-600");
        }
      }
    }
  }
}
</style>
