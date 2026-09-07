<template>
  <div class="min-h-screen w-full overflow-x-hidden pt-[100px] pb-[100px] map-bg relative text-[#1f1b12]">
    <!-- Ambient Map Background (Clouds & Trees contained in viewport wrapper) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <!-- Ambient Map Clouds -->
      <div class="absolute top-24 left-[-150px] w-32 h-10 cloud cloud-sm float-cloud-anim" style="animation-duration: 40s;"></div>
      <div class="absolute top-48 right-[-150px] w-24 h-8 cloud cloud-sm float-cloud-anim" style="animation-duration: 35s; animation-delay: 5s;"></div>
      <div class="absolute top-12 left-1/3 w-40 h-12 cloud cloud-md float-cloud-anim" style="animation-duration: 50s; animation-delay: 2s;"></div>

      <!-- Tree Decorations -->
      <div class="absolute bottom-32 left-10 tree-decoration text-[#006e29]">
        <span class="material-symbols-outlined text-[80px]" style="font-variation-settings: 'FILL' 1;">park</span>
      </div>
      <div class="absolute bottom-64 right-10 tree-decoration text-[#006e29]">
        <span class="material-symbols-outlined text-[100px]" style="font-variation-settings: 'FILL' 1;">park</span>
      </div>
      <div class="absolute bottom-1/2 left-20 tree-decoration text-[#7bdb85]">
        <span class="material-symbols-outlined text-[60px]" style="font-variation-settings: 'FILL' 1;">nature</span>
      </div>
    </div>

    <!-- Top Navigation Header -->
    <QuizHeader showBack backTo="/" />

    <!-- Main Map Container (ClientOnly to ensure exact stage rendering from localStorage on reload) -->
    <ClientOnly>
      <main
        class="relative w-full max-w-3xl mx-auto mt-8 p-6 flex flex-col items-center z-10 select-none transition-all duration-300"
        :style="{ height: containerHeight }"
      >
        <!-- Dynamic SVG Path Lines connecting Stage i to Stage i+1 -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
          <g v-for="s in stagesList.slice(0, stagesList.length - 1)" :key="`line-${s}`">
            <!-- Outer road shadow -->
            <line
              :x1="getLineCoords(s).x1"
              :y1="getLineCoords(s).y1"
              :x2="getLineCoords(s).x2"
              :y2="getLineCoords(s).y2"
              stroke="rgba(0,0,0,0.12)"
              stroke-width="16"
              stroke-linecap="round"
            />
            <!-- Road main track -->
            <line
              :x1="getLineCoords(s).x1"
              :y1="getLineCoords(s).y1"
              :x2="getLineCoords(s).x2"
              :y2="getLineCoords(s).y2"
              :stroke="isUnlocked(s + 1) ? '#ffffff' : '#cbd5e1'"
              stroke-width="12"
              stroke-linecap="round"
            />
            <!-- Dashed inner adventure trail -->
            <line
              :x1="getLineCoords(s).x1"
              :y1="getLineCoords(s).y1"
              :x2="getLineCoords(s).x2"
              :y2="getLineCoords(s).y2"
              :stroke="isUnlocked(s + 1) ? '#ffd93d' : '#94a3b8'"
              stroke-width="6"
              stroke-dasharray="10 8"
              stroke-linecap="round"
            />
          </g>
        </svg>

        <!-- Level Nodes (Dynamic Stage 1 to N) -->
        <div
          v-for="s in stagesList"
          :key="`node-${s}`"
          class="absolute -translate-x-1/2 transition-all duration-300 z-10"
          :style="{ top: `${getStageTop(s)}px`, left: `${getStageLeft(s)}%` }"
        >
          <button 
            @click="clickNode(s)"
            :class="[getNodeClass(s), s === maxStage ? 'w-24 h-24 border-4 shadow-xl' : 'w-20 h-20']"
            class="rounded-full flex flex-col items-center justify-center relative transition-transform duration-200"
          >
            <!-- Special Master Stage Crown Topper on highest Stage N -->
            <div v-if="s === maxStage" class="absolute -top-6 text-[#ffd93d] animate-bounce">
              <span class="material-symbols-outlined text-3xl font-bold drop-shadow-md" style="font-variation-settings: 'FILL' 1;">crown</span>
            </div>

            <!-- Stage Custom Icon -->
            <span :class="s === maxStage ? 'text-3xl' : 'text-2xl'" class="material-symbols-outlined font-bold" style="font-variation-settings: 'FILL' 1;">
              {{ store.getStageIcon(s) }}
            </span>
            <span class="text-xs font-extrabold mt-0.5 font-display">Stage {{ s }}</span>

            <!-- Status Mini Badge (Lock / Check / Play) -->
            <div 
              class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-sm z-20"
              :class="getStatusBadgeClass(s)"
            >
              <span class="material-symbols-outlined text-sm font-bold">
                {{ getStatusBadgeIcon(s) }}
              </span>
            </div>

            <!-- Stars earned layout -->
            <div 
              v-if="store.state.completedStages[s]?.completed"
              class="absolute -top-3 flex gap-0.5 bg-white rounded-full px-2 py-0.5 shadow-sm border border-[#006e29] scale-90 z-20"
            >
              <span 
                v-for="star in 3" 
                :key="star"
                class="material-symbols-outlined text-[12px] font-bold text-[#ffd93d]" 
                :style="{ fontVariationSettings: star <= (store.state.completedStages[s]?.stars || 0) ? `'FILL' 1` : `'FILL' 0` }"
              >star</span>
            </div>

            <!-- Mascot pointing/cheering at Current active stage -->
            <div 
              v-if="store.state.currentStage === s" 
              class="absolute -top-16 -right-12 w-24 h-24 animate-mascot-bounce pointer-events-none z-30"
            >
              <img alt="Mascot at current stage" class="w-full h-full object-contain filter drop-shadow-lg" src="/mascot.png" />
            </div>
          </button>
        </div>
      </main>
      <template #fallback>
        <div class="w-full max-w-3xl mx-auto mt-8 p-6 flex flex-col items-center justify-center min-h-[800px] z-10">
          <div class="animate-bounce flex flex-col items-center gap-3 text-[#005db8]">
            <span class="material-symbols-outlined text-5xl">map</span>
            <span class="font-bold text-lg font-display">Memuat Peta Petualangan...</span>
          </div>
        </div>
      </template>
    </ClientOnly>

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
import { computed } from 'vue';
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

const stagesList = computed<number[]>(() => {
  const keys = Object.keys(store.state.questionsByStage).map(Number);
  return keys.sort((a, b) => a - b);
});

const maxStage = computed<number>(() => {
  return stagesList.value.length > 0 ? Math.max(...stagesList.value) : 1;
});

const getStageLeft = (stageNum: number) => {
  const pattern = [40, 65, 25, 55, 35];
  return pattern[(stageNum - 1) % pattern.length];
};

const getStageTop = (stageNum: number) => {
  const reverseIndex = maxStage.value - stageNum;
  return 80 + reverseIndex * 145;
};

const containerHeight = computed(() => {
  return `${Math.max(800, 80 + maxStage.value * 145 + 100)}px`;
});

const getLineCoords = (stageNum: number) => {
  const y1 = getStageTop(stageNum) + (stageNum === maxStage.value ? 48 : 40);
  const x1 = `${getStageLeft(stageNum)}%`;

  const y2 = getStageTop(stageNum + 1) + (stageNum + 1 === maxStage.value ? 48 : 40);
  const x2 = `${getStageLeft(stageNum + 1)}%`;

  return { x1, y1, x2, y2 };
};

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

const getStatusBadgeIcon = (stageNum: number) => {
  const current = store.state.currentStage === stageNum;
  const completed = store.state.completedStages[stageNum]?.completed;

  if (current) return 'play_arrow';
  if (completed) return 'check';
  return 'lock';
};

const getStatusBadgeClass = (stageNum: number) => {
  const current = store.state.currentStage === stageNum;
  const completed = store.state.completedStages[stageNum]?.completed;

  if (current) return 'bg-[#ffd93d] text-[#725e00] border-[#705d00]';
  if (completed) return 'bg-[#8ff199] text-[#006e29] border-[#006e29]';
  return 'bg-[#d0c6ad] text-[#7e7761] border-[#7e7761]';
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
