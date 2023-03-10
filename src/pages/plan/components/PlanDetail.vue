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
        <v-stepper v-model="stepNumber" ref="stepper">
          <v-stepper-header>
            <v-stepper-step
              :complete="stepNumber > 1"
              step="1"
              :rules="[() => $vuehelper.step.error($v, 1, stepNumber)]"
            ></v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="stepNumber > 2"
              step="2"
              :rules="[() => $vuehelper.step.error($v, 2, stepNumber)]"
            ></v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="stepNumber > 3"
              step="3"
              :rules="[() => $vuehelper.step.error($v, 3, stepNumber)]"
            ></v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container>
                <v-text-field
                  label="Name of Plan"
                  type="text"
                  v-model="plan.planName"
                  required
                  @input="$v.plan.planName.$touch"
                  :error-messages="$v.plan.planName | errorMessages('Plan Name')"
                />
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Amount"
                      type="number"
                      v-model="plan.fee"
                      required
                      @input="$v.plan.fee.$touch"
                      :error-messages="$v.plan.fee | errorMessages('Amount')"
                    >
                      <template v-slot:prepend>
                        <span class="mt-2 mr-2">$</span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="periods"
                      v-model="plan.feePeriod"
                      @change="$v.plan.feePeriod.$touch"
                    >
                      <template v-slot:prepend>
                        <span class="mt-2 mr-2">Per</span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-select
                  :items="paymentDues"
                  label="Payment Due"
                  name="paymentDue"
                  prepend-icon="mdi-update"
                  v-model="plan.paymentDue"
                  required
                  @change="$v.plan.paymentDue.$touch"
                  :error-messages="$v.plan.paymentDue | errorMessages('Due Date')"
                ></v-select>
                <v-select :items="channels" v-model="plan.channel">
                  <template v-slot:prepend>
                    <span class="mt-2 mr-2" style="white-space: nowrap;">Applies to</span>
                  </template>
                  <template v-slot:append-outer>
                    <span class="mt-2 ml-2" style="white-space: nowrap;">sales channel</span>
                  </template>
                </v-select>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-container>
                <v-data-table
                  hide-default-footer
                  fixed-header
                  height="300"
                  :headers="addOnHeaders"
                  :items="activeAddOns"
                  disable-pagination
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-dialog v-model="addOnDialog" max-width="400px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="blue" small dark class="mb-2" v-on="on" primary>New Item</v-btn>
                        </template>
                        <v-card>
                          <v-card-text>
                            <v-container>
                              <v-select
                                :items="addOns"
                                item-text="addOnName"
                                item-value="addOnId"
                                v-model="selectedItem.addOnId"
                                label="Select Add-On"
                                prepend-icon="mdi-puzzle"
                                single-line
                              ></v-select>
                              <v-text-field
                                v-model="selectedItem.price"
                                prepend-icon="mdi-currency-usd"
                                label="Price"
                              ></v-text-field>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeAddOn">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="saveAddOn">Save</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.price="{ item }">{{ item.price | currencyDisplay }}</template>
                  <template v-slot:item.action="{ item }">
                    <v-icon small class="mr-2" @click="editAddOn(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteAddOn(item)">mdi-delete</v-icon>
                  </template>
                </v-data-table>
                <!-- 
                <v-form ref="form" lazy-validation>
                  <v-row>
                    <v-col></v-col>
                    <v-col class="text-right">
                      <v-btn small color="blue" class="white--text" @click="addAddOns()">Add AddOns</v-btn>
                    </v-col>
                  </v-row>
                  <v-simple-table fixed-header dense height="300px">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>Add-Ons</th>
                          <th>Price</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="array in plan.planAddOns" :key="array.addOn">
                          <td>
                            <v-select :items="addOn" label="Add Ons" required v-model="array.addOn"></v-select>
                          </td>
                          <td>
                            <v-text-field
                              label="Price"
                              type="number"
                              v-model="array.addOnPrice"
                              required
                            />
                          </td>
                          <td>
                            <v-btn small text icon color="dark grey" @click="deleteField(array)">
                              <v-icon small dark right>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-form>-->
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-container class="pt-12">
                <v-card flat color="transparent">
                  <!-- <v-subheader class="mb-6">
                    <v-icon>mdi-vector-arrange-below</v-icon>
                    <span class="pl-2">AUM Range</span>
                  </v-subheader>-->
                  <v-card-text>
                    <v-range-slider
                      v-model="aumRange"
                      min="1"
                      max="1000"
                      class="align-center"
                      thumb-label="always"
                      color="orange darken-3"
                      label="AUM Range"
                    />
                  </v-card-text>
                  <!-- <v-subheader class="mb-6">
                    <v-icon>mdi-account-group</v-icon>
                    <span class="pl-2">Client Count Range</span>
                  </v-subheader>-->
                  <v-card-text>
                    <v-range-slider
                      v-model="clientCountRange"
                      min="1"
                      max="1000"
                      class="align-center"
                      thumb-label="always"
                      color="purple darken-3"
                      label="Client Count Range"
                    />
                  </v-card-text>
                </v-card>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="stepNumber = --stepNumber" v-if="stepNumber > 1">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="close">Exit</v-btn>
        <v-btn
          color="primary"
          @click="nextStep()"
          :disabled="!valid"
        >{{ stepNumber == stepCount ? 'Save' : 'Next' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";
import {
  PlanModel,
  AddOnModel,
  PlanAddOnModel,
  ListItem,
  PlanRequest,
  AlertType
} from "@/model";
import { IPlanService, IAddOnService, IChannelService } from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  plan: {
    planName: { required },
    fee: { required },
    feePeriod: { required },
    paymentDue: { required },
    channel: { required }
  },
  valGroup: {
    step1: [
      "plan.planName",
      "plan.fee",
      "plan.feePeriod",
      "plan.paymentDue",
      "plan.channel"
    ],
    step2: [],
    step3: []
  }
};

@Component({
  validations: validations
})
export default class PlanDetail extends BaseDialogComponent<PlanModel> {
  @Inject("planService") service: IPlanService;
  @Inject("channelService") channelService: IChannelService;
  @Inject("addOnService") addonService: IAddOnService;

  plan: PlanModel = new PlanModel();
  periods: Array<ListItem> = [];
  channels: Array<ListItem> = [];
  title: string = "Add Plan";
  paymentDues: Array<ListItem> = [];
  addOns: Array<AddOnModel> = [];

  addOnDialog: boolean = false;
  activeAddOns: Array<PlanAddOn> = [];
  selectedItem: PlanAddOn = new PlanAddOn();

  public mounted() {
    this.stepCount = 3;

    this.paymentDues.push(new ListItem("Due On Receipt", "Due On Receipt"));
    this.paymentDues.push(new ListItem("Net 30", "Net 30"));

    if (this.data && this.data.planId) {
      this.service.getItem(this.data.planId.toString()).then(plan => {
        this.bind(plan);
      });
    } else this.bind(this.$vuehelper.clone(this.data));

    this.addonService.getAll().then(response => {
      this.addOns = response.data;
    });
  }

  bind(plan: PlanModel) {
    this.plan = plan;
    if (this.plan.planId) this.title = "Edit Plan";
    if (!this.plan.planAddOns) this.plan.planAddOns = [];

    this.activeAddOns = [];
    this.plan.planAddOns.forEach(a => {
      if (a.addOn)
        this.activeAddOns.push(
          new PlanAddOn(
            a.planAddonId,
            a.addOn.addOnName,
            a.addOn.addOnId,
            a.addOnFee
          )
        );
    });

    this.service.getTerms().then(items => {
      this.periods = items;

      if (!this.plan.feePeriod) this.plan.feePeriod = this.periods[0].value;
    });

    if (!this.plan.createdBy) this.plan.createdBy = this.currentUser.fullName;

    this.channelService.getListItems().then(items => {
      this.channels = items;

      if (!this.plan.channel) this.plan.channel = this.channels[0].value;
    });

    this.open(this.plan.planId > 0);
  }

  save() {
    if (this.valid) {
      this.service.isNameExists(this.plan).then(exists => {
        if (exists) {
          this.alert(
            `Plan with name '${this.plan.planName}' already exists.`,
            AlertType.Warning
          );
        } else {
          this.plan.planAddOns = [];
          this.activeAddOns.forEach(a => {
            let item = new PlanAddOnModel();
            item.planAddonId = a.id;
            item.planId = this.plan.planId;
            item.addOnFee = a.price;
            item.addOn = this.addOns.find(b => b.addOnId == a.addOnId);

            this.plan.planAddOns.push(item);
          });

          this.service.post(this.plan).then(
            (r: any) => this.onSave(),
            (e: any) => this.error(e)
          );
        }
      });
    } else {
      console.log(this.$v);
    }
  }

  get valid() {
    if (!this.plan.planId) {
      return this.$vuehelper.step.valid(this.$v, this.stepNumber);
    }

    return true;
  }

  get aumRange() {
    return [this.plan.aumMin, this.plan.aumMax];
  }

  set aumRange(value: Array<number>) {
    this.plan.aumMin = value[0];
    this.plan.aumMax = value[1];
  }

  get clientCountRange() {
    return [this.plan.clientCountMin, this.plan.clientCountMax];
  }

  set clientCountRange(value: Array<number>) {
    this.plan.clientCountMin = value[0];
    this.plan.clientCountMax = value[1];
  }

  editAddOn(item: PlanAddOn) {
    this.addOnDialog = true;

    this.selectedItem = this.$vuehelper.clone(item);
  }

  saveAddOn() {
    let addOn = this.addOns.find(a => a.addOnId == this.selectedItem.addOnId);
    if (addOn) this.selectedItem.addOnName = addOn.addOnName;

    let item = this.activeAddOns.find(
      p => p.addOnId == this.selectedItem.addOnId
    );
    if (item) {
      item.addOnName = this.selectedItem.addOnName;
      item.addOnId = this.selectedItem.addOnId;
      item.price = this.selectedItem.price;
    } else
      this.activeAddOns.push(
        new PlanAddOn(
          this.selectedItem.id,
          this.selectedItem.addOnName,
          this.selectedItem.addOnId,
          this.selectedItem.price
        )
      );

    this.closeAddOn();
  }

  deleteAddOn(item: PlanAddOn) {
    let di = this.activeAddOns.find(a => a.addOnId == item.addOnId);
    if (di) {
      let index = this.activeAddOns.indexOf(di);
      this.activeAddOns.splice(index, 1);
    }
  }

  closeAddOn() {
    this.addOnDialog = false;

    this.selectedItem = new PlanAddOn();
  }

  addOnHeaders: any = [
    { text: "Add-On", sortable: false, value: "addOnName" },
    { text: "Price", sortable: false, value: "price" },
    { value: "action", sortable: false, align: "end" }
  ];
}

class PlanAddOn {
  constructor(
    public id?: number,
    public addOnName?: string,
    public addOnId?: number,
    public price?: number
  ) {}
}
</script>