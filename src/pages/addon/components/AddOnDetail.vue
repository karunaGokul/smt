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
          <v-text-field
            label="Name of Add-On"
            type="text"
            v-model="addOn.addOnName"
            required
            @input="$v.addOn.addOnName.$touch"
            :error-messages="$v.addOn.addOnName | errorMessages('Add-On Name')"
          />
          <v-select :items="channels" v-model="addOn.channel">
            <template v-slot:prepend>
              <span class="mt-2 mr-2" style="white-space: nowrap;">Applies to</span>
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
import { AddOnModel, ListItem, AddOnRequest, AlertType } from "@/model";
import { IAddOnService, IChannelService } from "@/service";
import { BaseDialogComponent } from "@/components/base";

let validations: any = {
  addOn: {
    addOnName: { required },
    channel: { required }
  }
};

@Component({
  validations: validations
})
export default class AddOnDetail extends BaseDialogComponent<AddOnModel> {
  @Inject("addOnService") service: IAddOnService;
  @Inject("channelService") channelService: IChannelService;

  addOn: AddOnModel = new AddOnModel();
  channels: Array<ListItem> = [];
  title: string = "Add Add-On";

  public mounted() {
    this.addOn = this.$vuehelper.clone(this.data);
    if (this.addOn.addOnId) this.title = "Edit Add-On";

    if (!this.addOn.createdBy) this.addOn.createdBy = this.currentUser.fullName;

    this.channelService.getListItems().then(items => {
      this.channels = items;

      if (!this.addOn.channel) this.addOn.channel = this.channels[0].value;
    });

    this.open(this.data.addOnId > 0);
  }

  save() {
    if (this.valid) {
      this.service.isNameExists(this.addOn).then(exists => {
        if (exists) {
          this.alert(
            `Add-On with name '${this.addOn.addOnName}' already exists.`,
            AlertType.Warning
          );
        } else {
          this.service.post(this.addOn).then(
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