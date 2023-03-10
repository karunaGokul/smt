import { BaseModel, DataRequest } from './base.model';
import { UserModel } from './user.model';
import { AddOnModel } from './addon.model';

export class PlanModel extends BaseModel {
    public planId: number;
    public planName: string = "";
    public channel: string;
    public fee: number;
    public feePeriod: string;
    public subscriptionCount: number = 0;
    public createdBy: string;
    public paymentDue: string;
    public planAddOns: Array<PlanAddOnModel> = [];
    public aumMin: number;
    public aumMax: number;
    public clientCountMin: number;
    public clientCountMax: number;
}

export class PlanAddOnModel {
    public planAddonId: number;
    public addOn: AddOnModel = new AddOnModel();
    public planId: number;
    public addOnFee: number;
}

export class PlanRequest extends DataRequest {
    channel: string;

    search: string;
}
