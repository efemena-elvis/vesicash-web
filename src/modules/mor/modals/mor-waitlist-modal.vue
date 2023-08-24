<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    class="mor-waitlist-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Merchant of Record</div>
        <div class="tertiary-2-text grey-600">Create and manage your MOR</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group inline-group" v-if="false">
          <BasicInput
            label_title="First name"
            label_id="first-name"
            :input_value="form.first_name"
            is_required
            placeholder="Enter first name"
            @getInputState="updateFormState($event, 'first_name')"
            :error_handler="{
              type: 'minimum',
              minimum: 2,
              message: 'Name should be at least 2 characters long',
            }"
          />

          <BasicInput
            label_title="Last name"
            label_id="last-name"
            :input_value="form.last_name"
            is_required
            placeholder="Enter last name"
            @getInputState="updateFormState($event, 'last_name')"
            :error_handler="{
              type: 'minimum',
              minimum: 2,
              message: 'Name should be at least 2 characters long',
            }"
          />
        </div>

        <div class="form-group">
          <BasicInput
            label_title="Email address"
            label_id="email-address"
            :input_value="form.email_address"
            is_required
            placeholder="Enter email address"
            @getInputState="updateFormState($event, 'email_address')"
            :error_handler="{
              type: 'email',
              message: 'Enter a valid email address',
            }"
          />
        </div>

        <div class="form-group" v-if="false">
          <BasicInput
            label_title="Phone number"
            label_id="phoneNumber"
            input_type="number"
            :input_value="form.phone_number"
            is_phone_type
            is_required
            placeholder="Enter your phone number"
            :custom_style="{ input_wrapper_style: 'form-prefix' }"
            @getInputState="updateFormState($event, 'phone_number')"
            :error_handler="{
              type: 'minimum',
              minimum: 9,
              message: 'Enter a valid phone number',
            }"
          />
        </div>

        <div class="form-group">
          <div class="form-label">Expansion Country</div>
          <DropSelectInput
            placeholder="Select as applicable"
            @multiSelected="selectCountry($event)"
            :multi_options="countryOptions"
            multi
          />
        </div>

        <div class="form-group" v-if="false">
          <BasicInput
            label_title="Business Name"
            label_id="businessName"
            input_type="text"
            :input_value="form.business_name"
            is_required
            placeholder="Enter your business name"
            @getInputState="updateFormState($event, 'business_name')"
            :error_handler="{
              type: 'minimum',
              minimum: 4,
              message: 'Enter a business name',
            }"
          />
        </div>

        <div class="form-group">
          <div class="form-label">Business Category</div>
          <DropSelectInput
            placeholder="Select business category"
            @optionSelected="selectBusinessType($event)"
            :options="businessType"
            allow_search
            @searchItem="search_type = $event"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="save"
          class="btn btn-primary btn-md wt-100 mgt-10"
          :disabled="isDisabled"
          @click="joinMORWaitlist"
        >
          Get started
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "JoinWaitlistModal",

  props: {
    account: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    ModalCover,
  },

  computed: {
    ...mapGetters({
      getMorCountries: "mor/getMorCountries",
      getMorBusinessTypes: "mor/getMorBusinessTypes",
    }),

    countryOptions() {
      return [...this.getMorCountries]?.map((country) => ({
        ...country,
        selected: false,
      }));
    },

    businessType() {
      return [...this.getMorBusinessTypes]?.filter((option) =>
        option.name?.toLowerCase()?.includes(this.search_type?.toLowerCase())
      );
    },

    userPayload() {
      return {
        // firstname: this.form.first_name,
        // lastname: this.form.last_name,
        email_address: this.form.email_address,
        // phone_number: this.form.phone_number,
        // business_name: this.form.business_name,
        business_type_id: this.selected_business_type,
        country_id: this.selected_countries,
      };
    },

    isDisabled() {
      return (
        !this.form?.email_address ||
        !this.selected_countries?.length ||
        !this.selected_business_type
      );
    },
  },

  data() {
    return {
      selected_business_type: null,
      selected_countries: [],

      business_type_options: [
        { name: "Test 1", id: 1 },
        { name: "Test 2", id: 2 },
      ],

      country_options: [
        { name: "Nigeria", id: 1, selected: false },
        { name: "Liberia", id: 2, selected: false },
        { name: "Ghana", id: 3, selected: false },
        { name: "Slovenia", id: 4, selected: false },
        { name: "Russia", id: 5, selected: false },
      ],

      search_type: "",

      form: {
        // first_name: "",
        // last_name: "",
        email_address: "",
        // phone_number: "",
        // business_name: "",
      },

      validity: {
        // first_name: true,
        // last_name: true,
        email_address: true,
        // phone_number: true,
        // business_name: true,
      },
    };
  },

  methods: {
    ...mapActions({
      registerUser: "auth/registerUser",
      fetchConnectedUsers: "settings/fetchConnectedUsers",
      joinWaitlist: "mor/joinWaitlist",
    }),

    selectBusinessType(type) {
      this.selected_business_type = type.id;
    },

    selectCountry(countries) {
      this.selected_countries = countries
        ?.filter((ct) => ct.selected)
        ?.map((ct) => ct.id);
    },

    async joinMORWaitlist() {
      this.handleClick("save");

      try {
        const response = await this.joinWaitlist(this.userPayload);
        this.handleClick("save", "Join Waitlist", false);

        const type = response?.code === 200 ? "success" : "error";
        const message =
          response?.code === 200
            ? "A member of the team will reach out to fully onboard your business in the country of interest."
            : response.message;
        this.pushToast(message, type);

        if (response?.code === 200) this.$emit("closeTriggered");
      } catch (err) {
        console.log("ERROR ADDING USER", err);
        this.pushToast("Failed to join waitlist", "error");
        this.handleClick("save", "Join Waitlist", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.inline-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 toRem(16);
}
</style>

<style lang="scss">
.mor-waitlist-modal.modal-overlay {
  .modal-outer-container {
    top: toRem(10);
  }

  .drop-option-wrapper .inner-wrapper {
    padding: 5px 12px;
  }
}
</style>
