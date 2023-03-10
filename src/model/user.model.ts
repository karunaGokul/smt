import { BaseModel, DataRequest } from './base.model'

export class UserModel extends BaseModel {
    public userId: number;
    public userName: string;
    public password: string;
    public firstName:string;
    public lastName:string;
    public email: string;
    public fullName: string;
    public role?: string;
    public status: string;
    public avatar: string;    
    public phoneNumber: string;
}

export class UserRequest extends DataRequest {

    public role: string;

}

export class ContactModel extends BaseModel {
    public contactId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public fullName: string;
    public phone: string;
    public title: string;
    public active: boolean;
}