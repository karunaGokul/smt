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
      <template v-slot:item.planName="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.planName }}</span>
          </template>
          <span>{{ item.planName }}</span>
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
      <template
        v-slot:item.subscriptionCount="{ item }"
      >{{ item.subscriptionCount ? item.subscriptionCount : 0 }}</template>
      <template v-slot:item.fee="{ item }">
        <div class="y-price-align">
          <span>${{ item.fee }}</span>
          per {{ item.feePeriod.toLowerCase() }}
        </div>
      </template>
      <template v-slot:item.createdBy="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span :class="style.fieldClasses" v-on="on">{{ item.createdBy }}</span>
          </template>
          <span>{{ item.createdBy }}</span>
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
    <component v-bind:is="dialog.component" :data="dialog.data" @close="close" v-if="dialog"></component>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject } from "vue-property-decorator";

import {
  PlanRequest,
  PlanModel,
  GridModel,
  GridActionModel,
  GridItemActionModel,
  DialogModel
} from "@/model";
import { IPlanService } from "@/service";
import { BaseGridComponent } from "@/components/base";
import GridAction from "@/components/grid/GridAction.vue";
import GridRowAction from "@/components/grid/GridRowAction.vue";
import PlanDetail from "./PlanDetail.vue";

@Component({
  components: { GridAction, GridRowAction, PlanDetail }
})
export default class PlanGrid extends BaseGridComponent<
  PlanRequest,
  PlanModel
> {
  @Inject("planService") service: IPlanService;

  dialog: DialogModel<PlanModel> = null;

  created() {
    this.init(this.service);
  }

  getItems() {
    let action = this.gridData.actions.find(
      a => a.commandName == "ChannelFilter"
    );
    if (action) this.gridData.request.channel = action.commandValue;

    action = this.gridData.actions.find(a => a.commandName == "SearchFilter");
    if (action) this.gridData.request.search = action.commandValue;

    super.getItems();
  }

  onActionTriggered(action: GridActionModel) {
    switch (action.commandName) {
      case "AddPlan":
        this.openDetail(new PlanModel());
        break;
      case "Export":
        this.service.export(this.gridData.request, "plans.xlsx");
        break;
      default:
        this.refresh();
        break;
    }
  }

  onRowActionTriggered(item: PlanModel, action: GridItemActionModel) {
    switch (action.commandName) {
      case "Edit":
        this.openDetail(item);
        break;
      case "Delete":
        this.confirm(
          "Delete",
          `Are you sure you want to delete '${item.planName}'?`
        ).then((confirm: any) => {
          if (confirm) {
            this.service.delete(item.planId.toString()).then(() => {
              this.refresh();
            });
          }
        });
        break;
    }
  }

  openDetail(plan: PlanModel) {
    this.dialog = new DialogModel<PlanModel>();

    this.dialog.component = PlanDetail;
    this.dialog.data = plan;
  }

  close(save: boolean) {
    this.dialog = new DialogModel<PlanModel>();

    if (save) this.refresh();
  }
}
</script>
