import { SubscriptionModel, SubscriptionRequest, DataRespone, ListItem } from '@/model';
import { IBaseService, BaseService, BaseMockService } from './base.service'

export interface ISubscriptionService extends IBaseService<SubscriptionRequest, SubscriptionModel> {
    getStatuses(includeDefault?: boolean): Promise<Array<ListItem>>;
    getTerms(): Promise<Array<ListItem>>;
    getPaymentDues(): Promise<Array<ListItem>>;

    renew(subscription: SubscriptionModel): Promise<SubscriptionModel>;
    cancel(id: number, cancelDate: Date, reason: string): Promise<any>;
    calculateFees(subscription: SubscriptionModel): Promise<SubscriptionModel>;
}

export class SubscriptionService extends BaseService<SubscriptionRequest, SubscriptionModel> implements ISubscriptionService {
    constructor() {
        super("subscriptions");
    }

    getStatuses(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            if (includeDefault) items.push(new ListItem("All Status", ""));
            items.push(new ListItem("New", "New"));
            items.push(new ListItem("Renewed", "Renewed"));
            items.push(new ListItem("Cancelled", "Cancelled"));

            resolve(items);
        });
    }

    getTerms(): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push(new ListItem("Month", "Month"));
            items.push(new ListItem("Year", "Year"));

            resolve(items);
        });
    }

    getPaymentDues(): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push(new ListItem("Due On Receipt", "Due On Receipt"));
            items.push(new ListItem("Net 30", "Net 30"));

            resolve(items);
        });
    }

    calculateFees(subscription: SubscriptionModel): Promise<SubscriptionModel> {
        return this.post(subscription, `summary`);
    }

    renew(subscription: SubscriptionModel): Promise<SubscriptionModel> {
        return this.put(subscription, `${subscription.subscriptionId}/renew`);
    }

    cancel(id: number, cancelDate: Date, reason: string): Promise<any> {
        let data: any = {
            "subscriptionId": id,
            "cancelationDate": cancelDate,
            "cancelReason": reason
        };

        return this.httpPut(`${this.path}/${id}/cancel`, data).then(response => {
            return response.data;
        });
    }
}