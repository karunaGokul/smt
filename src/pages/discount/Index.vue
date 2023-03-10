<template>
  <v-container fluid class="pa-8" v-if="data">
    <h2 class="text-uppercase ma-2">Discounts</h2>
    <discount-grid :gridData="data"></discount-grid>
  </v-container>
</template>

<script lang="ts">
import { Component, Inject } from "vue-property-decorator";

import { Settings } from '@/config';
import { DiscountRequest, GridModel, DiscountModel } from "@/model";
import { IChannelService,IDiscountService } from "@/service";
import { BaseComponent } from '@/components/base';
import DiscountGrid from "./components/DiscountGrid.vue";

@Component({
  components: { DiscountGrid }
})
export default class DiscountPage extends BaseComponent {
  @Inject("channelService") channelService: IChannelService;
  @Inject("discountService") discountService: IDiscountService;


  data: GridModel<DiscountRequest> = null;

  mounted() {
    this.data = new GridModel(DiscountRequest);
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
      columns: 2,
      controlType: "Select",
      commandName: "DiscountTypeFilter",
      items: this.discountService.getDiscountTypes(true)
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
      commandName: "AddDiscount",
      label: "Add Discount",
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
      disable: (item: DiscountModel) => { return item.subscriptionCount > 0 }
    });

    this.data.headers = [
      { text: "Name", value: "discountName" },
      { text: "Channel", value: "channel", width: "15%" },
      { text: "Discount Type", value: "discountType", width: "10%", align: "center" },
      { text: "Discount By", value: "percentage", width: "20%", align: "end",sortable: false },
      { text: "Subscriptions", value: "subscriptionCount", width: "10%", align: "end" },
      { text: "Created By", value: "createdBy", width: "15%" }
    ];

    if (this.isAdmin)
      this.data.headers.push({ value: "action", sortable: false, width: "10%" });
  }
}
</script>