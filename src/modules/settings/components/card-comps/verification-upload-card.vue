<template>
  <div class="card rounded-12">
    <div class="icon-wrapper" :class="[uploaded && 'icon-wrapper--verified']">
      <CheckIcon v-if="uploaded" small />
      <slot v-else></slot>
    </div>

    <div class="secondary-2-text">
      {{ file_name ? file_name : title }}
    </div>
    <label class="btn btn-md btn-primary" :for="id" ref="uploadBtn"
      >Upload</label
    >
    <input
      type="file"
      :name="id"
      :id="id"
      class="d-none"
      accept="image/*,.doc,.docx,.pdf"
      @change="handleFileUpload"
      ref="fileUpload"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CheckIcon from "@/shared/components/icon-comps/check-icon";

export default {
  name: "FileUploadCard",

  props: {
    title: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "doc-upload",
    },
  },

  components: {
    CheckIcon,
  },

  data() {
    return {
      uploaded: false,
      file_name: "",
    };
  },

  methods: {
    ...mapActions({
      upload: "general/uploadToSpace",
    }),

    processFileSize(size) {
      return size.toString().length >= 6
        ? `${(size / 1000000).toFixed(1)}mb`
        : `${(size / 1000).toFixed(1)}kb`;
    },

    async handleFileUpload(files) {
      this.handleClick("uploadBtn");
      const [file] = files?.target?.files;
      if (file?.size > 1048576) {
        this.pushToast("Upload a maximum file size of 1mb", "warning");
        this.$refs.fileUpload.value = "";
        return;
      }
      const formatted_size = this.processFileSize(file.size);

      const uploads = { file, formatted_size };

      const response = await this.upload(uploads);

      response.data?.length
        ? this.$emit("uploaded", {
            url: response.data?.[0].file_url,
            name: file.name,
          })
        : this.pushToast("Failed to upload. retry", "warning");

      this.handleClick("uploadBtn", "Upload", false);
      this.$refs.fileUpload.value = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  border: toRem(1) solid getColor("grey-100");
  padding: toRem(14) toRem(16);
  gap: toRem(16);

  .icon-wrapper {
    @include draw-shape(48);
    @include flex-column("center", "center");
    background: getColor("teal-50");
    border-radius: 50%;
  }

  .icon-wrapper--verified {
    background: getColor("green-500");
  }
}
</style>
