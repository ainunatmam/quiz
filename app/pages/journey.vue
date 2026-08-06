<template>
  <div class="min-h-screen overflow-x-hidden pt-[100px] pb-[100px] map-bg relative text-[#1f1b12]">
    <!-- Ambient Map Clouds -->
    <div class="fixed top-24 left-[-150px] w-32 h-10 cloud cloud-sm float-cloud-anim" style="animation-duration: 40s;"></div>
    <div class="fixed top-48 right-[-150px] w-24 h-8 cloud cloud-sm float-cloud-anim" style="animation-duration: 35s; animation-delay: 5s;"></div>
    <div class="fixed top-12 left-1/3 w-40 h-12 cloud cloud-md float-cloud-anim" style="animation-duration: 50s; animation-delay: 2s;"></div>

    <!-- Tree Decorations -->
    <div class="fixed bottom-32 left-10 tree-decoration text-[#006e29]">
      <span class="material-symbols-outlined text-[80px]" style="font-variation-settings: 'FILL' 1;">park</span>
    </div>
    <div class="fixed bottom-64 right-10 tree-decoration text-[#006e29]">
      <span class="material-symbols-outlined text-[100px]" style="font-variation-settings: 'FILL' 1;">park</span>
    </div>
    <div class="fixed bottom-1/2 left-20 tree-decoration text-[#7bdb85]">
      <span class="material-symbols-outlined text-[60px]" style="font-variation-settings: 'FILL' 1;">nature</span>
    </div>

    <!-- Top Navigation Header -->
    <QuizHeader showBack backTo="/" />

    <!-- Main Map Container -->
    <main class="relative w-full max-w-3xl mx-auto h-[800px] mt-8 p-6 flex flex-col items-center z-10 select-none">
      <!-- Path Lines (dynamic colored paths based on unlock status) -->
      <!-- Line 4 to 5 -->
      <div 
        class="path-line h-[120px] top-[140px] left-1/2 -ml-2 -rotate-12 transform origin-bottom"
        :class="{ 'locked': !isUnlocked(5) }"
      ></div>

      <!-- Line 3 to 4 -->
      <div 
        class="path-line h-[130px] top-[260px] left-[60%] -ml-2 rotate-45 transform origin-bottom"
        :class="{ 'locked': !isUnlocked(4) }"
      ></div>

      <!-- Line 2 to 3 -->
      <div 
        class="path-line h-[150px] top-[390px] left-[40%] -ml-2 -rotate-30 transform origin-bottom"
        :class="{ 'locked': !isUnlocked(3) }"
      ></div>

      <!-- Line 1 to 2 -->
      <div 
        class="path-line h-[140px] top-[540px] left-[70%] -ml-2 rotate-12 transform origin-bottom"
        :class="{ 'locked': !isUnlocked(2) }"
      ></div>

      <!-- Level Nodes (1 to 5) -->
      <!-- Node 5 -->
      <div class="absolute top-[100px] left-[35%]">
        <button 
          @click="clickNode(5)"
          :class="getNodeClass(5)"
          class="w-20 h-20 rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
        >
          <span class="material-symbols-outlined text-2xl font-bold">{{ getNodeIcon(5) }}</span>
          <span class="text-xs font-bold mt-1 font-display">Stage 5</span>
        </button>
      </div>

      <!-- Node 4 -->
      <div class="absolute top-[220px] left-[55%]">
        <button 
          @click="clickNode(4)"
          :class="getNodeClass(4)"
          class="w-24 h-24 rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
        >
          <span class="material-symbols-outlined text-4xl font-bold" style="font-variation-settings: 'FILL' 1;">{{ getNodeIcon(4) }}</span>
          <span class="text-sm font-bold mt-1 font-display">Stage 4</span>

          <!-- Mascot pointing/cheering at Current stage -->
          <div 
            v-if="store.state.currentStage === 4" 
            class="absolute -top-16 -right-12 w-24 h-24 animate-mascot-bounce pointer-events-none z-30"
          >
            <img alt="Mascot at current stage" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
          </div>
        </button>
      </div>

      <!-- Node 3 -->
      <div class="absolute top-[370px] left-[25%]">
        <button 
          @click="clickNode(3)"
          :class="getNodeClass(3)"
          class="w-20 h-20 rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
        >
          <span class="material-symbols-outlined text-2xl font-bold" style="font-variation-settings: 'FILL' 1;">{{ getNodeIcon(3) }}</span>
          <span class="text-xs font-bold mt-1 font-display">Stage 3</span>

          <!-- Stars earned layout -->
          <div 
            v-if="store.state.completedStages[3]?.completed"
            class="absolute -top-3 flex gap-0.5 bg-white rounded-full px-2 py-0.5 shadow-sm border border-[#006e29] scale-90"
          >
            <span 
              v-for="star in 3" 
              :key="star"
              class="material-symbols-outlined text-[12px] font-bold text-[#ffd93d]" 
              :style="{ fontVariationSettings: star <= (store.state.completedStages[3]?.stars || 0) ? `'FILL' 1` : `'FILL' 0` }"
            >star</span>
          </div>

          <!-- Mascot at current stage 3 if reset/active -->
          <div 
            v-if="store.state.currentStage === 3" 
            class="absolute -top-16 -right-12 w-24 h-24 animate-mascot-bounce pointer-events-none z-30"
          >
            <img alt="Mascot at current stage" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
          </div>
        </button>
      </div>

      <!-- Node 2 -->
      <div class="absolute top-[520px] left-[65%]">
        <button 
          @click="clickNode(2)"
          :class="getNodeClass(2)"
          class="w-20 h-20 rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
        >
          <span class="material-symbols-outlined text-2xl font-bold" style="font-variation-settings: 'FILL' 1;">{{ getNodeIcon(2) }}</span>
          <span class="text-xs font-bold mt-1 font-display">Stage 2</span>

          <!-- Stars earned layout -->
          <div 
            v-if="store.state.completedStages[2]?.completed"
            class="absolute -top-3 flex gap-0.5 bg-white rounded-full px-2 py-0.5 shadow-sm border border-[#006e29] scale-90"
          >
            <span 
              v-for="star in 3" 
              :key="star"
              class="material-symbols-outlined text-[12px] font-bold text-[#ffd93d]" 
              :style="{ fontVariationSettings: star <= (store.state.completedStages[2]?.stars || 0) ? `'FILL' 1` : `'FILL' 0` }"
            >star</span>
          </div>

          <!-- Mascot at current stage 2 if reset/active -->
          <div 
            v-if="store.state.currentStage === 2" 
            class="absolute -top-16 -right-12 w-24 h-24 animate-mascot-bounce pointer-events-none z-30"
          >
            <img alt="Mascot at current stage" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
          </div>
        </button>
      </div>

      <!-- Node 1 -->
      <div class="absolute top-[660px] left-[40%]">
        <button 
          @click="clickNode(1)"
          :class="getNodeClass(1)"
          class="w-20 h-20 rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
        >
          <span class="material-symbols-outlined text-2xl font-bold" style="font-variation-settings: 'FILL' 1;">{{ getNodeIcon(1) }}</span>
          <span class="text-xs font-bold mt-1 font-display">Stage 1</span>

          <!-- Stars earned layout -->
          <div 
            v-if="store.state.completedStages[1]?.completed"
            class="absolute -top-3 flex gap-0.5 bg-white rounded-full px-2 py-0.5 shadow-sm border border-[#006e29] scale-90"
          >
            <span 
              v-for="star in 3" 
              :key="star"
              class="material-symbols-outlined text-[12px] font-bold text-[#ffd93d]" 
              :style="{ fontVariationSettings: star <= (store.state.completedStages[1]?.stars || 0) ? `'FILL' 1` : `'FILL' 0` }"
            >star</span>
          </div>

          <!-- Mascot at current stage 1 if reset/active -->
          <div 
            v-if="store.state.currentStage === 1" 
            class="absolute -top-16 -right-12 w-24 h-24 animate-mascot-bounce pointer-events-none z-30"
          >
            <img alt="Mascot at current stage" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
          </div>
        </button>
      </div>
    </main>

    <!-- Bottom Navigation (Mobile Only) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#4c96fe] border-t-4 border-[#005db8] rounded-t-2xl shadow-[0px_-8px_0px_0px_rgba(0,46,96,0.15)]">
      <NuxtLink
        to="/"
        class="flex flex-col items-center justify-center text-white opacity-85 hover:scale-105 transition-transform select-none"
      >
        <span class="material-symbols-outlined text-2xl">home</span>
        <span class="text-xs font-bold mt-0.5 font-display">Home</span>
      </NuxtLink>
      <NuxtLink
        to="/journey"
        class="flex flex-col items-center justify-center bg-[#ffd93d] text-[#725e00] rounded-2xl px-6 py-2 shadow-[0px_4px_0px_0px_rgba(114,94,0,1)] hover:scale-105 transition-transform select-none border-2 border-[#705d00]"
      >
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">map</span>
        <span class="text-xs font-bold mt-0.5 font-display">Map</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/composables/useGameStore';
import { useRouter } from 'vue-router';

const store = useGameStore();
const router = useRouter();

useHead({
  title: 'Journey Map - QuizQuest Adventure',
  meta: [
    { name: 'description', content: 'Explore the map, unlock stages and test your knowledge!' }
  ]
});

const isUnlocked = (stageNum: number) => {
  if (stageNum === 1) return true;
  return store.state.completedStages[stageNum - 1]?.completed || store.state.currentStage >= stageNum;
};

const getNodeClass = (stageNum: number) => {
  const current = store.state.currentStage === stageNum;
  const completed = store.state.completedStages[stageNum]?.completed;
  
  if (current) {
    return 'node-current hover:scale-110 active:scale-95';
  } else if (completed) {
    return 'node-completed hover:scale-110 active:scale-95';
  } else {
    return 'node-locked cursor-not-allowed';
  }
};

const getNodeIcon = (stageNum: number) => {
  const current = store.state.currentStage === stageNum;
  const completed = store.state.completedStages[stageNum]?.completed;
  
  if (current) return 'play_arrow';
  if (completed) return 'check_circle';
  return 'lock';
};

const clickNode = (stageNum: number) => {
  if (store.state.currentStage === stageNum || store.state.completedStages[stageNum]?.completed) {
    // Navigate to quiz solver page for this stage
    router.push(`/quiz?stage=${stageNum}`);
  } else {
    // LOCKED state - subtle feedback
    console.log(`Stage ${stageNum} is locked!`);
  }
};
</script>

<style scoped>
.map-bg {
  background: linear-gradient(180deg, #a9c7ff 0%, #d6e3ff 40%, #8ff199 40.1%, #7bdb85 100%);
  background-attachment: fixed;
}

@keyframes float-cloud-custom {
  0% { transform: translateX(0); }
  100% { transform: translateX(120vw); }
}

.float-cloud-anim {
  animation: float-cloud-custom 45s linear infinite;
}

.font-display {
  font-family: 'Quicksand', sans-serif;
}
</style>
