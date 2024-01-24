import { mapActions, mapMutations } from "vuex";
import { serviceStorage } from "@/shared/services";

const SnapshotMixin = {
  created() {
    // FETCH SNAPSHOT FROM LOCALSTORAGE AFTER APP RELOADS
    this.getSnapshots();
  },

  beforeMount() {
    window.addEventListener("beforeunload", this.takeSnapshots);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.takeSnapshots);
    });
  },

  data() {
    return {
      snaps: [
        {
          name: "app_onboarding",
          value: "getOnboardingState",
          type: "object",
          action: "updateOnboardingState",
        },

        {
          name: "mor_merchant",
          value: "isMoRSetupEnabled",
          type: "string",
          action: "updateMerchantState",
        },
      ],
    };
  },

  methods: {
    ...mapActions({
      updateMerchantState: "general/updateMerchantState",
      updateOnboardingState: "general/updateOnboardingState",
    }),

    ...mapMutations({
      UPDATE_TAX_RATE: "merchantTransactions/UPDATE_TAX_RATE",
    }),

    takeSnapshots() {
      this.snaps.map((snap) => {
        serviceStorage.setStorage({
          storage_name: snap.name,
          storage_value: this[snap?.value],
          storage_type: snap.type,
        });
      });
    },

    getSnapshots() {
      this.snaps.map((snap) => {
        let snap_cache = serviceStorage.getStorage({
          storage_name: snap.name,
          storage_type: snap.type,
        });

        if (snap_cache) {
          this[snap.action](snap_cache);
          // serviceStorage.removeStorage(snap.name);
        }
      });
    },
  },
};

export default SnapshotMixin;
