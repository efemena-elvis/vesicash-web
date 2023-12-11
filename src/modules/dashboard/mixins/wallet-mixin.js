import { mapActions, mapGetters } from "vuex";
import foreign_currency from "@/utilities/currency";
import countries from "@/utilities/countries";

const WalletMixin = {
  computed: {
    ...mapGetters({ getWalletSize: "general/getWalletSize" }),
  },

  data: () => ({
    default_wallet: {
      short: "---",
      enabled: true,
    },

    wallet_balance: [...foreign_currency],
    loading_wallet: true,
  }),

  watch: {
    wallet_balance: {
      handler() {
        this.$bus.$emit("reload-mor-wallets");
      },
    },
  },

  mounted() {
    this.fetchUserWalletBalance();
  },

  methods: {
    ...mapActions({
      getWalletBalance: "dashboard/getWalletBalance",
      updateWalletListSize: "general/updateWalletListSize",
    }),

    // =============================================
    // SETUP ALL POSSIBLE USER WALLET TYPES
    // =============================================
    setupWalletSize(base_country) {
      let local_currency = countries.find(
        (country) => country.country === base_country
      );

      let base_currency = {
        id: 1,
        code: local_currency.code,
        sign: local_currency.currency.sign,
        short: local_currency.currency.short,
        long: local_currency.currency.long,
        description: local_currency.currency.description,
        default: true,
        enabled: true,
      };

      let base_escrow_currency = { ...base_currency };
      base_escrow_currency.id = 2;
      base_escrow_currency.short = `ESCROW_${base_currency.short}`;

      this.updateWalletListSize([
        base_currency,
        base_escrow_currency,
        ...foreign_currency,
      ]);
    },

    // =============================================
    // FETCH ALL WALLET BALANCE OF CURRENT USER
    // =============================================
    async fetchUserWalletBalance() {
      const response = await this.handleDataRequest({
        action: "getWalletBalance",
        payload: {
          account_id: +this.getAccountId,
        },
      });

      if (response?.code === 200) {
        this.loading_wallet = false;
        const base_local_country = response.data?.country ?? "Nigeria";

        if (this.getWalletSize.length === 0) {
          this.setupWalletSize(base_local_country);
        }

        let { wallets } = response?.data;

        this.getWalletSize.map((type) => {
          wallets.map((wallet) => {
            if (type.short === wallet.currency) {
              type.balance = wallet.available.toString() ?? "0.00";
            }
            // else if (type.short.includes("GBP")) {
            //   type.balance = "0.00";
            // }
          });
        });

        this.wallet_balance = this.getWalletSize;
        this.checkMoRWallets(wallets);
      }
    },

    // CHECK FOR MOR WALLETS
    checkMoRWallets(wallets) {
      let updated_mor_wallets = [];

      let mor_wallets = wallets.filter((wallet) =>
        wallet.currency.includes("MOR")
      );

      mor_wallets.map((wallet) => {
        const fetched_wallet = countries.find(
          (country) => country.currency.short === wallet.currency.split("_")[1]
        );

        if (fetched_wallet !== -1) {
          let wallet_payload = {
            id: wallet.id,
            balance: wallet.available?.toString() ?? "0",
            code: fetched_wallet.code,
            sign: fetched_wallet.currency.sign,
            short: fetched_wallet.currency.short,
            long: fetched_wallet.currency.long,
            description: fetched_wallet.currency.description,
            default: false,
            enabled: true,
            mor: true,
          };

          updated_mor_wallets.push(wallet_payload);
        }
      });

      updated_mor_wallets.map((wallet) => {
        const wallet_found = this.getWalletSize.some(
          (w) => w.short === wallet.short && w.mor
        );

        if (wallet_found === false) {
          this.updateWalletListSize([...this.getWalletSize, wallet]);
        }

        const in_wallet = this.getWalletSize.find((w) => w.id === wallet.id);

        if (typeof in_wallet !== "undefined") {
          in_wallet.balance = wallet?.balance?.toString() ?? "0.00";
        }
      });

      this.wallet_balance = this.getWalletSize;
    },
  },
};

export default WalletMixin;
