import { ListItem } from '@/model';

export interface IChannelService {
    getListItems(includeDefault?: boolean): Promise<Array<ListItem>>;
}

export class ChannelService implements IChannelService {
    getListItems(includeDefault?: boolean): Promise<Array<ListItem>> {
        return new Promise((resolve, reject) => {
            let items = new Array<ListItem>();
            items.push({ text: "Redi2", value: "Redi2"});

            if (includeDefault)
                items.splice(0, 0, { text: "All Channels", value: ""});

            resolve(items);
        });
    }
}
