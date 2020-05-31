<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <span class="navbar-brand">recept0r</span>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto font-weight-bold">
        <li class="nav-item">
          <router-link :to="{name: 'home'}" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'about'}" class="nav-link">About</router-link>
        </li>
        <li class="nav-item" v-if="!publicView">
          <router-link :to="{name: 'create'}" class="nav-link">&plus;Create</router-link>
        </li>
      </ul>
      <span class="navbar-text mr-3">This is {{ currentPage }}</span>
      <nav-auth class="d-block" />
    </div>
  </nav>
</template>

<script>
import NavAuth from '@/components/NavAuth.vue';

export default {
  name: 'navbar',
  components: {
    NavAuth
  },
  props: {
    publicView: Boolean
  },
  computed: {
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
    }
  }
};
</script>

<style>
</style>