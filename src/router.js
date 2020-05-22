import Vue from "vue";
import Router from "vue-router";

//import views
import About from "@/views/About.vue";
import Home from "@/views/Home.vue";
import Create from "@/views/Create.vue";
import Recipe from "@/views/Recipe.vue";
import FourOFour from "@/views/404.vue";

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
      component: Create
    },
    {
      path: "/recipe/:id",
      name: "recipe",
      component: Recipe
    },
    {
      path: "*",
      name: "404*",
      component: FourOFour
    }
  ]
});