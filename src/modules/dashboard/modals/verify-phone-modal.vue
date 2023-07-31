<template>
  <ModalCover
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    :show_close_btn="false"
    :trigger_self_close="false"
    :place_center="true"
  >
    <!-- MODAL COVER HEADER -->
    <template slot="modal-cover-header">
      <div class="modal-cover-header">
        <div class="modal-cover-title text-center mgt-5 mgb--10">
          Verify phone number
        </div>
      </div>
    </template>

    <!-- MODAL COVER BODY -->
    <template slot="modal-cover-body">
      <div class="modal-cover-body">
        <p>An OTP code will be sent to the phone number you have provided</p>

        <div class="form-group wt-100">
          <BasicInput
            label_id="phoneNumber"
            input_type="number"
            :input_value="form.phone_number"
            is_phone_type
            is_required
            placeholder="Enter your phone number"
            :custom_style="{ input_wrapper_style: 'form-prefix' }"
            @getInputState="updateFormState($event, 'phone_number')"
            :error_handler="{
              type: 'phone',
              message: 'Phone number is not valid',
            }"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template slot="modal-cover-footer">
      <div class="modal-cover-footer">
        <button class="btn btn-primary btn-md wt-100" @click="verifyPhone">
          Continue
        </button>
      </div>
    </template>
  </ModalCover>
</template>

<script>
import ModalCover from "@/shared/components/util-comps/modal-cover";

export default {
  name: "verifyPhoneModal",

  components: {
    ModalCover,
  },

  data: () => ({
    form: {
      phone_number: "",
    },

    validity: {
      phone_number: true,
    },
  }),

  methods: {
    verifyPhone() {
      this.$emit("verifyUserPhone");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-cover-title {
  font-size: toRem(18.5);
}

.modal-cover-body {
  min-height: toRem(35);
  @include flex-row-wrap("center", "center");

  p {
    @include generate-font-type("tertiary-2");
    color: getColor("grey-700");
    line-height: toRem(22);
    text-align: center;
  }
}
</style>
