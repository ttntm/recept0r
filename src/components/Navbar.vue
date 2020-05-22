<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <span class="navbar-brand"><a href="/" class="navbar-brand">recept0r</a></span>
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
        <li class="nav-item">
          <router-link :to="{name: 'create'}" class="nav-link">&plus;Create</router-link>
        </li>
      </ul>
      <span class="navbar-text">This is {{ currentPage }}</span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  computed: {
    currentPage() {
      return this.$route.name; //use this to mark the active link in the navigation
    }
  }
};
</script>

<style>
</style>