<template>
  <div class="bg-[#fff8ef] text-[#1f1b12] overflow-hidden min-h-screen flex flex-col justify-center items-center relative select-none">
    <!-- Confetti rain animation -->
    <Confetti />

    <!-- Main Content Canvas -->
    <main class="w-full max-w-md mx-auto px-6 flex flex-col items-center justify-center space-y-8 z-10 relative mt-16 md:mt-0">
      <!-- Celebration Header -->
      <div class="text-center">
        <h1 class="font-extrabold text-3xl md:text-4xl text-[#006e29] drop-shadow-md flex items-center justify-center gap-2 font-display">
          <span class="material-symbols-outlined text-[#ffd93d] star-sparkle text-4xl" style="font-variation-settings: 'FILL' 1;">star</span>
          Great Job!
          <span class="material-symbols-outlined text-[#ffd93d] star-sparkle text-4xl" style="font-variation-settings: 'FILL' 1;">star</span>
        </h1>
      </div>

      <!-- Mascot & Reward Card -->
      <div class="bg-white p-6 rounded-3xl border-4 border-[#4c96fe] shadow-[0px_10px_30px_rgba(45,51,74,0.08)] flex flex-col items-center space-y-6 w-full relative pt-16">
        <!-- Floating Mascot overlapping card -->
        <div class="w-48 h-48 -top-24 absolute z-20">
          <img alt="Cheering Blue Mascot" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
        </div>

        <!-- Reward Details -->
        <div class="text-center space-y-2 w-full pt-4">
          <p class="font-bold text-lg text-[#4d4633] font-display">You earned some cool rewards!</p>
          <div class="flex flex-col gap-3 mt-4">
            <!-- Stars Reward -->
            <div class="flex items-center justify-between bg-[#ffd93d]/10 p-4 rounded-xl border-2 border-[#ffd93d]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#ffd93d] rounded-full flex items-center justify-center border-2 border-[#705d00] shadow-[0px_3px_0px_0px_rgba(114,94,0,0.5)]">
                  <span class="material-symbols-outlined text-[#725e00] font-bold" style="font-variation-settings: 'FILL' 1;">stars</span>
                </div>
                <span class="font-extrabold text-sm text-[#4d4633] font-display">Stars</span>
              </div>
              <span class="text-2xl font-extrabold text-[#705d00] font-display">+10</span>
            </div>

            <!-- XP Reward -->
            <div class="flex items-center justify-between bg-[#8ff199]/10 p-4 rounded-xl border-2 border-[#8ff199]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#8ff199] rounded-full flex items-center justify-center border-2 border-[#006e29] shadow-[0px_3px_0px_0px_rgba(0,110,41,0.5)]">
                  <span class="material-symbols-outlined text-[#00702a] font-bold" style="font-variation-settings: 'FILL' 1;">military_tech</span>
                </div>
                <span class="font-extrabold text-sm text-[#4d4633] font-display">Experience</span>
              </div>
              <span class="text-2xl font-extrabold text-[#006e29] font-display">+25 XP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <NuxtLink
        to="/journey"
        class="bubbly-btn-tertiary bounce-btn w-full max-w-sm h-16 text-xl rounded-full flex items-center justify-center gap-2 select-none"
      >
        Continue Adventure
        <span class="material-symbols-outlined text-2xl font-bold" style="font-variation-settings: 'FILL' 1;">arrow_forward</span>
      </NuxtLink>
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Success! - QuizQuest Adventure',
  meta: [
    { name: 'description', content: 'Congratulations on completing the quiz stage!' }
  ]
});
</script>

<style scoped>
.bounce-btn {
  animation: bounce-soft 2s infinite;
}

@keyframes bounce-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.star-sparkle {
  animation: sparkle 1.5s infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.5; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1.15); }
}

.font-display {
  font-family: 'Quicksand', sans-serif;
}
</style>
