<template>
  <div :class="[!table_empty && 'full-width']">
    <!-- PAGE TITLE -->
    <div class="page-title primary-1-text grey-900 mgb-4">Users</div>

    <!-- PAGE META -->
    <div class="page-meta tertiary-2-text grey-600">
      Invite and manage your team here.
    </div>

    <button
      class="btn btn-md btn-primary add-user-button"
      v-if="hasConnectedUsers"
      @click="toggleAddUserModal"
    >
      <span class="icon icon-plus mgr-8"></span> Add new user
    </button>

    <div class="mgt-32 pdb-40">
      <UserTable @emptyAction="toggleAddUserModal" />
    </div>

    <portal to="vesicash-modals">
      <transition name="fade" v-if="show_add_user_modal">
        <AddUserModal
          @closeTriggered="toggleAddUserModal"
          @saved="toggleSuccessModal"
        />
      </transition>

      <transition name="fade" v-if="show_success_modal">
        <SuccessModal
          @closeTriggered="toggleSuccessModal"
          @done="toggleSuccessModal"
          message="You have successfully added a user to your account"
        />
      </transition>
    </portal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import AddUserModal from "@/modules/settings/modals/add-user-modal";
import UserTable from "@/modules/settings/components/table-comps/user-table";
import SuccessModal from "@/shared/modals/success-modal";
export default {
  name: "UsersSettings",

  components: {
    UserTable,
    AddUserModal,
    SuccessModal,
  },

  computed: {
    ...mapGetters({ getConnectedUsers: "settings/getConnectedUsers" }),

    hasConnectedUsers() {
      return this.getConnectedUsers?.length;
    },
  },

  data() {
    return {
      show_add_user_modal: false,
      show_success_modal: false,
      table_empty: false,
      loading_users: true,
    };
  },

  methods: {
    ...mapActions({}),

    toggleAddUserModal() {
      this.show_add_user_modal = !this.show_add_user_modal;
    },

    toggleSuccessModal() {
      this.show_add_user_modal = false;
      this.show_success_modal = !this.show_success_modal;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-user-button {
  position: absolute;
  left: 100%;
  top: 0;
  width: max-content;
  transform: translateX(-100%);
  transition: background ease-in-out 0.25s !important;

  @include breakpoint-custom-down(785) {
    position: static;
    transform: translateX(0);
    left: 0;
    margin-top: toRem(24);
  }
}

.page-meta {
  padding-bottom: toRem(24);
  border-bottom: toRem(0.5) solid getColor("grey-200");
}

.full-width {
  position: absolute;
  width: calc(100% - 70px);

  @include breakpoint-down(lg) {
    width: calc(100% - 50px);
  }

  @include breakpoint-down(sm) {
    width: calc(100% - 30px);
  }
}

.users-empty-state {
  @include flex-column("center", "center");
  margin-top: toRem(37.5);
  padding-bottom: toRem(130);

  .empty-text {
    width: 35%;

    @include breakpoint-down(md) {
      width: 45%;
    }

    @include breakpoint-down(sm) {
      width: 65%;
    }
  }
}
</style>
