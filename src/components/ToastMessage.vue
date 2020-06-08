<template>
  <div id="toast-message" class="fixed bottom-0 right-0 max-w-md m-8">
    <Transition name="slide-fade">
      <div
        v-if="message"
        :class="{
            'error': message.type === 'error',
            'success': message.type === 'success',
            'bg-gray-500': message.type === 'info',
        }"
        class="rounded-lg shadow-md p-6 pr-10"
        style="min-width: 240px"
      >
        <button
          @click.prevent="message = null"
          class="font-bold opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100"
        >×</button>
        <div class="flex items-center">
          <img v-if="message.type === 'error'" src="@/assets/sad.svg" class="smiley block w-6 h-6 mr-2">
          <img v-if="message.type === 'success'" src="@/assets/happy.svg" class="smiley block w-6 h-6 mr-2">
          <img v-if="message.type === 'info'" src="@/assets/happy.svg" class="smiley block w-6 h-6 mr-2">
          <span class="block font-bold">
            {{ message.text }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { EventBus } from "@/helpers/event-bus.js";

export default {
  name: "toast-message",
  data() {
    return {
      message: null
    };
  },
  mounted() {
    let timer;
    EventBus.$on("toast-message", message => {
      clearTimeout(timer);

      this.message = message;

      timer = setTimeout(() => {
        this.message = null;
      }, 5000);
    });
  }
};
</script>

<style lang="postcss" scoped>
.error {
  @apply text-white;
  background-color: salmon;
}
.success {
  @apply bg-green-200 text-green-900;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.75s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
.smiley {
  animation: roll 1s linear infinite;
}
@keyframes roll {
  0% {
    transform: rotate(-20deg);
  }
  100% {
    transform: rotate(20deg);
  }
}
</style>