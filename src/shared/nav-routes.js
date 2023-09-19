const escrowRoutes = [
  {
    id: 1,
    title: "Dashboard",
    icon: "DashboardIcon",
    link: "/dashboard",
    slug: "dashboard",
    tour_id: [1, 2, 3],
  },
  {
    id: 2,
    title: "Escrow transactions",
    icon: "TransactionIcon",
    link: "/transactions",
    slug: "transactions",
    tour_id: [5],
  },
  {
    id: 3,
    title: "Foreign exchange",
    icon: "ExchangeIcon",
    link: "/exchange",
    slug: "exchange",
    tour_id: [6],
  },
  {
    id: 4,
    title: "Payments",
    icon: "PaymentIcon",
    link: "/payments",
    slug: "payments",
    tour_id: [7],
  },
  {
    id: 5,
    title: "Merchant of Records",
    icon: "MORIcon",
    link: "/settings/mor-setup",
    slug: "mor",
    tour_id: [7],
  },
  {
    id: 6,
    title: "Developers",
    icon: "DeveloperIcon",
    link: "/developer",
    slug: "developer",
    tour_id: [],
  },
  {
    id: 7,
    title: "Settings",
    icon: "SettingsIcon",
    link: "/settings/profile",
    slug: "settings",
    tour_id: [],
  },
];

const merchantRoutes = [
  {
    id: 1,
    title: "Dashboard",
    icon: "DashboardIcon",
    link: "/dashboard",
    slug: "dashboard",
    tour_id: [1, 2, 3],
  },
  {
    id: 2,
    title: "Escrow transactions",
    icon: "TransactionIcon",
    link: "/transactions",
    slug: "transactions",
    tour_id: [5],
  },
  {
    id: 3,
    title: "MoR transactions",
    icon: "PaymentIcon",
    link: "/merchant/mor-transaction",
    slug: "mor-transaction",
    tour_id: [],
  },
  {
    id: 4,
    title: "Foreign exchange",
    icon: "ExchangeIcon",
    link: "/exchange",
    slug: "exchange",
    tour_id: [6],
  },
  {
    id: 5,
    title: "Payments",
    icon: "FundIcon",
    link: "/payments",
    slug: "payments",
    tour_id: [7],
  },
  // {
  //   id: 6,
  //   title: "Tax Records",
  //   icon: "TaxIcon",
  //   link: "/payments",
  //   slug: "payments",
  //   tour_id: [],
  // },
  // {
  //   id: 7,
  //   title: "Reports",
  //   icon: "ChartIcon",
  //   link: "/payments",
  //   slug: "payments",
  //   tour_id: [],
  // },
  // {
  //   id: 8,
  //   title: "Customers",
  //   icon: "CustomerIcon",
  //   link: "/payments",
  //   slug: "payments",
  //   tour_id: [],
  // },
  {
    id: 9,
    title: "Developers",
    icon: "DeveloperIcon",
    link: "/merchant/developer",
    slug: "developer",
    tour_id: [],
  },
  {
    id: 10,
    title: "Settings",
    icon: "SettingsIcon",
    link: "/settings/profile",
    slug: "settings",
    tour_id: [],
  },
];

const onboardingRoutes = [
  {
    id: 1,
    title: "Business information",
    icon: "CheckIcon",
    link: "/onboarding/business-information",
    slug: "business-information",
    disabled: false,
  },
  {
    id: 2,
    title: "Business verification",
    icon: "CheckIcon",
    link: "/onboarding/business-verification",
    slug: "business-verification",
    disabled: true,
  },
  {
    id: 3,
    title: "Identity verification",
    icon: "CheckIcon",
    link: "/onboarding/identity-verification",
    slug: "identity-verification",
    disabled: true,
  },
  {
    id: 4,
    title: "MoR deployment",
    icon: "CheckIcon",
    link: "/onboarding/mor-deployment",
    slug: "mor-deployment",
    disabled: true,
  },
];

export { escrowRoutes, merchantRoutes, onboardingRoutes };
