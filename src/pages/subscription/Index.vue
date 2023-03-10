<template>
  <div class="subscriptions">
    <v-container fluid class="pa-8" v-if="data">
      <h2 class="text-uppercase ma-2">Subscriptions</h2>
      <subscription-grid :gridData="data"></subscription-grid>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from "vue-property-decorator";

import { Settings } from "@/config";
import { SubscriptionRequest, GridModel, SubscriptionModel } from "@/model";
import {
  IChannelService,
  IPlanService,
  IAddOnService,
  ISubscriptionService
} from "@/service";
import SubscriptionGrid from "./components/SubscriptionGrid.vue";

@Component({
  components: { SubscriptionGrid }
})
export default class SubscriptionPage extends Vue {
  @Inject("channelService") channelService: IChannelService;
  @Inject("planService") planService: IPlanService;
  @Inject("addOnService") addOnService: IAddOnService;
  @Inject("subscriptionService") subscriptionService: ISubscriptionService;

  @Prop() search: string;

  data: GridModel<SubscriptionRequest> = null;

  mounted() {
    this.data = new GridModel(SubscriptionRequest);
    this.data.request.pageSize = Settings.GridPageSize;

    this.data.actions.push({
      columns: 2,
      controlType: "Search",
      commandName: "SearchFilter",
      commandValue: this.search
    });

    this.data.actions.push({
      columns: 2,
      controlType: "Select",
      commandName: "ChannelFilter",
      items: this.channelService.getListItems(true)
    });

    this.data.actions.push({
      columns: 2,
      controlType: "MultiSelect",
      label: "All Plans",
      commandName: "PlanFilter",
      items: this.planService.getListItems()
    });

    this.data.actions.push({
      columns: 2,
      controlType: "MultiSelect",
      label: "All AddOns",
      commandName: "AddOnFilter",
      items: this.addOnService.getListItems()
    });

    this.data.actions.push({
      columns: 2,
      controlType: "MultiSelect",
      label: "All Statuses",
      commandName: "StatusFilter",
      commandValue: ["New", "Renewed"],
      items: this.subscriptionService.getStatuses()
    });

    this.data.actions.push({
      columns: 0,
      controlType: "Export",
      commandName: "Export",
      label: "Export to Excel"
    });

    this.data.itemActions.push({
      text: "Edit",
      icon: "mdi-pencil",
      commandName: "Edit",
      disable: (item: SubscriptionModel) => {
        return item.status === "Cancelled";
      }
    });

    this.data.itemActions.push({
      icon: "mdi-settings",
      commandName: "DropMenu",
      text: "Settings",
      links: [
        {
          text: "View Subscription",
          icon: "mdi-eye-outline",
          commandName: "View"
        },
        {
          text: "Renew Subscription",
          icon: "mdi-autorenew",
          commandName: "Renew",
          disable: (item: SubscriptionModel) => {
            return item.status === "Cancelled";
          }
        },
        {
          text: "Cancel Subscription",
          icon: "mdi-cancel",
          commandName: "Cancel",
          disable: (item: SubscriptionModel) => {
            return item.status === "Cancelled";
          }
        }
      ]
    });

    this.data.headers = [];

      this.data.headers.push({ text: "Firm", value: "firmName", width: "20%" });
      this.data.headers.push({ text: "Channel", value: "channel" });
      if (!this.$vuetify.breakpoint.smOnly)
        this.data.headers.push({text: "Plans & Add-Ons", sortable: false, value: "plansAndAddOns", width: "20%"});
      this.data.headers.push({ text: "Term", value: "term", width: "10%" });
      this.data.headers.push({ text: "Status", value: "status", width: "10%" });
      this.data.headers.push({ text: "Starts", value: "startsOn", width: "8%" });
      this.data.headers.push({ text: "Expires", value: "endsOn", width: "8%" });
      this.data.headers.push({ text: "MRR($)", value: "totalFee", width: "8%", align: "end" });
      this.data.headers.push({ value: "action", sortable: false, width: "5%" });
  }
}
</script>