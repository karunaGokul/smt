<template>
  <v-app :class="{ 'y-mac': macOS }">
    <AppHeader />

    <v-content>
      <router-view></router-view>
      <app-alert ref="alert"></app-alert>
      <app-confirm ref="confirm"></app-confirm>
    </v-content>

    <AppFooter />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";
import { DIContainer } from "./dicontainer";
import { AuthenticationResponse } from "@/model";

import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppAlert from "@/components/layout/AppAlert.vue";
import AppConfirm from "@/components/layout/AppConfirm.vue";

@Component({
  components: { AppHeader, AppFooter, AppAlert, AppConfirm }
})
export default class App extends DIContainer {
  get macOS() {
    return window.navigator.platform.toLowerCase().indexOf("mac") == 0;
  }

  created() {
    let token = this.$store.getters.accessToken;
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    this.createAxiosResponseInterceptor();

    this.createFilters();
  }

  mounted() {
    let root: any = this.$root;
    let alert: AppAlert = this.$refs.alert as AppAlert;
    let confirm: AppConfirm = this.$refs.confirm as AppConfirm;

    root.$alert = alert.show;
    root.$confirm = confirm.show;
  }

  createFilters() {
    Vue.filter("currencyDisplay", (value: any) => {
      if (!value) return "";

      return `$${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    });

    Vue.filter("dateDisplay", (value: any, format: string) => {
      if (!value) return "";

      return this.$vuehelper.date.format(value, format);
    });

    Vue.filter("errorMessages", (value: any, name: string) => {
      return this.$vuehelper.val.messages(value, name);
    });
  }

  createAxiosResponseInterceptor() {
    let self = this;

    const interceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        const status = error.response ? error.response.status : null;

        if (status !== 401) {
          return Promise.reject(error);
        }

        axios.interceptors.response.eject(interceptor);

        return self.$store
          .dispatch("refreshToken")
          .then((response: AuthenticationResponse) => {
            if (response.success) {
              error.response.config.headers["Authorization"] =
                "Bearer " + self.$store.getters.accessToken;
              return axios(error.response.config);
            } else {
              self.$store.dispatch("logout");

              self.$router.push("/login").catch(err => {});

              return Promise.reject(error);
            }
          })
          .catch(error => {
            self.$store.dispatch("logout");

            self.$router.push("/login").catch(err => {});

            return Promise.reject(error);
          })
          .finally(this.createAxiosResponseInterceptor);
      }
    );
  }
}
</script>
