<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="600" dismissible>
      <v-alert :type="type" prominent>
        <template v-slot:close>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        {{ text }}
      </v-alert>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AlertType } from "@/model";

@Component
export default class AppAlert extends Vue {
  dialog: boolean = false;
  text: string = "";
  type: string = "error";

  show(text: string, type?: AlertType) {
    this.dialog = true;
    this.text = text;

    if (type) this.type = AlertType[type].toLowerCase();
  }
}
</script>