<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-sm' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Add users to account</div>
        <div class="tertiary-2-text grey-600 wt-75">
          Create account for new users
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group inline-group">
          <FormFieldInput
            label_title="First name"
            label_id="firstName"
            is_required
            placeholder="Enter first name"
            :input_value="getFormFieldValueMx(form, 'firstname')"
            @getInputState="updateFormFieldMx($event, 'firstname')"
            :error_handler="{
              type: 'required',
              message: 'First name is a required field',
            }"
          />

          <FormFieldInput
            label_title="Last name"
            label_id="lastName"
            is_required
            placeholder="Enter last name"
            :input_value="getFormFieldValueMx(form, 'lastname')"
            @getInputState="updateFormFieldMx($event, 'lastname')"
            :error_handler="{
              type: 'required',
              message: 'Last name is a required field',
            }"
          />
        </div>

        <div class="form-group">
          <FormFieldInput
            label_title="Email address"
            label_id="emailAddress"
            input_type="email"
            is_required
            placeholder="Enter email address"
            :input_value="getFormFieldValueMx(form, 'email_address')"
            @getInputState="updateFormFieldMx($event, 'email_address')"
            :error_handler="{
              type: 'email',
              message: 'Enter a valid email address',
            }"
          />
        </div>

        <div class="form-group">
          <FormFieldInput
            label_title="Password"
            label_id="password"
            input_type="password"
            is_required
            placeholder="Enter password"
            :custom_style="{ input_wrapper_style: 'form-suffix' }"
            :input_value="getFormFieldValueMx(form, 'password')"
            @getInputState="updateFormFieldMx($event, 'password')"
            :error_handler="{
              type: 'password',
              message: 'Password should contain at least 4 characters',
            }"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="btnRef"
          class="btn btn-primary btn-md wt-100 mgt-10"
          @click="addUser"
          :disabled="isFormValidated"
        >
          Add user
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import { mapActions } from "vuex";
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "AddUserModal",

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
    isFormValidated() {
      return this.validateFormFieldMx(this.form);
    },

    userPayload() {
      return {
        ...this.getFormPayloadMx(this.form),
        business_id: this.getAccountId,
        account_type: "individual",
        phone_number: "",
      };
    },
  },

  data() {
    return {
      form: {
        firstname: {
          validated: false,
          value: "",
        },
        lastname: {
          validated: false,
          value: "",
        },
        email_address: {
          validated: false,
          value: "",
        },
        password: {
          validated: false,
          value: "",
        },
      },
    };
  },

  methods: {
    ...mapActions({
      registerUser: "auth/registerUser",
      fetchConnectedUsers: "settings/fetchConnectedUsers",
    }),

    async addUser() {
      const response = await this.handleDataRequest({
        action: "registerUser",
        payload: this.userPayload,
        btn_text: "Add User",
        alert_handler: {
          success: "User invitation has been sent successfully.",
          error: "Unable to add a new user",
        },
      });

      if (response?.code === 201) {
        await this.fetchConnectedUsers({ business_id: this.getAccountId });
        this.$emit("saved");
      }

      if (response.code === 400) {
        const error_type = response.message.split(":")[0];

        if (error_type === "EmailAddress") {
          this.handleToastPushMx("Email address already exist!", "error");
        } else if (error_type === "PhoneNumber") {
          this.handleToastPushMx("Phone number already exist!", "error");
        }
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
