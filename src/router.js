import Vue from "vue";
import Router from "vue-router";

//import views
import About from "@/views/About.vue";
import Home from "@/views/Home.vue";
import Create from "@/views/Create.vue";
import Recipe from "@/views/Recipe.vue";
import FourOFour from "@/views/404.vue";

import store from "@/store";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/create",
      name: "create",
      component: Create,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
         if (!store.state.user.currentUser) { //get stored user state from vuex store
          alert('Nope...');
        } else {
          return next();
        }
      }
    },
    {
      path: "/recipe/:id/:refId",
      name: "recipe",
      component: Recipe
    },
    {
      path: "*",
      name: "404*",
      component: FourOFour
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
});