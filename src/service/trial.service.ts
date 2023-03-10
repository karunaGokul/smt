import { TrialModel, TrialRequest, ListItem } from '@/model';
import { IBaseService, BaseService } from './base.service'

export interface ITrialService extends IBaseService<TrialRequest, TrialModel> {
    getStatuses(includeDefault?: boolean): Promise<Array<ListItem>>;

    startTrial(trial: TrialModel): Promise<TrialModel>;
    extendTrial(trial: TrialModel): Promise<TrialModel>;

    zohoRefreshCheck(): Promise<boolean>;
}

export class TrialService extends BaseService<TrialRequest, TrialModel> implements ITrialService {
    constructor() {
        super("trials");
    }

    getStatuses(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            if (includeDefault) items.push(new ListItem("All Status", ""));

            items.push(new ListItem("Initial", "Initial"));
            items.push(new ListItem("Extended", "Extended"));
            items.push(new ListItem("Not Started", "Not Started"));
            items.push(new ListItem("Expired", "Expired"));

            resolve(items);
        });
    }    

    startTrial(trial: TrialModel): Promise<TrialModel> {
        return this.post(trial, `${trial.trialId}/startTrial`);
    }

    extendTrial(trial: TrialModel): Promise<TrialModel> {
        return this.post(trial, `${trial.trialId}/extendTrial`);
    }

    zohoRefreshCheck() {
        return this.httpGet("zohoRefreshJobCheck", null).then(response => {
            return response.data;
        });
    }
}