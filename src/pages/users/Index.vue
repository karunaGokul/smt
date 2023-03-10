<template>
  <div class="users">
    <v-container fluid class="pa-8" v-if="data">
      <h2 class="text-uppercase ma-2">Users</h2>
      <user-grid :gridData="data"></user-grid>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";

import { UserRequest, GridModel, UserModel } from "@/model";
import { IUserService } from "@/service";
import { Settings } from '@/config';
import UserGrid from "./components/UserGrid.vue";

@Component({
  components: { UserGrid }
})
export default class UserPage extends Vue {
  @Inject("userService") userService: IUserService;
  data: GridModel<UserRequest> = null;

  mounted() {
    this.data = new GridModel(UserRequest);
    this.data.request.pageSize = Settings.PricingGridPageSize;

    this.data.actions.push({
      columns: 2,
      offset: 0,
      controlType: "Select",
      commandName: "RoleFilter",
      items: this.userService.getRoles(true)
    });

    this.data.itemActions.push({
      text: "Edit",
      icon: "mdi-pencil",
      commandName: "Edit"
    });

    this.data.itemActions.push({
      text: "Delete",
      icon: "mdi-delete",
      commandName: "Delete"
    });

    this.data.actions.push({
      columns: 0,
      offset: 0,
      controlType: "PrimaryButton",
      commandName: "AddUser",
      label: "Add User",
      className: "text-right",
      icon: "plus"
    });

    this.data.headers = [
      { value: "avatar", sortable: false, width: "5%" },
      { text: "Email", value: "email" },
      { text: "Name", value: "fullName" },
      { text: "Role", value: "role" },
      { text: "Status", value: "status" },
      { value: "action", sortable: false, width: "10%" }
    ];
  }
}
</script>