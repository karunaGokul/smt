import { ListItem } from './base.model';

export class DialogModel<M> {
    name: string;
    component: any;
    data: M;
}

export class GridActionModel {
    offset?: number = 0;
    columns: number;
    controlType: string;
    commandName: string;
    commandValue?: any;
    label?: string;
    icon?: string;

    className?: string;
    items?: Promise<Array<ListItem>>;

    listControlOptions?: Array<ListItem>;

    onChange?: (...params: any) => void;
    hidden?: () => boolean;
}

export class GridItemActionModel {
    text: string;
    icon?: string;
    color?: string;
    commandName: string;

    disable?: (item: any) => boolean;
    hidden?: () => boolean;

    links?: Array<GridItemActionModel>;
}

export class GridHeaderModel {
    text?: string;
    value: string;
    sortable?: boolean;
    width?: string;
    align?: string;
    class?: string;

    sorted?: boolean;
}

export class GridModel<R> {
    actions: Array<GridActionModel> = [];
    itemActions: Array<GridItemActionModel> = [];
    headers: Array<GridHeaderModel> = [];
    classNames: Array<string> = [];
    disableSort: boolean = false;

    title: string;
    height: number;
    message: string;

    request: R;

    constructor(RCreator: new() => R) {
        this.request = new RCreator();
    }
}