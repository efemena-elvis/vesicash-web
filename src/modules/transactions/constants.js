export const SINGLE_ROLE_OPTIONS = [
  { id: 1, name: "Buyer" },
  { id: 2, name: "Seller" },
];

export const MULTIPLE_ROLE_OPTIONS = [
  { id: 1, name: "Buyer" },
  { id: 2, name: "Seller" },
  { id: 3, name: "Broker" },
  { id: 4, name: "Sub-broker" },
];

export const USER_ACCESS_OPTIONS = [
  { id: 1, name: "Approve" },
  { id: 2, name: "Mark as done" },
  { id: 3, name: "View" },
];

export const USER_PAYOUT_OPTIONS = [
  { id: 1, name: "No" },
  { id: 2, name: "Yes" },
];

export const CURRENCY_OPTIONS = [
  { id: 1, name: "NGN (₦)", slug: "naira", short: "NGN" },
  { id: 2, name: "USD ($)", slug: "dollar", short: "USD" },
  // { id: 3, name: "GBP (£)", slug: "pound", short: "GPB" },
];

export const INSPECTION_OPTIONS = [
  { id: 1, name: "1 day" },
  { id: 2, name: "2 days" },
  { id: 3, name: "3 days" },
  { id: 4, name: "4 days" },
  { id: 5, name: "5 days" },
  { id: 6, name: "6 days" },
  { id: 7, name: "7 days" },
];

export const CURRENCY_CODE = {
  naira: "NGN",
  dollar: "USD",
  pound: "GBP",
};

export const ESCROW_CONFIG_KEY = "ESCROW_CONFIG_KEY";

export const DEFAULT_ESCROW_CONFIG = {
  currency: "NGN",
  dashboard_url: "https://vesicash.com",
  title: "",
  type: "",
  description: "",
  parties: [],
  milestones: [
    {
      title: "",
      amount: "",
      description: "",
      inspection_period: "",
      grace_period: "",
      due_date: "",
      id: "milestone-one",
    },
  ],
  dispute_handler: "",
  files: [],
};

export const getEscrowConfig = () => {
  const config = localStorage.getItem(ESCROW_CONFIG_KEY);
  return config ? JSON.parse(config) : DEFAULT_ESCROW_CONFIG;
};

export const updateEscrowConfig = (config) => {
  localStorage.setItem(ESCROW_CONFIG_KEY, JSON.stringify(config));
};

export const clearEscrowConfig = () => {
  localStorage.setItem(
    ESCROW_CONFIG_KEY,
    JSON.stringify(DEFAULT_ESCROW_CONFIG)
  );
};
