import { AuthStatus } from "./enums";
import { UserModel } from "./user.model";

export class AuthenticationRequest {
    username?: string;
    password?: string;
    grant_type: string = "password";
    refresh_token?: string;
}

export class AuthenticationResponse {
    accessToken: string;
    refreshToken: string;
    success: boolean;
    error: string;
}

export class AuthenticationState {
    accessToken: string = "";
    refreshToken: string = "";
    isAdmin: boolean = true;
    userData: UserModel;
    status: AuthStatus;
}
