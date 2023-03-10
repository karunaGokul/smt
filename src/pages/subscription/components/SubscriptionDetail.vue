<template>
  <v-dialog v-model="show" max-width="900" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p
          class="subtitle-1"
          v-if="name == 'Renew'"
        >Ok, lets get this renewal started for - {{ subscription.firmName }}</p>
        <p
          class="subtitle-1"
          v-else-if="name == 'Edit'"
        >Ok, lets edit subscription for - {{ subscription.firmName }}</p>
        <p
          class="subtitle-1"
          v-else-if="name == 'View'"
        >Subscription for - {{ subscription.firmName }}</p>
        <p
          class="subtitle-1"
          v-else
        >Yay! Let's create a subscription for - {{ subscription.firmName }}</p>
        <v-stepper v-model="stepNumber" ref="stepper">
          <v-stepper-header v-if="name != 'View'">
            <v-stepper-step
              :complete="stepNumber > 1"
              step="1"
              :rules="[() => $vuehelper.step.error($v, 1, stepNumber)]"
            >Dates</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="stepNumber > 2"
              step="2"
              :rules="[() => $vuehelper.step.error($v, 2, stepNumber)]"
            >Plan</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="stepNumber > 3"
              step="3"
              :rules="[() => $vuehelper.step.error($v, 3, stepNumber)]"
            >Add-Ons</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              :complete="stepNumber > 4"
              step="4"
              :rules="[() => $vuehelper.step.error($v, 4, stepNumber)]"
            >Discounts</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="5">Summary</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container v-if="name == 'Renew'">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card outlined class="pa-6 pt-3">
                      <div class="overline mb-6 font-weight-black">Previous</div>
                      <v-text-field
                        label="Start Date"
                        prepend-icon="mdi-calendar-range"
                        :value="data.startsOn | dateDisplay"
                        type="text"
                        disabled
                      />
                      <v-text-field
                        label="Term"
                        prepend-icon="mdi-anchor"
                        :value="data.term"
                        type="text"
                        disabled
                      />
                      <v-text-field
                        label="End Date"
                        prepend-icon="mdi-calendar-range"
                        :value="data.endsOn | dateDisplay"
                        type="text"
                        disabled
                      />
                      <v-text-field
                        label="Due Date"
                        prepend-icon="mdi-update"
                        :value="data.paymentDue"
                        type="text"
                        disabled
                      />
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card flat class="pa-6 pt-3">
                      <div class="overline mb-6 font-weight-black">New</div>
                      <v-menu
                        v-model="startDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :value="subscription.startsOn | dateDisplay"
                            label="Start Date"
                            prepend-icon="mdi-calendar-range"
                            readonly
                            v-on="on"
                            :error-messages="$v.subscription.startsOn | errorMessages('Start Date')"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="subscription.startsOn"
                          no-title
                          :min="minStartDate"
                          @input="startDate = false"
                          @change="onStartDateChange()"
                        ></v-date-picker>
                      </v-menu>
                      <v-select
                        :items="terms"
                        label="Choose Term"
                        name="term"
                        prepend-icon="mdi-anchor"
                        v-model="selectedTerm"
                        required
                        @change="onTermChange()"
                      ></v-select>
                      <v-menu
                        v-model="endDate"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            :value="subscription.endsOn | dateDisplay"
                            label="End Date"
                            prepend-icon="mdi-calendar-range"
                            readonly
                            v-on="on"
                            :error-messages="$v.subscription.endsOn | errorMessages('End Date')"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="subscription.endsOn"
                          no-title
                          @input="endDate = false"
                          @change="$v.subscription.endsOn.$touch"
                        ></v-date-picker>
                      </v-menu>
                      <v-select
                        :items="paymentDues"
                        label="Payment Due"
                        name="paymentDue"
                        prepend-icon="mdi-update"
                        v-model="subscription.paymentDue"
                        required
                        @change="$v.subscription.paymentDue.$touch"
                        :error-messages="$v.subscription.paymentDue | errorMessages('Due Date')"
                      ></v-select>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
              <v-container v-else>
                <v-subheader>Alright let's start by getting some key dates</v-subheader>

                <v-row no-gutters>
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="startDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="subscription.startsOn | dateDisplay"
                          label="Start Date"
                          prepend-icon="mdi-calendar-range"
                          readonly
                          v-on="on"
                          :error-messages="$v.subscription.startsOn | errorMessages('Start Date')"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="subscription.startsOn"
                        no-title
                        @input="startDate = false"
                        @change="onStartDateChange()"
                      ></v-date-picker>
                    </v-menu>
                    <v-select
                      :items="terms"
                      label="Choose Term"
                      name="term"
                      prepend-icon="mdi-anchor"
                      v-model="selectedTerm"
                      required
                      @change="onTermChange()"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row no-gutters v-if="selectedTerm !== 'Month'">
                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="endDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="subscription.endsOn | dateDisplay"
                          label="End Date"
                          prepend-icon="mdi-calendar-range"
                          readonly
                          v-on="on"
                          :error-messages="$v.subscription.endsOn | errorMessages('End Date')"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="subscription.endsOn"
                        no-title
                        @input="endDate = false"
                        @change="$v.subscription.endsOn.$touch"
                        :min="minEndDate"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-subheader>Specify the plan the firm is signing up for</v-subheader>
              <v-container>
                <v-row>
                  <v-col cols="12" md="7">
                    <v-select
                      :items="plans"
                      item-text="planName"
                      item-value="planId"
                      label="Plan name"
                      name="term"
                      prepend-icon="mdi-rotate-orbit"
                      v-model="subscription.plan.planId"
                      required
                      @change="loadPlanAddOns"
                      :error-messages="$v.subscription.plan.planId | errorMessages('Plan name')"
                    >
                      <template
                        v-slot:item="{ item }"
                      >{{ `${item.planName} - $${item.fee} per ${item.feePeriod.toLowerCase()}`}}</template>
                    </v-select>
                    <v-text-field
                      label="Payment Due"
                      name="paymentDue"
                      prepend-icon="mdi-update"
                      v-model="paymentDue"
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-subheader>Specify the Add-Ons applicable to this firm</v-subheader>
              <v-container>
                <v-row>
                  <v-col cols="12" md="9">
                    <v-select
                      :items="planAddOns"
                      v-model="selectedPlanAddOns"
                      item-text="addOn.addOnName"
                      item-value="planAddonId"
                      label="Select Add-Ons"
                      prepend-icon="mdi-puzzle"
                      multiple
                      single-line
                      chips
                      :error-messages="$v.selectedPlanAddOns | errorMessages('Add-Ons')"
                    >
                      <template
                        v-slot:item="{ item }"
                      >{{ `${item.addOn.addOnName} - $${item.addOnFee}${subscription.plan.feePeriod ? ' per ' + subscription.plan.feePeriod.toLowerCase() : ''}`}}</template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-subheader>Specify the discounts applicable to this firm</v-subheader>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      :items="discounts"
                      v-model="selectedDiscounts"
                      item-text="discountName"
                      item-value="discountId"
                      label="Select Discounts"
                      prepend-icon="mdi-brightness-percent"
                      multiple
                      single-line
                      chips
                      :error-messages="$v.selectedDiscounts | errorMessages('Discounts')"
                    >
                      <template v-slot:item="{ item, on }">
                        <v-list-item v-on="on" v-if="item.discountName">
                          <span
                            v-if="item.discountType == 'Flat Dollar'"
                          >{{ `${item.discountName} - $${item.percentage}` }}</span>
                          <span
                            v-else-if="item.discountType == 'Program'"
                          >{{ `${item.discountName} - ${item.percentage} %` }}</span>
                          <span v-else>{{ item.discountName }}</span>
                        </v-list-item>
                        <v-list-item v-else style="min-height: 12px">
                          <v-divider></v-divider>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6" v-if="isCustomCoupon">
                    <v-select
                      :items="coupons"
                      label="Coupon Code"
                      prepend-icon="mdi-ticket-confirmation"
                      v-model="selectedCoupon"
                      item-text="discountName"
                      item-value="discountId"
                      :error-messages="$v.selectedCoupon | errorMessages('Coupon Code')"
                    >
                      <template
                        v-slot:item="{ item }"
                      >{{ `${item.discountName} - ${item.percentage} %` }}</template>
                    </v-select>
                    <v-text-field
                      v-if="selectedCoupon"
                      :value="selectedCouponPercentage"
                      label="Enter Percentage"
                      prepend-icon="mdi-ticket-percent"
                      disabled
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="5">
              <water-mark v-if="displayWaterMark">
                <template v-slot:content>
                  <p class="display-3">Cancelled</p>
                  <p class="headline">As of {{ subscription.cancelledOn | dateDisplay }}</p>
                </template>
              </water-mark>
              <v-container>
                <v-subheader
                  v-if="name != 'View'"
                >Please review the subscription details below, and click subscribe button if it all looks good</v-subheader>
                <v-row
                  class="fill-height"
                  align-content="center"
                  justify="center"
                  v-if="calculating"
                >
                  <v-col class="subtitle-1 text-center" cols="12">Calculating fees</v-col>
                  <v-col cols="6">
                    <v-progress-linear color="blue" indeterminate rounded height="6"></v-progress-linear>
                  </v-col>
                </v-row>
                <v-row v-else>
                  <v-col cols="12" md="6">
                    <v-list
                      dense
                      class.y-dense="$vuetify.breakpoint.smAndUp"
                      class.y-border-right="$vuetify.breakpoint.smAndUp"
                    >
                      <v-list-item>
                        <v-list-item-content>Term</v-list-item-content>
                        <v-list-item-content
                          class="align-end font-weight-bold"
                        >{{ subscription.startsOn | dateDisplay }} - {{ subscription.endsOn | dateDisplay }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Pays</v-list-item-content>
                        <v-list-item-content
                          class="align-end font-weight-bold"
                        >{{ subscription.invoicePeriod }}ly, {{ subscription.paymentDue }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Plan</v-list-item-content>
                        <v-list-item-content
                          class="align-end font-weight-bold"
                        >{{ subscription.plan.planName }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Channel</v-list-item-content>
                        <v-list-item-content
                          class="align-end font-weight-bold"
                        >{{ subscription.plan.channel }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Add-Ons</v-list-item-content>
                        <v-list-item-content class="align-end font-weight-bold">{{ addOnNames }}</v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Discounts</v-list-item-content>
                        <v-list-item-content class="align-end font-weight-bold">{{ discountNames }}</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list dense>
                      <v-list-item v-if="subscription.plan">
                        <v-list-item-content>{{ subscription.plan.planName }}</v-list-item-content>
                        <v-list-item-content class="align-end font-weight-bold">
                          <div class="y-price-align">
                            <span>{{ subscription.planFee | currencyDisplay }}</span>
                            Per {{ subscription.invoicePeriod }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        v-for="(item, index) in subscription.addOns"
                        :key="'addon' + index"
                      >
                        <v-list-item-content>{{ item.planAddOn.addOn.addOnName }}</v-list-item-content>
                        <v-list-item-content class="align-end font-weight-bold">
                          <div class="y-price-align">
                            <span>{{ item.addOnFee | currencyDisplay }}</span>
                            Per {{ subscription.invoicePeriod }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="font-weight-black">
                        <v-list-item-content>
                          <v-divider dark class="pb-2"></v-divider>&nbsp;
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-divider class="pb-2"></v-divider>
                          <div class="y-price-align">
                            <span>{{ planAndAddOnTotal | currencyDisplay }}</span>
                            Per {{ subscription.invoicePeriod }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        v-for="(item, index) in subscription.discounts"
                        :key="'discount' + index"
                      >
                        <v-list-item-content>{{ item.discount.discountName }}</v-list-item-content>
                        <v-list-item-content class="align-end green--text font-weight-bold">
                          <div class="y-price-align">
                            <span>-{{ item.discountFee | currencyDisplay }}</span>
                            Per {{ subscription.invoicePeriod }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item class="font-weight-black">
                        <v-list-item-content>Total</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <v-divider class="pb-2"></v-divider>
                          <div class="y-price-align">
                            <span>{{ subscription.totalFee | currencyDisplay }}</span>
                            Per {{ subscription.invoicePeriod }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="stepNumber = --stepNumber"
          :disabled="calculating"
          v-if="stepNumber > 1 && name != 'View'"
        >Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Exit</v-btn>
        <v-btn
          color="primary"
          @click="nextStep()"
          :disabled="calculating || !valid"
        >{{ stepNumber == stepCount ? saveButtonText : 'Next' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import {
  SubscriptionModel,
  ListItem,
  PlanModel,
  SubscriptionAddOn,
  AddOnModel,
  DiscountModel,
  SubscriptionDiscount,
  PlanAddOnModel
} from "@/model";
import {
  IUserService,
  ISubscriptionService,
  IPlanService,
  IAddOnService,
  IDiscountService,
  IPlanAddOnService
} from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  subscription: {
    startsOn: { required },
    endsOn: { required },
    paymentDue: { required },
    term: {},

    plan: {
      planId: { required }
    },
    invoicePeriod: { required }
  },
  selectedPlanAddOns: {},
  selectedDiscounts: {},
  selectedCoupon: {},
  valGroup: {
    step1: ["subscription.startsOn", "subscription.endsOn"],
    step2: ["subscription.plan.planId"],
    step3: ["selectedPlanAddOns"],
    step4: ["selectedDiscounts", "selectedCoupon"],
    step5: []
  }
};

@Component({
  validations: validations
})
export default class SubscriptionDetail extends BaseDialogComponent<
  SubscriptionModel
> {
  @Inject("subscriptionService") service: ISubscriptionService;
  @Inject("planService") planService: IPlanService;
  @Inject("addOnService") addOnService: IAddOnService;
  @Inject("discountService") discountService: IDiscountService;
  @Inject("planAddOnService") planAddOnService: IPlanAddOnService;

  startDate: boolean = false;
  endDate: boolean = false;
  dueDate: boolean = false;
  terms: Array<ListItem> = [];
  paymentDues: Array<ListItem> = [];

  plans: Array<PlanModel> = [];

  selectedPlanAddOns: Array<number> = [];

  discounts: Array<DiscountModel> = [];

  selectedDiscounts: Array<number> = [];
  coupons: Array<DiscountModel> = [];

  selectedCoupon: number = null;
  selectedTerm: string = "";
  subscription = new SubscriptionModel();
  calculating: boolean = false;
  planAndAddOnTotal: number = 0;
  title: string = "Add Subscription";

  bindListItems() {
    this.service.getTerms().then(items => {
      this.terms = items;

      if (!this.selectedTerm) {
        this.selectedTerm = this.terms[0].value;
        this.subscription.term = this.selectedTerm;
      }
    });
    this.service.getPaymentDues().then(items => {
      this.paymentDues = items;
    });

    this.planService.getAll().then(response => {
      this.plans = response.data;
      this.plans.sort((obj1, obj2) => {
        if (obj1.fee > obj2.fee) return 1;

        if (obj1.fee < obj2.fee) return -1;

        return 0;
      });
    });

    this.discountService.getAll().then(response => {
      response.data.sort((obj1, obj2) => {
        if (obj1.percentage > obj2.percentage) return 1;

        if (obj1.percentage < obj2.percentage) return -1;

        return 0;
      });

      this.discounts.push(
        ...response.data.filter(d => d.discountType == "Flat Dollar")
      );
      this.discounts.push(new DiscountModel(-10));
      this.discounts.push(
        ...response.data.filter(d => d.discountType == "Program")
      );
      this.discounts.push(new DiscountModel(-11));
      this.discounts.push(this.getCustomCoupon());

      this.coupons.push(
        ...response.data.filter(d => d.discountType == "Coupon")
      );
    });
  }

  mounted() {
    this.subscription = this.$vuehelper.clone(this.data);
    this.selectedTerm = this.subscription.term;

    this.bindListItems();
    if (this.name == "Edit") this.title = "Edit Subscription";
    else if (this.name == "View") this.title = "View Subscription";
    else if (this.name == "Renew") {
      this.title = "Renew Subscription";

      this.subscription.startsOn = this.$vuehelper.date.getString(
        this.$moment(this.data.endsOn)
          .add(1, "days")
          .toDate()
      );

      this.calculateEndDate();
    }

    if (this.subscription.addOns && this.subscription.addOns.length)
      this.selectedPlanAddOns = this.subscription.addOns.map(
        a => a.planAddOn.planAddonId
      );

    if (this.subscription.discounts && this.subscription.discounts.length) {
      this.selectedDiscounts = this.subscription.discounts
        .filter(d => d.discount.discountType != "Coupon")
        .map(d => d.discount.discountId);

      let coupons = this.subscription.discounts.filter(
        d => d.discount.discountType == "Coupon"
      );
      if (coupons && coupons.length) {
        this.selectedDiscounts.push(-1);

        this.selectedCoupon = coupons[0].discount.discountId;
      }
    }

    this.stepCount = 5;
    this.open(this.data.subscriptionId > 0);

    this.loadPlanAddOns();
    if (this.name == "View") {
      this.stepNumber = 5;
      this.calculatePlanAddOnTotal();
    }
  }

  calculatePlanAddOnTotal() {
    this.planAndAddOnTotal = this.subscription.planFee;
    if (this.subscription.addOns && this.subscription.addOns.length)
      this.planAndAddOnTotal += this.subscription.addOns.reduce(
        (sum, current) => sum + current.addOnFee,
        0
      );
  }

  planAddOns: Array<PlanAddOnModel> = [];
  loadPlanAddOns() {
    if (this.subscription.plan && this.subscription.plan.planId)
      this.planService
        .getItem(this.subscription.plan.planId.toString())
        .then(plan => {
          this.subscription.plan = plan;

          this.planAddOns = plan.planAddOns;
        });
  }

  stepLoaded() {
    //if (this.stepNumber == 3)
    //this.loadPlanAddOns();

    if (this.stepNumber == this.stepCount && this.name != "View") {
      this.subscription.plan = this.plans.find(
        p => p.planId == this.subscription.plan.planId
      );

      this.subscription.addOns = [];
      this.selectedPlanAddOns.forEach(planAddOnId => {
        let temp = this.planAddOns.find(a => a.planAddonId == planAddOnId);
        if (temp != null) {
          let item = new SubscriptionAddOn();
          item.planAddOn = this.$vuehelper.clone(temp);

          this.subscription.addOns.push(item);
        }
      });

      this.subscription.discounts = [];
      this.selectedDiscounts.forEach(discountId => {
        if (discountId == -1) {
          if (this.selectedCoupon) {
            let item = new SubscriptionDiscount();
            item.discount = this.$vuehelper.clone(
              this.coupons.find(a => a.discountId == this.selectedCoupon)
            );

            this.subscription.discounts.push(item);
          }
        } else {
          let item = new SubscriptionDiscount();
          item.discount = this.$vuehelper.clone(
            this.discounts.find(a => a.discountId == discountId)
          );

          this.subscription.discounts.push(item);
        }
      });
      this.subscription.invoicePeriod = this.selectedTerm;
      this.calculating = true;
      let trialId = this.subscription.trialId;
      this.subscription.planFee = null;
      this.service.calculateFees(this.subscription).then(response => {
        this.subscription = response;
        this.subscription.trialId = trialId;

        this.calculatePlanAddOnTotal();

        this.calculating = false;
      });
    }
  }

  save() {
    this.subscription.invoicePeriod = this.selectedTerm;
    if (this.name == "View") {
      this.close();
    } else if (this.name == "Renew") {
      this.service.renew(this.subscription).then((response: any) => {
        this.$root.$emit("subscriptionChanged");

        this.close();
      });
    } else {
      this.service.put(this.subscription).then((response: any) => {
        this.$root.$emit("subscriptionChanged");
        this.$root.$emit("trialChanged");

        this.close();
      });
    }
  }

  calculateEndDate() {
    if (this.subscription.startsOn) {
      let moment = this.$moment(this.subscription.startsOn);

      if (this.selectedTerm == "Month") {
        this.subscription.endsOn = new Date("9999-12-31");
      } else{
        moment.add(1, "years");
        this.subscription.endsOn = moment.toDate();
      } 
    }
  }

  onStartDateChange() {
    this.calculateEndDate();
  }

  onTermChange() {
    this.subscription.term = this.selectedTerm;
    this.calculateEndDate();
  }

  getCustomCoupon() {
    let customCoupon = new DiscountModel();
    customCoupon.discountId = -1;
    customCoupon.discountName = "Custom Coupon";

    return customCoupon;
  }

  get addOnNames() {
    let text = "";

    if (this.subscription)
      text = this.subscription.addOns
        .map(a => a.planAddOn.addOn.addOnName)
        .join(", ");

    return text;
  }

  get discountNames() {
    let text = "";

    if (this.subscription)
      text = this.subscription.discounts
        .map(a => a.discount.discountName)
        .join(", ");

    return text;
  }

  get isCustomCoupon() {
    return this.selectedDiscounts.some(d => d == -1);
  }

  get selectedCouponPercentage() {
    let percent = "";

    if (this.selectedCoupon) {
      let coupon = this.coupons.find(c => c.discountId == this.selectedCoupon);

      if (coupon)
        percent = `${
          this.coupons.find(c => c.discountId == this.selectedCoupon).percentage
        }%`;
    }

    return percent;
  }

  get saveButtonText() {
    let text = "Subscribe";

    if (this.name == "Edit") text = "Save";
    else if (this.name == "View") text = "Close";
    else if (this.name == "Renew") text = "Renew";

    return text;
  }

  get valid() {
    if (!this.subscription.subscriptionId) {
      return this.$vuehelper.step.valid(this.$v, this.stepNumber);
    }

    return true;
  }

  get minStartDate() {
    if (this.name == "Renew")
      return this.$vuehelper.date.getString(
        this.$moment(this.data.endsOn)
          .add(1, "days")
          .toDate()
      );

    return undefined;
  }

  get minEndDate() {
    if (this.subscription.startsOn) {
      return this.$vuehelper.date.getString(
        this.$moment(this.subscription.startsOn)
          .add(1, "days")
          .toDate()
      );
    }

    return null;
  }

  get displayWaterMark() {
    return this.name == "View" && this.subscription.status == "Cancelled";
  }

  get paymentDue() {
    this.subscription.paymentDue = "";

    if (this.subscription.plan.planId) {
      if (this.selectedTerm == "Month") {
        this.subscription.paymentDue = "Due On Receipt";
      } else {
        this.plans.forEach(plan => {
          if (this.subscription.plan.planId == plan.planId)
            this.subscription.paymentDue = plan.paymentDue;
        });
      }
    }

    return this.subscription.paymentDue;
  }
}
</script>