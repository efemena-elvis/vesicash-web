<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
    class="mor-waitlist-modal"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Merchants of Records</div>
        <div class="tertiary-2-text grey-600">Create and manage your MOR</div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group inline-group">
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

        <div class="form-group">
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
          <div class="form-label">Country</div>
          <DropSelectInput
            placeholder="Choose one or more country"
            @multiSelected="selectCountry($event)"
            :multi_options="country_options"
            multi
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
        >
          Join Waitlist
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/modal-cover";
import BasicInput from "@/shared/components/form-comps/basic-input";
import DropSelectInput from "@/shared/components/drop-select-input";

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
    BasicInput,
    DropSelectInput,
  },

  computed: {
    businessType() {
      return [...this.business_type_options]?.filter((option) =>
        option.name?.toLowerCase()?.includes(this.search_type?.toLowerCase())
      );
    },

    userPayload() {
      return {
        business_id: this.getAccountId,
        // account_type: "business",
        firstname: this.form.first_name,
        lastname: this.form.last_name,
        email_address: this.form.email_address,
        phone_number: this.form.phone_number,
        password: this.form.password,
      };
    },

    isDisabled() {
      return Object.values(this.validity).some((valid) => valid);
    },
  },

  data() {
    return {
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
        first_name: "",
        last_name: "",
        email_address: "",
        phone_number: "",
      },

      validity: {
        first_name: true,
        last_name: true,
        email_address: true,
        phone_number: true,
      },
    };
  },

  methods: {
    ...mapActions({
      registerUser: "auth/registerUser",
      fetchConnectedUsers: "settings/fetchConnectedUsers",
    }),

    selectBusinessType(type) {
      console.log("TYPE IS CALLED", type);
    },

    selectCountry(countries) {
      console.log("He resides here", countries);
    },

    async addUser() {
      this.handleClick("save");

      try {
        const response = await this.registerUser(this.userPayload);

        const type = response.code === 200 ? "success" : "error";

        if (response.code === 200) {
          if (response?.data?.existing) {
            this.pushToast(
              `User with the ${response?.data?.existing} already exists`
            );
            this.handleClick("save", "Add user", false);
            return;
          }
          await this.fetchConnectedUsers({ business_id: this.getAccountId });
          this.handleClick("save", "Add user", false);
          this.$emit("saved");
        } else {
          this.handleClick("save", "Add user", false);
          this.pushToast(response.message, type);
        }
      } catch (err) {
        console.log("ERROR ADDING USER", err);
        this.pushToast("Failed to add new user", "error");
        this.handleClick("save", "Add user", false);
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
}
</style>
