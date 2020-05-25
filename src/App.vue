<template>
  <div id="app" class="d-flex h-100 flex-column">
    <Navbar />
    <div class="container flex-grow-1 flex-shrink-0">
      <div class="row">
        <AppHeader />
      </div>
      <router-view :recipes="recipes" @status:update="updateRecipes" />
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
    getRecipes() {
      fetch('/.netlify/functions/all-recipes')
        .then((response) => {
          return response.json();
        }).then((res) => {
          this.recipes = res.map((e) => {
            let temp = Object.assign({}, e.data); //create new object from DB data
            temp.refId = e.ref['@ref'].id; // add the database ID for edit/delete operations
            return temp; //return newly created temp object
          });
      })
    },
    updateRecipes(status) {
      this.updateList = status[0];
      if(status) { //if an update is neccessary...
        this.getRecipes(); //...do it!
        this.updateList = false; // and make sure you let others know it's done
      }
    }
  },
  created() {
    this.getRecipes();
  },
  data() {
    return {
      recipes: [],
      updateList: false
    };
  }
};
</script>

<style></style>
