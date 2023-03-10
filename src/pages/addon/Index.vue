<template>
  <v-container fluid class="pa-8" v-if="data">
    <h2 class="text-uppercase ma-2">Add-Ons</h2>
    <add-on-grid :gridData="data"></add-on-grid>
  </v-container>
</template>

<script lang="ts">
import { Component, Inject } from "vue-property-decorator";

import { Settings } from "@/config";
import { AddOnRequest, GridModel, AddOnModel, GridHeaderModel } from "@/model";
import { IChannelService } from "@/service";
import { BaseComponent } from "@/components/base";
import AddOnGrid from "./components/AddOnGrid.vue";

@Component({
  components: { AddOnGrid }
})
export default class AddOnPage extends BaseComponent {
  @Inject("channelService") channelService: IChannelService;

  data: GridModel<AddOnRequest> = null;

  mounted() {
    this.data = new GridModel(AddOnRequest);
    this.data.request.pageSize = Settings.PricingGridPageSize;

    this.data.actions.push({
      columns: 2,
      controlType: "Search",
      commandName: "SearchFilter"
    });

    this.data.actions.push({
      columns: 2,
      controlType: "Select",
      commandName: "ChannelFilter",
      items: this.channelService.getListItems(true)
    });

    this.data.actions.push({
      columns: 0,
      controlType: "Export",
      commandName: "Export",
      label: "Export to Excel"
    });

    this.data.actions.push({
      columns: 0,
      controlType: "PrimaryButton",
      commandName: "AddAddOn",
      label: "Add AddOn",
      icon: "plus",
      hidden: () => { return !this.isAdmin }
    });

    this.data.itemActions.push({
      text: "Edit",
      icon: "mdi-pencil",
      commandName: "Edit"
    });

    this.data.itemActions.push({
      text: "Delete",
      icon: "mdi-delete",
      commandName: "Delete",
      disable: (item: AddOnModel) => {
        return item.subscriptionCount > 0;
      }
    });

   this.data.headers = [
      { text: "Name", value: "addOnName" },
      { text: "Channel", value: "channel", width: "10%" },
      {
        text: "Subscriptions",
        value: "subscriptionCount",
        width: "10%",
        align: "end"
      },
      { text: "Created By", value: "createdBy", width: "15%" }
    ];

    if (this.isAdmin)
      this.data.headers.push({ value: "action", sortable: false, width: "10%" });
  }
}
</script>