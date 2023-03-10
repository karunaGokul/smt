import moment from 'moment';
import { Validation } from "vuelidate";
import { ValidationEvaluation, ValidationGroups } from 'vue/types/vue';

export class VueHelperProvider {
    public date: DateHelper = new DateHelper();
    public val: ValHelper = new ValHelper();
    public step: StepHelper = new StepHelper();

    clone<T>(object: T): T {
        return this._clone(object);
    }

    getImageUrl(blobText: string) {
        return `data:image/png;base64, ${blobText}`
    }

    private _clone(object: any) {
        let cloned: any = new (<any>object).constructor();

        for (let key in object) {
            try {
                cloned[key] = object[key];

                if (typeof object[key] == "object")
                    cloned[key] = this._clone(object[key]);
            }
            catch (e) { //error  
            }
        }
        return cloned;
    }
}

class DateHelper {
    format(date: Date, format?: string) {
        if (!format) format = "MM/DD/YYYY";

        if (date)
            return moment(date).format(format);
        else
            return "";
    }

    getString(date: Date) : any {
        return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
    }
}

class ValHelper {
    messages(evaluation: ValidationEvaluation, label: string) {
        let errors = new Array();

        if (!evaluation!.$dirty || !evaluation!.$invalid) return errors;

        if (!evaluation!.required) errors.push(`Required`);

        if (!evaluation!.invalid) errors.push(``);

        return errors;
    }


}

class StepHelper {
    valGroup(v: ValidationGroups, stepNumber: number): Validation {
        if (stepNumber == 1)
            return v.valGroup.step1;
        else if (stepNumber == 2)
            return v.valGroup.step2;
        else if (stepNumber == 3)
            return v.valGroup.step3;
        else if (stepNumber == 4)
            return v.valGroup.step4;
        else if (stepNumber == 5)
            return v.valGroup.step5;
        else if (stepNumber == 6)
            return v.valGroup.step6;
        else if (stepNumber == 7)
            return v.valGroup.step7;
        else if (stepNumber == 8)
            return v.valGroup.step8;
        else if (stepNumber == 9)
            return v.valGroup.step9;
    }

    valid(v: ValidationGroups, stepNumber: number): boolean {
        if (stepNumber == 1)
            return <any>(!v.valGroup.step1.$invalid && v.$anyDirty);
        else if (stepNumber == 2)
            return <any>(!v.valGroup.step2.$invalid && v.$anyDirty);
        else if (stepNumber == 3)
            return <any>(!v.valGroup.step3.$invalid && v.$anyDirty);
        else if (stepNumber == 4)
            return <any>(!v.valGroup.step4.$invalid && v.$anyDirty);
        else if (stepNumber == 5)
            return <any>(!v.valGroup.step5.$invalid && v.$anyDirty);
        else if (stepNumber == 6)
            return <any>(!v.valGroup.step6.$invalid && v.$anyDirty);
        else if (stepNumber == 7)
            return <any>(!v.valGroup.step7.$invalid && v.$anyDirty);
        else if (stepNumber == 8)
            return <any>(!v.valGroup.step8.$invalid && v.$anyDirty);
        else if (stepNumber == 9)
            return <any>(!v.valGroup.step9.$invalid && v.$anyDirty);
    }

    error(v: ValidationGroups, stepNumber: number, currentStep: number) {
        let valGroup = this.valGroup(v, stepNumber);

        return !(currentStep > stepNumber && valGroup.$invalid);
    }
}