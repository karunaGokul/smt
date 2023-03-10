<template>
  <v-row :justify="justify" :class="{ 'pb-2': $vuetify.breakpoint.smAndUp }">
    <v-col
      v-for="(action, index) in nonFloatingActions"
      :key="index"
      :cols="$vuetify.breakpoint.smAndUp ? action.columns : 12"
      :offset="action.offset"
      :class="action.className"
    >
      <template v-if="action.controlType == 'Refresh'">
        <v-btn icon @click="actionTriggered(action)" small>
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </template>
      <template v-else-if="action.controlType == 'Search'">
        <v-text-field
          label="Search"
          single-line
          hide-details
          append-icon="mdi-magnify"
          dense
          clearable
          v-model="action.commandValue"
          @input="onSearchChange(action)"
        />
      </template>
      <template v-else-if="action.controlType == 'Select'">
        <v-select
          dense
          single-line
          hide-details
          @change="actionTriggered(action)"
          v-model="action.commandValue"
          :items="action.listControlOptions"
          :label="action.label"
        ></v-select>
      </template>
      <template v-else-if="action.controlType == 'MultiSelect'">
        <v-select
          dense
          single-line
          hide-details
          @change="actionTriggered(action)"
          v-model="action.commandValue"
          :items="action.listControlOptions"
          :label="action.label"
          multiple
          class="flex-nowrap"
        >
          <template v-slot:prepend-item>
            <v-list-item
              ripple
              @click="onSelectAllToggle(action, index)"
              v-if="action.commandValue && action.listControlOptions"
            >
              <v-list-item-action>
                <v-icon
                  :color="action.commandValue.length > 0 ? 'indigo darken-4' : ''"
                >{{ getIcon(action) }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Select All</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template v-slot:selection="{ item, index }">
            <div v-if="index === 0" class="d-flex align-center">
              <input
                readonly
                type="text"
                :value="action.label"
                v-if="action.commandValue.length == action.listControlOptions.length"
              />
              <v-chip small v-else>
                <span :title="item.text">{{ item.text }}</span>
              </v-chip>
              <span
                v-if="action.commandValue.length > 1 && action.commandValue.length != action.listControlOptions.length"
                class="grey--text caption"
              >(+{{ action.commandValue.length - 1 }})</span>
            </div>
          </template>
        </v-select>
      </template>
      <template v-else-if="action.controlType == 'DateRange'">
        <date-range
          @changed="onDateRangeChange(action, ...arguments)"
          @loaded="onDateRangeLoad(action, ...arguments)"
          :value="action.commandValue"
          :options="action.items"
        ></date-range>
      </template>
      <template v-else-if="action.controlType == 'Textbox'">Textbox</template>
      <template v-else>Not implemented - {{ action.controlType }}</template>
    </v-col>
    <v-col
      class="text-right"
      :cols="$vuetify.breakpoint.smAndUp ? floatingColumns : 12"
      v-if="floatingActions && floatingActions.length"
    >
      <template v-for="(action, index) in floatingActions" :class="action.className">
        <template v-if="action.controlType == 'Export'">
          <v-btn
            tile
            outlined
            @click="actionTriggered(action)"
            color="primary"
            class="text-capitalize mt-1 ml-5"
            :title="action.label"
            :key="index"
            small
          >
            <v-icon left>mdi-file-excel</v-icon>
            {{ action.label }}
          </v-btn>
        </template>
        <template v-else-if="action.controlType == 'PrimaryButton'">
          <v-btn
            @click="actionTriggered(action)"
            color="primary"
            class="text-capitalize mt-1 ml-5"
            :key="index"
            small
          >
            <v-icon left v-if="action.icon">mdi-{{ action.icon }}</v-icon>
            {{ action.label }}
          </v-btn>
        </template>
      </template>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { GridActionModel } from "@/model";
import DateRange from "../DateRange.vue";

@Component({
  components: { DateRange }
})
export default class GridAction extends Vue {
  @Prop({ default: () => new Array<GridActionModel>() }) actions: Array<
    GridActionModel
  >;
  @Prop({ default: "end" }) justify: string;

  created() {
    this.actions.forEach((action, index) => {
      if (
        ["Select", "MultiSelect"].includes(action.controlType) &&
        action.items
      ) {
        action.items.then(items => {
          if (items.length) {
            action.listControlOptions = items;
            if (!action.commandValue) {
              if (action.controlType == "MultiSelect") action.commandValue = [];
              //items.map(v => v.value);
              else action.commandValue = items[0].value;
            }

            this.$set(this.actions, index, action);
          }
        });
      }
    });
  }

  actionTriggered(action: GridActionModel) {
    if (!action.commandName) action.commandName = action.controlType;

    this.$emit("actionTriggered", action);
  }

  debounce: any = null;
  onSearchChange(action: GridActionModel) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.actionTriggered(action);
    }, 600);
  }

  onDateRangeChange(action: GridActionModel, startDate: Date, endDate: Date) {
    action.onChange(startDate, endDate);
    this.actionTriggered(action);
  }

  onDateRangeLoad(action: GridActionModel, startDate: Date, endDate: Date) {
    action.onChange(startDate, endDate);
  }

  onSelectAllToggle(action: GridActionModel, index: number) {
    if (action.commandValue.length == action.listControlOptions.length)
      action.commandValue = [];
    else action.commandValue = action.listControlOptions.map(v => v.value);

    this.$set(this.actions, index, action);

    this.actionTriggered(action);
  }

  getIcon(action: GridActionModel) {
    if (action.commandValue.length == action.listControlOptions.length)
      return "mdi-checkbox-marked";
    else if (action.commandValue.length > 0) return "mdi-minus-box";
    else return "mdi-checkbox-blank-outline";
  }

  get validActions() {
    let actions = this.actions.filter(
      a => a.hidden == undefined || !a.hidden()
    );
    if (this.$vuetify.breakpoint.smAndDown)
      actions = actions.filter(a => a.controlType != "Refresh");

    return actions;
  }

  get nonFloatingActions() {
    return this.validActions.filter(a => a.columns > 0);
  }

  get floatingActions() {
    return this.validActions.filter(a => a.columns == 0);
  }

  get floatingColumns() {
    let nonfloatinCols = 0;
    nonfloatinCols += this.nonFloatingActions.reduce(
      (sum, current) => sum + current.columns,
      0
    );

    let cols = 12 - nonfloatinCols;

    return cols > 0 ? cols : 0;
  }
}
</script>
