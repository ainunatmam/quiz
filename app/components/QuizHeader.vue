<template>
  <header class="fixed top-0 w-full z-50 flex justify-between items-center px-6 bg-white border-b-4 border-[#d0c6ad] shadow-[0px_4px_0px_0px_rgba(208,198,173,1)] h-[80px]">
    <!-- Left Section: Title & Optional Back Button -->
    <div class="flex items-center gap-3">
      <NuxtLink
        v-if="showBack"
        :to="backTo || '/'"
        class="text-[#4d4633] hover:scale-105 transition-transform p-2 rounded-full hover:bg-[#eae2d2] flex items-center justify-center border-2 border-transparent active:border-[#7e7761]"
      >
        <span class="material-symbols-outlined font-bold" style="font-variation-settings: 'FILL' 1;">arrow_back</span>
      </NuxtLink>
      <NuxtLink to="/" class="hover:scale-102 transition-transform">
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#705d00] tracking-tight font-display-lg select-none">
          QuizQuest Adventure
        </h1>
      </NuxtLink>
    </div>

    <!-- Right Section: Stats & Avatar -->
    <div class="flex items-center gap-4">
      <!-- Stars Counter -->
      <div class="hidden sm:flex bg-[#ffd93d]/20 text-[#725e00] rounded-full px-4 py-2 font-bold items-center gap-2 border-2 border-[#ffd93d] shadow-sm select-none">
        <span class="material-symbols-outlined text-[#ffd93d]" style="font-variation-settings: 'FILL' 1;">stars</span>
        <span>{{ store.state.stars }}</span>
      </div>

      <!-- Level Badge -->
      <div class="hidden sm:flex bg-[#8ff199]/20 text-[#00702a] rounded-full px-4 py-2 font-bold items-center gap-2 border-2 border-[#8ff199] shadow-sm select-none">
        <span class="material-symbols-outlined text-[#006e29]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
        <span>Lvl {{ store.state.level }}</span>
      </div>

      <!-- Reset State Button (Secret cheat/helper for demo) -->
      <button 
        @click="store.resetGame"
        title="Reset Progress"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-[#fbf3e2] border-2 border-[#7e7761] text-[#7e7761] hover:bg-[#eae2d2] hover:scale-105 active:scale-95 transition-transform"
      >
        <span class="material-symbols-outlined text-xl">restart_alt</span>
      </button>

      <!-- Profile Avatar -->
      <div class="w-12 h-12 rounded-full border-2 border-[#005db8] overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-[0px_4px_0px_0px_#005db8] active:translate-y-1 active:shadow-none">
        <img alt="Player Mascot Avatar" class="w-full h-full object-cover" src="/avatar.png" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useGameStore } from '~/composables/useGameStore';

defineProps<{
  showBack?: boolean;
  backTo?: string;
}>();

const store = useGameStore();
</script>

<style scoped>
.font-display-lg {
  font-family: 'Quicksand', sans-serif;
}
</style>
