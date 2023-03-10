<template>
  <div class="y-row-actions">
    <template v-for="(action, index) in validActions">
      <v-menu
        left
        bottom
        dark
        transition="slide-y-transition"
        offset-y
        v-if="action.commandName == 'DropMenu'"
        :key="index"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            class="ml-4 mt-n1"
            x-small
            :color="action.color"
            v-on="on"
            :disabled="isDropMenuDisabled(action)"
          >
            <v-icon>{{ action.icon }}</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <template v-for="(link, i) in action.links">
            <v-list-item :key="i" @click="actionTriggered(link)" v-if="!isDisabled(link)">
              <v-list-item-icon v-if="link.icon">
                <v-icon dense>{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
      <v-btn
        v-else-if="action.icon"
        :key="index"
        icon
        @click="actionTriggered(action)"
        class="ml-4 mt-n1"
        :title="action.text"
        :disabled="isDisabled(action)"
        x-small
        :color="action.color"
      >
        <v-icon>{{ action.icon }}</v-icon>
      </v-btn>
      <!-- <v-btn 
        v-else
        text x-small
        :key="index"
        @click="actionTriggered(action)"
        :disabled="isDisabled(action)"
        color="primary"
      >{{ action.text }}</v-btn>-->
      <a
        v-else
        :key="index"
        @click="actionTriggered(action)"
        :disabled="isDisabled(action)"
        color="primary"
        class="mx-2"
      >{{ action.text }}</a>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { GridItemActionModel } from "@/model";

@Component
export default class GridRowAction extends Vue {
  @Prop({ default: () => new Array<GridItemActionModel>() }) actions: Array<
    GridItemActionModel
  >;

  @Prop() item: any;

  actionTriggered(action: GridItemActionModel) {
    this.$emit("actionTriggered", action);
  }

  isDisabled(action: GridItemActionModel) {
    if (action.disable) return action.disable(this.item);

    return false;
  }

  isDropMenuDisabled(action: GridItemActionModel) {
    let disabled = true;
    if (action.links && action.links.length) {
      action.links.forEach(link => {
        if (!link.disable || !link.disable(this.item)) disabled = false;
      });
    }

    return disabled;
  }

  get validActions() {
    return this.actions.filter(a => a.hidden == undefined || !a.hidden());
  }
}
</script>
