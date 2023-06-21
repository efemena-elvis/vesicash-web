<template>
  <tr @click="viewTransactionDetails">
    <td class="body-data" :class="`${table_name}-1`">21st Apr 2022</td>

    <td class="body-data" :class="`${table_name}-2`">112450701</td>

    <td class="body-data" :class="`${table_name}-3`">Awobanga@gmail.com</td>

    <td class="body-data" :class="`${table_name}-4`">$430,000</td>

    <td class="body-data" :class="`${table_name}-5`">Master Card</td>

    <td class="body-data" :class="`${table_name}-6`">
      <TagCard card_text="Successful" card_type="success" />
    </td>

    <td class="body-data" :class="`${table_name}-7`">
      <button class="btn btn-secondary btn-sm">View</button>
    </td>
  </tr>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "MoRTransactionTableRow",

  components: {
    TagCard,
  },

  props: {
    table_name: {
      type: String,
      default: "",
    },

    data: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    viewTransactionDetails() {},
  },
};
</script>

<style lang="scss" scoped>
.transaction-table-row {
}
</style>
