import { PlanAddOnModel, PlanRequest, ListItem, DataRespone } from '@/model';
import { IBaseService, BaseService, BaseMockService } from './base.service'

export interface IPlanAddOnService extends IBaseService<PlanRequest, PlanAddOnModel> {
  //  isNameExists(item: PlanAddOnModel): Promise<boolean>;
  //  getListItems(includeDefault?: boolean): Promise<Array<ListItem>>;
    getTerms(): Promise<Array<ListItem>>;
}

export class PlanAddOnService extends BaseService<PlanRequest, PlanAddOnModel> implements IPlanAddOnService {
    constructor() {
        super("planaddons");
    }

    getTerms(): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push(new ListItem("Month", "Month"));
            items.push(new ListItem("Year", "Year"));

            resolve(items);
        });
    }

 /*   getListItems(includeDefault?: boolean): Promise<Array<ListItem>> {
        let request = new PlanRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            let items = new Array<ListItem>();
            items.push(...response.data.map(p => new ListItem(p.planName, p.planId.toString())));

            if (includeDefault)
                items.splice(0, 0, { text: "All Plans", value: "" });

            return items;
        });
    }  */


}

export class PlanAddOnMockService extends BaseMockService<PlanRequest, PlanAddOnModel> implements IPlanAddOnService {
    constructor() {
        super("plans");
    }

    getTerms(): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push(new ListItem("Month", "Month"));
            items.push(new ListItem("Year", "Year"));

            resolve(items);
        });
    }

    getListItems(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    isNameExists(item: PlanAddOnModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
}