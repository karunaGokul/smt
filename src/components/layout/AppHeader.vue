<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped dark class="y-nav-drawer" v-if="isLoggedIn">
      <v-list class="mt-10 text-uppercase">
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title to="/">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="mdi-cash-usd-outline" no-action>
          <template v-slot:activator>
            <v-list-item-title>Pricing</v-list-item-title>
          </template>
          <v-list-item link to="/plans" class="text-capitalize">
            <v-list-item-title>Plans</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/addons" class="text-capitalize">
            <v-list-item-title>Add-ons</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/discounts" class="text-capitalize">
            <v-list-item-title>Discounts</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item to="/trials">
          <v-list-item-action>
            <v-icon>mdi-av-timer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Trials</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/subscriptions">
          <v-list-item-action>
            <v-icon>mdi-briefcase-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscriptions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/users" v-if="isAdmin">
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Users</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark clipped-left class="y-app-header">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isLoggedIn"></v-app-bar-nav-icon>
      <v-toolbar-title class="y-logo">BILLFIN</v-toolbar-title>
      <v-toolbar-title class="mx-4">|</v-toolbar-title>
      <v-toolbar-title class="subtitle-1" v-if="$vuetify.breakpoint.smAndUp">Subscription Management</v-toolbar-title>
      <v-toolbar-title class="subtitle-1" v-else>SMT</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-flex align-center" v-if="isLoggedIn">
        <v-autocomplete
          label="Search Firm"
          outlined
          rounded
          dense
          class="mr-8"
          single-line
          hide-details
          append-icon="mdi-magnify"
          filled
          v-model="select"
          :loading="loading"
          :items="items"
          item-text="name"
          item-value="id"
          :search-input.sync="search"
          hide-no-data
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <template v-slot:item="{ item }">
            <v-list-item-avatar
              size="24"
              :color="item.isTrial ? 'indigo' : 'green'"
              class="font-weight-light white--text"
            >{{ item.isTrial ? 'T' : 'S' }}</v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-menu
          left
          bottom
          transition="slide-y-transition"
          open-on-hover
          offset-y
          v-if="currentUser"
        >
          <template v-slot:activator="{ on }">
            <v-list flat rounded color="transparent">
              <v-list-item v-on="on">
                <v-list-item-avatar size="36" class="mr-2">
                  <img v-if="avatar" :src="avatar" />
                  <v-icon v-else dark>mdi-account-circle</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Hi {{ currentUser.firstName }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
          <v-card>
            <v-container>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar
                    color="green"
                    class="white--text"
                    v-if="currentUser.firstName && currentUser.lastName"
                  >{{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}</v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ currentUser.fullName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ currentUser.role }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list dense nav flat>
                <v-list-item-group>
                  <v-list-item @click="openProfile">
                    <v-list-item-icon>
                      <v-icon>mdi-account-edit</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>My Profile</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-icon>
                      <v-icon>mdi-logout</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-container>
          </v-card>
        </v-menu>
        <component
          v-bind:is="dialog.component"
          :data="dialog.data"
          :name="dialog.name"
          @close="close"
          v-if="dialog"
        ></component>
      </div>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Watch } from "vue-property-decorator";
import { ITrialService, ISubscriptionService } from "@/service";
import { UserModel, DialogModel } from "@/model";
import { BaseComponent } from '../base';
import UserDetail from "@/pages/users/components/UserDetail.vue";

@Component
export default class AppHeader extends BaseComponent {
  @Inject("subscriptionService") subscriptionService: ISubscriptionService;
  @Inject("trialService") trialService: ITrialService;

  drawer: boolean = false;
  dialog: DialogModel<UserModel> = null;

  created() {
    if (!this.currentUser && this.isLoggedIn)
      this.$store.dispatch("setCurrentUser");
  }

  openProfile() {
    this.dialog = new DialogModel<UserModel>();
    this.dialog.name = "Profile";
    this.dialog.component = UserDetail;
    this.dialog.data = this.currentUser;
  }

  close(save: boolean) {
    this.dialog = new DialogModel<UserModel>();
  }

  logout() {
    this.$store
      .dispatch("logout")
      .then(() => this.$router.push("/login"))
      .catch(err => console.log(err));
  }

  get avatar() {
    return this.currentUser && this.currentUser.avatar
      ? this.$vuehelper.getImageUrl(this.currentUser.avatar)
      : "";
  }

  loading: boolean = false;
  items: Array<any> = [];
  originalItems: Array<any> = [];
  search: string = null;
  select: string = null;

  mounted() {
    this.buildItems().then();
  }

  @Watch("search", {})
  onSearchChange(value: string) {
    if (value) {
      if (this.originalItems.length) this.searchFirm(value);
      else {
        this.loading = true;

        this.buildItems().then(() => {
          this.searchFirm(value);
          this.loading = false;
        });
      }
    } else this.items = [];
  }

  @Watch("select", {})
  onSelectChange(value: string) {
    let selectedItem = this.items.find(i => i.id == parseInt(value));
    if (selectedItem) {
      this.items = [];

      if (selectedItem.isTrial) {
        if (this.$router.currentRoute.name == "trials")
          this.$root.$emit("trialSearch", selectedItem.name);
        else
          this.$router.push({
            name: "trials",
            params: { search: selectedItem.name }
          });
      } else {
        if (this.$router.currentRoute.name == "subscriptions")
          this.$root.$emit("subscriptionSearch", selectedItem.name);
        else
          this.$router.push({
            name: "subscriptions",
            params: { search: selectedItem.name }
          });
      }
    }
  }

  searchFirm(value: string) {
    this.items = this.originalItems.filter(item => {
      return item.name.toLowerCase().indexOf((value || "").toLowerCase()) == 0;
    });
  }

  buildItems() {
    return Promise.all([
      this.trialService.getAll(),
      this.subscriptionService.getAll()
    ]).then(response => {
      this.originalItems = [];

      response[0].data.forEach(t => {
        let item = { id: t.firmId, name: t.firmName, isTrial: true };

        this.originalItems.push(item);
      });

      response[1].data.forEach(s => {
        let item = {
          id: s.subscriptionId,
          name: s.firmName,
          isTrial: false
        };

        this.originalItems.push(item);
      });

      return true;
    });
  }
}
</script>