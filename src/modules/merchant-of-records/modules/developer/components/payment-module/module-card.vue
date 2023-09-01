<template>
  <div
    class="module-card rounded-12 soft-shadow-effect mgb-32 smooth-animation"
  >
    <!-- CARD TOP -->
    <div class="card-top">
      <img v-lazy="loadImage('module-banner.png')" alt="Module banner" />
    </div>

    <!-- CARD BOTTOM -->
    <div class="card-bottom">
      <div class="left-section">
        <div class="title-text mgb-4 primary-1-text grey-900">
          {{ getModule.name }}
        </div>

        <div class="description-text tertiary-2-text grey-700 mgb-8">
          {{ getModule.country }} <span>&bull;</span> {{ getModule.currency }}
        </div>

        <TagCard :card_text="getModule.status" :card_type="getModule.state" />
      </div>

      <div class="right-section">
        <div
          class="option pointer border-grey-100 rounded-circle"
          @click="toggleMenu"
        >
          <div class="icon-ellipsis-h grey-500 f-size-21"></div>
        </div>
      </div>
    </div>

    <!-- DROPDOWN CARD -->
    <div class="menu-wrapper" v-if="show_menu" v-on-clickaway="toggleMenu">
      <DropdownMenu
        :menu_items="moduleMenus"
        @editModule="viewPaymentModule"
        @deleteModule="deleteModule"
        @publishModule="publishModule"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TagCard from "@/shared/components/card-comps/tag-card";

export default {
  name: "ModuleCard",

  components: {
    TagCard,
    DropdownMenu: () =>
      import(
        /* webpackChunkName: "dashboard-module" */ "@/shared/components/util-comps/dropdown-menu"
      ),
  },

  props: {
    module: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    ...mapGetters({ getMorCountries: "merchant/getMorCountries" }),

    moduleMenus() {
      return [
        {
          icon: "icon-edit-pen f-size-16",
          text: "Edit Module",
          action: "editModule",
        },
        {
          icon: "icon-trash f-size-20",
          text: "Delete Module",
          action: "deleteModule",
        },
        {
          icon: "icon-close f-size-20",
          text: this.module?.is_published ? "Unpublish" : "Publish",
          action: "publishModule",
        },
      ];
    },

    getModule() {
      const countries = this.getMorCountries?.length
        ? [...this.getMorCountries]
        : [];
      const module = this.module;
      const name = module?.name || "-----------";
      const country =
        countries?.find((cc) => cc?.currency_code === module?.currency_code)
          ?.name || "-------";
      const currency = (module?.currency_code || "---") + " currency";
      const status = module?.is_published ? "Published" : "Not Published";
      const state = module?.is_published ? "success" : "progress";

      return {
        name,
        country,
        currency,
        status,
        state,
      };
    },
  },

  data: () => ({
    show_menu: false,

    menu_items: [],
  }),

  methods: {
    ...mapActions({
      deletePaymentModule: "merchant/deletePaymentModule",
      publishPaymentModule: "merchant/publishPaymentModule",
    }),

    async deleteModule() {
      this.toggleMenu();
      this.showPageLoader("Deleting module");
      const _response = await this.deletePaymentModule(this.module?.id);
      const response = _response?.data;
      const type = response?.code === 200 ? "success" : "warning";
      const message = response?.message;
      this.pushToast(message, type);
      if (response?.code === 200) {
        this.$emit("refresh");
      }
      this.hidePageLoader();
    },

    async publishModule() {
      this.toggleMenu();
      const payload = {
        id: this.module.id,
        payload: {
          is_published: `${!this.module?.is_published}`,
        },
      };
      this.showPageLoader(
        `${this.module?.is_published ? "Unpublishing" : "Publishing"} module`
      );
      const response = await this.publishPaymentModule(payload);
      const type = response?.code === 200 ? "success" : "warning";
      const message = response?.message;
      this.pushToast(message, type);
      if (response?.code === 200) {
        this.$emit("refresh");
      }
      this.hidePageLoader();
    },

    viewPaymentModule() {
      this.$router?.push(
        `/merchant/payment-module/customer?id=${this.module?.id}`
      );
    },

    toggleMenu() {
      this.show_menu = !this.show_menu;
    },
  },
};
</script>

<style lang="scss" scoped>
.module-card {
  position: relative;

  .title-text {
    max-width: 85%;
    overflow-wrap: anywhere;
  }

  .card-top {
    height: toRem(172);

    img {
      @include width-height(100%);
    }
  }

  .card-bottom {
    @include flex-row-nowrap("space-between", "flex-start");
    padding: toRem(16);

    .option {
      @include flex-row-nowrap("center", "center");
      @include transition(0.3s);
      @include draw-shape(32);

      &:hover {
        background: getColor("grey-10");
      }
    }
  }
  .menu-wrapper {
    position: absolute;
    top: toRem(225);
    right: toRem(12);
  }
}
</style>
