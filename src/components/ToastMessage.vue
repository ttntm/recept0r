<template>
  <div id="toast-message" class="fixed bottom-0 right-0 max-w-md m-8">
    <Transition name="slide-fade">
      <div
        v-if="toastMessage"
        :class="{
          'error': toastMessage.type === 'error',
          'success': toastMessage.type === 'success',
          'bg-gray-500': toastMessage.type === 'info',
        }"
        class="rounded-lg shadow-md p-6 pr-10"
        style="min-width: 240px"
      >
        <button
          @click.prevent="sendToastMessage(null)"
          class="font-bold opacity-75 cursor-pointer absolute top-0 right-0 py-2 px-3 hover:opacity-100 focus:outline-none"
          v-blur
        >×</button>
        <div class="flex items-center">
          <img v-if="toastMessage.type === 'error'" src="@/assets/sad.svg" class="smiley block w-6 h-6 mr-4">
          <img v-if="toastMessage.type === 'success'" src="@/assets/happy.svg" class="smiley block w-6 h-6 mr-4">
          <img v-if="toastMessage.type === 'info'" src="@/assets/happy.svg" class="smiley block w-6 h-6 mr-4">
          <span class="block font-bold">
            {{ toastMessage.text }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "toast-message",
  computed: {
    ...mapGetters('app',['toastMessage']),
  },
  methods: {
    ...mapActions('app', ['sendToastMessage']),
  }
};
</script>

<style lang="postcss" scoped>
  .error {
    @apply bg-gray-500 text-blue-500;
  }
  .success {
    @apply bg-gray-500 text-blue-500;
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
    animation: roll 1.25s linear infinite;
  }
  @keyframes roll {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-20deg);
    }
    50% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>