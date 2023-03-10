<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">Cancel Subscription</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p
          class="subtitle-1"
        >Bummer, can't win them all. Let's cancel the subscription for - {{ subscription.firmName }}</p>
        <v-container>
          <v-row>
            <v-col cols="12" md="7">
              <v-text-field
                label="Subscription Started"
                name="startsOn"
                prepend-icon="mdi-calendar-range"
                :value="subscription.startsOn | dateDisplay"
                type="text"
                disabled
              />
              <v-text-field
                label="Subscription Ends"
                name="endsOn"
                prepend-icon="mdi-calendar-range"
                :value="subscription.endsOn | dateDisplay"
                type="text"
                disabled
              />
              <v-menu
                v-model="cancelDateControl"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :value="cancelDate | dateDisplay"
                    label="Cancel As Of"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    v-on="on"
                    :error-messages="$v.cancelDate | errorMessages('Cancel Date')"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="cancelDate"
                  no-title
                  @input="cancelDateControl = false"
                  :min="minDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-textarea
            counter
            label="Reason for cancelling"
            v-model="reason"
            prepend-icon="mdi-notebook"
            :error-messages="$v.reason | errorMessages('Reason')"
          ></v-textarea>
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
import { SubscriptionModel } from "@/model";
import { ISubscriptionService } from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  cancelDate: { required },
  reason: { required }
};

@Component({
  validations: validations
})
export default class CancelSubscription extends BaseDialogComponent<
  SubscriptionModel
> {
  @Inject("subscriptionService") service: ISubscriptionService;

  cancelDateControl: boolean = false;
  cancelDate: Date = null;
  reason: string = "";

  subscription: SubscriptionModel = new SubscriptionModel();

  public mounted() {
    this.subscription = this.$vuehelper.clone(this.data);

    this.open(false);
  }

  save() {
    if (this.valid) {
      this.service
        .cancel(this.subscription.subscriptionId, this.cancelDate, this.reason)
        .then((response: any) => {
          this.$root.$emit("subscriptionChanged");

          this.close();
        });
    } else {
      console.log(this.$v);
    }
  }

  get minDate() {
    return this.$vuehelper.date.getString(
      this.$moment(this.subscription.startsOn)
        .add(1, "days")
        .toDate()
    );
  }
  
}
</script>