export default () => {
  return {
    mor_countries: [],
    mor_business_types: [],

    mor_payment_module_config: {
      logo_url: "https://logo.com",
      module_name: "name",
      background_colour: "black",
      button_colour: "blue",
      request_phone_number: true,
      request_country: false,
      request_street_address: false,
      country_id: 1,
      currency_code: "NG",
      is_shipping_type: true,
      shipping_types: [
        {
          name: "Express delivery",
          time: "6hrs",
          amount: 3000,
          currency_code: "NGN",
        },
      ],
      product_type: "product_type",
      vat: 2,
      payment_methods: ["card", "banktransfer"],
    },
  };
};
