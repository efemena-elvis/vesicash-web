const foreign_currencies = [
  {
    id: 3,
    code: "us",
    sign: "$",
    short: "USD",
    long: "Dollar",
    default: true,
    enabled: true,
  },
  {
    id: 4,
    code: "us",
    sign: "$",
    short: "ESCROW_USD",
    long: "Dollar",
    default: true,
    enabled: true,
  },
  {
    id: 5,
    code: "gb",
    sign: "£",
    short: "GBP",
    long: "Pound Sterling",
    default: false,
    enabled: false,
  },
  {
    id: 6,
    code: "gb",
    sign: "£",
    short: "ESCROW_GBP",
    long: "Pound Sterling",
    default: false,
    enabled: false,
  },
];

export default foreign_currencies;
