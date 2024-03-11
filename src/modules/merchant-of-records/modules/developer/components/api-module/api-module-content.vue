<template>
  <div class="api-module">
    <div class="key-wrapper">
      <div class="key-loader skeleton-loader" v-if="generating_keys"></div>

      <div
        v-else
        class="keys tertiary-2-text"
        :class="[
          getAPIKeysDetails && !getAPIKeysDetails.is_live && 'revoked-key',
        ]"
      >
        {{ getAPIKeysDetails ? getAPIKeysDetails.public_key : "" }}
      </div>

      <button
        class="btn btn-sm btn-secondary"
        :class="[copied_key.public_key && 'copied-btn']"
        @click="copyAPIkeys('public_key')"
        :disabled="!getAPIKeysDetails"
      >
        <span v-if="copied_key.public_key">Keys Copied!</span>

        <template v-else>
          <span class="mgr-4">
            <CopyIcon />
          </span>
          <span>Copy public keys</span>
        </template>
      </button>
    </div>

    <div class="key-wrapper">
      <div class="key-loader skeleton-loader" v-if="generating_keys"></div>
      <div
        class="keys tertiary-2-text"
        :class="[
          getAPIKeysDetails && !getAPIKeysDetails.is_live && 'revoked-key',
        ]"
        v-else
      >
        {{ getAPIKeysDetails ? getAPIKeysDetails.private_key : "" }}
      </div>

      <button
        class="btn btn-sm btn-secondary"
        :class="[copied_key.private_key && 'copied-btn']"
        @click="copyAPIkeys('private_key')"
        :disabled="!getAPIKeysDetails"
      >
        <span v-if="copied_key.private_key">Keys Copied!</span>

        <template v-else>
          <span class="mgr-4">
            <CopyIcon />
          </span>
          <span>Copy private keys</span>
        </template>
      </button>
    </div>

    <button
      class="btn btn-md btn-alert generate-key-btn"
      ref="btnRef"
      :disabled="generating_keys"
      v-if="false"
    >
      Revoke keys
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import CopyIcon from "@/shared/components/icon-comps/copy-icon";

export default {
  name: "APIModuleContent",

  components: {
    CopyIcon,
  },

  computed: {
    ...mapGetters({
      getAPIKeys: "developer/getAPIKeys",
      getAPIKeysDetails: "developer/getAPIKeysDetails",
    }),
  },

  watch: {
    getAPIKeysDetails: {
      async handler(keys) {
        if (!keys) this.fetchTokenKeys();
        // else {
        //   if (keys.public_key.includes("v_staging")) {
        //     this.fetchTokenKeys(true);
        //   }
        // }
      },
      immediate: true,
    },
  },

  data() {
    return {
      api_keys: "26fhf4jf8key783920v56y",
      copied: false,
      copied_key: {
        private_key: false,
        public_key: false,
      },
      generating_keys: false,
    };
  },

  methods: {
    ...mapActions({
      generateAPIkeys: "developer/generateAPIkeys",
      fetchAPIkeys: "developer/fetchAPIkeys",
    }),

    async generateKeys() {
      this.generating_keys = true;

      const response = await this.handleDataRequest({
        action: "generateAPIkeys",
        payload: {
          account_id: this.getAccountId,
        },
        alert_handler: {
          success: "API keys generated successfully.",
          error: "Unable to generate API keys.",
          request_error: "Failed to generate API keys.",
          not_found_error: "Failed to generate API keys.",
        },
      });

      if (response) {
        this.generating_keys = false;
      }
    },

    async fetchTokenKeys(regenerate = false) {
      this.generating_keys = true;

      const response = await this.handleDataRequest({
        action: "fetchAPIkeys",
        payload: {
          regenerate,
        },
        show_alert: false,
        // alert_handler: {
        //   success: "API keys fetched successfully",
        //   error: "Failed to load API keys",
        //   request_error: "Failed to load API keys",
        //   not_found_error: "No API keys found, generate new keys.",
        // },
      });

      if (response) {
        this.generating_keys = false;
      }
    },

    async copyAPIkeys(type = "public_key") {
      await navigator.clipboard.writeText(this.getAPIKeysDetails[type]);
      this.copied_key[type] = true;

      setTimeout(() => (this.copied_key[type] = false), 2500);
    },
  },
};
</script>

<style lang="scss" scoped>
.api-module {
  .key-wrapper {
    @include flex-row-nowrap("flex-start", "center");
    margin-bottom: toRem(40);
    gap: toRem(16);

    @include breakpoint-custom-down(787) {
      @include flex-row-wrap("flex-start", "center");
    }

    .keys {
      min-width: toRem(368);
      max-width: toRem(368);
      min-height: toRem(42);
      padding: toRem(12) toRem(16);
      border: toRem(1) dashed getColor("green-500");
      border-radius: toRem(12);
      background: getColor("green-10");
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @include breakpoint-custom-down(787) {
        min-width: auto;
        width: 100%;
      }
    }

    .key-loader {
      width: toRem(350);
      height: toRem(42);
      border-radius: toRem(8);
    }

    .copied-btn {
      background-color: getColor("green-50") !important;
      border: toRem(1) dashed getColor("green-500");
      min-height: toRem(42);
      min-width: toRem(121.69);

      &:focus {
        background-color: getColor("green-50") !important;
      }
    }
  }
}
</style>
