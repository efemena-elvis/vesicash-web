<template>
  <tr>
    <td class="body-data" :class="`${table_name}-1`">{{ index + 1 }}</td>

    <td class="body-data" :class="`${table_name}-2`">
      {{ data.country_data.name }} MoR Contract
    </td>

    <td class="body-data" :class="`${table_name}-3`">
      <TagCard
        :card_text="getSignedState.text"
        :card_type="getSignedState.theme"
      />
    </td>

    <td class="body-data" :class="`${table_name}-4`">
      <button class="btn btn-secondary btn-sm" @click="toggleMoRContract">
        {{ contractIsSigned }}
      </button>
    </td>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_mor_contract">
        <MoRContractModal
          :country_data="data"
          @closeTriggered="toggleMoRContract"
        />
      </transition>
    </portal>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "MoRDocumentTableRow",

  components: {
    TagCard,
    MoRContractModal: () =>
      import(
        /* webpackChunkName: "MoR-module" */
        "@/modules/merchant-of-records/modules/config/modals/mor-contract-modal"
      ),
  },

  computed: {
    contractIsSigned() {
      const isSigned = ["pending", "verified"].includes(this.data.status);
      return isSigned ? "View Contract" : "View and Sign";
    },

    getSignedState() {
      if (this.data.status === "unsigned")
        return {
          text: "Not signed",
          theme: "stale",
        };
      else if (this.data.status === "pending")
        return {
          text: "Signed - awaiting verification",
          theme: "okay",
        };
      else if (this.data.status === "verified")
        return {
          text: "Verified",
          theme: "success",
        };
      else
        return {
          text: "Not verified",
          theme: "error",
        };
    },
  },

  props: {
    index: {
      type: Number,
    },

    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      show_mor_contract: false,
    };
  },

  methods: {
    toggleMoRContract() {
      this.show_mor_contract = !this.show_mor_contract;
    },
  },
};
</script>

<style lang="scss" scoped></style>
