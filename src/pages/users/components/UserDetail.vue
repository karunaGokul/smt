<template>
  <v-dialog v-model="show" max-width="800" persistent scrollable>
    <v-card>
      <v-card-title>
        <h1 class="headline">{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6" class="pt-0 pb-0">
              <v-text-field
                label="First Name"
                prepend-icon="mdi-account-circle"
                type="text"
                v-model="user.firstName"
                required
                @input="$v.user.firstName.$touch"
                :error-messages="$v.user.firstName | errorMessages('First Name')"
              />
            </v-col>
            <v-col cols="12" md="6" class="pt-0 pb-0">
              <v-text-field
                label="Last Name"
                prepend-icon="mdi-account-circle-outline"
                type="text"
                v-model="user.lastName"
                required
                @input="$v.user.lastName.$touch"
                :error-messages="$v.user.lastName | errorMessages('Last Name')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" class="pt-0 pb-0">
              <v-text-field
                label="E-mail"
                prepend-icon="mdi-email"
                type="email"
                v-model="user.email"
                required
                @input="$v.user.email.$touch"
                :error-messages="$v.user.email | errorMessages('E-mail')"
                autocomplete="new-email"
              ></v-text-field>

              <v-menu offset-x elevation="24" transition="slide-y-transition" v-model="showTooltip">
                <template v-slot:activator="{ }">
                  <v-text-field
                    label="Password"
                    prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="user.password"
                    @input="$v.user.password.$touch"
                    :error-messages="$v.user.password | errorMessages('Password')"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    @keydown="showTooltip = true"
                    @click="showTooltip = true"
                    @blur="showTooltip = false"
                    autocomplete="new-password"
                    v-if="name != 'Profile'"
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

              <div class="text-right pb-2">
                <v-btn
                  x-small
                  @click="openChangePassword()"
                  v-if="name == 'Profile'"
                  dark
                >Change Password</v-btn>
              </div>

              <v-text-field
                label="SMS Number"
                prepend-icon="mdi-phone"
                type="text"
                v-model="user.phoneNumber"
                v-mask="'###-###-####'"
                @change="$v.user.phoneNumber.$touch"
                :error-messages="$v.user.phoneNumber | errorMessages('SMS Number')"
              ></v-text-field>

              <template v-if="name != 'Profile'">
                <v-select
                  :items="roles"
                  v-model="user.role"
                  label="Role"
                  prepend-icon="mdi-account-group"
                  @input="$v.user.role.$touch"
                  :error-messages="$v.user.role | errorMessages('Role')"
                />
                <v-select
                  :items="status"
                  v-model="user.status"
                  label="Status"
                  prepend-icon="mdi-clipboard-check"
                  v-if="showStatus===true"
                />
              </template>
            </v-col>
            <v-col cols="12" md="6" class="pt-0 pb-0">
              <v-file-input
                accept="image/png, image/jpeg, image/bmp"
                :placeholder="avatarPlaceHolder"
                prepend-icon="mdi-camera"
                show-size
                small-chips
                @change="fileChange"
              ></v-file-input>

              <v-container>
                <v-img v-if="photo" :src="photoUrl" height="200px" class="ml-5"></v-img>
                <v-img
                  v-else-if="user.avatar"
                  :src="$vuehelper.getImageUrl(user.avatar)"
                  height="200px"
                  class="ml-5"
                ></v-img>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save" :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
    <change-password ref="changePassword"></change-password>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import {
  required,
  requiredIf,
  email,
  minLength
} from "vuelidate/lib/validators";
import { mask } from "vue-the-mask";
import { ListItem, AlertType, UserModel } from "@/model";
import { IUserService } from "@/service";
import { BaseDialogComponent } from "@/components/base";
import ChangePassword from "./ChangePassword.vue";

let validations: any = {
  user: {
    firstName: { required },
    lastName: { required },
    password: {
      required: (v: string, vm: UserModel) => {
        return vm.userId ? true : v ? true : false;
      },
      invalid: (v: string, vm: UserModel) => {
        if (!v) return true;

        var strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
        );
        return strongRegex.test(v);
      }
    },
    email: { required, email },
    phoneNumber: {},
    avatar: {},
    role: { required }
  }
};

@Component({
  components: { ChangePassword },
  validations: validations,
  directives: { mask }
})
export default class UserDetail extends BaseDialogComponent<UserModel> {
  @Inject("userService") userService: IUserService;

  user: UserModel = new UserModel();
  status: Array<ListItem> = [];
  roles: Array<ListItem> = [];
  title: string = "Add User";
  showStatus: boolean = false;
  showPassword: boolean = false;
  photo: File = null;
  avatarPlaceHolder: string = null;
  showTooltip: boolean = false;

  public mounted() {
    this.user = this.$vuehelper.clone(this.data);

    if (this.user.userId) {
      this.title = "Edit User";
      this.showStatus = true;
    }

    if (this.user.avatar != null && this.user.userId)
      this.avatarPlaceHolder = "Update your profile photo";
    else this.avatarPlaceHolder = "Personalize with your photo";

    if (this.name == "Profile") this.title = "Edit Profile";

    this.status.push(new ListItem("Active", "Active"));
    this.status.push(new ListItem("InActive", "InActive"));

    this.userService.getRoles().then(items => {
      this.roles = items;
    });

    this.open(this.data.userId > 0);
  }

  save() {
    if (this.valid) {
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      this.user.userName = this.user.email;

      if (this.user.phoneNumber)
        this.user.phoneNumber = this.user.phoneNumber.replace(/-/g, "");

      this.userService.isNameExists(this.user).then(exists => {
        if (exists) {
          this.alert(
            `user with name '${this.user.userName}' already exists.`,
            AlertType.Warning
          );
        } else
          this.userService.saveUser(this.user).then(
            (r: UserModel) => this.processAvatar(r),
            (e: any) => this.error(e)
          );
      });
    } else {
      console.log(this.$v);
    }
  }

  processAvatar(user: UserModel) {
    if (!user.userId) this.user.userId = user.userId;

    if (this.user.userId == this.currentUser.userId)
      this.$store.dispatch("setCurrentUser");

    if (this.photo) {
      this.userService.uploadPhoto(this.photo, this.user.userId).then(() => {
        this.onSave();
      });
    } else this.onSave();
  }

  fileChange(file: File) {
    this.photo = file;

    this.$v.user.avatar.$touch();
  }

  openChangePassword() {
    let component = this.$refs.changePassword as ChangePassword;

    component.open();
  }

  get photoUrl() {
    return this.photo ? window.URL.createObjectURL(this.photo) : null;
  }

  get passwordRules() {
    let rules: any = [];

    rules.push({
      valid: this.user.password && this.user.password.length >= 8,
      text: `Minimum 8 characters`
    });
    rules.push({
      valid: this.user.password && /\d/.test(this.user.password),
      text: `Atleast one number`
    });
    rules.push({
      valid: this.user.password && /[!@#$%^&*]/.test(this.user.password),
      text: `Atleast one special character (! @ # $ % ^ & *)`
    });

    return rules;
  }
}
</script>