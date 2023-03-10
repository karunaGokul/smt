<template>
  <div>
    <v-data-table
      dense
      :headers="gridData.headers"
      :items="response.data"
      :options.sync="options"
      :server-items-length="response.pageInfo.totalResults"
      :loading="gridData.request._loading"
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
            <v-col :cols="$vuetify.breakpoint.smAndUp ? 0 : 12">
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
      <template v-slot:item.firmName="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.firmName }}</span>
          </template>
          <span>{{ item.firmName }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.channel="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.channel }}</span>
          </template>
          <span>{{ item.channel }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.status="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.status }}</span>
          </template>
          <span>{{ item.status }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.endsOn="{ item }">
        <v-tooltip bottom v-if="item.endsOn">
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.endsOn | dateDisplay }}</span>
          </template>
          <span>{{ item.endsOn | dateDisplay("dddd, MMMM DD, YYYY") }}</span>
        </v-tooltip>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.salesUser.fullName="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.salesUser.fullName }}</span>
          </template>
          <span>{{ item.salesUser.fullName }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.action="{ item }">
        <grid-row-action
          :item="item"
          :actions="gridData.itemActions"
          @actionTriggered="onRowActionTriggered(item, ...arguments)"
        ></grid-row-action>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
    <component
      v-bind:is="dialog.component"
      :data="dialog.data"
      :name="dialog.name"
      @close="close"
      v-if="dialog"
    ></component>
    <component
      v-bind:is="subscriptionDialog.component"
      :data="subscriptionDialog.data"
      @close="close"
      v-if="subscriptionDialog"
    ></component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject } from "vue-property-decorator";

import { Settings } from "@/config";
import {
  TrialRequest,
  TrialModel,
  GridModel,
  GridActionModel,
  GridItemActionModel,
  DialogModel,
  SubscriptionModel
} from "@/model";
import { ITrialService } from "@/service";
import { BaseGridComponent } from "@/components/base";
import GridAction from "@/components/grid/GridAction.vue";
import GridRowAction from "@/components/grid/GridRowAction.vue";
import TrialDetail from "./TrialDetail.vue";
import ExtendTrial from "./ExtendTrial.vue";
import SubscriptionDetail from "@/pages/subscription/components/SubscriptionDetail.vue";

@Component({
  components: {
    GridAction,
    GridRowAction,
    TrialDetail,
    ExtendTrial,
    SubscriptionDetail
  }
})
export default class TrialGrid extends BaseGridComponent<
  TrialRequest,
  TrialModel
> {
  @Inject("trialService") service: ITrialService;

  dialog: DialogModel<TrialModel> = null;
  subscriptionDialog: DialogModel<SubscriptionModel> = null;
  zohoInProgress: boolean = false;

  created() {
    this.init(this.service);
    this.zohoInProgress = false;

    this.$root.$on("trialChanged", () => {
      this.refresh();
    });

    this.$root.$on("trialSearch", (name: string) => {
      this.gridData.actions[0].commandValue = name;

      this.refresh();
    });
  }

  getItems() {
    let action = this.gridData.actions.find(
      a => a.commandName == "ChannelFilter"
    );
    if (action) this.gridData.request.channel = action.commandValue;

    action = this.gridData.actions.find(
      a => a.commandName == "SalesPersonFilter"
    );
    if (action) this.gridData.request.salesUserId = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "StatusFilter");
    if (action) this.gridData.request.status = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "SearchFilter");
    if (action) this.gridData.request.search = action.commandValue;

    super.getItems();
  }

  onActionTriggered(action: GridActionModel) {
    switch (action.commandName) {
      case "Export":
        this.service.export(this.gridData.request, "trials.xlsx");
        break;
      case "ConnectToZoho":
        this.gridData.request.refreshTrial = true;
        this.refresh();
        break;
      default:
        this.refresh();
        break;
    }
  }

  onRowActionTriggered(item: TrialModel, action: GridItemActionModel) {
    switch (action.commandName) {
      case "StartTrial":
        this.openTrailDetail(item);
        break;
      case "ViewTrial":
        this.openTrailDetail(item, "View");
        break;
      case "ExtendTrial":
        this.openExtendTrail(item);
        break;
      case "Subscribe":
        this.openAddSubscription(item);
        break;
    }
  }

  close() {
    this.dialog = new DialogModel<TrialModel>();
    this.subscriptionDialog = new DialogModel<SubscriptionModel>();
  }

  openTrailDetail(trial: TrialModel, name?: string) {
    this.dialog = new DialogModel<TrialModel>();
    this.dialog.name = name;

    this.dialog.component = TrialDetail;
    this.dialog.data = trial;
  }

  openExtendTrail(trial: TrialModel) {
    this.dialog = new DialogModel<TrialModel>();

    this.dialog.component = ExtendTrial;
    this.dialog.data = trial;
  }

  openAddSubscription(trial: TrialModel) {
    this.subscriptionDialog = new DialogModel<SubscriptionModel>();

    let subscription = new SubscriptionModel();
    subscription.trialId = trial.trialId;
    subscription.firmName = trial.firmName;
    subscription.firmId = trial.firmId;
    subscription.salesUser = trial.salesUser;

    this.subscriptionDialog.component = SubscriptionDetail;
    this.subscriptionDialog.data = subscription;
  }
}
</script>
