<template>
  <div>
    <v-data-table
      dense
      :headers="gridData.headers"
      :items="response.data"
      :options.sync="options"
      :loading="gridData.request._loading"
      :server-items-length="response.pageInfo.totalResults"
      :footer-props="style.footerProps"
      :height="style.height"
      :class="style.classNames"
      :disable-sort="gridData.disableSort"
      :no-data-text="gridData.message"
    >
      <template v-slot:top>
        <v-toolbar flat dense height="auto" color="transparent">
          <v-row no-gutters align="center" v-if="gridData.title">
            <v-col>
              <v-toolbar-title class="font-weight-bold">{{ gridData.title }}</v-toolbar-title>
            </v-col>
            <v-col>
              <grid-action :actions="gridData.actions" @actionTriggered="onActionTriggered"></grid-action>
            </v-col>
          </v-row>
          <template v-else>
            <grid-action
              :actions="gridData.actions"
              @actionTriggered="onActionTriggered"
              :justify="'start'"
            ></grid-action>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:item.avatar="{ item }">
        <v-avatar color="green" size="24">
          <img v-if="item.avatar" :src="$vuehelper.getImageUrl(item.avatar)" />
          <span v-else class="white--text font-weight-light">{{item.firstName.charAt(0)}}</span>
        </v-avatar>
      </template>

      <template v-slot:item.action="{ item }">
        <grid-row-action
          :actions="gridData.itemActions"
          :item="item"
          @actionTriggered="onRowActionTriggered(item, ...arguments)"
        ></grid-row-action>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
    <component v-bind:is="dialog.component" :data="dialog.data" @close="close" v-if="dialog"></component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject } from "vue-property-decorator";

import {
  UserRequest,
  GridModel,
  GridActionModel,
  GridItemActionModel,
  DialogModel,
  UserModel
} from "@/model";
import { IUserService } from "@/service";
import { BaseGridComponent } from "@/components/base";
import GridAction from "@/components/grid/GridAction.vue";
import GridRowAction from "@/components/grid/GridRowAction.vue";
import UserDetail from "./UserDetail.vue";

@Component({
  components: { GridAction, GridRowAction, UserDetail }
})
export default class UserGrid extends BaseGridComponent<
  UserRequest,
  UserModel
> {
  @Inject() userService: IUserService;

  users: Array<UserModel> = [];

  created() {
    this.init(this.userService);
  }

  dialog: DialogModel<UserModel> = null;
  bindUsers() {
    let request = new UserRequest();
    request._skipPaging = true;

    this.userService.getItems(request).then(response => {
      this.users = response.data.filter(u => u.fullName);
    });
  }

  getItems() {
    let action = this.gridData.actions.find(a => a.commandName == "RoleFilter");
    if (action) this.gridData.request.role = action.commandValue;

    super.getItems();
  }

  onActionTriggered(action: GridActionModel) {
    switch (action.commandName) {
      case "AddUser":
        this.openAddUser(new UserModel());
        break;
      default:
        this.refresh();
        break;
    }
  }

  onRowActionTriggered(item: UserModel, action: GridItemActionModel) {
    switch (action.commandName) {
      case "Edit":
        this.openAddUser(item);

        break;
      case "Delete":
        this.confirm(
          "Delete",
          `Are you sure you want to delete '${item.userName}'?`
        ).then((confirm: any) => {
          if (confirm) {
            this.userService.delete(item.userId.toString()).then(() => {
              this.refresh();
            });
          }
        });
    }
  }

  openAddUser(user: UserModel) {
    this.dialog = new DialogModel<UserModel>();
    this.dialog.component = UserDetail;
    this.dialog.data = user;
  }

  close(save: boolean) {
    this.dialog = new DialogModel<UserModel>();

    if (save) this.refresh();
  }
}
</script>
