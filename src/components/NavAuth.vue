<template>
  <div id="nav-auth">
    <div v-if="isLoggedIn">
      <button @click="triggerNetlifyIdentityAction('logout')" class="btn btn-sm btn-outline-secondary">Log Out</button>
    </div>
    <div v-else>
      <button @click="triggerNetlifyIdentityAction('login')" class="btn btn-sm btn-outline-dark mr-2">Log In</button>
      <button @click="triggerNetlifyIdentityAction('signup')" class="btn btn-sm btn-outline-secondary">Sign Up</button>
    </div>
  </div>
</template>

<script>
import netlifyIdentity from "netlify-identity-widget";
import { mapActions, mapState } from "vuex";

netlifyIdentity.init({
  APIUrl: "https://recept0r.netlify.app/.netlify/identity",
  logo: true // you can try false and see what happens
});

export default {
  name: 'nav-auth',
  computed: mapState({
    isLoggedIn: state => state.user.currentUser
  }),
  data() {
    return {
      currentUser: null
    };
  },
  methods: {
    ...mapActions({
      setUser: 'user/setUser'
    }),
    triggerNetlifyIdentityAction(action) {
      if (action == "login" || action == "signup") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, user => {
          this.setUser(user);
          netlifyIdentity.close();
        });
      } else if (action == "logout") {
        this.setUser(null);
        netlifyIdentity.logout();
        this.$router.push('/');
      }
    },
  }
};
</script>

<style>
</style>