import { DiscountModel, DiscountRequest,ListItem } from '@/model';
import { IBaseService, BaseService, BaseMockService } from './base.service'

export interface IDiscountService extends IBaseService<DiscountRequest, DiscountModel> {
    isNameExists(item: DiscountModel): Promise<boolean>;
    getDiscountTypes(item : Boolean) :Promise<Array<ListItem>>;
}

export class DiscountService extends BaseService<DiscountRequest, DiscountModel> implements IDiscountService {
    constructor() {
        super("discounts");
    }

    isNameExists(item: DiscountModel): Promise<boolean> {
        let request = new DiscountRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            return response.data.some(
                p => (!item.discountId || item.discountId != p.discountId) && p.discountName.toLowerCase() == item.discountName.toLowerCase()
            );
        });
    }

    getDiscountTypes(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push({ text: "Program", value: "Program"});
            items.push({ text: "Flat Dollar", value: "Flat Dollar"});
            items.push({ text: "Coupon", value: "Coupon"});


            if (includeDefault)
                items.splice(0, 0, { text: "All Discount Types", value: ""});

            resolve(items);
        });
    }
}

export class DiscountMockService extends BaseMockService<DiscountRequest, DiscountModel> implements IDiscountService {
    constructor() {
        super("discounts");
    }

    isNameExists(item: DiscountModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    }

    getDiscountTypes(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push({ text: "Program", value: "Program"});
            items.push({ text: "Flat Dollar", value: "Flat Dollar"});
            items.push({ text: "Coupon", value: "Coupon"});


            if (includeDefault)
                items.splice(0, 0, { text: "All Discounts", value: ""});

            resolve(items);
        });
    }
}