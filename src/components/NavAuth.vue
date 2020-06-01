<template>
  <div id="nav-auth" class="navbar-text">
    <div v-if="!publicView">
      <button @click="logout()" class="btn btn-sm btn-outline-secondary ml-2">Log Out</button>
    </div>
    <div v-else>
      <button @click="toggleShow()" class="btn btn-sm btn-outline-dark mr-2">Log In</button>
    </div>
    <transition name="fade">
      <div v-if="isShowing" class="user-modal rounded-lg shadow-lg border border-secondary">
        <div class="user-modal-close" @click="toggleShow()">&times;</div>
        <div class="form">
          <form v-if="mode === 'register'" class="" @keyup.enter="signup()">
            <h2 class="mb-3">👋 Register Here</h2>
            <div class="form-group">
              <label for="name">Name</label>
              <input class="form-control" id="name" v-model="crendentials.name" ref="firstInput" type="text" placeholder="Arnold Schwarzenegger"/>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="form-control" id="email" v-model="crendentials.email" type="text" placeholder="arnie@terminator.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="form-control" id="password" type="password" v-model="crendentials.password" placeholder="******"/>
            </div>
            <button class="btn btn-outline-dark mb-2" type="button" @click="signup()">Sign Up</button>
            <p class="message">
              Already registered?
              <a href="#" @click="toggleMode">Sign In</a>
            </p>
          </form>

          <form v-if="mode === 'login'" class="login-form stack" @keyup.enter="login()">
            <h2 class="mb-3">🔐 Login Here</h2>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="form-control" id="email" v-model="crendentials.email" ref="firstInput" type="text" placeholder="hey@email.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="form-control" id="password" type="password" v-model="crendentials.password" placeholder="******"/>
            </div>
            <button class="btn btn-outline-dark mb-2" type="button" @click="login()">Login</button>
            <p class="message">
              Not registered?
              <a href="#" @click="toggleMode">Create an account</a>
            </p>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'nav-auth',
  props: {
    publicView: Boolean
  },
  data() {
    return {
      crendentials: {
        name: "",
        password: "",
        email: ""
      },
      mode: "login",
      isShowing: false
    };
  },
   methods: {
    ...mapActions("user", [
      "attemptLogin",
      "attemptSignup",
      "attemptLogout",
      "getCurrentUser",
    ]),
    toggleShow() {
      this.isShowing = !this.isShowing;
      if(this.isShowing) {
        this.$nextTick(function () {
          this.$refs['firstInput'].focus();
        });
      }
    },
    toggleMode() {
      this.mode === "register"
        ? (this.mode = "login")
        : (this.mode = "register");
    },
    signup() {
      this.attemptSignup(this.crendentials)
        .then(response => {
          this.toggleShow();
          alert("Confirmation email has been sent to you!");
          console.log(response);
        })
        .catch(error => {
          alert(`Somethings gone wrong signing up.
                 Error: ${error}`);
          console.error(error, "Somethings gone wrong signing up");
        });
    },
    login() {
      this.attemptLogin({ ...this.crendentials })
        .then(() => {
          //alert(`You have signed in!`);
          this.toggleShow();
        })
        .catch(error => {
          alert(`Somethings gone wrong logging in.
                 Error: ${error}`);
          console.error(error, "Somethings gone wrong logging in");
        });
    },
    logout() {
      this.attemptLogout()
        .then(resp => {
          // alert("logged out");
          if(this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
          console.log("logged out", resp);
        })
        .catch(error => {
          alert("problem with logout");
          location.reload();
          console.error("problem with logout", error);
        });
    }
  }
};
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease-out;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .user-modal {
    background: #f8f9fa;
    padding: 2rem 2.5rem;
    width: 450px;
    position: fixed;
    top: 150px;
    left: 0;
    right: 0;
    margin: 0 auto;
    opacity: 1;
    z-index: 1;
  }

  @media(max-width:767px){
    .user-modal {max-width: 95%;}
  }

  .user-modal-close {
    position: absolute;
    font-size: 2rem;
    top: 0;
    right: 10px;
    cursor: pointer;
  }
</style>