<template>
  <div>
    <!-- PAGE TITLE -->
    <div class="page-title primary-1-text grey-900 mgb-4">Account</div>

    <!-- PAGE META -->
    <div class="page-meta tertiary-2-text grey-600">
      Update or add new transfer bank accounts
    </div>

    <div class="mgb-20">
      <TabSwitcher :tabs="tab_options" @tabSelected="account_type = $event" />
    </div>

    <!-- FILTER ROW SECTION -->
    <div class="filter-row-section mgt-32" v-if="false">
      <div class="form-group">
        <BasicInput
          label_title=""
          label_id="search"
          :input_value="form.search_filter"
          placeholder="Search account or bank name"
          @getInputState="updateFormState($event, 'search_filter')"
        />
      </div>

      <div class="form-group">
        <DropSelectInput
          placeholder="Filter by currency"
          :options="currency_options"
          @selectedOption="selectDropdownOption('currency', $event)"
        />
      </div>
    </div>

    <div class="accounts-container">
      <template v-if="loading_accounts">
        <div
          class="skeleton-loader account-skeleton"
          v-for="i in 4"
          :key="i"
        ></div>
      </template>

      <template v-else>
        <div class="add-account-button" @click="toggleAccountCurrencySelection">
          <span class="icon icon-plus h5 green-600"></span>
          <div class="green-600 secondary-2-text">Add new account details</div>
        </div>

        <UserAccountCard
          v-for="(account, index) in getSelectedAccount"
          :key="index"
          :account="account"
          @click="showAccountDetails"
        />
      </template>
    </div>

    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_new_local_account_modal">
        <AddLocalAccountModal
          :account_type="account_type"
          :selected_currency="selected_currency"
          @closeTriggered="toggleNewLocalAccountModal"
          @saved="showSuccessModal('show_new_local_account_modal', $event)"
        />
      </transition>

      <transition name="fade" v-if="show_new_wallet_modal">
        <AddWalletAccountModal
          :account_type="account_type"
          @closeTriggered="toggleNewWalletModal"
          @saved="showSuccessModal('show_new_wallet_modal', $event)"
        />
      </transition>

      <transition name="fade" v-if="show_select_account_modal">
        <SelectAccountCurrencyModal
          @closeTriggered="toggleAccountCurrencySelection"
          @selectCurrency="toggleNewAccountModal"
        />
      </transition>

      <transition name="fade" v-if="show_new_foreign_account_modal">
        <AddForeignAccountModal
          @closeTriggered="toggleNewForeignAccountModal"
          @saved="showSuccessModal('show_new_foreign_account_modal', $event)"
        />
      </transition>

      <transition name="fade" v-if="show_update_foreign_account_modal">
        <UpdateDollarAccountModal
          @closeTriggered="toggleUpdateForeignAccountModal"
          :savedDetails="selected_account"
          @saved="showSuccessModal('show_update_foreign_account_modal', $event)"
        />
      </transition>

      <transition name="fade" v-if="show_local_account_details_modal">
        <AccountDetailsModal
          @closeTriggered="toggleLocalAccountDetailsModal"
          :account="selected_account"
          @edit="editForeignAccount"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <SuccessModal
          @closeTriggered="toggleSuccessModal"
          @done="toggleSuccessModal"
          :message="response_message"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TabSwitcher from "@/shared/components/util-comps/tab-switcher";
import AddLocalAccountModal from "@/modules/settings/modals/add-local-account-modal";
import AddWalletAccountModal from "@/modules/settings/modals/add-wallet-account-modal";
import AddForeignAccountModal from "@/modules/settings/modals/add-foreign-account-modal";

import SelectAccountCurrencyModal from "@/modules/settings/modals/select-account-currency-modal";
import UpdateDollarAccountModal from "@/modules/settings/modals/update-dollar-account-modal";
import UserAccountCard from "@/shared/components/card-comps/user-account-card";
import AccountDetailsModal from "@/modules/settings/modals/account-details-modal";
import SuccessModal from "@/shared/modals/success-modal";

export default {
  name: "AccountSettings",

  components: {
    TabSwitcher,
    AddWalletAccountModal,
    AddLocalAccountModal,
    AddForeignAccountModal,
    UpdateDollarAccountModal,
    SelectAccountCurrencyModal,
    UserAccountCard,
    AccountDetailsModal,
    SuccessModal,
  },

  computed: {
    ...mapGetters({
      getAccounts: "settings/getAccounts",
      getWalletSize: "general/getWalletSize",
    }),

    getSelectedAccount() {
      return this.getAccounts.filter(
        (account) => account.category === this.account_type
      );
    },
  },

  data() {
    return {
      tab_options: [
        {
          name: "Settlement accounts",
          value: "settlement",
          active: true,
        },
        {
          name: "3rd party accounts",
          value: "third_party",
          active: false,
        },
        {
          name: "Vesicash account Ids",
          value: "wallet",
          active: false,
        },
      ],

      currency_options: [],

      form: {
        search_filter: "",
      },

      validity: {
        search_filter: "",
      },

      account_type: "settlement",
      selected_account: null,

      show_success_modal: false,
      show_select_account_modal: false,
      show_new_local_account_modal: false,
      show_new_foreign_account_modal: false,
      show_new_wallet_modal: false,

      show_local_account_details_modal: false,
      show_update_foreign_account_modal: false,
      loading_accounts: false,

      response_message: "",
      selected_currency: {},
    };
  },

  async mounted() {
    this.loadWalletCurrencyOptions();

    this.loading_accounts = true;
    await this.fetchUserBanks();
    this.loading_accounts = false;
  },

  methods: {
    ...mapActions({ fetchAllBanks: "settings/fetchAllBanks" }),

    async fetchUserBanks() {
      await this.fetchAllBanks(this.getAccountId);
    },

    loadWalletCurrencyOptions() {
      this.getWalletSize
        .filter((wallet) => wallet.enabled && !wallet.short.includes("ESCROW"))
        .map((wallet_type) => {
          this.currency_options.push({
            id: wallet_type.id,
            name: `${wallet_type.long} wallet (${wallet_type.short})`,
            slug: wallet_type.long.toLowerCase(),
            short: wallet_type.short,
            country: wallet_type.code.toUpperCase(),
          });
        });
    },

    // SELECT OPTION FROM OPTION LIST
    selectDropdownOption(type, value) {
      console.log(type, value);
    },

    toggleAccountCurrencySelection() {
      if (this.account_type === "wallet") this.toggleNewWalletModal();
      else this.show_select_account_modal = !this.show_select_account_modal;
    },

    toggleNewLocalAccountModal() {
      this.show_new_local_account_modal = !this.show_new_local_account_modal;
    },

    toggleNewWalletModal() {
      this.show_new_wallet_modal = !this.show_new_wallet_modal;
    },

    toggleNewForeignAccountModal() {
      this.show_new_foreign_account_modal =
        !this.show_new_foreign_account_modal;
    },

    toggleUpdateForeignAccountModal() {
      this.show_update_foreign_account_modal =
        !this.show_update_foreign_account_modal;
    },

    toggleNewAccountModal(currency) {
      this.toggleAccountCurrencySelection();
      this.selected_currency = currency;

      if (currency.short === "USD") this.toggleNewForeignAccountModal();
      else this.toggleNewLocalAccountModal();
    },

    toggleLocalAccountDetailsModal() {
      this.show_local_account_details_modal =
        !this.show_local_account_details_modal;
    },

    editForeignAccount() {
      this.show_local_account_details_modal = false;
      this.toggleUpdateForeignAccountModal();
    },

    toggleSuccessModal() {
      this.show_success_modal = !this.show_success_modal;
    },

    showAccountDetails(account) {
      this.selected_account = account;
      this.toggleLocalAccountDetailsModal();
    },

    showSuccessModal(modal, message) {
      this[modal] = false;
      this.response_message = message;
      this.show_success_modal = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin card-size {
  width: toRem(352);

  @include breakpoint-custom-down(800) {
    width: toRem(342);
  }
  @include breakpoint-custom-down(790) {
    width: toRem(332);
  }
  @include breakpoint-custom-down(771) {
    width: 100%;
  }
}

.page-meta {
  padding-bottom: toRem(24);
  border-bottom: toRem(0.5) solid getColor("grey-200");
  margin-bottom: toRem(32);
}

.accounts-container {
  position: absolute;
  width: calc(100% - 70px);
  @include flex-row-wrap("flex-start", "flex-end");
  gap: toRem(32);
  margin-top: toRem(12);
  padding-bottom: toRem(150);

  @include breakpoint-down(lg) {
    width: calc(100% - 50px);
  }

  @include breakpoint-down(sm) {
    width: calc(100% - 30px);
  }

  .add-account-button {
    @include flex-column("center", "center");
    @include card-size;
    padding: toRem(14);
    border: toRem(1) solid getColor("grey-100");
    border-radius: toRem(12);
    transition: background ease-in-out 0.3s;
    cursor: pointer;

    &:hover {
      background: getColor("grey-10");
    }
  }

  .account-skeleton {
    border-radius: toRem(12);
    @include card-size;
    height: toRem(65);
  }
}

.filter-row-section {
  @include flex-row-wrap("space-between", "center");

  .form-group {
    width: toRem(340);

    @include breakpoint-down(xs) {
      width: 100%;
    }
  }
}
</style>
