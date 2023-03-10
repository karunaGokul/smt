<template>
  <v-container fluid class="pa-8" v-if="data">
    <h2 class="text-uppercase ma-2">Trials</h2>
    <trial-grid :gridData="data"></trial-grid>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from "vue-property-decorator";

import { Settings } from "@/config";
import { TrialRequest, GridModel, TrialModel } from "@/model";
import { IChannelService, ITrialService, IUserService } from "@/service";
import TrialGrid from "./components/TrialGrid.vue";

@Component({
  components: { TrialGrid }
})
export default class TrialPage extends Vue {
  @Inject("channelService") channelService: IChannelService;
  @Inject("trialService") trialService: ITrialService;
  @Inject("userService") userService: IUserService;

  @Prop() search: string;

  data: GridModel<TrialRequest> = null;

  mounted() {
    this.data = new GridModel(TrialRequest);
    this.data.request.pageSize = Settings.GridPageSize;

    this.data.actions.push({
      columns: 2,
      offset: 0,
      controlType: "Search",
      commandName: "SearchFilter",
      commandValue: this.search
    });

    this.data.actions.push({
      columns: 2,
      offset: 0,
      controlType: "Select",
      commandName: "ChannelFilter",
      items: this.channelService.getListItems(true)
    });

    this.data.actions.push({
      columns: 3,
      offset: 0,
      controlType: "MultiSelect",
      label: "All SalesPersons",
      commandName: "SalesPersonFilter",
      items: this.userService.getSalesUserList()
    });

    this.data.actions.push({
      columns: 3,
      offset: 0,
      controlType: "MultiSelect",
      label: "All Statuses",
      commandName: "StatusFilter",
      commandValue: ["Initial", "Extended", "Not Started"],
      items: this.trialService.getStatuses()
    });

    this.data.actions.push({
      columns: 0,
      offset: 0,
      controlType: "Export",
      commandName: "Export",
      label: "Export to Excel",
      className: "text-right"
    });


    this.data.itemActions.push({
      icon: "mdi-settings",
      commandName: "DropMenu",
      text: "Settings",
      links: [
         {
          text: "View Trial",
          icon: "mdi-eye-outline",
          commandName: "ViewTrial"
        },
        {
          text: "Subscribe Trial",
          icon: "mdi-play-box-outline",
          commandName: "Subscribe",
          disable: (item: TrialModel) => {
            return item.status == "Not Started";
          }
        },
         {
          text: "Extend Trial",
          icon: "mdi-open-in-new",
          commandName: "ExtendTrial",
          disable: (item: TrialModel) => {
            return item.status == "Not Started";
          }
        },
         {
          text: "Start Trial",
          icon: "mdi-play-circle",
          commandName: "StartTrial",
          disable: (item: TrialModel) => {
            return item.status != "Not Started";
          }
        }
      ]
    });

    this.data.headers = [
      { text: "Firm", value: "firmName" },
      { text: "Channel", value: "channel", width: "10%" },
      { text: "Expires", value: "endsOn", width: "12%" },
      { text: "Status", value: "status", width: "12%" },
      { text: "Salesperson", value: "salesUser.fullName", width: "15%" },
      { text: "Demo By", value: "demoUser.fullName", width: "15%" },
      { value: "action", sortable: false, width: "5%" }
    ];
  }
}
</script>