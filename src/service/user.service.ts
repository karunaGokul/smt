import { UserModel, UserRequest, ListItem } from '@/model';
import { IBaseService, BaseService } from './base.service';


export interface IUserService extends IBaseService<UserRequest, UserModel> {
    getCurrentUser(): Promise<UserModel>;
    getRoles(includeDefault?: boolean): Promise<Array<ListItem>>;
    isNameExists(item: UserModel): Promise<boolean>;
    saveUser(user: UserModel): Promise<UserModel>;
    uploadPhoto(file: File, userId: number): Promise<any>;
    getSalesUserList(includeDefault?: boolean): Promise<Array<ListItem>>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<any>;
}

export class UserService extends BaseService<UserRequest, UserModel> implements IUserService {
    constructor() {
        super("users");
    }

    getSalesUserList(includeDefault?: boolean): Promise<Array<ListItem>> {
        let request = new UserRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            let items = new Array<ListItem>();
            items.push(...response.data.map(p => new ListItem(p.fullName, p.userId.toString())));

            if (includeDefault)
                items.splice(0, 0, { text: "All Salespeople", value: "" });

            return items;
        });
    }

    getCurrentUser(): Promise<UserModel> {
        return this.httpGet(`${this.path}/currentUser`, null).then(
            (response: any) => {
                return response.data;
            },
            (reason: any) => {
                return null;
            }
        );
    }

    getRoles(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            if (includeDefault) items.push(new ListItem("All Users", ""));

            items.push({ text: "Executive", value: "Executive" });
            items.push({ text: "Admin", value: "Admin" });
            items.push({ text: "Finance", value: "Finance" });
            items.push({ text: "Sales", value: "Sales" });
            items.push({ text: "Support", value: "Support" });

            resolve(items);
        });
    }

    isNameExists(item: UserModel): Promise<boolean> {
        let request = new UserRequest();
        request._skipPaging = true;

        return this.getItems(request).then(response => {
            return response.data.some(
                p => (!item.userId || item.userId != p.userId) && p.email.toLowerCase() == item.email.toLowerCase()
            );
        });
    }

    saveUser(user: UserModel): Promise<UserModel> {
        return this.post(user);
    }

    changePassword(userId: number, oldPassword: string, newPassword: string) {
        let data = { userId: userId, oldPassword: oldPassword, newPassword: newPassword };

        return this.httpPut(`${this.path}/changePassword`, data).then(response => {
            return response.data;
        });
    }

    uploadPhoto(file: File, userId: number): Promise<any> {
        let formData = new FormData();
        formData.append("uploadImage", file);

        return this.upload(formData, `${userId}/uploadAvatar`);
    }
}
