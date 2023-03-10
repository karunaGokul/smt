import { AddOnModel, AddOnRequest, ListItem } from '@/model';
import { IBaseService, BaseService, BaseMockService } from './base.service'

export interface IAddOnService extends IBaseService<AddOnRequest, AddOnModel> {
    isNameExists(item: AddOnModel): Promise<boolean>;
    getListItems(includeDefault?: boolean): Promise<Array<ListItem>>;
    getTerms(): Promise<Array<ListItem>>
}

export class AddOnService extends BaseService<AddOnRequest, AddOnModel> implements IAddOnService {
    constructor() {
        super("addOns");
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
        let request = new AddOnRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            let items = new Array<ListItem>();
            items.push(...response.data.map(p => new ListItem(p.addOnName, p.addOnId.toString())));

            if (includeDefault)
                items.splice(0, 0, { text: "All Add-Ons", value: "" });

            return items;
        });
    }

    isNameExists(item: AddOnModel): Promise<boolean> {
        let request = new AddOnRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            return response.data.some(
                p => (!item.addOnId || item.addOnId != p.addOnId) && p.addOnName.toLowerCase() == item.addOnName.toLowerCase()
            );
        });
    }
}

export class AddOnMockService extends BaseMockService<AddOnRequest, AddOnModel> implements IAddOnService {
    constructor() {
        super("addOns");
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

    isNameExists(item: AddOnModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }
}