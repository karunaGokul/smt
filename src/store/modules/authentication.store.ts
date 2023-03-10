import { GetterTree, MutationTree, ActionTree } from 'vuex';

import { AuthenticationState, AuthStatus, AuthenticationRequest, AuthenticationResponse, UserModel } from '@/model';
import { AuthenticationService, UserService } from '@/service';

const state: AuthenticationState = {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    isAdmin: localStorage.getItem('isAdmin') === "false" ? false : true,
    userData: null,
    status: AuthStatus.Loading
}

const getters: GetterTree<AuthenticationState, any> = {
    accessToken: state => {
        return state.accessToken;
    },
    isLoggedIn: state => {
        return !!state.accessToken;
    },
    authStatus: state => {
        return state.status;
    },
    currentUser: state => {
        return state.userData;
    },
    isAdmin: state => {
        return state.isAdmin;
    }
}

const mutations: MutationTree<AuthenticationState> = {
    onAuthenticate(state, data: AuthenticationResponse) {
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;

        state.status = data.success ? AuthStatus.Success : data.error == "Bad credentials" ? AuthStatus.BadCredentials : AuthStatus.Failed;
    },

    onLogout(state) {
        state.accessToken = "";
        state.refreshToken = "";
    },

    onSetCurrentUser(state, user) {
        state.userData = user;

        state.isAdmin = user.role == "Admin" || user.role == "Executive";
    }
}

const actions: ActionTree<AuthenticationState, any> = {
    refreshToken(context) {
        let service = new AuthenticationService();
        return service.refreshToken(context.state.refreshToken).then(response => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            context.commit('onAuthenticate', response);

            return response;
        });
    },

    login(context, request: AuthenticationRequest) {
        let service = new AuthenticationService();
        return service.login(request).then(response => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            context.commit('onAuthenticate', response);

            return response;
        });
    },

    logout(context) {
        let service = new AuthenticationService();
        return service.logout().then(response => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isAdmin');

            context.commit('onLogout');
        });
    },

    setCurrentUser(context) {
        let service = new UserService();

        return service.getCurrentUser().then(user => {
            localStorage.setItem('isAdmin', (user.role == "Admin" || user.role == "Executive").toString());

            context.commit('onSetCurrentUser', user);
        });
    }
}

export const LoginModule = {
    state,
    getters,
    mutations,
    actions
}