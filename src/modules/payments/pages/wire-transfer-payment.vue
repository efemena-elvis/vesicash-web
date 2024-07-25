<template>
  <div class="payment-layout">
    <div class="payment-card">
      <div class="h5-text grey-900">Complete your payment</div>
      <div
        class="skeleton-loader skeleton-loader__price mgy-10"
        v-if="loading_wire_account"
      ></div>
      <div class="h2-text green-600 mgy-10" v-else>$500,000</div>
      <div class="details-section">
        <div>
          <div class="details-card">
            <div class="success-card" v-if="submitted">
              <div class="check-wrapper"><CheckIcon /></div>
              <div class="h5-text grey-900 text-center" @click="paid = true">
                Your payment will be confirmed in about an hour
              </div>
            </div>
            <template v-else>
              <template v-if="loading_wire_account">
                <div
                  v-for="i in [1, 2, 3, 4, 5]"
                  :key="i"
                  class="skeleton-loader"
                ></div>
              </template>

              <template v-else>
                <div
                  class="detail-item"
                  v-for="item in details"
                  :key="item.name"
                >
                  <div>
                    <div class="grey-500 tertiary-1-text mgb-2">
                      {{ item.name }}
                    </div>
                    <div class="teal-800 secondary-1-text">
                      {{ item.value }}
                    </div>
                  </div>
                  <button @click="copyItem(item)" class="copy-btn">
                    <CopyIcon />
                  </button>
                  <div
                    :class="[
                      'copy-tag tertiary-2-text',
                      item.copied ? 'copy-tag__visible' : 'copy-tag__hidden',
                    ]"
                  >
                    Copied
                  </div>
                </div>
              </template>
            </template>
          </div>
          <button class="btn btn-md btn-teal w-100 mgy-40" @click="paid = true">
            I have made payment
          </button>
          <div class="alert-card mgt-0">
            <InfoAlertIcon />
            <div class="tertiary-2-text">
              Remember to fill the form on the right after you have made the
              transfer to help us verify your payment.
            </div>
          </div>
        </div>
        <div class="payment-form">
          <div
            :class="[
              'disable-layer',
              paid && !submitted && 'disable-layer__hidden',
            ]"
          ></div>
          <BasicInput
            label_title="Name of sender"
            label_id="SenderName"
            input_type="text"
            is_required
            placeholder="Name"
            :input_value="sender.name"
            @getInputState="setSenderField($event, 'name')"
            :error_handler="{
              type: 'required',
              message: 'Name is required',
            }"
          />
          <BasicInput
            label_title="Account number of sender"
            label_id="SenderAccountNumber"
            input_type="number"
            is_required
            placeholder="Account number"
            :input_value="sender.account_number"
            @getInputState="setSenderField($event, 'account_number')"
            :error_handler="{
              type: 'required',
              message: 'Account number is required',
            }"
          />
          <BasicInput
            label_title="Bank name"
            label_id="bankName"
            input_type="text"
            is_required
            placeholder="Bank name"
            :input_value="sender.bank_name"
            @getInputState="setSenderField($event, 'bank_name')"
            :error_handler="{
              type: 'required',
              message: 'Bank name is required',
            }"
          />

          <BasicInput
            label_title="Bank sort code"
            label_id="bankSortCode"
            input_type="text"
            is_required
            placeholder="Bank sort code"
            :input_value="sender.bank_sort_code"
            @getInputState="setSenderField($event, 'bank_sort_code')"
            :error_handler="{
              type: 'required',
              message: 'Bank sort code is required',
            }"
          />
          <div>
            <label for="payment-receipt" class="form-label"
              >Upload payment receipt</label
            >
            <label for="payment-receipt" class="upload-card">
              <div v-if="receipt" class="grey-600 tertiary-2-text">
                {{ receipt.original_name }}
              </div>
              <template v-else>
                <div
                  class="icon-spinner f-size-19 animate"
                  v-if="uploading"
                ></div>
                <FileIcon active v-else />
              </template>

              <div class="grey-900 secondary-2-text mgy-4">
                {{ receipt ? "Replace" : "Browse" }} file
              </div>
              <div class="grey-500 tertiary-2-text">
                You can upload a doc or a PDF file
              </div>
            </label>
            <input
              type="file"
              name="payment-receipt"
              id="payment-receipt"
              class="d-none"
              accept="image/*,.doc,.docx,.pdf"
              @change="handleFileUpload"
              ref="fileUpload"
            />
          </div>
          <button
            class="btn btn-md btn-teal w-100"
            :disabled="submitDisabled"
            @click="submitPayment"
            ref="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "EscrowPublicPayment",

  components: {
    CopyIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/copy-icon"
      ),
    InfoAlertIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/info-alert-icon"
      ),
    FileIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/file-icon"
      ),
    CheckIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/check-icon"
      ),
  },

  computed: {
    reference() {
      return this.$route.params.reference;
    },

    submitDisabled() {
      return (
        !this.sender.account_number ||
        !this.sender.bank_name ||
        !this.sender.name ||
        !this.receipt
      );
    },

    payload() {
      return {
        reference: this.reference,
        account_name: this.sender.name,
        account_number: this.sender.account_number,
        bank_name: this.sender.bank_name,
        sort_code: this.sender.bank_sort_code,
        receipt_url: this.receipt?.file_url,
      };
    },
  },

  mounted() {
    this.$utils.setPageBackgroundColor("#043b56");
    this.loadAccount();
  },

  data() {
    return {
      wire_account: null,
      loading_wire_account: false,
      paid: false,
      receipt: null,
      sender: {
        name: "",
        account_number: "",
        bank_name: "",
        bank_sort_code: "",
      },
      submitted: false,
      details: [
        {
          name: "Account number",
          value: "0159494476",
          copied: false,
        },
        {
          name: "Beneficiary",
          value: "Vesicash",
          copied: false,
        },
        {
          name: "Sort code",
          value: "45679",
          copied: false,
        },
        {
          name: "Bank name",
          value: "Guaranty Trust Bank",
          copied: false,
        },
      ],
      uploading: false,
    };
  },

  methods: {
    ...mapActions({
      upload: "general/uploadToCloud",
      fetchAccountDetails: "payments/fetchWireAccount",
      submitWirePayment: "payments/submitWirePayment",
    }),

    async loadAccount() {
      try {
        this.loading_wire_account = true;
        const response = await this.fetchAccountDetails(
          this.$route?.params?.reference
        );
        console.log({ response });
        this.loading_wire_account = false;
      } catch (e) {
        console.log("FAILED TO LOAD WIRE ACCOUNT", e);
        this.pushToast("Failed to load wire account", "error");
        this.loading_wire_account = false;
      }
    },

    resetItemCopyState() {
      this.details = this.details.map((item) => {
        item.copied = false;
        return item;
      });
    },

    async copyItem(item) {
      await navigator.clipboard.writeText(item.value);

      this.details = this.details.map((data) => {
        if (data.name === item.name) data.copied = true;
        return data;
      });

      setTimeout(() => {
        this.resetItemCopyState();
      }, 2000);
    },

    setSenderField({ value }, field) {
      this.sender[field] = value;
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

      const uploads = { files, id: "PAYMENT-RECIPTS" };

      const response = await this.upload(uploads);

      this.uploading = false;

      if (response.data?.length) {
        this.receipt = response.data?.[0];
      } else {
        this.pushToast("Failed to upload. retry", "warning");
      }

      this.$refs.fileUpload.value = "";
    },

    async submitPayment() {
      try {
        this.handleClick("submit");
        const _response = await this.submitWirePayment(this.payload);
        this.handleClick("submit", "Submit", false);
        const response = _response?.data || _response;
        const message = response?.data?.message || response?.message;
        if (response.code === 200) {
          this.pushToast(message, "success");
          this.submitted = true;
        } else {
          this.pushToast(message, "warning");
        }
      } catch (e) {
        this.handleClick("submit", "Submit", false);
        console.log("FAILED TO SUBMIT PAYMENT", e);
        this.pushToast("Failed to submit payment", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-card {
  background: getColor("neutral-10");
  border-radius: toRem(20);
  padding: toRem(30);
  width: toRem(1200);
  max-width: 98%;
  margin: toRem(24) auto;
}

.skeleton-loader {
  height: toRem(35);

  &__price {
    width: toRem(200);
    height: toRem(50);
  }
}

.success-card {
  display: grid;
  place-items: center;

  .check-wrapper {
    @include draw-shape(100);
    background: getColor("teal-800");
    display: grid;
    place-items: center;
    border-radius: 100%;
  }
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  position: relative;

  .disable-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    transition: background ease-in-out 0.25s;
    background: rgba(#000, 0.02);

    &__hidden {
      background-color: transparent;
      z-index: -1;
    }
  }
}

.upload-card {
  padding: toRem(20);
  border: toRem(1) dashed getColor("teal-500");
  border-radius: toRem(10);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.details-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: toRem(40);

  @include breakpoint-down(md) {
    grid-template-columns: 100%;
  }

  .details-card {
    border-radius: toRem(10);
    padding: toRem(15);
    border: toRem(1) getColor("grey-300") solid;
    display: grid;
    gap: toRem(16);
    min-height: toRem(265);

    .detail-item {
      @include flex-row-nowrap("space-between", "center");
      position: relative;

      .copy-btn {
        background: transparent;
      }

      .copy-tag {
        color: getColor("neutral-10");
        background: getColor("teal-700");
        padding: toRem(6) toRem(12);
        border-radius: toRem(6);
        position: absolute;
        left: 50%;
        top: 0;
        transition: all ease-in-out 0.25s;

        &__visible {
          transform: translate(-50%, -60%);
          opacity: 1;
        }
        &__hidden {
          transform: translate(-50%, -20%);
          opacity: 0;
        }
      }
    }
  }

  .alert-card {
    @include flex-row-nowrap("flex-start", "center");
    gap: toRem(10);
    padding: toRem(10);
    border: toRem(1) solid getColor("yellow-100");
    background: getColor("yellow-50");
    border-radius: toRem(8);
  }
}
</style>
