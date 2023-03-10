<template>
  <v-dialog v-model="dialog" width="600" @keydown.esc="cancel">
    <v-card>
      <v-card-title class="headline grey lighten-2">{{ title }}</v-card-title>
      <v-card-text v-show="!!message">
        <v-container>{{ message }}</v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="cancel">Cancel</v-btn>
        <v-btn color="primary" @click.native="agree">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppConfirm extends Vue {
  dialog: boolean = false;
  message: string = "";
  resolve: any = null;
  reject: any = null;
  title: string = "";

  show(title: string, message: string) : Promise<boolean> {
    this.dialog = true;
    this.title = title;
    this.message = message;

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  agree() {
    this.resolve(true);
    this.dialog = false;
  }

  cancel() {
    this.resolve(false);
    this.dialog = false;
  }
}
</script>