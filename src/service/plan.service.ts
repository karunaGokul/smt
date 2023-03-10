import { PlanModel, PlanRequest, ListItem, DataRespone } from '@/model';
import { IBaseService, BaseService, BaseMockService } from './base.service'

import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios'

export interface IPlanService extends IBaseService<PlanRequest, PlanModel> {
    isNameExists(item: PlanModel): Promise<boolean>;
    getListItems(includeDefault?: boolean): Promise<Array<ListItem>>;
    getTerms(): Promise<Array<ListItem>>;
}

export class PlanService extends BaseService<PlanRequest, PlanModel> implements IPlanService {
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
        let request = new PlanRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            let items = new Array<ListItem>();
            items.push(...response.data.map(p => new ListItem(p.planName, p.planId.toString())));

            if (includeDefault)
                items.splice(0, 0, { text: "All Plans", value: "" });

            return items;
        });
    }

    isNameExists(item: PlanModel): Promise<boolean> {
        let request = new PlanRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            return response.data.some(
                p => (!item.planId || item.planId != p.planId) && p.planName.toLowerCase() == item.planName.toLowerCase()
            );
        });
    }
}

export class PlanMockService extends BaseMockService<PlanRequest, PlanModel> implements IPlanService {
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

    isNameExists(item: PlanModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
}