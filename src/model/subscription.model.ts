import { BaseModel, DataRequest } from './base.model';
import { UserModel } from './user.model';
import { DiscountModel } from './discount.model';
import { PlanModel,PlanAddOnModel } from './plan.model';

export class SubscriptionModel extends BaseModel {
    public subscriptionId: number;
    public trialId: number;
    public firmName: string = "";
    public firmId: number;
    public status: string;
    public startsOn: Date;
    public endsOn: Date;
    public paymentDue: string;
    public term: string;
    public salesUser: UserModel;
    public invoicePeriod: string;
    public plan: PlanModel = new PlanModel();
    public planFee: number;
    public subscribedBy: UserModel;

    public addOns: Array<SubscriptionAddOn> = [];
    public discounts: Array<SubscriptionDiscount> = [];
    public totalFee: number;
    public cancelledOn: Date;
}

export class SubscriptionAddOn {
    planAddOn: PlanAddOnModel = new PlanAddOnModel();
    addOnFee: number;
}

export class SubscriptionDiscount {
    discount: DiscountModel = new DiscountModel();
    discountFee: number;
}

export class SubscriptionRequest extends DataRequest {
    fromStartDate: Date;
    toStartDate: Date;
    fromEndDate: Date;
    toEndDate: Date;
    status: Array<string>;
    channel: string;
    plan: Array<string>;
    addOn: Array<string>;
    isRenewed: boolean;

    search: string;
}
