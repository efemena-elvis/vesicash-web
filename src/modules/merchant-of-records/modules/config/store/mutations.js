export default {
  SAVE_MOR_COUNTRIES: (state, data) => (state.mor_countries = data),

  SAVE_MOR_BUSINESS_TYPES: (state, data) => (state.mor_business_types = data),

  UPDATE_PAYMENT_MODULE: (state, { field, data }) => {
    state.mor_payment_module_config = {
      ...state.mor_payment_module_config,
      [field]: data,
    };
  },

  SET_PAYMENT_MODULE: (state, data) => (state.mor_payment_module_config = data),

  RESET_PAYMENT_MODULE: (state) => {
    state.mor_payment_module_config = {
      logo_url: "",
      module_name: "",
      background_colour: "#f1f7f7",
      button_colour: "#043b56",
      request_phone_number: true,
      request_country: false,
      request_street_address: false,
      country_id: 0,
      country_name: "",
      currency_code: "",
      is_shipping_type: false,
      shipping_types: [
        {
          amount: 0,
          currency_code: "",
          name: "",
          time: "",
        },
      ],
      product_type: "",
      vat: 0,
      payment_methods: ["credit_card"],
    };
  },
};
