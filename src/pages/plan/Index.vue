<template>
  <v-container fluid class="pa-8" v-if="data">
    <h2 class="text-uppercase ma-2">Plans</h2>
    <plan-grid :gridData="data"></plan-grid>
  </v-container>
</template>

<script lang="ts">
import { Component, Inject } from "vue-property-decorator";

import { Settings } from '@/config';
import { PlanRequest, GridModel, PlanModel } from "@/model";
import { IChannelService } from "@/service";
import { BaseComponent } from '@/components/base';
import PlanGrid from "./components/PlanGrid.vue";

@Component({
  components: { PlanGrid }
})
export default class PlanPage extends BaseComponent {
  @Inject("channelService") channelService: IChannelService;

  data: GridModel<PlanRequest> = null;

  mounted() {
    this.data = new GridModel(PlanRequest);
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
      commandName: "AddPlan",
      label: "Add Plan",
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
      disable: (item: PlanModel) => { return item.subscriptionCount > 0 }
    });

    this.data.headers = [
      { text: "Name", value: "planName" },
      { text: "Channel", value: "channel", width: "10%" },
      { text: "Pricing", value: "fee", width: "15%", class: "y-price-align", sorted: true },
      { text: "Payment Due", value: "paymentDue", width: "15%" },
      { text: "Subscriptions", value: "subscriptionCount", width: "10%", align: "end" },
      { text: "Created By", value: "createdBy", width: "15%" }
    ];

    if (this.isAdmin)
      this.data.headers.push({ value: "action", sortable: false, width: "10%" });
  }
}
</script>