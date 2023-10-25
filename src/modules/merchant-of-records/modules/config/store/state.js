export default () => {
  return {
    mor_countries: [],
    mor_business_types: [],

    mor_payment_module_config: {
      logo_url: "",
      module_name: "",
      business_name: "",
      background_colour: "#f1f7f6",
      button_colour: "#043b56",
      request_phone_number: true,
      request_country: false,
      request_street_address: false,
      country_id: 0,
      country_name: "",
      country_code: "",
      currency_code: "",
      currency_sign: "",
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
      amount: 0,
      vat: 0,
      payment_methods: ["card"],
    },
  };
};
