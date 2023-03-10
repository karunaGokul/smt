import { BaseModel, DataRequest } from './base.model';
import { UserModel, ContactModel } from './user.model'

export class TrialModel extends BaseModel {
    public trialId: number;
    public firmId: number;
    public firmName: string = "";
    public startsOn: Date;
    public endsOn: Date;
    public demoDate: Date;
    public salesUser: UserModel;
    public demoUser: UserModel;
    public status: string;
    public channel: string;
    public externalId: string;
    public billfinId: string;
    public reportedAUMString: string;
    public reportedAUM: number;

    public firmContacts: Array<ContactModel> = [];
}

export class TrialRequest extends DataRequest {
    startDate: Date;
    endDate: Date;
    status: Array<string>;
    channel: string;
    salesUserId: Array<string>;
    search: string;

    refreshTrial: boolean;
}
