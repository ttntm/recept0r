<template>
  <div id="nav-auth" class="">
    <div v-if="!publicView">
      <button @click="logout()" class="btn text-gray-600 border-gray-600 hover:text-white hover:bg-gray-600 py-1">Log Out</button>
    </div>
    <div v-else>
      <button @click="toggleShow()" ref="loginButton" class="btn btn-gray py-1">Log In</button>
    </div>
    <transition name="fade">
      <div v-if="isShowing" v-closable="{exclude: ['loginButton'],handler: 'toggleShow'}" class="user-modal">
        <div class="user-modal-close text-gray-500 hover:text-gray-800" @click="toggleShow()">&times;</div>
        <div class="form">
          <!-- SIGNUP PART -->
          <form v-if="mode === 'register'" class="" @keyup.enter="signup()">
            <h2 class="text-xl mb-4">👋 Register Here</h2>
            <div class="form-group">
              <label for="name">Name</label>
              <input class="form-control" id="name" v-model="crendentials.name" ref="firstInput" type="text" placeholder="Arnold Schwarzenegger"/>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="form-control" id="email" type="email" v-model="crendentials.email" placeholder="arnie@terminator.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="form-control" id="password" type="password" v-model="crendentials.password" placeholder="******"/>
            </div>
            <button class="btn btn-gray py-1 mb-4" type="button" @click="signup()">Sign Up</button>
            <p class="text-sm">
              Already registered? <a href="#" @click="toggleMode()">Sign In</a>
            </p>
          </form>
          <!-- LOGIN PART -->
          <form v-if="mode === 'login'" class="login-form stack" @keyup.enter="login()">
            <h2 class="text-xl mb-4">🔐 Login Here</h2>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="form-control" id="email" type="email" v-model="crendentials.email" ref="firstInput" placeholder="hey@email.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="form-control" id="password" type="password" v-model="crendentials.password" placeholder="******"/>
            </div>
            <button class="btn btn-gray py-1 mb-4" type="button" @click="login()">Login</button>
            <p class="text-sm">
              Not registered? <a href="#" @click="toggleMode()">Create an account</a>
            </p>
          </form>
          <p v-if="cValidateMsg !== ''" class="font-bold" :class="{ 'error' : !cValidate }">{{ cValidateMsg }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { EventBus } from '@/event-bus.js';

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
      isShowing: false,
      cValidateMsg: ''
    };
  },
  computed: {
    cValidate() {
      let c = this.crendentials;
      let rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      let valid = rx.test(c.email);
      if(this.mode === 'login') {
        if(!c.password || !c.email) {
          return false;
        } else if(c.password && c.email && valid) {
          return true;
        } else {
          return false;
        }
      } else {
        if(!c.password || !c.email || !c.name) {
          return false;
        } else if(c.password && c.email && c.name && valid) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  watch: {
    isShowing: {
      handler() {
        if(!this.isShowing) {
          this.crendentials = { name: "", password: "", email: "" }; //clear credentials object when modal closes
          this.cValidateMsg = null; //clear message when modal closes
        }
      }
    }
  },
  methods: {
    ...mapActions("user", [
      "attemptLogin",
      "attemptSignup",
      "attemptLogout",
      "getCurrentUser",
    ]),
    ...mapActions("app", ["toggleMenu"]),
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
      this.cValidateMsg = null;
    },
    signup() {
      if(!this.cValidate) {
        this.cValidateMsg = "Please enter valid information.";
      } else {
        let msg = { text: '', type: ''}
        this.cValidateMsg = "Signing up...";
        this.attemptSignup(this.crendentials)
          .then(response => {
            console.log(response);
            msg.text = "A confirmation email has been sent to you, please check your inbox!";
            msg.type =  'info';
            this.toggleShow();
            this.toggleMenu(false); //vuex action
            this.toast(msg); //emit toast into EventBus
          })
          .catch(error => {
            this.cValidateMsg = null;
            console.error(error, "Something's gone wrong signing up");
            msg.text = "Something's gone wrong signing up, please try again later.";
            msg.type =  'error';
            this.toast(msg); //emit toast into EventBus
          });
      }
    },
    login() {
      if(!this.cValidate) {
        this.cValidateMsg = "Please enter valid information.";
      } else {
        let msg = { text: '', type: ''}
        this.cValidateMsg = "Logging in...";
        this.attemptLogin({ ...this.crendentials })
          .then(() => {
            this.toggleShow();
            this.toggleMenu(false);
            msg.text = "You're logged in now 😀";
            msg.type =  'success';
            this.toast(msg); //emit toast into EventBus
          })
          .catch(error => {
            this.cValidateMsg = null;
            console.error(error, "Something's gone wrong logging in");
            msg.text = "Something's gone wrong logging in, please try again later.";
            msg.type =  'error';
            this.toast(msg); //emit toast into EventBus
          });
      }
    },
    logout() {
      let msg = { text: '', type: ''}
      this.attemptLogout()
        .then(resp => {
          console.log("logged out", resp);
          this.toggleMenu(false);
          if(this.$route.name === 'create') {
            this.$router.push({ name: 'home' });
          }
          msg.text = "You're logged out now, cya soon 😉";
          msg.type =  'info';
          this.toast(msg); //emit toast into EventBus
        })
        .catch(error => {
          console.error("problem with logout", error);
          msg.text = "Problem with logout, forcing page refresh.";
          msg.type =  'error';
          this.toast(msg); //emit toast into EventBus
          location.reload(); //this forces logout due to cleared local storage - error state "hidden" from user...
        });
    },
    escHandler(e) {
      if((e.key=='Escape'||e.key=='Esc'||e.keyCode==27)){
        if(this.isShowing) {
          this.toggleShow();
        }
      }
    },
    toast(message) {
      EventBus.$emit('toast-message', message);
    }
  },
  mounted() {
    var vm = this;
    window.addEventListener('keydown', vm.escHandler);
  },
  beforeDestroy() {
    var vm = this;
    window.removeEventListener('keydown', vm.escHandler);
  }
};
</script>

<style lang="postcss" scoped>
  .form-group {
    @apply flex flex-col mb-4;
  }
  a:link {
    @apply text-green-600 underline;
  }
  a:hover {
    @apply text-green-800 no-underline;
  }
  .error { color: salmon; }
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease-out; }
  .fade-enter, .fade-leave-to { opacity: 0; }
  .user-modal {
    @apply fixed left-0 right-0 opacity-100 rounded-lg shadow-lg border border-gray-500 text-left px-10 py-8 mx-auto;
    background: linear-gradient(190deg, rgba(247,250,252,1) 0%, rgba(237,242,247,1) 100%);
    width: 450px;
    top: 100px;
    z-index: 1;
  }
  @media(max-width:767px){
    .user-modal {max-width: 95%;}
  }
  .user-modal-close {
    @apply absolute top-0 cursor-pointer text-3xl;
    right: 10px;
  }
</style>