import { mapActions, mapGetters } from "vuex";

const MoRSummary = {
  computed: {
    ...mapGetters({ getWalletSize: "general/getWalletSize" }),

    getTransactionRevenue() {
      return this.wallet_revenue_metrics;
    },

    getTransactionVolume() {
      return this.wallet_transaction_volume;
    },
  },

  watch: {
    getWalletSize: {
      handler(value) {
        this.wallet_size = value.filter((wallet) => wallet.mor);

        this.wallet_size = this.wallet_size.map((wallet) => {
          return { ...wallet, metric_value: "0" };
        });

        this.wallet_revenue_metrics = this.wallet_size;
        this.wallet_transaction_volume = this.wallet_size;

        if (this.wallet_size.length) {
          this.fetchMoRSummary();
        }
      },
      immediate: true,
      deep: true,
    },
  },

  data() {
    return {
      loading: true,
      wallet_size: [],
      wallet_revenue_metrics: [],
      wallet_transaction_volume: [],
    };
  },

  created() {
    this.$bus.$on(
      "updateTransactionVolume",
      (data) => (this.wallet_transaction_volume = data)
    );
  },

  methods: {
    ...mapActions({
      getMoRTransactionSummary: "merchantDashboard/getMoRTransactionSummary",
    }),

    async fetchMoRSummary() {
      const response = await this.handleDataRequest({
        action: "getMoRTransactionSummary",
        payload: { account_id: this.getAccountId },
        alert_handler: {
          error: "Unable to fetch MoR summary",
          request_error: "Unable to fetch MoR summary",
        },
      });

      if (response.code === 200 && response.data.length) {
        this.wallet_revenue_metrics.map((wallet) => {
          let payload = response.data.find((w) => w.currency === wallet.short);

          if (payload !== -1) {
            wallet.metric_value = payload?.amount.toString() ?? "0.00";
          } else {
            wallet.metric_value = "0.00";
          }
        });
      }

      setTimeout(() => (this.loading = false), 1000);
    },
  },
};

export default MoRSummary;
