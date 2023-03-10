import axios from 'axios';
import { AxiosResponse, AxiosError, AxiosRequestConfig, ResponseType } from 'axios'
import { stringify } from 'qs';

import { Settings } from '@/config';
import { DataRespone, IBaseModel, IBaseRequest, PageInfo, ListItem, DataRequest } from '@/model';

export interface IBaseService<R extends IBaseRequest, T extends IBaseModel> {
    getItem(id: string): Promise<T>;
    getItems(request: R): Promise<DataRespone<T>>;
    getAll(): Promise<DataRespone<T>>;

    post(data: T, endPoint?: string): Promise<T>;
    put(data: T, endPoint?: string): Promise<T>;
    delete(id: string): Promise<boolean>;
    export(request: R, fileName: string, endPoint?: string): void;
}

export abstract class ServiceHelper {
    protected baseUrl: string = Settings.ApiUrl;

    protected apiUrl: string = `${this.baseUrl}/${Settings.ApiPath}`;

    httpGet(route: string, request: any, responseType?: ResponseType): Promise<AxiosResponse<any>> {
        let params: any = {};
        if (request) {
            for (let key in request) {
                if (key.charAt(0) != "_") {
                    if (request[key] instanceof Date) {
                        let dateString: any = request[key];

                        let date: Date = new Date(dateString);

                        if (date)
                            params[key] = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
                    }
                    else {
                        let value: any = request[key];

                        if (value || value === false)
                            params[key] = request[key];
                    }
                }
            }
        }

        let path = `${this.apiUrl}/${route}`;
        let config: AxiosRequestConfig = {
            params: params,
            'paramsSerializer': params => {
                return stringify(params, { arrayFormat: 'repeat' })
            }
        };

        if (responseType) config.responseType = responseType;

        return axios.get<any>(path, config);
    }


    protected httpPost(route: string, data: any): Promise<AxiosResponse<any>> {
        let path = `${this.apiUrl}/${route}`;

        return axios.post(path, data);
    }

    protected httpPut(route: string, data: any): Promise<AxiosResponse<any>> {
        let path = `${this.apiUrl}/${route}`;

        return axios.put(path, data);
    }

    protected httpDelete(route: string): Promise<AxiosResponse<any>> {
        let path = `${this.apiUrl}/${route}`;

        return axios.delete(path);
    }
}

export class BaseService<R extends IBaseRequest, T extends IBaseModel> extends ServiceHelper {
    constructor(protected path: string) {
        super();
    }

    getItem(id: string): Promise<T> {
        let path = this.path;
        path = `${path}/${id}`;

        return this.httpGet(path, null).then(
            (response: AxiosResponse) => {
                return response.data;
            },
            (reason: AxiosError) => {
                return null;
            }
        );
    }

    getAll(): Promise<DataRespone<T>> {
        let request: any = new DataRequest();
        request._skipPaging = true;

        return this.getItems(request);
    }

    getItems(request: R): Promise<DataRespone<T>> {
        if (request._skipPaging) {
            request.page = undefined;
            request.pageSize = undefined;
        }

        request._loading = true;
        return this.httpGet(`${this.path}`, request).then(
            (response: AxiosResponse) => {
                request._loading = false;

                return response.data;
            },
            (reason: AxiosError) => {
                request._loading = false;

                throw reason;
            }
        );
    }

    post(data: T, endPoint?: string): Promise<T> {
        let path = this.path;
        if (endPoint) path = `${path}/${endPoint}`;

        return this.httpPost(path, data).then(response => {
            return response.data;
        });
    }

    put(data: T, endPoint?: string): Promise<T> {
        let path = this.path;
        if (endPoint) path = `${path}/${endPoint}`;

        return this.httpPut(path, data).then(response => {
            return response.data;
        });
    }

    delete(id: string): Promise<boolean> {
        let path = `${this.path}/${id}`;

        return this.httpDelete(path).then((response: AxiosResponse) => {
            return true;
        });
    }

    upload(formData: FormData, route: string) {
        let path = `${this.path}/${route}`;

        let config: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

        return axios.post(`${this.apiUrl}/${path}`, formData, config).then(response => {
            return response.data;
        });
    }

    export(request: R, fileName: string, endPoint?: string): void {
        let path = `${this.path}/export`;
        if (endPoint) path = endPoint;

        this.httpGet(path, request, "blob").then(response => {
            let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
            let fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", fileName);
            fileLink.style.display = "none";
            document.body.appendChild(fileLink);

            fileLink.click();
            document.body.removeChild(fileLink);
        });
    }
}


export class BaseMockService<R extends IBaseRequest, T extends IBaseModel> {
    protected baseUrl: string = Settings.MockApiUrl;

    protected apiUrl: string = `${this.baseUrl}/${Settings.MockApiPath}`;

    constructor(protected path: string) {
    }

    getItem(id: string): Promise<T> {
        return null;
    }

    getAll(): Promise<DataRespone<T>> {
        let request: any = new DataRequest();
        request._skipPaging = true;

        return this.getItems(request);
    }

    getItems(request: R): Promise<DataRespone<T>> {
        let params = "";
        if (request.sortColumn)
            params = `_sort=${request.sortColumn}&_order=${request.ascending ? "asc" : "desc"}`;

        if (request.page > 0 && request.pageSize > 0)
            params += `&_page=${request.page}&_limit=${request.pageSize}`;

        for (let key in request) {
            if (key.charAt(0) != "_" && !["sortColumn", "ascending", "page", "pageSize"].includes(key)) {
                let value: any = request[key];

                if (request[key] instanceof Date) {
                    let dateString: any = request[key];

                    let date: Date = new Date(dateString);

                    if (date)
                        value = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
                }
                else if (value)
                    params += `&${key}_like=${value.toString()}`;
            }
        }

        request._loading = true;
        return axios.get(`${this.apiUrl}/${this.path}?${params}`).then(json => {
            let items = json.data.items;

            let response = new DataRespone<T>();
            response.pageInfo = new PageInfo();
            response.pageInfo.page = request.page;
            response.pageInfo.pageSize = request.pageSize;
            response.pageInfo.sortColumn = request.sortColumn;
            response.pageInfo.ascending = request.ascending;
            response.pageInfo.totalResults = json.data.totalRecords;

            response.data = items;

            request._loading = false;
            return response;
        });
    }

    post(data: T, endPoint?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }

    put(data: T, endPoint?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    }

    delete(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    export(request: R, fileName: string, endPoint?: string): void {

    }
}
