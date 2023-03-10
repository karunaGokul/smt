<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="9">
              <v-text-field
                label="Name of the Discount"
                type="text"
                v-model="discount.discountName"
                required
                @input="$v.discount.discountName.$touch"
                :error-messages="$v.discount.discountName | errorMessages('Discount Name')"
              />
            </v-col>
            <v-col cols="3">
              <v-select
                :items="discountTypes"
                label="Discount Type"
                v-model="discount.discountType"
                @input="$v.discount.discountType.$touch"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-text-field
            v-if="discount.discountType!='Flat Dollar'"
            label="Percent"
            type="number"
            v-model="discount.percentage"
            required
            @input="$v.discount.percentage.$touch"
            :error-messages="$v.discount.percentage | errorMessages('Percent')"
          >
            <template v-slot:prepend>
              <span class="mt-2 mr-2" style="white-space: nowrap;">Apply discount % of</span>
            </template>
          </v-text-field>
          <v-text-field
            v-if="discount.discountType=='Flat Dollar'"
            label="Dollar"
            type="number"
            v-model="discount.percentage"
            required
            @input="$v.discount.percentage.$touch"
            :error-messages="$v.discount.percentage | errorMessages('Dollar')"
          >
            <template v-slot:prepend>
              <span class="mt-2 mr-2" style="white-space: nowrap;">Apply discount $ of</span>
            </template>
          </v-text-field>
          <v-select :items="channels" v-model="discount.channel">
            <template v-slot:prepend>
              <span class="mt-2 mr-2" style="white-space: nowrap;">For</span>
            </template>
            <template v-slot:append-outer>
              <span class="mt-2 ml-2" style="white-space: nowrap;">sales channel</span>
            </template>
          </v-select>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save" :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";
import { DiscountModel, ListItem, DiscountRequest, AlertType } from "@/model";
import { IDiscountService, IChannelService } from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  discount: {
    discountName: { required },
    percentage: { required },
    channel: { required },
    discountType: { required }
  }
};

@Component({
  validations: validations
})
export default class DiscountDetail extends BaseDialogComponent<DiscountModel> {
  @Inject("discountService") service: IDiscountService;
  @Inject("channelService") channelService: IChannelService;

  discount: DiscountModel = new DiscountModel();
  channels: Array<ListItem> = [];
  title: string = "Add Discount";
  discountTypes: Array<ListItem> = [];

  public mounted() {
    this.discount = this.$vuehelper.clone(this.data);
    this.discountTypes.push(new ListItem("Program", "Program"));
    this.discountTypes.push(new ListItem("Flat Dollar", "Flat Dollar"));
    this.discountTypes.push(new ListItem("Coupon", "Coupon"));

    if (this.discount.discountId) this.title = "Edit Discount";

    if (!this.discount.createdBy)
      this.discount.createdBy = this.currentUser.fullName;

    this.channelService.getListItems().then(items => {
      this.channels = items;

      if (!this.discount.channel)
        this.discount.channel = this.channels[0].value;
    });

    this.open(this.data.discountId > 0);
  }

  save() {
    if (this.valid) {
      this.service.isNameExists(this.discount).then(exists => {
        if (exists) {
          this.alert(
            `Discount with name '${this.discount.discountName}' already exists.`,
            AlertType.Warning
          );
        } else {
          this.service.post(this.discount).then(
            (r: any) => this.onSave(),
            (e: any) => this.error(e)
          );
        }
      });
    } else {
      console.log(this.$v);
    }
  }
}
</script>