<template>
  <div class="pdb-80">
    <!-- PAGE TITLE -->
    <div class="page-title primary-1-text grey-900 mgb-4">Profile</div>

    <!-- PAGE META -->
    <div class="page-meta tertiary-2-text grey-600">
      Update your profile and personal info here.
    </div>

    <!-- FORM AREA -->
    <div class="settings-form-area mgt-20">
      <!-- BUSINESS LOGO BLOCK -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">
            {{ isBusiness ? "Business logo" : "Profile picture" }}
          </label>
        </div>

        <div class="col-12 col-sm-8 logo-block">
          <div class="profile-avatar position-relative">
            <div
              class="icon-spinner f-size-19 animate position-absolute"
              v-if="uploading_file"
            ></div>

            <img
              :src="uploaded_pic"
              alt="logo"
              ref="logoImage"
              v-if="uploaded_pic"
            />
            <ProfileAvatarIcon v-else />
          </div>

          <input
            type="file"
            id="fileUpload"
            class="d-none"
            accept="image/*"
            ref="fileUpload"
            @change="uploadPic"
          />

          <label
            class="btn btn-secondary btn-sm fw-semibold"
            disabled
            :for="uploading_file ? '' : 'fileUpload'"
          >
            {{
              uploading_file
                ? "Uploading..."
                : isBusiness
                ? "Upload business logo"
                : "Upload profile pic"
            }}
          </label>
        </div>
      </div>

      <!-- FULL NAME BLOCK -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Full name</label>
        </div>

        <div class="col-12 col-sm-8 two-columns-row">
          <FormFieldInput
            label_id="firstName"
            is_required
            placeholder="Enter your first name"
            :input_value="getFormFieldValueMx(form, 'first_name')"
            @getInputState="updateFormFieldMx($event, 'first_name')"
            :error_handler="{
              type: 'single',
              message: 'First name should contain at least two characters',
            }"
          />

          <FormFieldInput
            label_id="lastName"
            is_required
            placeholder="Enter your last name"
            :input_value="getFormFieldValueMx(form, 'last_name')"
            @getInputState="updateFormFieldMx($event, 'last_name')"
            :error_handler="{
              type: 'single',
              message: 'Last name should contain at least two characters',
            }"
          />
        </div>
      </div>

      <!-- USERNAME BLOCK -->
      <div class="page-input-block row" v-if="isBusiness && false">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Username</label>
        </div>

        <div class="col-12 col-sm-8">
          <FormFieldInput
            label_id="userName"
            placeholder="Enter your username"
            :input_value="getFormFieldValueMx(form, 'username')"
            @getInputState="updateFormFieldMx($event, 'username')"
          />
        </div>
      </div>

      <!-- DOB BLOCK -->
      <div class="page-input-block row" v-if="false">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Date of Birth</label>
        </div>

        <div class="col-12 col-sm-8">
          <FormFieldInput
            label_id="dob"
            input_type="date"
            placeholder="Select date of birth"
            :input_value="getFormFieldValueMx(form, 'dob')"
            @getInputState="updateFormFieldMx($event, 'dob')"
            :maximum_date="new Date().toISOString().split('T')[0]"
          />
        </div>
      </div>

      <!-- FLUTTERWAVE MERCHANT ID BLOCK -->
      <div class="page-input-block row" v-if="isBusiness">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Merchant ID</label>
        </div>

        <div class="col-12 col-sm-8 position-relative">
          <div ref="show" class="show-input">-------</div>

          <FormFieldInput
            label_id="merchantId"
            placeholder="Enter your flutterwave merchant id"
            :input_value="getFormFieldValueMx(form, 'flutterwave_merchant_id')"
            @getInputState="
              updateFormFieldMx($event, 'flutterwave_merchant_id')
            "
          />
        </div>
      </div>

      <!-- BIO BLOCK -->
      <div class="page-input-block row" v-if="isBusiness && false">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Bio</label>
        </div>

        <div class="col-12 col-sm-8">
          <textarea
            name="bio"
            id="bio"
            cols="30"
            rows="4"
            placeholder="Write about your company "
            class="form-control"
            v-model="form.bio.value"
          ></textarea>
        </div>
      </div>

      <!-- EMAIL BLOCK -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Email</label>
        </div>

        <div class="col-12 col-sm-8 two-columns-row two-columns-row--tight">
          <FormFieldInput
            label_id="emailAddress"
            input_type="email"
            is_required
            placeholder="Enter your email address"
            :is_disabled="isEmailVerified"
            :input_value="getFormFieldValueMx(form, 'email_address')"
            @getInputState="updateFormFieldMx($event, 'email_address')"
            :error_handler="{
              type: 'email',
              message: 'Email address is not valid',
            }"
          />

          <TagCard
            card_text="Email verified"
            card_type="success"
            class="slim-app-chip"
            v-if="isEmailVerified"
          />

          <button
            class="btn btn-secondary btn-sm fw-semibold"
            v-else
            :disabled="!isEmailValidated"
            @click="toggleInputModal('email_address')"
          >
            Verify
          </button>
        </div>
      </div>

      <!-- PHONE BLOCK -->
      <div class="page-input-block row">
        <div class="col-12 col-sm-4">
          <label for="logo" class="form-label fw-bold">Phone number</label>
        </div>

        <div
          class="col-12 col-sm-8 two-columns-row two-columns-row--tight two-columns-row--phone-variant"
        >
          <div class="position-relative">
            <FormFieldInput
              label_id="phoneNumber"
              input_type="number"
              is_phone_type
              is_required
              :is_disabled="isPhoneVerified"
              placeholder="Enter your phone number"
              :custom_style="{ input_wrapper_style: 'form-prefix' }"
              :input_value="getFormFieldValueMx(form, 'phone_number')"
              @getInputState="updateFormFieldMx($event, 'phone_number')"
              :error_handler="{
                type: 'phone',
                message: 'Phone number is not valid',
              }"
            />
          </div>

          <div
            class="verify-skeleton skeleton-loader"
            v-if="loading_verification"
          ></div>

          <TagCard
            card_text="Phone verified"
            v-else-if="isPhoneVerified"
            card_type="success"
            class="slim-app-chip"
          />

          <template v-else>
            <button
              v-if="is_phone_changed"
              class="btn btn-secondary btn-sm fw-semibold"
              :disabled="!isPhoneValidated"
              @click="updateUserPhone()"
            >
              Update phone
            </button>

            <button
              v-else
              class="btn btn-secondary btn-sm fw-semibold"
              :disabled="!isPhoneValidated"
              @click="toggleInputModal('phone_number')"
            >
              Verify
            </button>
          </template>
        </div>
      </div>

      <!-- BIO BLOCK -->
      <div class="d-flex row">
        <div class="col-12 col-sm-4"></div>

        <div class="col-12 col-sm-8">
          <button
            class="btn btn-primary btn-md"
            @click="saveProfile"
            :disabled="isDisabled"
            ref="btnRef"
          >
            Save profile
          </button>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_input_modal">
        <VerifyInputModal
          @continue="initiateOTPRequest"
          :input="form[input_type].value"
          @closeTriggered="toggleInputModal"
          :email="input_type === 'email_address' ? true : false"
        />
      </transition>

      <transition name="fade" v-if="show_otp_modal">
        <VerifyOtpModal
          @closeTriggered="toggleOtpModal"
          :input="form[input_type].value"
          :email="input_type === 'email_address' ? true : false"
          @done="updatePhoneVerificationState"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import countries from "@/utilities/countries";
import TagCard from "@/shared/components/card-comps/tag-card";
import ProfileAvatarIcon from "@/shared/components/icon-comps/profile-avatar-icon";
import VerifyInputModal from "@/modules/settings/modals/verify-input-modal";
import VerifyOtpModal from "@/modules/settings/modals/verify-otp-modal";

export default {
  name: "ProfileSettings",

  components: {
    TagCard,
    ProfileAvatarIcon,
    VerifyInputModal,
    VerifyOtpModal,
  },

  computed: {
    isBusiness() {
      return this.getAccountType === "business" ? true : false;
    },

    isPhoneVerified() {
      return this.getUser?.verifications?.phone ?? false;
    },

    isEmailVerified() {
      return this.getUser?.verifications?.email ?? false;
    },

    isPhoneValidated() {
      return this.form.phone_number?.validated;
    },

    isEmailValidated() {
      return this.form.email?.validated;
    },

    isDisabled() {
      return this.validateFormFieldMx(this.form) || !this.isEmailVerified;
    },

    userProfileUpdate() {
      let profile_updates = {
        account_type: this.getAccountType,
        firstname: this.form.first_name.value,
        middlename: "",
        lastname: this.form.last_name.value,
        phone_number: this.form.phone_number.value,
        email_address: this.form.email_address.value,
        // username: this.form.username.value,
        dob: this.form.dob.value,
        meta: this.uploaded_pic,
        // bio: this.form.bio.value,
        flutterwave_merchant_id: this.form.flutterwave_merchant_id.value,
      };

      if (!this.isBusiness) delete profile_updates.updates.username;
      if (!this.isBusiness)
        delete profile_updates.updates?.flutterwave_merchant_id;

      return profile_updates;
    },
  },

  watch: {
    "form.phone_number.value": {
      handler(value) {
        this.is_phone_changed =
          this.initial_phone_value !== value ? true : false;
      },
    },
  },

  data() {
    return {
      show_input_modal: false,
      show_otp_modal: false,
      uploaded_pic: "",
      uploading_file: false,
      loading_verification: false,
      input_type: "phone_number",

      country_code: "",
      initial_phone_value: false,
      is_phone_changed: false,

      form: {
        first_name: {
          validated: false,
          value: "",
        },
        last_name: {
          validated: false,
          value: "",
        },
        // username: {
        //   validated: true,
        //   value: "",
        // },
        // dob: {
        //   validated: true,
        //   value: "",
        // },
        flutterwave_merchant_id: {
          validated: true,
          value: "",
        },
        // bio: {
        //   validated: true,
        //   value: "",
        // },
        email_address: {
          validated: false,
          value: "",
        },
        phone_number: {
          validated: false,
          value: "",
        },
      },
    };
  },

  created() {
    // ==========================================
    // UPDATE USER SELECTED COUNTRY STATE
    // ==========================================
    this.$bus.$on("update-country-state", (country) =>
      this.extractCountryCode(country)
    );
  },

  mounted() {
    this.updateSavedProfile();
  },

  updated() {
    const merchantInput = document.querySelector(".profile_merchant_id_field");

    if (merchantInput && this.$route?.query?.focus_merchant) {
      merchantInput.focus();
      this.$refs?.show?.scrollIntoView();
      this.$router.replace({ name: this.$route.name });
    }
  },

  methods: {
    ...mapActions({
      saveUserProfile: "settings/saveUserProfile",
      uploadToSpace: "general/uploadToSpace",
    }),

    ...mapMutations({ UPDATE_AUTH_USER: "auth/UPDATE_AUTH_USER" }),

    toggleInputModal(type) {
      this.input_type = type;
      this.show_input_modal = !this.show_input_modal;
    },

    toggleOtpModal(type) {
      this.input_type = type;
      this.show_otp_modal = !this.show_otp_modal;
    },

    initiateOTPRequest(input) {
      this.form[this.input_type].value = input;
      this.toggleInputModal(this.input_type);
      this.toggleOtpModal(this.input_type);
    },

    extractCountryCode(country_name) {
      this.country_code = countries.find(
        (country) => country.country === country_name
      ).dialing_code;
    },

    async uploadPic(event) {
      const [file] = event.target.files;

      if (!this.processFileSize(file.size)) {
        this.pushToast("Upload a maximum file size of 1mb", "error");
        return false;
      }

      this.uploaded_pic = URL.createObjectURL(file);

      this.$nextTick(() => {
        const image = this.$refs.logoImage;
        if (image) image.onload = () => URL.revokeObjectURL(image.src);
      });

      this.uploading_file = true;

      const loadedImage = await this.uploadToSpace({
        file,
        formatted_size: this.processFileSize(file.size),
      });

      this.uploading_file = false;

      this.uploaded_pic =
        loadedImage.code === 201 ? loadedImage.data[0].file_url : "";

      if (loadedImage.code !== 201)
        this.pushToast("File upload failed", "error");
    },

    processFileSize(size) {
      if (size > 1000000) return false;

      return size.toString().length >= 6
        ? `${(size / 1000000).toFixed(1)}mb`
        : `${(size / 1000).toFixed(1)}kb`;
    },

    updateSavedProfile() {
      const {
        fullname,
        email,
        // username,
        dob,
        phone,
        flutterwave_merchant_id,
        // bio,
        meta,
      } = this.getUser;

      this.uploaded_pic = meta;

      const [firstname, lastname] = fullname.split(" ");

      this.form.first_name.value = firstname;
      this.form.first_name.validated = !!firstname;

      this.form.last_name.value = lastname;
      this.form.last_name.validated = !!lastname;

      // this.form.username.value = username;
      // this.form.dob.value = dob;
      this.form.flutterwave_merchant_id.value = flutterwave_merchant_id;
      // this.form.bio.value = bio;

      this.form.email_address.value = email;
      this.form.email_address.validated = !!email;

      this.form.phone_number.value = phone;
      this.form.phone_number.validated = !!phone;
      this.initial_phone_value = phone;
      this.is_phone_changed = false;
    },

    updateProfile() {
      const updatedUser = {
        ...this.getUser,
        email: this.form.email_address.value,
        phone: this.form.phone_number.value,
        // bio: this.form.bio.value,
        meta: this.uploaded_pic,
        fullname: `${this.form.last_name.value} ${this.form.first_name.value}`,
        // username: this.form?.username.value,
        // dob: this.form?.dob.value,
        flutterwave_merchant_id: this.form?.flutterwave_merchant_id.value,
      };

      this.UPDATE_AUTH_USER(updatedUser);
    },

    async saveProfile() {
      const response = await this.handleDataRequest({
        action: "saveUserProfile",
        payload: this.userProfileUpdate,
        btn_text: "Save profile",
        alert_handler: {
          success: "User profile was updated successfully",
          error: "Failed to save profile",
          request_error: "Unable to save user profile",
          not_found_error: "Unable to save user profile",
        },
      });

      if (response?.code === 200) this.updateProfile();
    },

    updatePhoneVerificationState() {
      const updatedUser = {
        ...this.getUser,
        verifications: {
          email: this.getUser.verifications.email,
          phone: true,
        },
      };

      this.UPDATE_AUTH_USER(updatedUser);
      this.handleToastPushMx(
        "Phone number was verified successfully",
        "success"
      );
    },

    async updateUserPhone() {
      const user_phone = this.sanitizePhone(
        this.country_code,
        this.form.phone_number.value
      );

      if (user_phone) {
        const updatedUser = {
          ...this.getUser,
          phone: user_phone,
        };

        this.UPDATE_AUTH_USER(updatedUser);

        const response = await this.handleDataRequest({
          action: "saveUserProfile",
          payload: {
            phone_number: user_phone,
          },
          alert_handler: {
            success: "User phone number updated successfully",
            error: "Failed to save user phone number",
          },
        });

        if (response?.code === 200)
          setTimeout(() => this.updateSavedProfile(), 1000);
      } else {
        this.handleToastPushMx("Phone number is not valid!", "error");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.logo-block {
  display: grid;
  grid-template-columns: toRem(60) auto;
  gap: toRem(22);
  align-items: center;

  @include breakpoint-down(sm) {
    grid-template-columns: toRem(60) 1fr;

    .btn-sm {
      width: 100%;
    }
  }

  .profile-avatar {
    background: getColor("teal-50");
    border: toRem(0.5) solid getColor("teal-200");
    border-radius: 50%;
    @include draw-shape(56);
    @include flex-row-nowrap("center", "center");

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
}

.two-columns-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: toRem(32);

  @include breakpoint-down(sm) {
    grid-template-columns: 1fr;
  }
}

.two-columns-row--tight {
  gap: toRem(16);
  align-items: center;

  .slim-app-chip {
    height: max-content;
    padding: 0.196875rem 0.625rem 0.15rem 1.3125rem;
  }
}

.two-columns-row--phone-variant {
  grid-template-columns: 5fr 3fr;
  @include breakpoint-down(md) {
    grid-template-columns: 5fr 2fr;
  }
  @include breakpoint-down(sm) {
    grid-template-columns: 1fr;
  }
}

.btn-sm {
  width: max-content;
  padding: 0.5rem 2rem;
}

.pdb-80 {
  padding-bottom: toRem(80);
}

.verify-skeleton {
  width: toRem(80);
  height: toRem(30);
}

.show-input {
  position: absolute;
  transform: translateY(-150px);
  opacity: 0;
}
</style>
