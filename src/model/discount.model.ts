import { BaseModel, DataRequest } from './base.model';
import { UserModel } from './user.model';

export class DiscountModel extends BaseModel {
    public discountId: number;
    public discountName: string = "";
    public channel: string;
    public percentage: number;
    public discountType: string;
    public subscriptionCount: number;
    public createdBy: string;

    constructor(id?: number) {
      super();

      this.discountId = id;
    }
}

export class DiscountRequest extends DataRequest {
    channel: string;
    discountType:string
    search: string;
}
