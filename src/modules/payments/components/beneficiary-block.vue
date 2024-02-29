
<template>
  <div class="beneficiary-block rounded-12 border-grey-200 mgb-48">
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="title-text primary-1-text grey-900">Beneficiaries</div>

      <router-link
        v-if="beneficiaries.length"
        to="payments/beneficiary-list"
        class="action-text btn-tertiary pdy-6 btn-sm smooth-transition rounded-8 link-no-underline secondary-2-text green-500 pointer btn-link"
      >
        View all
      </router-link>
    </div>

    <!-- BODY ROW -->
    <div class="body-row">
      <div class="body-row-loading" v-if="loading">
        <div
          class="loading-card skeleton-loader"
          v-for="(_, index) in 5"
          :key="index"
        ></div>
      </div>

      <template v-else>
        <div class="body-row-content" v-if="beneficiaries.length">
          <BeneficiaryCard
            v-for="(beneficiary, index) in beneficiaries"
            :key="index"
            :is_group="beneficiary.is_group"
            :beneficiary_name="beneficiary?.account_name ?? beneficiary?.name"
            :beneficiary_account="
              beneficiary?.account_no ?? beneficiary.number_of_recipients
            "
          />
        </div>

        <div class="body-row-empty" v-else>
          <UserIcon profileMenu />
          <div class="message grey-600 tertiary-2-text text-center">
            You have no saved beneficiaries
          </div>
        </div>
      </template>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <button class="btn btn-tertiary btn-md tsf-btn" @click="sendMoney">
        <img :src="loadImage('cash-icon.svg', 'dashboard')" alt="transfer" />
        <div class="text">Send Money</div>
      </button>

      <button
        class="btn btn-tertiary btn-md tsf-btn"
        @click="toggleBeneficiary"
      >
        <UserIcon />
        <div class="text">Add Beneficiary</div>
      </button>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_beneficiary_dialog">
        <NewBeneficiaryModal @closeTriggered="toggleBeneficiary" />
      </transition>
    </portal>
  </div>
</template>
  
<script>
import { mapActions } from "vuex";
import UserIcon from "@/shared/components/icon-comps/user-icon";
import BeneficiaryCard from "@/modules/payments/components/beneficiary-card";

export default {
  name: "BeneficiaryBlock",

  components: {
    UserIcon,
    BeneficiaryCard,
    NewBeneficiaryModal: () =>
      import(
        /* webpackChunkName: "payment-module" */ "@/modules/payments/modals/beneficiary-modal/new-beneficiary-modal"
      ),
  },

  data: () => ({
    show_beneficiary_dialog: false,
    loading: false,

    beneficiaries: [],
  }),

  mounted() {
    this.fetchUserBeneficiaries();
  },

  methods: {
    ...mapActions({
      fetchBankDetails: "dashboard/fetchBankDetails",
      fetchGroupAccounts: "settings/fetchGroupAccounts",
    }),

    toggleBeneficiary() {
      this.show_beneficiary_dialog = !this.show_beneficiary_dialog;
    },

    sendMoney() {
      this.$router.push("/payments/send-money");
    },

    async fetchUserBeneficiaries() {
      this.loading = true;

      const [single_beneficiaries, group_beneficiaries] = await Promise.all([
        this.handleDataRequest({
          action: "fetchBankDetails",
          payload: this.getAccountId,
          alert_handler: {
            error: "Unable to fetch user beneficiaries",
            request_error: "Unable to fetch user beneficiaries",
          },
        }),

        this.handleDataRequest({
          action: "fetchGroupAccounts",
          show_alert: false,
        }),
      ]);

      if (
        single_beneficiaries.code === 200 &&
        group_beneficiaries.code === 200
      ) {
        let single = single_beneficiaries?.data?.length
          ? single_beneficiaries.data.map((data) => ({
              ...data,
              is_group: false,
            }))
          : [];

        let group = group_beneficiaries?.data?.length
          ? group_beneficiaries.data.map((data) => ({
              ...data,
              is_group: true,
            }))
          : [];

        this.beneficiaries = this.$utils.sortByDate(
          [...single, ...group],
          "desc"
        );

        this.loading = false;
      }
    },
  },
};
</script>
  
<style lang="scss" scoped>
.beneficiary-block {
  @include flex-column("space-between", "space-between");
  padding: toRem(18) toRem(24);
  gap: toRem(18);

  .top-row {
    @include flex-row-nowrap("space-between", "flex-start");

    .action-text {
      &:hover {
        color: getColor("green-600");
      }
    }
  }

  .body-row {
    &-loading {
      @include flex-row-nowrap("flex-start", "center");
      gap: toRem(16);

      .loading-card {
        border-radius: toRem(10);
        width: toRem(200);
        height: toRem(60);
      }
    }

    &-content {
      @include flex-row-nowrap("flex-start", "center");
      position: relative;
      gap: toRem(16);
      overflow: overlay;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &-empty {
      @include flex-column("center", "center");
      gap: toRem(10);
    }
  }

  .bottom-row {
    @include flex-row-nowrap("flex-start", "center");
    margin-top: toRem(8);
    gap: toRem(16);

    button {
      img {
        position: relative;
        margin-left: toRem(-4);
        @include draw-shape(24);
      }

      .text {
        margin-left: toRem(8);
      }
    }
  }
}
</style>