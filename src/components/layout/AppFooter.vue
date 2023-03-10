<template>

 <v-bottom-navigation
    dark
    fixed
    app
    height="36"
    class="y-app-footer"
  >
      <!-- <a class="ma-4">Terms of Service</a>
      <v-divider
        inset
        vertical
      ></v-divider> -->
      <span class="ma-2 grey--text lighten-5--text">&copy; Redi2 Technologies, Inc 2002 - 2019</span>
  </v-bottom-navigation>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class AppFooter extends Vue {
    bottomNav: string = 'recent';
  }
</script>