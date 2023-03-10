<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">Extend Trial</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p class="subtitle-1">Sure, let's extends the current trail for - {{ trial.firmName }}</p>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Trial Started"
                name="startsOn"
                prepend-icon="mdi-calendar-range"
                :value="trial.startsOn | dateDisplay"
                type="text"
                disabled
              />
              <v-text-field
                label="Trial Ends"
                name="endsOn"
                prepend-icon="mdi-calendar-range"
                :value="trial.endsOn | dateDisplay"
                type="text"
                disabled
              />
              <v-text-field
                label="Extend Another"
                prepend-icon="mdi-calculator"
                v-model="selectedInterval"
                type="number"
                suffix="days"
                @input="onIntervalChange"
              />
              <v-menu
                v-model="extendDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="endDate | dateDisplay"
                    label="Extend Trial to"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    v-on="on"
                    :error-messages="$v.endDate | errorMessages('Extend Date')"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  @input="extendDate = false"
                  @change="onExtendDateChange"
                  :min="minEndDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { required } from "vuelidate/lib/validators";
import { TrialModel } from "@/model";
import { ITrialService } from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  endDate: { required }
};

@Component({
  validations: validations
})
export default class Extendrial extends BaseDialogComponent<TrialModel> {
  @Inject("trialService") service: ITrialService;

  extendDate: boolean = false;
  endDate: Date = null;

  trial: TrialModel = new TrialModel();
  selectedInterval: number = 7;

  public mounted() {
    this.trial = this.$vuehelper.clone(this.data);
    this.calculateExtendDate();

    this.open(false);
  }

  calculateExtendDate() {
    if (this.selectedInterval) {
      let moment = this.$moment(this.trial.endsOn);
      moment.add(this.selectedInterval, "days");

      this.endDate = this.$vuehelper.date.getString(moment.toDate());
    }
  }

  onIntervalChange() {
    this.calculateExtendDate();
  }

  onExtendDateChange() {
    let endDate = this.$moment(this.trial.endsOn);
    let extendDate = this.$moment(this.endDate);

    this.selectedInterval = extendDate.diff(endDate, "days");
  }

  save() {
    if (this.valid) {
      this.trial.endsOn = this.endDate;

      this.service.extendTrial(this.trial).then((response: any) => {
        this.$root.$emit("trialChanged");

        this.close();
      });
    } else {
      console.log(this.$v);
    }
  }

  get minEndDate() {
    if (this.trial && this.trial.endsOn)
      return this.$vuehelper.date.getString(
        this.$moment(this.data.endsOn)
          .add(1, "days")
          .toDate()
      );
    else return undefined;
  }
}
</script>