import { Component, Vue, Prop } from "vue-property-decorator";
import { IBaseModel } from "@/model";
import { BaseComponent } from './BaseComponent';

@Component
export class BaseDialogComponent<M extends IBaseModel> extends BaseComponent {
  show: boolean = false;
  stepNumber: number = 0;
  stepCount: number = 0;

  @Prop() data: M;
  @Prop() name: string;

  open(isEdit: boolean) {
    this.show = true;
    this.stepNumber = 1;

    if (!isEdit)
      this.$v.$reset();
    this.$v.$touch();
    if (isEdit)
      this.$v.$reset();
  }

  close() {
    this.show = false;

    this.$emit("close", false);
  }

  protected onSave() {
    this.show = false;

    this.$emit("close", true);
  }

  protected nextStep() {
    let valGroup = this.$vuehelper.step.valGroup(this.$v, this.stepNumber);
    valGroup.$touch();


    if (!valGroup.$invalid) {
      if (this.stepNumber == this.stepCount)
        this.save();
      else {
        this.stepNumber = ++this.stepNumber;

        this.stepLoaded();
      }
    } else {
      console.log(this.$v);
    }
  }

  protected save() { }
  protected stepLoaded() { }
}