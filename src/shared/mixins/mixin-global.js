const MixinGlobal = {
  methods: {
    /*****************************************
     * IMAGE ASSETS MIXIN GROUP
     *****************************************/
    loadImageMx(src, module = null) {
      return module
        ? require(`@/modules/${module}/assets/${src}`)
        : require(`@/shared/assets/static/${src}`);
    },

    loadFalseImageMx(src) {
      return require(`@/shared/assets/dynamic/${src}`);
    },

    /*****************************************
     * FORM REQUEST MIXIN GROUP
     *****************************************/
    handleButtonClickMx(
      btnRef = "btnRef",
      btnText = "Please wait...",
      btnLoading = true
    ) {
      if (btnLoading) {
        this.$refs[btnRef].disabled = true;
        this.$refs[
          btnRef
        ].innerHTML = `<div class="icon-spinner f-size-19 mgr-10 animate"></div>${btnText}`;

        setTimeout(() => {}, 8000);
      } else {
        this.$refs[btnRef].innerHTML = `${btnText}`;
        this.$refs[btnRef].disabled = false;
      }
    },

    updateFormFieldMx(data, type, is_country = false) {
      if (is_country) {
        this.form[type].value = data.country;
        this.form[type].validated = true;
      } else {
        this.form[type].value = data?.value;
        this.form[type].validated = data?.validity;
      }
    },

    getFormFieldValueMx(formPayload, field) {
      return formPayload[field].value;
    },

    getFormPayloadMx(formPayload) {
      const newPayload = {};

      for (let key in formPayload) {
        newPayload[key] = formPayload[key].value;
      }

      return newPayload;
    },

    validateFormFieldMx(formPayload) {
      const payload = Object.values(formPayload);

      const form_validated = Object.values(payload).every(
        (innerObj) => innerObj.validated === true
      );

      return !form_validated;
    },

    /*****************************************
     * UTIL MIXIN GROUP
     *****************************************/
    togglePageLoaderMx(message = "") {
      this.$bus.$emit("toggle-page-loader", message);
    },

    handleToastPushMx(message = "", status = "success") {
      message &&
        this.$bus.$emit("toggle-alert-banner", {
          message,
          status,
        });
    },

    /*****************************************
     * VALIDATE USER PHONE NUMBER
     *****************************************/
    sanitizePhone(country_code, phone) {
      if (phone.startsWith("+" || country_code)) return phone;
      else {
        if (phone.startsWith("0")) return `${country_code}${phone.slice(1)}`;
        else return `${country_code}${phone}`;
      }
    },

    /*****************************************
     * VALIDATE USER EMAIL ADDRESS
     *****************************************/
    validateUserEmailAddress(email_address) {
      const forbiddenDomains = ["gmail.com", "hotmail.com", "yahoo.com"];
      const domain = email_address.split("@")[1];
      return forbiddenDomains.includes(domain) ? false : true;
    },

    /*****************************************
     * REQUEST MIXIN GROUP
     *****************************************/
    async handleDataRequest({
      action,
      payload = "",
      btn_text = "",
      show_alert = true,
      alert_handler = {}, // success: "", error: "", request_error: "", not_found_error: ""
    }) {
      const btnRef = "btnRef";
      const handle_alert = Object.values(alert_handler).length;
      this.handleButtonStateOnRequest(btnRef, "start", btn_text);

      try {
        let response = await this[action](payload);

        this.handleButtonStateOnRequest(btnRef, "stop", btn_text);

        // 200 responses
        if (response?.code === 200 || response?.code === 201) {
          if (handle_alert && alert_handler?.success)
            show_alert && this.handleToastPushMx(alert_handler.success);
        }
        // 400 responses
        else if (response?.code === 400) {
          if (handle_alert && alert_handler?.request_error)
            show_alert &&
              this.handleToastPushMx(alert_handler.request_error, "error");
        }
        // 404 responses
        else if (response?.code === 404) {
          if (handle_alert && alert_handler?.not_found_error) {
            show_alert &&
              this.handleToastPushMx(alert_handler.not_found_error, "error");
          }
        }
        // error responses
        else {
          handle_alert
            ? this.handleToastPushMx(
                response?.message ?? alert_handler.error,
                "error"
              )
            : null;
        }

        return response === undefined ? false : response;
      } catch (_) {
        this.handleButtonStateOnRequest(btnRef, "stop", btn_text);
        console.error("A network error occured!!!");
      }
    },

    handleButtonStateOnRequest(
      btnRef = "btnRef",
      btnState = "start",
      btnText = ""
    ) {
      if (btnState === "start") {
        btnText.length && this.handleButtonClickMx(btnRef);
      } else {
        btnText.length && this.handleButtonClickMx(btnRef, btnText, false);
      }
    },
  },
};

export default MixinGlobal;
