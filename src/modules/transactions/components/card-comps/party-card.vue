<template>
  <div class="party-card">
    <div class="secondary-1-text span-full text-capitalize">
      {{ partyType }}
    </div>

    <div class="party-row span-full">
      <div
        class="span-full delete-party"
        @click="$emit('delete', party)"
        v-if="allow_delete"
      >
        Delete
      </div>
      <BasicInput
        label_title="Email"
        :label_id="party.user_id + '-email'"
        input_type="email"
        is_required
        placeholder="party@email.co"
        :input_value="party.email"
        @getInputState="setPartyField($event, 'email')"
        :error_handler="{
          type: 'email',
          message: 'Email is required',
        }"
        :class="[party_type !== 'broker' ? 'span-full' : '']"
        :is_disabled="party_disabled"
      />

      <BasicInput
        v-if="party_type === 'broker'"
        label_title="Broker share"
        label_id="percentage"
        input_type="number"
        placeholder="2%"
        :currency="`${party.percentage || '0'}%`"
        :input_value="party.percentage"
        :custom_style="{
          input_wrapper_style: 'form-prefix form-prefix-right',
        }"
        @getInputState="setPartyField($event, 'percentage')"
      />

      <!-- <BasicInput
        label_title="Phone"
        label_id="phone"
        input_type="number"
        placeholder="+2347044567809"
        :input_value="party.phone"
        @getInputState="setPartyField($event, 'phone')"
      />

      <BasicInput
        label_title="Full name"
        label_id="fullname"
        input_type="text"
        is_required
        placeholder="Greg Gallagher"
        :input_value="
          party.first_name || party.last_name
            ? `${party.first_name} ${party.last_name}`
            : ''
        "
        @getInputState="setPartyField($event, 'name')"
        :error_handler="{
          type: 'required',
          message: 'Party name is required',
        }"
      />
      <BasicInput
        label_title="Role Description"
        label_id="role_description"
        input_type="text"
        placeholder="Service buyer"
        :input_value="party.role_description"
        @getInputState="setPartyField($event, 'role_description')"
      /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "PartyCard",

  props: {
    party_type: {
      type: String,
      default: "seller",
    },
    party_detail: {
      type: Object,
      default: () => ({}),
    },
    allow_delete: {
      type: Boolean,
      default: false,
    },

    currency: {
      type: String,
      default: "NGN(₦)",
    },

    party_disabled: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    party_detail: {
      handler(detail) {
        if (detail) this.party = detail;
      },
      immediate: true,
    },
  },

  computed: {
    partyType() {
      if (this.party_type === "seller") return "Service provider";
      if (this.party_type === "buyer") return "Service recipent";
      return this.party_type;
    },
  },

  data() {
    return {
      party: null,
    };
  },

  methods: {
    setPartyField({ value }, field) {
      if (field === "name") {
        const first_name = value.split(" ")?.[0] || "";
        const last_name = value.split(" ")?.[1] || "";
        this.party.first_name = first_name;
        this.party.last_name = last_name;
        this.$emit("updated", this.party);
        return;
      }
      if (field === "percentage") {
        if (Number(value) < 0) {
          this.pushToast("Share cant be less than 0%", "warning");
          this.party[field] = 0;
          this.$emit("updated", this.party);
          return;
        }
        if (Number(value) > 100) {
          this.pushToast("Share cant be more than 100%", "warning");
          this.party[field] = 100;
          this.$emit("updated", this.party);
          return;
        }
      }
      this.party[field] = field === "percentage" ? Number(value) : value;
      this.$emit("updated", this.party);
    },
  },
};
</script>

<style lang="scss" scoped>
.party-card {
  display: grid;
  gap: toRem(25) toRem(30);
  grid-template-columns: repeat(auto-fill, minmax(toRem(310), 1fr));
  align-items: center;
  max-width: 100%;
  background: transparent;
  padding: toRem(20);
  border: toRem(1) solid getColor("grey-100");
  border-radius: toRem(20);
  position: relative;

  .broker-btn {
    max-width: max-content;
  }

  .span-full {
    grid-column: 1/-1;
  }

  .party-row {
    display: grid;
    gap: toRem(25) toRem(30);
    grid-template-columns: repeat(auto-fill, minmax(toRem(310), 1fr));
    align-items: center;
    position: relative;
  }

  .delete-party {
    font-size: 0.8rem;
    color: getColor("grey-700");
    text-decoration: underline;
    margin-bottom: toRem(-80);
    transition: all ease 0.25s;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;

    &:hover {
      color: getColor("red-400");
      text-decoration: none;
    }
  }
}
</style>
