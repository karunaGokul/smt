import { BaseModel, DataRequest } from './base.model';
import { UserModel } from './user.model';

export class AddOnModel extends BaseModel {
    public addOnId: number;
    public addOnName: string = "";
    public channel: string;
    public subscriptionCount: number;
    public createdBy: string;
}

export class AddOnRequest extends DataRequest {
    channel: string;
    search: string;
}
