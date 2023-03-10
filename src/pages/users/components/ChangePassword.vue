<template>
  <v-dialog v-model="show" max-width="600" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">Password</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <p class="subtitle-1">Set a strong password to prevent unauthorized access to your account.</p>
        <v-container>
          <v-row>
            <v-col cols="10">
              <v-text-field
                label="Current Password"
                prepend-icon="mdi-lock-open-variant"
                type="password"
                v-model="currentPassword"
                required
                @change="$v.currentPassword.$touch"
                :error-messages="$v.currentPassword | errorMessages('Current Password')"
                autocomplete="current-password"
              />
              <v-menu offset-x elevation="24" transition="slide-y-transition" v-model="showTooltip">
                <template v-slot:activator="{ }">
                  <v-text-field
                    label="New Password"
                    prepend-icon="mdi-lock"
                    v-model="newPassword"
                    @input="$v.newPassword.$touch"
                    :error-messages="$v.newPassword | errorMessages('New Password')"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    @keydown="showTooltip = true"
                    @click="showTooltip = true"
                    @blur="showTooltip = false"
                    autocomplete="new-password"
                  ></v-text-field>
                </template>
                <v-list dense color="grey lighten-2">
                  <v-list-item v-for="(item, i) in passwordRules" :key="i">
                    <v-list-item-icon>
                      <v-icon v-if="item.valid" color="green">mdi-check-circle-outline</v-icon>
                      <v-icon v-else color="error">mdi-close-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-text-field
                label="Confirm Password"
                prepend-icon="mdi-lock-plus"
                type="password"
                v-model="confirmPassword"
                required
                @input="$v.confirmPassword.$touch"
                :error-messages="$v.confirmPassword| errorMessages('Confirm Password')"
                autocomplete="confirm-password"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save" :disabled="$v.$invalid">Change Password</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { required, sameAs } from "vuelidate/lib/validators";
import { ListItem, AlertType, UserModel } from "@/model";
import { IUserService } from "@/service";
import { BaseDialogComponent, BaseComponent } from "@/components/base";

let validations: any = {
  currentPassword: { required },
  newPassword: {
    required: (v: string, vm: UserModel) => {
      return vm.userId ? true : v ? true : false;
    },
    invalid: (v: string, vm: any) => {
      if (!v) return true;

      if (v === vm.currentPassword) return false;

      var strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      return strongRegex.test(v);
    }
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs('newPassword')
  }
};

@Component({
  validations: validations
})
export default class ChangePassword extends BaseComponent {
  @Inject("userService") userService: IUserService;

  show: boolean = false;
  showPassword: boolean = false;
  showTooltip: boolean = false;

  currentPassword: string = null;
  newPassword: string = null;
  confirmPassword: string = null;

  open() {
    this.show = true;

    this.currentPassword = null;
    this.newPassword = null;
    this.confirmPassword = null;

    this.$v.$reset();
  }

  save() {
    if (this.valid) {
      this.userService
        .changePassword(
          this.currentUser.userId,
          this.currentPassword,
          this.newPassword
        )
        .then(
          r => {
            this.close();
          },
          e => {
            this.showError("Current password is not valid");
          }
        );
    }
  }

  close() {
    this.show = false;

    this.$emit("close", false);
  }

  get passwordRules() {
    let rules: any = [];

    rules.push({
      valid: this.newPassword && this.newPassword.length >= 8,
      text: `Minimum 8 characters`
    });
    rules.push({
      valid: this.newPassword && /\d/.test(this.newPassword),
      text: `Atleast one number`
    });
    rules.push({
      valid: this.newPassword && /[!@#$%^&*]/.test(this.newPassword),
      text: `Atleast one special character (! @ # $ % ^ & *)`
    });
    rules.push({
      valid: this.newPassword !== this.currentPassword,
      text: `Same as Current Password`
    });

    return rules;
  }
}
</script>