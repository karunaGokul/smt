import { Vue } from "vue-property-decorator";
import { AxiosResponse, AxiosError } from "axios";
import { AlertType, UserModel } from '@/model';

export class BaseComponent extends Vue {
    error(e: AxiosError) {
        let root: any = this.$root;

        root.$alert(e.message, AlertType.Error);
    }

    showError(message: string) {
        let root: any = this.$root;

        root.$alert(message, AlertType.Error);
    }

    alert(message: string, type: AlertType) {
        let root: any = this.$root;

        root.$alert(message, type);
    }

    confirm(title: string, message: string) {
        let root: any = this.$root;

        return root.$confirm(title, message);
    }

    get isAdmin() {
        return this.$store.getters.isAdmin;
    }

    get currentUser(): UserModel {
        return this.$store.getters.currentUser;
    }

    get isLoggedIn() {
        return this.$store.getters.isLoggedIn;
    }

    get valid() {
        return !this.$v.$invalid && this.$v.$anyDirty;
    }
}