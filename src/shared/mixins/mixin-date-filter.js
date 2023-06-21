const MixinDateFilter = {
  data() {
    return {
      time: ["2020-04-19", "2022-08-09"],
    };
  },

  computed: {
    today() {
      const date = new Date();
      return date;
    },

    yesterday() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },

    lastWeek() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },

    lastMonth() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 4);
      return date;
    },

    lastYear() {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 52);
      return date;
    },

    shortcutConfig() {
      const today = new Date();
      return [
        {
          text: "Till Date",
          onClick: () => {
            return [];
          },
        },
        {
          text: "Today",
          onClick: () => {
            return [today, today];
          },
        },
        {
          text: "Yesterday",
          onClick: () => {
            return [this.yesterday, today];
          },
        },
        {
          text: "Last Week",
          onClick: () => {
            return [this.lastWeek, today];
          },
        },
        {
          text: "Last Month",
          onClick: () => {
            return [this.lastMonth, today];
          },
        },
        {
          text: "Last Year",
          onClick: () => {
            return [this.lastYear, today];
          },
        },
      ];
    },

    formattedStartDate() {
      const date = this.time[0];

      if (!date) return "";
      const start_date = this.$date.formatDate(new Date(date), false);

      const start_day = start_date?.getDay("d3");
      const start_month = start_date?.getMonth("m4");
      const start_year = start_date?.getYear("y1");

      return `${start_day} ${start_month}, ${start_year}`;
    },

    formattedEndDate() {
      const date = this.time[1];

      if (!date) return "";
      const start_date = this.$date.formatDate(new Date(date), false);

      const start_day = start_date?.getDay("d3");
      const start_month = start_date?.getMonth("m4");
      const start_year = start_date?.getYear("y1");

      return `${start_day} ${start_month}, ${start_year}`;
    },

    formattedDateRange() {
      if (!this.formattedStartDate || !this.formattedEndDate) return "";
      return `${this.formattedStartDate} - ${this.formattedEndDate}`;
    },

    formattedDateRangeString() {
      if (!this.time[0] || !this.time[1]) return "";
      return `${new Date(this.time[0]).toDateString()}${new Date(
        this.time[1]
      ).toDateString()}`;
    },

    dateShortcuts() {
      const today = new Date()?.toDateString();
      return [
        {
          id: `${today}${today}`,
          name: "Today",
        },
        {
          id: `${this.yesterday.toDateString()}${today}`,
          name: "Yesterday",
        },
        {
          id: `${this.lastWeek.toDateString()}${today}`,
          name: "Last Week",
        },
        {
          id: `${this.lastMonth.toDateString()}${today}`,
          name: "Last Month",
        },
        {
          id: `${this.lastYear.toDateString()}${today}`,
          name: "Last year",
        },
      ];
    },

    getDateShortcut() {
      return (
        this.dateShortcuts.find(
          (date) => date.id === this.formattedDateRangeString
        )?.name || ""
      );
    },
  },

  methods: {
    disabledDate(a) {
      return new Date(a).getTime() > new Date().getTime();
    },
  },
};

export default MixinDateFilter;
