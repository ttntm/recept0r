<template>
  <div id="app" class="d-flex h-100 flex-column">
    <Navbar />
    <div class="container flex-grow-1 flex-shrink-0">
      <div class="row">
        <AppHeader />
      </div>
      <router-view :updateList="updateList" :fPath="fPath" @status:update="updateRecipes" />
    </div>
    <AppFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'App',
  components: {
      Navbar,
      AppHeader,
      AppFooter
  },
  methods: {
    updateRecipes(status) {
      this.updateList = status[0];
    }
  },
  data() {
    return {
      updateList: false,
      fPath: {
        readAll: process.env.VUE_APP_FUNC_PATH_ALL,
        readOne: process.env.VUE_APP_FUNC_PATH_ONE,
        create: process.env.VUE_APP_FUNC_PATH_CREATE,
        edit: process.env.VUE_APP_FUNC_PATH_EDIT,
        delete: process.env.VUE_APP_FUNC_PATH_DELETE
      }
    };
  }
};
</script>

<style>
</style>
