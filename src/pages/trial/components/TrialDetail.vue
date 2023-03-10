<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card v-if="trial.trialId">
      <v-card-title>
        <h1 class="headline">{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p class="subtitle-1" v-if="!isViewTrial">Let's get this trial started for - {{ trial.firmName }}</p>
        <p class="subtitle-1" v-if="isViewTrial">Trial for - {{ trial.firmName }}</p>

        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-list disabled>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-currency-usd</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>AUM</v-list-item-subtitle>
                    <v-list-item-title>{{ trial.reportedAUMString }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Demo On</v-list-item-subtitle>
                    <v-list-item-title>{{ trial.demoDate | dateDisplay }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Demo By</v-list-item-subtitle>
                    <v-list-item-title>{{ demoUserName }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="6" v-if="!isViewTrial">
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
                    :value="trial.startsOn | dateDisplay"
                    label="Start Date"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    v-on="on"
                    :error-messages="$v.trial.startsOn | errorMessages('Start Date')"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="trial.startsOn"
                  no-title
                  @input="startDate = false"
                  @change="onStartDateChange()"
                ></v-date-picker>
              </v-menu>
              <v-select
                :items="trialIntervals"
                v-model="selectedInterval"
                label="Trial For"
                prepend-icon="mdi-calculator"
                suffix="days"
                @change="onIntervalChange()"
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
                    :value="trial.endsOn | dateDisplay"
                    label="End Date"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    v-on="on"
                    :error-messages="$v.trial.endsOn | errorMessages('End Date')"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="trial.endsOn"
                  no-title
                  @input="endDate = false"
                  @change="onEndDateChange()"
                ></v-date-picker>
              </v-menu>
              <v-select
                :items="trial.firmContacts"
                item-text="fullName"
                item-value="contactId"
                v-model="firmContacts"
                label="Select Contact(s)"
                prepend-icon="mdi-account"
                multiple
                small-chips
                :error-messages="$v.firmContacts | errorMessages('Contacts')"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6" v-if="isViewTrial">
              <v-list disabled>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Start Date</v-list-item-subtitle>
                    <v-list-item-title>{{ trial.startsOn | dateDisplay }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>End Date</v-list-item-subtitle>
                    <v-list-item-title v-if="trial.endsOn">{{ trial.endsOn | dateDisplay }}</v-list-item-title>
                    <v-list-item-title v-if="!trial.endsOn">-</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Contacts</v-list-item-subtitle>
                    <v-list-item-title>{{ contactNames }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>            
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="stepNumber = --stepNumber" v-if="stepNumber > 1">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Exit</v-btn>
        <v-btn color="primary" @click="save" :disabled="!valid" v-if="!isViewTrial">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";

import {
  TrialModel,
  UserModel,
  UserRequest,
  ContactModel,
  ListItem
} from "@/model";
import { IUserService, ITrialService } from "@/service";
import { BaseDialogComponent } from "@/components/base";
import { Settings } from "../../../config";

let validations: any = {
  trial: {
    startsOn: { required },
    endsOn: {
      required,
      invalid: (v: Date, vm: TrialModel) => {
        return v > vm.startsOn;
      }
    }
  },
  firmContacts: { required }
};

@Component({
  validations: validations
})
export default class TrialDetail extends BaseDialogComponent<TrialModel> {
  @Inject() trialService: ITrialService;
  @Inject() userService: IUserService;

  demoDate: boolean = false;
  startDate: boolean = false;
  endDate: boolean = false;

  trial = new TrialModel();
  demoUserName: string = "-";
  users: Array<UserModel> = [];
  firmContacts: Array<number> = [];
  title: string = "Start Trial";
  trialIntervals: Array<ListItem> = [];
  selectedInterval: string = null;
  contactNames: string = "-";

  bindUsers() {
    let request = new UserRequest();
    request._skipPaging = true;

    this.userService.getItems(request).then(response => {
      this.users = response.data.filter(u => u.fullName);
    });
  }

  bindIntervals() {
    this.trialIntervals.push(new ListItem("7", "7"));
    this.trialIntervals.push(new ListItem("10", "10"));
    this.trialIntervals.push(new ListItem("14", "14"));
    this.trialIntervals.push(new ListItem("21", "21"));
    this.trialIntervals.push(new ListItem("30", "30"));

    this.selectedInterval = Settings.DefaultTrialDays.toString();
  }

  mounted() {
    if (this.isViewTrial) this.title = "View Trial";
    else {
      this.bindUsers();
      this.bindIntervals();
    }

    this.trial = this.$vuehelper.clone(this.data);

    let date = new Date();
    if (!this.trial.startsOn)
      this.trial.startsOn = this.$vuehelper.date.getString(date);
    if (!this.trial.endsOn) this.calculateEndDate();

    this.firmContacts = this.trial.firmContacts.map(f => f.contactId);
    this.contactNames = this.trial.firmContacts.map(f => f.fullName).join(", ");
    if (this.trial.demoUser) this.demoUserName = this.trial.demoUser.fullName;

    this.open(false);
  }

  save() {
    this.trial.firmContacts = this.trial.firmContacts.filter(c =>
      this.firmContacts.some(c1 => c.contactId == c1)
    );

    this.trialService.startTrial(this.trial).then((response: any) => {
      this.$root.$emit("trialChanged");

      this.close();
    });
  }

  calculateEndDate() {
    if (this.trial.startsOn && this.selectedInterval) {
      let moment = this.$moment(this.trial.startsOn);
      moment.add(parseInt(this.selectedInterval), "days");

      this.trial.endsOn = this.$vuehelper.date.getString(moment.toDate());
    }
  }

  onIntervalChange() {
    this.calculateEndDate();
  }

  onStartDateChange() {
    this.calculateEndDate();
  }

  onEndDateChange() {
    this.selectedInterval = null;
  }

  get maxStartDate() {
    var currentDate = new Date();

    return this.$vuehelper.date.getString(this.$moment(currentDate).toDate());
  }

  get isViewTrial() {
    return this.name == "View";
  }
}
</script>