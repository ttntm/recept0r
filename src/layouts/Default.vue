<template>
  <div class="d-flex h-100 flex-column">
    <Navbar />
    <div class="container flex-grow-1 flex-shrink-0">
      <div class="row">
        <AppHeader />
      </div>
      <div class="row">
        <slot />
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
    components: {
        Navbar,
        AppHeader,
        AppFooter
    }
};
</script>

<style>

</style>