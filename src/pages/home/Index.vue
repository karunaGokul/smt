<template>
  <v-container fluid>
    <h2 class="text-uppercase ma-3">Dashboard</h2>
    <v-row v-if="trialData">
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <trial-grid :gridData="trialData.trialsNotStarted"></trial-grid>
        </v-card>
      </v-col>
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <trial-grid :gridData="trialData.trialsExpiring"></trial-grid>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="subscriptionData">
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <subscription-grid :gridData="subscriptionData.subscriptionStarted"></subscription-grid>
        </v-card>
      </v-col>
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <subscription-grid :gridData="subscriptionData.subscriptionRenewing"></subscription-grid>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="subscriptionData">
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <subscription-grid :gridData="subscriptionData.subscriptionRenewed"></subscription-grid>
        </v-card>
      </v-col>
      <v-col md="6" sm="12">
        <v-card class="ma-3 pa-3 elevation-4" outlined>
          <subscription-grid :gridData="subscriptionData.subscriptionCancelled"></subscription-grid>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import {
  Dictionary,
  TrialRequest,
  GridModel,
  GridHeaderModel,
  SubscriptionRequest,
  SubscriptionDiscount,
  DateRangeOption
} from "@/model";
import TrialGrid from "@/pages/trial/components/TrialGrid.vue";
import SubscriptionGrid from "@/pages/subscription/components/SubscriptionGrid.vue";
import { ListItem } from "../../model";

@Component({
  components: { TrialGrid, SubscriptionGrid }
})
export default class HomePage extends Vue {
  trialData: Dictionary<GridModel<TrialRequest>> = null;
  subscriptionData: Dictionary<GridModel<SubscriptionRequest>> = null;

  mounted() {
    this.bindTrials();
    this.bindSubscriptions();
  }

  bindTrials() {
    this.trialData = {};

    // Trials not started
    this.trialData.trialsNotStarted = new GridModel(TrialRequest);
    this.trialData.trialsNotStarted.request.status = ["Not Started"];
    this.trialData.trialsNotStarted.title = "Trials Not Started";
    this.trialData.trialsNotStarted.height = 194;
    this.trialData.trialsNotStarted.disableSort = true;

    this.trialData.trialsNotStarted.actions.push({
      columns: 1,
      offset: 11,
      controlType: "Refresh",
      commandName: "ConnectToZoho"
    });

    this.trialData.trialsNotStarted.itemActions.push({
      text: "Start",
      commandName: "StartTrial"
    });

    this.trialData.trialsNotStarted.headers = this.getHeaders(
      20,
      "trialsNotStarted"
    );

    // Trials Expiring
    this.trialData.trialsExpiring = new GridModel(TrialRequest);
    this.trialData.trialsExpiring.title = "Trials Expiring";
    this.trialData.trialsExpiring.height = 194;
    this.trialData.trialsExpiring.disableSort = true;
    this.trialData.trialsExpiring.request.status = ["Initial", "Extended", "Not Started"];

    this.trialData.trialsExpiring.actions.push({
      columns: 7,
      offset: 1,
      controlType: "DateRange",
      commandName: "DateFilter",
      onChange: (startDate: Date, endDate: Date) => {
        (this.trialData.trialsExpiring.request.startDate = startDate),
          (this.trialData.trialsExpiring.request.endDate = endDate);
      },
      commandValue: DateRangeOption.ThisMonth
    });
    this.trialData.trialsExpiring.actions.push({
      columns: 1,
      offset: 2,
      controlType: "Refresh",
      commandName: "Refresh"
    });

    this.trialData.trialsExpiring.itemActions.push({
      text: "Subscribe",
      commandName: "Subscribe"
    });

    this.trialData.trialsExpiring.itemActions.push({
      text: "Extend",
      commandName: "ExtendTrial"
    });

    this.trialData.trialsExpiring.headers = this.getHeaders(
      32,
      "trialsExpiring"
    );
  }

  bindSubscriptions() {
    this.subscriptionData = {};

    // Subscription started
    this.subscriptionData.subscriptionStarted = new GridModel<
      SubscriptionRequest
    >(SubscriptionRequest);
    this.subscriptionData.subscriptionStarted.request.status = ["New"];
    this.subscriptionData.subscriptionStarted.title = "Subscriptions Started";
    this.subscriptionData.subscriptionStarted.height = 194;
    this.subscriptionData.subscriptionStarted.disableSort = true;

    this.subscriptionData.subscriptionStarted.actions.push({
      columns: 7,
      offset: 1,
      controlType: "DateRange",
      commandName: "DateFilter",
      items: new Promise((resolve, reject) => {
        let data: Array<ListItem> = [];
        data.push(new ListItem("This Week", DateRangeOption.ThisWeek.toString()));
        data.push(new ListItem("Last Week", DateRangeOption.LastWeek.toString()));
        data.push(new ListItem("This Month", DateRangeOption.ThisMonth.toString()));
        data.push(new ListItem("Last Month", DateRangeOption.LastMonth.toString()));

        resolve(data);
      }),
      onChange: (startDate: Date, endDate: Date) => {
        (this.subscriptionData.subscriptionStarted.request.fromStartDate = startDate),
          (this.subscriptionData.subscriptionStarted.request.toStartDate = endDate);
      },
      commandValue: DateRangeOption.ThisMonth
    });
    this.subscriptionData.subscriptionStarted.actions.push({
      columns: 1,
      offset: 2,
      controlType: "Refresh",
      commandName: "Refresh"
    });

    this.subscriptionData.subscriptionStarted.itemActions.push({
      text: "View",
      commandName: "View"
    });

    this.subscriptionData.subscriptionStarted.headers = this.getHeaders(
      20,
      "subscriptionStarted"
    );

    // Subscription renewing
    this.subscriptionData.subscriptionRenewing = new GridModel(
      SubscriptionRequest
    );
    this.subscriptionData.subscriptionRenewing.request.status = ["New"];
    this.subscriptionData.subscriptionRenewing.title = "Subscriptions Renewing";
    this.subscriptionData.subscriptionRenewing.height = 194;
    this.subscriptionData.subscriptionRenewing.disableSort = true;

    this.subscriptionData.subscriptionRenewing.actions.push({
      columns: 7,
      offset: 1,
      controlType: "DateRange",
      commandName: "DateFilter",
      onChange: (startDate: Date, endDate: Date) => {
        (this.subscriptionData.subscriptionRenewing.request.toStartDate = startDate),
          (this.subscriptionData.subscriptionRenewing.request.toEndDate = endDate);
      },
      commandValue: DateRangeOption.ThisMonth
    });
    this.subscriptionData.subscriptionRenewing.actions.push({
      columns: 1,
      offset: 2,
      controlType: "Refresh",
      commandName: "Refresh"
    });

    this.subscriptionData.subscriptionRenewing.itemActions.push({
      text: "Renew",
      commandName: "Renew"
    });

    this.subscriptionData.subscriptionRenewing.itemActions.push({
      text: "Cancel",
      commandName: "Cancel"
    });

    this.subscriptionData.subscriptionRenewing.headers = this.getHeaders(
      30,
      "subscriptionRenewing"
    );

    // Subscription renewed
    this.subscriptionData.subscriptionRenewed = new GridModel(
      SubscriptionRequest
    );
    this.subscriptionData.subscriptionRenewed.request.status = ["New"];
    this.subscriptionData.subscriptionRenewed.request.isRenewed = true;
    this.subscriptionData.subscriptionRenewed.title = "Subscriptions Renewed";
    this.subscriptionData.subscriptionRenewed.height = 194;
    this.subscriptionData.subscriptionRenewed.disableSort = true;

    this.subscriptionData.subscriptionRenewed.actions.push({
      columns: 7,
      offset: 1,
      controlType: "DateRange",
      commandName: "DateFilter",
      items: new Promise((resolve, reject) => {
        let data: Array<ListItem> = [];
        data.push(new ListItem("This Week", DateRangeOption.ThisWeek.toString()));
        data.push(new ListItem("Last Week", DateRangeOption.LastWeek.toString()));
        data.push(new ListItem("This Month", DateRangeOption.ThisMonth.toString()));
        data.push(new ListItem("Last Month", DateRangeOption.LastMonth.toString()));

        resolve(data);
      }),
      onChange: (startDate: Date, endDate: Date) => {
        (this.subscriptionData.subscriptionRenewed.request.fromStartDate = startDate),
          (this.subscriptionData.subscriptionRenewed.request.toStartDate = endDate);
      },
      commandValue: DateRangeOption.ThisMonth
    });
    this.subscriptionData.subscriptionRenewed.actions.push({
      columns: 1,
      offset: 2,
      controlType: "Refresh",
      commandName: "Refresh"
    });

    this.subscriptionData.subscriptionRenewed.itemActions.push({
      text: "View",
      commandName: "View"
    });

    this.subscriptionData.subscriptionRenewed.headers = this.getHeaders(
      30,
      "subscriptionRenewed"
    );

    // Subscription cancelled
    this.subscriptionData.subscriptionCancelled = new GridModel(
      SubscriptionRequest
    );
    this.subscriptionData.subscriptionCancelled.request.status = ["Cancelled"];
    this.subscriptionData.subscriptionCancelled.title =
      "Subscriptions Cancelled";
    this.subscriptionData.subscriptionCancelled.height = 194;
    this.subscriptionData.subscriptionCancelled.disableSort = true;

    this.subscriptionData.subscriptionCancelled.actions.push({
      columns: 7,
      offset: 1,
      controlType: "DateRange",
      commandName: "DateFilter",
      items: new Promise((resolve, reject) => {
        let data: Array<ListItem> = [];
        data.push(new ListItem("This Week", DateRangeOption.ThisWeek.toString()));
        data.push(new ListItem("Last Week", DateRangeOption.LastWeek.toString()));
        data.push(new ListItem("This Month", DateRangeOption.ThisMonth.toString()));
        data.push(new ListItem("Last Month", DateRangeOption.LastMonth.toString()));

        resolve(data);
      }),
      onChange: (startDate: Date, endDate: Date) => {
        (this.subscriptionData.subscriptionCancelled.request.fromStartDate = startDate),
          (this.subscriptionData.subscriptionCancelled.request.toStartDate = endDate);
      },
      commandValue: DateRangeOption.ThisMonth
    });
    this.subscriptionData.subscriptionCancelled.actions.push({
      columns: 1,
      offset: 2,
      controlType: "Refresh",
      commandName: "Refresh"
    });

    this.subscriptionData.subscriptionCancelled.itemActions.push({
      text: "View",
      commandName: "View"
    });

    this.subscriptionData.subscriptionCancelled.headers = this.getHeaders(
      30,
      "subscriptionCancelled"
    );
  }

  getHeaders(actions: number, gridName: String) {
    let headers: any = [];

    headers.push({ text: "Firm", value: "firmName" });
    headers.push({ text: "Channel", value: "channel", width: "15%" });
    headers.push({
      text: "Salesperson",
      value: "salesUser.fullName",
      width: "25%"
    });

    if (gridName == "trialsExpiring" || gridName == "subscriptionRenewing")
      headers.push({ text: "Expires On", value: "endsOn" });
    else if (
      gridName == "subscriptionStarted" ||
      gridName == "subscriptionRenewed"
    )
      headers.push({ text: "Starts On", value: "startsOn" });
    else if (gridName == "subscriptionCancelled")
      headers.push({ text: "Cancels On", value: "cancelledOn" });

    headers.push({ value: "action", sortable: false, width: `${actions}%` });

    return headers;
  }
}
</script>
