import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios'

import { Settings } from '@/config';
import { AuthenticationRequest, AuthenticationResponse } from '@/model';
import { ServiceHelper } from './base.service';

export class AuthenticationService extends ServiceHelper {
    static refreshTokenRequest: Promise<AuthenticationResponse> = null;

    refreshToken(token: string) {
        if (!AuthenticationService.refreshTokenRequest) {
            AuthenticationService.refreshTokenRequest = this._refreshToken(token);
            AuthenticationService.refreshTokenRequest.then(this.resetAuthTokenRequest, this.resetAuthTokenRequest);
        }

        return AuthenticationService.refreshTokenRequest;
    }

    resetAuthTokenRequest() {
        AuthenticationService.refreshTokenRequest = null;
    }

    private _refreshToken(token: string): Promise<AuthenticationResponse> {
        let request = new AuthenticationRequest();
        request.refresh_token = token;
        request.grant_type = "refresh_token";

        if (token) {
            return this.login(request);
        }
        else {
            return new Promise((resolve, reject) => {
                let response = new AuthenticationResponse();
                response.success = false;

                resolve(response);
            });
        }
    }

    login(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return axios.request(
            {
                url: `${this.baseUrl}/oauth/token`,
                method: "post",
                params: request,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                auth: {
                    username: Settings.AuthUserName,
                    password: Settings.AuthPassword
                }
            }).then(
                (result: AxiosResponse) => {
                    let response = new AuthenticationResponse();
                    if (result.data.error) {
                        response.success = false;
                        response.error = result.data.error_description;
                    }
                    else {
                        response.success = true;
                        response.accessToken = result.data.access_token;
                        response.refreshToken = result.data.refresh_token;

                        axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
                    }

                    return response;
                },
                (error: AxiosError) => {
                    let response = new AuthenticationResponse();
                    response.success = false;
                    if (error && error.response && error.response.data)
                        response.error = error.response.data.error_description;

                    return response;
                }
            );
    }

    logout() {
        return new Promise((resolve, reject) => {
            delete axios.defaults.headers.common['Authorization'];
            resolve()
        });
    }

}