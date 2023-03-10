<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-form @submit.prevent="login">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom></v-progress-linear>
            </v-toolbar>
            <v-card-text>
              <v-alert dense type="error" v-if="isBadCredentials">Please enter valid credentials</v-alert>
              <v-text-field
                label="E-mail"
                name="username"
                prepend-icon="mdi-account"
                v-model="request.username"
                type="text"
                required
                :error-messages="$v.request.username | errorMessages('E-mail')"
              />

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                v-model="request.password"
                required
                :error-messages="$v.request.password | errorMessages('Password')"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" type="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

import {
  AuthenticationRequest,
  AuthStatus,
  AuthenticationResponse
} from "@/model";

@Component({
  mixins: [validationMixin],
  validations: {
    request: {
      username: { required },
      password: { required }
    }
  }
})
export default class LoginPage extends Vue {
  request = new AuthenticationRequest();
  showPassword: boolean = false;
  loading: boolean = false;

  login() {
    this.$v.$touch();

    if (!this.$v.$invalid) {
      this.loading = true;
      this.$store.dispatch("login", this.request).then(
        (response: AuthenticationResponse) => {
          this.loading = false;

          if (response.success) {
            this.$store.dispatch("setCurrentUser");

            this.$router.push("/");
          }
        },
        err => {
          this.loading = false;

          console.log(err);
        }
      );
    }
  }

  get isBadCredentials() {
    return this.$store.getters.authStatus == AuthStatus.BadCredentials;
  }
}
</script>
