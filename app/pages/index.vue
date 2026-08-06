<template>
  <div class="text-[#1f1b12] min-h-screen relative flex flex-col pb-24 md:pb-0">
    <!-- WebGL shader background -->
    <ShaderBackground />

    <!-- Top Navigation Bar -->
    <QuizHeader />

    <!-- Main Content Canvas -->
    <main class="relative z-10 flex-grow flex flex-col items-center justify-center px-6 pt-[100px] pb-32">
      <!-- Atmospheric Elements: Clouds -->
      <div class="cloud cloud-md top-32 left-10 animate-float hidden md:block"></div>
      <div class="cloud cloud-md top-48 right-12 animate-float-delayed hidden md:block"></div>

      <!-- Twinkling Stars -->
      <div class="absolute top-40 left-1/4 text-[#ffd93d] animate-star-twinkle">
        <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">star</span>
      </div>
      <div class="absolute top-24 right-1/3 text-[#ffd93d] animate-star-twinkle" style="animation-delay: 1s;">
        <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">star</span>
      </div>
      <div class="absolute top-64 right-1/4 text-[#8ff199] animate-star-twinkle" style="animation-delay: 2s;">
        <span class="material-symbols-outlined text-5xl" style="font-variation-settings: 'FILL' 1;">star</span>
      </div>

      <!-- Hero Section -->
      <div class="flex flex-col items-center text-center max-w-2xl w-full z-20">
        <!-- Logo -->
        <div class="w-64 md:w-96 mb-3 animate-bounce-slow flex justify-center">
          <img alt="QuizQuest Adventure Logo" class="w-full h-auto drop-shadow-xl object-contain" src="/logo.png" />
        </div>

        <!-- Mascot -->
        <div class="w-48 md:w-64 mb-6 animate-float relative flex justify-center">
          <img alt="Friendly Blue Mascot waving" class="w-full h-auto object-contain" src="/mascot.png" />
          <!-- Mascot Shadow -->
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-3 bg-black/10 rounded-full blur-sm"></div>
        </div>

        <!-- Call to Action -->
        <NuxtLink
          to="/journey"
          class="bubbly-btn text-2xl md:text-3xl px-12 py-5 rounded-full mb-10 w-full md:w-auto animate-pulse-glow flex items-center justify-center gap-3 select-none"
        >
          <span class="material-symbols-outlined text-4xl md:text-5xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
          Start Adventure!
        </NuxtLink>

        <!-- Stats Panel (Bento Style) -->
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Level Card -->
          <div class="stat-card p-6 flex flex-col items-center justify-center select-none">
            <span class="material-symbols-outlined text-[#005db8] text-4xl mb-2" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
            <h3 class="text-sm font-bold text-[#4d4633] uppercase tracking-wide">Current Level</h3>
            <p class="text-3xl font-extrabold text-[#1f1b12] mt-1">Level {{ store.state.level }}</p>
          </div>

          <!-- Stars Card -->
          <div class="stat-card p-6 flex flex-col items-center justify-center select-none">
            <span class="material-symbols-outlined text-[#ffd93d] text-4xl mb-2" style="font-variation-settings: 'FILL' 1;">star</span>
            <h3 class="text-sm font-bold text-[#4d4633] uppercase tracking-wide">Total Stars</h3>
            <p class="text-3xl font-extrabold text-[#1f1b12] mt-1 flex items-center gap-1">
              {{ store.state.stars }}
              <span class="material-symbols-outlined text-[#ffd93d]" style="font-variation-settings: 'FILL' 1;">star</span>
            </p>
          </div>

          <!-- Progress Card -->
          <div class="stat-card p-6 flex flex-col items-center justify-center select-none">
            <span class="material-symbols-outlined text-[#006e29] text-4xl mb-2" style="font-variation-settings: 'FILL' 1;">forest</span>
            <h3 class="text-sm font-bold text-[#4d4633] uppercase tracking-wide">Forest World</h3>
            <div class="w-full mt-2">
              <div class="flex justify-between text-sm font-bold mb-1 text-[#4d4633]">
                <span>Progress</span>
                <span>{{ store.state.worldProgress }}%</span>
              </div>
              <div class="progress-track h-4 w-full">
                <div class="progress-fill" :style="{ width: `${store.state.worldProgress}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-4 py-3 bg-[#secondary-container] dark:bg-secondary rounded-t-2xl shadow-[0px_-8px_0px_0px_rgba(0,46,96,0.15)] bg-[#4c96fe] border-t-4 border-[#005db8]">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center bg-[#ffd93d] text-[#725e00] rounded-2xl px-6 py-2 shadow-[0px_4px_0px_0px_rgba(114,94,0,1)] hover:scale-105 transition-transform active:translate-y-1 select-none border-2 border-[#705d00]"
      >
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">home</span>
        <span class="text-xs font-bold mt-0.5">Home</span>
      </NuxtLink>
      <NuxtLink
        to="/journey"
        class="flex flex-col items-center justify-center text-white opacity-85 hover:scale-105 transition-transform select-none"
      >
        <span class="material-symbols-outlined text-2xl">map</span>
        <span class="text-xs font-bold mt-0.5">Map</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/composables/useGameStore';

const store = useGameStore();

useHead({
  title: 'QuizQuest Adventure - Home',
  meta: [
    { name: 'description', content: 'A fun and interactive neomorphic kids adventure quiz app.' }
  ]
});
</script>
