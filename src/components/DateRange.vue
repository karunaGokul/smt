<template>
  <v-select
    :items="items"
    v-model="selectedRange"
    dense
    single-line
    hide-details
    @change="onChange"
  ></v-select>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ListItem, DateRangeOption } from "@/model";

@Component
export default class DateRange extends Vue {
  @Prop() value: DateRangeOption;
  @Prop() options: Promise<Array<ListItem>>;

  items = new Array<ListItem>();
  selectedRange: string = null;

  mounted() {
    if (this.options) {
      this.options.then(items => {
        this.items = items;
      })
    }
    else if (this.items.length == 0) {
      this.items.push(
        new ListItem("This Week", DateRangeOption.ThisWeek.toString())
      );
      this.items.push(
        new ListItem("Next Week", DateRangeOption.NextWeek.toString())
      );
      this.items.push(
        new ListItem("This Month", DateRangeOption.ThisMonth.toString())
      );
      this.items.push(
        new ListItem("Next Month", DateRangeOption.NextMonth.toString())
      );
    }

    this.selectedRange = this.value
      ? this.value.toString()
      : this.items[0].value;

    this.emitEvent("loaded");
  }

  onChange() {
    this.emitEvent("changed");
  }

  emitEvent(action: string) {
    let startDate: Date;
    let endDate: Date;

    let date = new Date();
    let currentDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    if (this.selectedRange == DateRangeOption.ThisWeek.toString()) {
      let first = currentDate.getDate() - currentDate.getDay();

      startDate = new Date(new Date(currentDate.valueOf()).setDate(first));
      endDate = new Date(new Date(currentDate.valueOf()).setDate(first + 6));
    } else if (this.selectedRange == DateRangeOption.LastWeek.toString()) {
      let first = currentDate.getDate() - currentDate.getDay() - 7;

      startDate = new Date(new Date(currentDate.valueOf()).setDate(first));
      endDate = new Date(new Date(currentDate.valueOf()).setDate(first + 6));
    } else if (this.selectedRange == DateRangeOption.NextWeek.toString()) {
      let first = currentDate.getDate() - currentDate.getDay() + 7;

      startDate = new Date(new Date(currentDate.valueOf()).setDate(first));
      endDate = new Date(new Date(currentDate.valueOf()).setDate(first + 6));
    } else if (this.selectedRange == DateRangeOption.ThisMonth.toString()) {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (this.selectedRange == DateRangeOption.LastMonth.toString()) {
      startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      endDate = new Date(date.getFullYear(), date.getMonth(), 0);
    } else if (this.selectedRange == DateRangeOption.NextMonth.toString()) {
      startDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    }

    this.$emit(action, startDate, endDate);
  }
}
</script>