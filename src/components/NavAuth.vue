<template>
  <div id="nav-auth" class="navbar-text">
    <div v-if="isLoggedIn">
      <span class="text-dark">{{ this.isLoggedIn.email }}</span>
      <button @click="triggerNetlifyIdentityAction('logout')" class="btn btn-sm btn-outline-secondary ml-2">Log Out</button>
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

export default {
  name: 'nav-auth',
  computed:
    mapState({
      isLoggedIn: state => state.user.currentUser,
    }),
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
        if(this.$route.name !== 'home') { //prevent duplicate navigation router error
            this.$router.push({ name: 'home' });
        }
      }
    },
  }
};
</script>

<style>
</style>