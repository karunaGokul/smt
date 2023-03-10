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
            <span :class="style.fieldClasses" v-on="on">{{ item.plan.channel }}</span>
          </template>
          <span>{{ item.plan.channel }}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.startsOn="{ item }">
        <v-tooltip bottom v-if="item.startsOn">
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.startsOn | dateDisplay }}</span>
          </template>
          <span>{{ item.startsOn | dateDisplay('dddd, MMMM DD, YYYY') }}</span>
        </v-tooltip>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.cancelledOn="{ item }">
        <v-tooltip bottom v-if="item.cancelledOn">
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.cancelledOn | dateDisplay }}</span>
          </template>
          <span>{{ item.cancelledOn | dateDisplay('dddd, MMMM DD, YYYY') }}</span>
        </v-tooltip>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.endsOn="{ item }">
        <v-tooltip bottom v-if="item.endsOn">
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.endsOn | dateDisplay }}</span>
           
          </template>
          <span>{{ item.endsOn | dateDisplay('dddd, MMMM DD, YYYY') }}</span>
           
        </v-tooltip>
        
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.term="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.term }}</span>
          </template>
          <span>{{ item.term }}</span>
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
      <template v-slot:item.totalFee="{ item }">{{ item.totalFee | currencyDisplay }}</template>
      <template v-slot:item.plansAndAddOns="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ getPlanAddOnText(item) }}</span>
          </template>
          <span>{{ getPlanAddOnText(item) }}</span>
        </v-tooltip>
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
          :actions="gridData.itemActions"
          :item="item"
          @actionTriggered="onRowActionTriggered(item, ...arguments)"
        ></grid-row-action>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
    <component v-bind:is="dialog.component" :data="dialog.data" :name="dialog.name" @close="close" v-if="dialog"></component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject } from "vue-property-decorator";

import {
  SubscriptionRequest,
  SubscriptionModel,
  GridModel,
  GridActionModel,
  GridItemActionModel,
  DialogModel
} from "@/model";
import { ISubscriptionService } from "@/service";
import { BaseGridComponent } from "@/components/base";
import GridAction from "@/components/grid/GridAction.vue";
import GridRowAction from "@/components/grid/GridRowAction.vue";
import SubscriptionDetail from "./SubscriptionDetail.vue";
import CancelSubscription from "./CancelSubscription.vue";

@Component({
  components: { GridAction, GridRowAction }
})
export default class SubscriptionGrid extends BaseGridComponent<
  SubscriptionRequest,
  SubscriptionModel
> {
  @Inject("subscriptionService") service: ISubscriptionService;

  dialog: DialogModel<SubscriptionModel> = null;

  created() {
    this.init(this.service);

    this.$root.$on("subscriptionChanged", () => {
      this.refresh();
    });

    this.$root.$on("subscriptionSearch", (name: string) => {
      this.gridData.actions[0].commandValue = name;

      this.refresh();
    });
  }

  getItems() {
    let action = this.gridData.actions.find(
      a => a.commandName == "ChannelFilter"
    );
    if (action) this.gridData.request.channel = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "PlanFilter");
    if (action) this.gridData.request.plan = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "AddOnFilter");
    if (action) this.gridData.request.addOn = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "StatusFilter");
    if (action) this.gridData.request.status = action.commandValue && action.commandValue.toString();

    action = this.gridData.actions.find(a => a.commandName == "SearchFilter");
    if (action) this.gridData.request.search = action.commandValue;

    super.getItems();
  }

  onActionTriggered(action: GridActionModel) {
    switch (action.commandName) {
      case "Export":
        this.service.export(this.gridData.request, "subscriptions.xlsx");
        break;
      default:
        this.refresh();
        break;
    }
  }

  onRowActionTriggered(item: SubscriptionModel, action: GridItemActionModel) {
    switch (action.commandName) {
      case "Edit":
      case "View":
      case "Renew":
        this.openDetail(action.commandName, item);
        break;
      case "Cancel":
        this.openCancelSubscription(item);
        break;
      default:
        break;
    }
  }

  openDetail(name: string, subscription: SubscriptionModel) {
    this.dialog = new DialogModel<SubscriptionModel>();

    this.dialog.component = SubscriptionDetail;
    this.dialog.name = name;
    this.dialog.data = subscription;
  }

   openCancelSubscription(subscription: SubscriptionModel) {
    this.dialog = new DialogModel<SubscriptionModel>();

    this.dialog.component = CancelSubscription;
    this.dialog.data = subscription;
  }

  close(save: boolean) {
    this.dialog = new DialogModel<SubscriptionModel>();

    if (save) this.refresh();
  }

  getPlanAddOnText(item: SubscriptionModel) {
    let text = item.plan.planName;

    if (item.addOns && item.addOns.length)
      text = `${text} + ${item.addOns.map(a => a.planAddOn.addOn.addOnName).join(" + ")}`;

    return text;
  }
}
</script>
