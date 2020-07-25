<template>
  <div class="app has-background-light">
    <navbar></navbar>

    <div class="container">
      <div class="mt-5">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import Navbar from '@/components/Navbar.vue';

  @Component({
    components: {Navbar}
  })
  export default class App extends Vue {
  }
</script>

<style lang="scss">
  @import '~bulma-slider/dist/css/bulma-slider.min.css';
  @import '~bulma-fluent/css/bulma.css';
  @import 'assets/css/spacing.sass';
  @import '~@mdi/font/css/materialdesignicons.min.css';

  html, body, .app {
    min-height: 100vh;
  }
</style>
