<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-md' }"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title">Invite users to account</div>
        <div class="tertiary-2-text grey-600 wt-75">
          Create account for new users
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <div class="form-group">
          <FormFieldInput
            label_title="Fullname"
            label_id="fullName"
            is_required
            placeholder="Enter fullname"
            :input_value="getFormFieldValueMx(form, 'fullname')"
            @getInputState="updateFormFieldMx($event, 'fullname')"
            :error_handler="{
              type: 'required',
              message: 'Fullname is a required field',
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

        <!-- ACCESS TYPES -->
        <div class="form-group">
          <label class="form-label">Access types</label>

          <div class="access-cards">
            <userAccessCard
              v-for="(level, index) in access_levels"
              :key="index"
              :level="level"
              @updateSelection="updateAccessTypeSelection(index)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button
          ref="btnRef"
          class="btn btn-primary btn-md wt-100"
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
import userAccessCard from "@/modules/settings/components/card-comps/user-access-card";

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
    userAccessCard,
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
        fullname: {
          validated: false,
          value: "",
        },
        email_address: {
          validated: false,
          value: "",
        },
        access_level: {
          validated: false,
          value: "",
        },
      },

      access_levels: [
        {
          title: "Moderator",
          types: [
            "Manage payment module",
            "Invoice",
            "Escrow",
            "View wallets",
            "View dashboard",
            "Analytics",
          ],
          selected: false,
        },
        {
          title: "Developer",
          types: [
            "Manage payment module",
            "Generate keys",
            "View live keys",
            "View wallets",
            "View dashboard",
            "Analytics",
          ],
          selected: false,
        },
      ],
    };
  },

  methods: {
    ...mapActions({
      registerUser: "auth/inviteUser",
      fetchConnectedUsers: "settings/fetchConnectedUsers",
    }),

    updateAccessTypeSelection(index) {
      this.form.access_level.validated = true;

      this.access_levels.map((level) => (level.selected = false));
      this.access_levels[index].selected = true;

      this.form.access_level.value =
        this.access_levels[index].title.toLowerCase();
    },

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
.access-cards {
  @include flex-column("flex-start", "flex-start");
  gap: toRem(16);
}
</style>
