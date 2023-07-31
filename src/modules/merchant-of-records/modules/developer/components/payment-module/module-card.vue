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
          Dollar card merchant
        </div>

        <div class="description-text tertiary-2-text grey-700 mgb-8">
          United states <span>&bull;</span> USD currency
        </div>

        <TagCard card_text="Published" card_type="success" />
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
        :menu_items="menu_items"
        @editModule="editPaymentModule"
        @deleteModule="deletePaymentModule"
        @unpublishModule="unpublishPaymentModule"
      />
    </div>
  </div>
</template>

<script>
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

  data: () => ({
    show_menu: false,

    menu_items: [
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
        text: "Unpublish",
        action: "unpublishModule",
      },
    ],
  }),

  methods: {
    toggleMenu() {
      this.show_menu = !this.show_menu;
    },

    editPaymentModule() {
      console.log("Edit module");
    },

    deletePaymentModule() {
      console.log("Delete module");
    },

    unpublishPaymentModule() {
      console.log("Unpublish module");
    },
  },
};
</script>

<style lang="scss" scoped>
.module-card {
  position: relative;

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
