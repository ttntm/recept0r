<template>
  <div id="nav-auth" class="">
    <div v-if="loggedIn">
      <button @click="logout()" class="btn btn-gray">Log Out</button>
    </div>
    <div v-else>
      <button @click="toggleShow()" ref="loginButton" class="btn btn-gray">Log In</button>
    </div>
    <transition name="fade">
      <div v-if="isShowing" v-closable="{exclude: ['loginButton','toLogin','toSignup'],handler: 'toggleShow'}" class="user-modal">
        <div class="user-modal-close text-cool-gray-500 hover:text-blue-500" @click="toggleShow()">&times;</div>
        <div class="form">
          <div class="w-3/4 flex flex-row justify-around mt-4 mb-6 mx-auto">
            <h3 class="">
              <a href="#"
                class="text-cool-gray-500 text-lg pb-1 border-b border-transparent"
                :class="{ 'border-blue-500 text-blue-500 font-bold': mode === 'register' }"
                @click="toggleMode('register')"
                v-blur
                ref="toSignup"
              >
                Sign Up
              </a>
            </h3>
            <h3 class="">
              <a href="#"
                class="text-cool-gray-500 text-lg pb-1 border-b border-transparent"
                :class="{ 'border-blue-500 text-blue-500 font-bold': mode === 'login' }"
                @click="toggleMode('login')"
                v-blur
                ref="toLogin"
              >
                Login
              </a>
            </h3>
          </div>
          <!-- SIGNUP PART - TEMP INVITE ONLY -->
          <div v-if="mode === 'register'">
            <p class="text-center">
              Thanks for your interest in recept0r.<br><br>
              Public registrations are suspended until further notice. This is currently an invite only service.<br><br>
              If you'd like to see this app in action, head over to <a href="https://demo.recept0r.com" target="_blank" class="font-bold underline hover:no-underline">demo.recept0r.com</a>
            </p>
          </div>
          <!-- SIGNUP PART -->
          <form v-if="mode === 'register-allowed'" class="" @submit.prevent>
            <div class="form-group">
              <label for="name">Name</label>
              <input class="auth-form-control" id="name" v-model="crendentials.name" ref="firstInput" type="text" placeholder="Arnold Schwarzenegger"/>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="auth-form-control" id="email" type="email" v-model="crendentials.email" placeholder="arnie@terminator.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="auth-form-control" id="password" type="password" v-model="crendentials.password" placeholder="******"/>
            </div>
            <button class="modal-btn px-8 py-2 mt-8 mb-4 mx-auto" type="button" @click="signup()">Sign Up</button>
          </form>
          <!-- LOGIN PART -->
          <form v-if="mode === 'login'" class="" @submit.prevent>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="auth-form-control" id="email" type="email" v-model="crendentials.email" ref="firstInput" placeholder="hey@email.com"/>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input class="auth-form-control" id="password" type="password" v-model="crendentials.password" @keyup.enter="login()" placeholder="******"/>
            </div>
            <button class="modal-btn px-8 py-2 mt-8 mb-4 mx-auto" type="button" @click="login()">Login</button>
          </form>
          <p v-if="cValidateMsg !== ''" v-html="cValidateMsg" class="font-bold mt-8 mb-2" :class="{ 'error' : !cValidate }" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'nav-auth',
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
    ...mapGetters('user',['loggedIn']),
    cValidate() {
      let c = this.crendentials;
      let rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
      let valid = rx.test(c.email);
      if(this.mode === 'login') {
        if(!c.password || !c.email) {
          return false;
        } else if(c.password && c.email && valid) {
          return true;
        } else { return false; }
      } else {
        if(!c.password || !c.email || !c.name) {
          return false;
        } else if(c.password && c.email && c.name && valid) {
          return true;
        } else { return false; }
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
    ...mapActions('user', [
      'attemptLogin',
      'attemptSignup',
      'attemptLogout',
      'getCurrentUser',
    ]),
    ...mapActions('app', [
      'toggleMenu',
      'sendToastMessage'
    ]),
    toggleShow() {
      this.isShowing = !this.isShowing;
      if(this.isShowing) {
        this.$nextTick(function () {
          this.$refs['firstInput'].focus();
        });
      }
    },
    toggleMode(current) {
      if(this.mode === current) {
        return
      } else {
        this.mode === "register"
          ? (this.mode = "login")
          : (this.mode = "register");
        this.cValidateMsg = null;
        this.$nextTick(function () {
          this.$refs['firstInput'].focus();
        });
      }
    },
    signup() {
      if(!this.cValidate) {
        this.cValidateMsg = "Please enter valid information.";
      } else {
        let msg = { text: '', type: ''};
        this.cValidateMsg = "Signing up...";
        this.attemptSignup(this.crendentials)
          .then(response => {
            console.log(response);
            msg.text = "A confirmation email has been sent to you, please check your inbox!";
            msg.type =  'info';
            this.toggleShow();
            this.toggleMenu(false); //vuex action
            this.sendToastMessage(msg); //vuex action sendToastMessage(message)
          })
          .catch(error => {
            this.cValidateMsg = null;
            console.error(error, "Something's gone wrong signing up");
            msg.text = "Something's gone wrong signing up, please try again later.";
            msg.type =  'error';
            this.sendToastMessage(msg); //vuex action sendToastMessage(message)
          });
      }
    },
    login() {
      if(!this.cValidate) {
        this.cValidateMsg = "Please enter valid information.";
      } else {
        let msg = { text: '', type: ''};
        let spinner = require('@/assets/loading.svg');
        this.cValidateMsg = `<img src="${spinner}" class="mx-auto">`;
        this.attemptLogin({ ...this.crendentials })
          .then(() => {
            this.toggleShow();
            this.toggleMenu(false);
            msg.text = "You're logged in now";
            msg.type =  'success';
            this.sendToastMessage(msg); //vuex action sendToastMessage(message)
          })
          .catch(error => {
            this.cValidateMsg = null;
            console.error(error, "Something's gone wrong logging in");
            msg.text = "Something's gone wrong logging in, please try again later.";
            msg.type =  'error';
            this.sendToastMessage(msg); //vuex action sendToastMessage(message)
          });
      }
    },
    logout() {
      let msg = { text: '', type: ''};
      this.attemptLogout()
        .then(resp => {
          console.log("logged out", resp);
          this.toggleMenu(false);
          msg.text = "You're logged out now, cya soon";
          msg.type =  'info';
          this.sendToastMessage(msg); //vuex action sendToastMessage(message)
        })
        .catch(error => {
          console.error("problem with logout", error);
          msg.text = "Problem with logout, forcing page refresh.";
          msg.type =  'error';
          this.sendToastMessage(msg); //vuex action sendToastMessage(message)
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
  },
  mounted() {
    const vm = this;
    window.addEventListener('keydown', vm.escHandler);
  },
  beforeDestroy() {
    const vm = this;
    window.removeEventListener('keydown', vm.escHandler);
  }
};
</script>

<style lang="postcss" scoped>
  .form-group {
    @apply flex flex-col border-b border-cool-gray-500 mb-8;
  }
  .form-group label {
    @apply tracking-wide text-sm text-blue-600 mb-1;
  }
  .auth-form-control {
    @apply bg-gray-500 px-3 py-1;
  }
  .auth-form-control:focus {
    outline: 0;
    @apply shadow-outline bg-white;
  }
  .error { color: salmon; }
  .fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease-out; }
  .fade-enter, .fade-leave-to { opacity: 0; }
  .user-modal {
    @apply fixed left-0 right-0 opacity-100 rounded-lg shadow-lg bg-gray-500 text-left px-12 py-8 mx-auto;
    width: 450px;
    top: 100px;
    z-index: 1;
  }
  @media(max-width:767px){
    .user-modal {
      max-width: 90%;
      top: 20px;
    }
  }
  .modal-btn {
    @apply block font-bold border border-blue-500 text-blue-500 rounded-lg shadow-sm;
  }
  .modal-btn:hover, .modal-btn:focus {
    @apply bg-cool-gray-500 border-cool-gray-500 shadow-none;
  }
  .modal-btn:focus {
    @apply outline-none shadow-outline;
  }
  .user-modal-close {
    @apply absolute top-0 cursor-pointer text-3xl;
    right: 15px;
  }
</style>