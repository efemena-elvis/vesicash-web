const navRoutes = [
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
    title: "Settings",
    icon: "SettingsIcon",
    link: "/settings/profile",
    slug: "settings",
    tour_id: [],
  },
];

export default navRoutes;
