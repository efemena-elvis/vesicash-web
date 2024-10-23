<template>
  <div class="document-card" @click="open = !open">
    <div :class="['icon-wrapper', saved ? 'icon-wrapper__pending' : '']">
      <div class="icon icon-info alert-icon h5-text" v-if="saved"></div>
      <component :is="docConfig.icon" active v-else />
    </div>
    <div class="trigger">
      <div class="secondary-2-text">
        {{ docConfig?.title }}
      </div>
      <div class="tertiary-2-text grey-500 mgt-4" v-if="saved">
        Pending verification
      </div>
    </div>
    <div
      :class="[
        'icon icon-caret-right h4-text caret',
        open && !saved ? 'caret__open' : '',
      ]"
    ></div>
    <div class="form-wrapper" v-show="open && !saved" @click.stop>
      <input
        type="text"
        class="form-control"
        :placeholder="docConfig.placeholder"
        v-model="doc_number"
      />
      <div v-if="type === 'bvn'" class="mgy-20">
        <label for="BVN-DOB" class="form-label">Date of birth</label>
        <input type="date" id="BVN-DOB" v-model="dob" class="form-control" />
      </div>

      <div
        :class="[
          'upload-card mgy-30',
          uploading ? 'upload-card__disabled' : '',
        ]"
        v-else
      >
        <div v-if="uploaded_files.length" class="agreement-files">
          <div class="trash-wrapper" @click.stop="removeFile">
            <div class="icon icon-trash"></div>
          </div>
          <div
            class="secondary-2-text grey-700 mb-1"
            v-for="file in uploaded_files"
            :key="file.original_name"
          >
            <FileIcon />
            {{ file.original_name }}
          </div>
        </div>

        <label
          v-else
          :for="`supporting-doc-for-${type}`"
          class="d-block pointer"
        >
          <div class="d-flex justify-content-center my-2">
            <div class="icon-spinner f-size-19 animate" v-if="uploading"></div>
            <FileIcon v-else active />
          </div>

          <!-- TITLE TEXT -->
          <div class="title-text grey-900 primary-1-text text-center mgb-4">
            Click to upload supporting document
          </div>

          <!-- DESCRIPTION TEXT -->
          <div class="description-text tertiary-2-text grey-600 text-center">
            You can upload a doc or PDF file
          </div>
          <input
            type="file"
            name="supporting-doc"
            :id="`supporting-doc-for-${type}`"
            class="d-none"
            accept="image/*,.doc,.docx,.pdf"
            @change="handleFileUpload"
            ref="fileUpload"
          />
        </label>
      </div>
      <div class="action-row">
        <button
          class="btn btn-md btn-primary ml-auto"
          ref="save"
          :disabled="disabled"
          @click="save"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VerificationUploadCard from "./verification-upload-card.vue";
import { mapActions } from "vuex";
export default {
  name: "DocumentVerificationCard",

  props: {
    type: {
      type: String,
      default: "national_id",
    },
    title: {
      type: String,
      default: "Government issued identity",
    },
    uploaded: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BusinessIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/business-icon"
      ),
    BvnIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/bvn-icon"
      ),
    FileIcon: () =>
      import(
        /* webpackChunkName: 'shared-module' */ "@/shared/components/icon-comps/file-icon"
      ),
    VerificationUploadCard,
  },

  watch: {
    uploaded: {
      handler(state) {
        if (state) this.saved = state;
      },
      immediate: true,
    },
  },

  computed: {
    docConfig() {
      const type = this.type;
      switch (type) {
        case "national_id":
          return {
            title: "Government issued identity",
            icon: "FileIcon",
            placeholder: "Enter Government ID number",
          };
        case "cac":
          return {
            title: "Business registration",
            icon: "BusinessIcon",
            placeholder: "Enter business registration number",
          };

        case "tin":
          return {
            title: "Tax identification",
            icon: "BvnIcon",
            placeholder: "Enter tax identification number",
          };
        case "bvn":
          return {
            title: "Bank verification number",
            icon: "BvnIcon",
            placeholder: "Enter your BVN",
          };

        default:
          return {
            icon: "BusinessIcon",
            placeholder: "Enter business registration number",
          };
      }
    },

    verfiyDocPayload() {
      return {
        type: this.type,
        id: this.doc_number,
        meta: this.uploaded_files?.[0]?.file_url,
      };
    },

    bvnPayload() {
      return {
        bvn: this.doc_number,
        dob: this.dob,
        // account_id: this.getAccountId,
      };
    },

    disabled() {
      return this.type === "bvn"
        ? !this.bvnPayload.bvn || !this.bvnPayload.dob
        : !this.verfiyDocPayload?.id || !this.verfiyDocPayload?.meta;
    },
  },

  data() {
    return {
      uploaded_files: [],
      uploading: false,
      doc_number: "",
      saved: false,
      open: false,
      dob: null,
    };
  },
  methods: {
    ...mapActions({
      upload: "general/uploadToCloud",
      verfiyUserDocument: "settings/verfiyUserDocument",
      verfiyUserBVN: "settings/verfiyUserBVN",
    }),

    removeFile() {
      this.uploaded_files = [];
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

      const uploads = { files, id: "DOC-SUPPORTING-FILE" };

      const response = await this.upload(uploads);

      this.uploading = false;

      if (response.data?.length) {
        this.uploaded_files = response?.data;
      } else {
        this.pushToast("Failed to upload. retry", "warning");
      }

      this.$refs.fileUpload.value = "";
    },

    async save() {
      this.saved = false;
      this.handleClick("save");

      try {
        const response =
          this.type === "bvn"
            ? await this.verfiyUserBVN(this.bvnPayload)
            : await this.verfiyUserDocument(this.verfiyDocPayload);

        this.handleClick("save", "Submit", false);

        if (response?.code === 200) {
          this.pushToast(response?.message, "success");
          this.$emit("saved", this.type);
          this.saved = true;
        } else {
          this.pushToast(response?.data?.message || response?.message, "error");
        }
      } catch (err) {
        this.handleClick("save", "Submit", false);
        this.pushToast("Failed to submit verification", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.document-card {
  padding: toRem(20);
  border-radius: toRem(12);
  border: toRem(1) solid getColor("grey-200");
  display: grid;
  grid-template-columns: toRem(60) 1fr toRem(20);
  gap: toRem(30) toRem(10);
  align-items: center;

  .trigger {
    cursor: pointer;
  }

  .alert-icon {
    color: white;
  }

  .caret {
    transition: transform ease 0.35s;
  }

  .caret__open {
    transform: rotate(90deg);
  }

  .icon-wrapper {
    @include draw-shape(50);
    background-color: getColor("teal-50");
    border-radius: 50%;
    display: grid;
    place-items: center;
  }

  .icon-wrapper__pending {
    background: getColor("yellow-500");
  }

  .form-wrapper {
    grid-column: 1/-1;
  }

  .upload-card {
    border-radius: toRem(15);
    padding: toRem(20);
    border: toRem(1) dotted getColor("grey-100");
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

  .action-row {
    grid-column: 1/-1;
    display: flex;
    justify-content: end;
  }
}
</style>
