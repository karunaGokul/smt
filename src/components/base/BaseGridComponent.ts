import { Vue, Watch, Prop } from "vue-property-decorator";

import { DataRespone, IBaseRequest, IBaseModel, GridModel } from "@/model";
import { IBaseService } from "@/service";
import { BaseComponent } from './BaseComponent';

export class BaseGridComponent<R extends IBaseRequest, M extends IBaseModel> extends BaseComponent {
    gridService: IBaseService<R, M>;
    @Prop() gridData: GridModel<R>;

    response = new DataRespone<M>();
    options = new GridOptionModel();
    style = new GridStyleModel();

    init(service: IBaseService<R, M>) {
        this.gridService = service;

        if (!this.gridData.request.sortColumn) {
            let sortedHeader = this.gridData.headers.find(h => h.sorted);
            if (sortedHeader) this.gridData.request.sortColumn = sortedHeader.value;
        }

        this.options.sortBy = [this.gridData.request.sortColumn];

        this.options.sortDesc = [!this.gridData.request.ascending];
        this.options.page = this.gridData.request.page;
        this.options.itemsPerPage = this.gridData.request.pageSize;

        if (!this.gridData.classNames)
            this.gridData.classNames = [];

        this.gridData.classNames.push("y-single-line");
        if (this.$vuetify.breakpoint.smAndUp && this.gridData.height)
            this.gridData.classNames.push("y-fixed-layout");

        if (!this.gridData.disableSort && this.$vuetify.breakpoint.smAndUp)
            this.gridData.classNames.push("y-sortable");
        this.style.footerProps = { itemsPerPageOptions: [] };

        this.style.classNames = this.gridData.classNames.join(" ");
        this.style.height = this.gridData.height > 0 && this.$vuetify.breakpoint.smAndUp ? this.gridData.height.toString() : 'auto';
        this.style.fieldClasses = this.$vuetify.breakpoint.smAndUp ? 'text-overflow' : null;
    }

    @Watch("options", { deep: true })
    optionsChanged() {
        this.gridData.request.sortColumn = this.options.sortBy && this.options.sortBy.length ? this.options.sortBy[0] : undefined;
        this.gridData.request.ascending = this.options.sortDesc && this.options.sortDesc.length && this.options.sortDesc[0] ? false : true;
        this.gridData.request.page = this.options.page;
        this.gridData.request.pageSize = this.options.itemsPerPage;

        this.getItems();
    }

    getItems() {
        this.gridService.getItems(this.gridData.request).then(
            r => this.response = r,
            e => {
                this.response = new DataRespone<M>();
                this.gridData.message = `Error: ${e.message}`;
                this.style.classNames = `${this.style.classNames} y-error`;
            }
        );
    }

    refresh() {
        this.getItems();
    }
}

class GridOptionModel {
    public sortBy: Array<string> = [];
    public sortDesc: Array<boolean> = [];
    public page: number = 1;
    public itemsPerPage: number = 0;

    keyword: string = "";
}

class GridStyleModel {
    public classNames: string;
    public height: string;
    public fieldClasses: string;

    public footerProps: any;
}