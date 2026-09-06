<template>
  <div class="bg-[#f5eddd] text-[#1f1b12] min-h-screen flex flex-col pt-[90px] pb-[90px] md:pb-0 overflow-x-hidden">
    <!-- Top Navigation Header -->
    <QuizHeader showBack backTo="/journey" />

    <!-- Main Content Canvas -->
    <main class="flex-grow flex flex-col items-center justify-start px-6 py-8 max-w-4xl mx-auto w-full gap-8 mt-4">
      <!-- Progress Bar Card -->
      <div class="w-full flex items-center justify-between gap-4 bg-white p-4 rounded-full border-2 border-[#d0c6ad] shadow-sm select-none">
        <span class="text-base font-extrabold text-[#4d4633] shrink-0 font-display">Stage {{ stageId }}</span>
        <div class="flex-grow relative h-6 bg-[#fff8ef] rounded-full overflow-hidden border-2 border-[#d0c6ad] flex items-center px-2 gap-3 justify-center">
          <!-- Connect dots based on questions length -->
          <div
            v-for="(q, idx) in questions"
            :key="idx"
            class="w-4 h-4 rounded-full z-10 shrink-0 border-2 transition-all duration-300"
            :class="[
              idx < currentQuestionIdx
                ? 'bg-[#006e29] border-[#006e29]'
                : idx === currentQuestionIdx
                ? 'bg-[#ffd93d] border-[#705d00] active-bubble-pulse scale-110'
                : 'bg-[#eae2d2] border-[#7e7761]'
            ]"
          >
            <!-- Current Question Marker -->
            <span
              v-if="idx === currentQuestionIdx"
              class="absolute -top-7 -translate-x-1/3 text-[10px] font-extrabold text-[#ffe173] bg-[#221b00] px-2 py-0.5 rounded-full shadow-md transform rotate-6 select-none font-display"
            >
              Here!
            </span>
          </div>
          <!-- Connecting Dashed Line -->
          <div class="absolute top-1/2 left-6 right-6 h-1 border-t-2 border-dashed border-[#d0c6ad] -translate-y-1/2 z-0"></div>
        </div>
        <span class="text-sm font-extrabold text-[#4d4633] shrink-0 flex items-center gap-1 font-display">
          <span class="material-symbols-outlined text-[#ffd93d]" style="font-variation-settings: 'FILL' 1;">stars</span>
          {{ store.state.stars }}
        </span>
      </div>

      <!-- Question & Mascot Grid -->
      <div class="w-full flex flex-col md:flex-row gap-6 items-start">
        <!-- Left: Question Card -->
        <div class="w-full md:w-2/3 bg-white rounded-3xl p-6 quiz-card animate-pop-in relative z-10 flex flex-col items-center text-center gap-6">
          <!-- Text to Speech Sound Toggle -->
          <div class="w-full flex justify-end">
            <button
              @click="toggleSound"
              :class="soundOn ? 'bg-[#4c96fe] text-white shadow-[#005db8]' : 'bg-[#eae2d2] text-[#7e7761] shadow-[#7e7761]'"
              class="p-3 rounded-full hover:scale-110 transition-transform flex items-center justify-center border-2 border-transparent shadow-[0px_4px_0px_0px] active:translate-y-1 active:shadow-none"
            >
              <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">
                {{ soundOn ? 'volume_up' : 'volume_off' }}
              </span>
            </button>
          </div>

          <!-- Question Prompt -->
          <h2 class="text-2xl md:text-3xl font-extrabold text-[#1f1b12] font-display px-4 leading-snug">
            {{ currentQuestion?.prompt }}
          </h2>

          <!-- Answer Grid -->
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <button
              v-for="(option, idx) in currentQuestion?.options ?? []"
              :key="idx"
              @click="selectOption(option)"
              :disabled="showCorrectTransition"
              :class="getOptionClass(option)"
              class="w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-2 min-h-[110px] group relative overflow-hidden transition-all duration-200 select-none border-2 font-display"
            >
              <span class="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300" style="font-variation-settings: 'FILL' 1;">
                {{ option.icon }}
              </span>
              <span class="text-lg font-bold">{{ option.text }}</span>
            </button>
          </div>
        </div>

        <!-- Right: Mascot Speech Bubble Area -->
        <div class="w-full md:w-1/3 flex flex-col items-center justify-center animate-pop-in relative mt-8 md:mt-0" style="animation-delay: 0.15s;">
          <div class="relative">
            <!-- Mascot Image -->
            <img class="w-48 h-auto object-contain hover:scale-105 transition-transform duration-300 z-10 relative drop-shadow-xl" src="/mascot.png" alt="Mascot Feedback" />
            <!-- Twinkling stars next to mascot -->
            <span class="material-symbols-outlined absolute -top-4 -left-4 text-[#ffd93d] animate-bounce text-3xl" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined absolute top-10 -right-8 text-[#4c96fe] animate-pulse text-2xl" style="font-variation-settings: 'FILL' 1;">favorite</span>
          </div>

          <!-- Speech bubble -->
          <div class="bg-white border-2 border-[#d0c6ad] p-4 rounded-2xl rounded-tl-none mt-4 shadow-sm relative w-full text-center select-none">
            <div class="absolute -top-3.5 left-6 w-4 h-4 bg-white border-t-2 border-l-2 border-[#d0c6ad] transform rotate-45"></div>
            <p class="text-base font-bold text-[#4d4633] font-display">{{ speechBubbleText }}</p>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '~/composables/useGameStore';

const route = useRoute();
const router = useRouter();
const store = useGameStore();

const stageId = computed(() => {
  const s = parseInt(route.query.stage as string);
  return isNaN(s) ? 4 : s;
});

useHead({
  title: `Stage ${stageId.value} Quiz - QuizQuest Adventure`,
  meta: [
    { name: 'description', content: 'Solve trivia to win stars and progress through forest worlds!' }
  ]
});

// Setup trivia questions by stage
interface Option {
  text: string;
  icon: string;
  isCorrect: boolean;
}

interface Question {
  prompt: string;
  options: Option[];
}

const questionsByStage: Record<number, Question[]> = {
  1: [
    {
      prompt: '[Stage 1: Animals] Which of these animals swims in the deep ocean?',
      options: [
        { text: 'Dolphin', icon: 'waves', isCorrect: true },
        { text: 'Lion', icon: 'pets', isCorrect: false },
        { text: 'Elephant', icon: 'eco', isCorrect: false },
        { text: 'Eagle', icon: 'flight', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 1: Animals] Which bird flies high in the sky?',
      options: [
        { text: 'Eagle', icon: 'flight', isCorrect: true },
        { text: 'Fish', icon: 'water', isCorrect: false },
        { text: 'Frog', icon: 'nature', isCorrect: false },
        { text: 'Cat', icon: 'pets', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 1: Animals] Which animal is known as the King of the Jungle?',
      options: [
        { text: 'Lion', icon: 'pets', isCorrect: true },
        { text: 'Rabbit', icon: 'eco', isCorrect: false },
        { text: 'Dolphin', icon: 'waves', isCorrect: false },
        { text: 'Turtle', icon: 'water', isCorrect: false }
      ]
    }
  ],
  2: [
    {
      prompt: '[Stage 2: Shapes] Which shape has exactly 3 corners?',
      options: [
        { text: 'Square', icon: 'crop_square', isCorrect: false },
        { text: 'Circle', icon: 'fiber_manual_record', isCorrect: false },
        { text: 'Triangle', icon: 'change_history', isCorrect: true },
        { text: 'Star', icon: 'grade', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 2: Shapes] What shape is a round shiny coin?',
      options: [
        { text: 'Circle', icon: 'fiber_manual_record', isCorrect: true },
        { text: 'Triangle', icon: 'change_history', isCorrect: false },
        { text: 'Square', icon: 'crop_square', isCorrect: false },
        { text: 'Diamond', icon: 'diamond', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 2: Shapes] Which shape shines high up in the night sky?',
      options: [
        { text: 'Star', icon: 'grade', isCorrect: true },
        { text: 'Rectangle', icon: 'crop_square', isCorrect: false },
        { text: 'Circle', icon: 'fiber_manual_record', isCorrect: false },
        { text: 'Triangle', icon: 'change_history', isCorrect: false }
      ]
    }
  ],
  3: [
    {
      prompt: '[Stage 3: Fruits] Which of these is a red yummy fruit?',
      options: [
        { text: 'Broccoli', icon: 'nutrition', isCorrect: false },
        { text: 'Apple', icon: 'apple', isCorrect: true },
        { text: 'Potato', icon: 'grass', isCorrect: false },
        { text: 'Carrot', icon: 'filter_hdr', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 3: Fruits] Which yellow fruit is a favorite snack for monkeys?',
      options: [
        { text: 'Banana', icon: 'nutrition', isCorrect: true },
        { text: 'Onion', icon: 'eco', isCorrect: false },
        { text: 'Tomato', icon: 'circle', isCorrect: false },
        { text: 'Mushroom', icon: 'forest', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 3: Fruits] Which sweet fruit grows in purple bunches?',
      options: [
        { text: 'Grapes', icon: 'grain', isCorrect: true },
        { text: 'Corn', icon: 'grass', isCorrect: false },
        { text: 'Cucumber', icon: 'eco', isCorrect: false },
        { text: 'Coconut', icon: 'circle', isCorrect: false }
      ]
    }
  ],
  4: [
    {
      prompt: '[Stage 4: Forest] What green plants fill the forest and clean our air?',
      options: [
        { text: 'Trees', icon: 'park', isCorrect: true },
        { text: 'Rocks', icon: 'landscape', isCorrect: false },
        { text: 'Clouds', icon: 'cloud', isCorrect: false },
        { text: 'Sand', icon: 'grain', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 4: Forest] What falls from clouds to give forest plants water?',
      options: [
        { text: 'Raindrops', icon: 'water_drop', isCorrect: true },
        { text: 'Sunbeams', icon: 'light_mode', isCorrect: false },
        { text: 'Wind', icon: 'air', isCorrect: false },
        { text: 'Leaves', icon: 'eco', isCorrect: false }
      ]
    },
    {
      prompt: '[Stage 4: Forest] Which warm star shines bright over the forest canopy?',
      options: [
        { text: 'The Sun', icon: 'light_mode', isCorrect: true },
        { text: 'The Moon', icon: 'dark_mode', isCorrect: false },
        { text: 'A Comet', icon: 'auto_awesome', isCorrect: false },
        { text: 'Lantern', icon: 'light', isCorrect: false }
      ]
    }
  ],
  5: [
    {
      prompt: '🌟 [Stage 5 Master Review]: Which ocean creature from Stage 1 swims in deep water?',
      options: [
        { text: 'Dolphin', icon: 'waves', isCorrect: true },
        { text: 'Lion', icon: 'pets', isCorrect: false },
        { text: 'Eagle', icon: 'flight', isCorrect: false },
        { text: 'Elephant', icon: 'eco', isCorrect: false }
      ]
    },
    {
      prompt: '🌟 [Stage 5 Master Review]: Which red fruit from Stage 3 matches the round shape from Stage 2?',
      options: [
        { text: 'Apple', icon: 'apple', isCorrect: true },
        { text: 'Broccoli', icon: 'nutrition', isCorrect: false },
        { text: 'Triangle Chip', icon: 'change_history', isCorrect: false },
        { text: 'Carrot', icon: 'filter_hdr', isCorrect: false }
      ]
    },
    {
      prompt: '🌟 [Stage 5 Master Review]: What 3-corner shape from Stage 2 does a pine tree top in Stage 4 look like?',
      options: [
        { text: 'Triangle', icon: 'change_history', isCorrect: true },
        { text: 'Square', icon: 'crop_square', isCorrect: false },
        { text: 'Circle', icon: 'fiber_manual_record', isCorrect: false },
        { text: 'Star', icon: 'grade', isCorrect: false }
      ]
    }
  ]
};

const questions = computed(() => {
  return questionsByStage[stageId.value] || questionsByStage[5];
});

const currentQuestionIdx = ref(0);
const currentQuestion = computed(() => questions.value[currentQuestionIdx.value]);

// Speech Bubble Text State
const speechBubbleText = ref("You're doing great! Let's choose the best answer!");

// Interactive option evaluation state
const selectedOptionText = ref<string | null>(null);
const wrongSelections = ref<string[]>([]);
const showCorrectTransition = ref(false);
const soundOn = ref(true);

const toggleSound = () => {
  soundOn.value = !soundOn.value;
};

const getOptionClass = (option: Option) => {
  const isSelected = selectedOptionText.value === option.text;
  const isWrong = wrongSelections.value.includes(option.text);
  
  if (isWrong) {
    return 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a] shadow-[0px_6px_0px_0px_#ba1a1a] cursor-not-allowed opacity-80';
  }
  
  if (isSelected && option.isCorrect) {
    return 'bg-[#8ff199] text-[#00702a] border-[#006e29] shadow-[0px_6px_0px_0px_#006e29]';
  }
  
  // Default state: Sunshine Yellow Neomorphic bubbly look
  return 'bg-[#ffd93d]/15 text-[#4d4633] border-[#7e7761] shadow-[0px_6px_0px_0px_#7e7761] hover:scale-[1.02] active:translate-y-[3px] active:shadow-[0px_3px_0px_0px_#7e7761]';
};

const selectOption = (option: Option) => {
  if (wrongSelections.value.includes(option.text) || showCorrectTransition.value) return;
  
  selectedOptionText.value = option.text;
  
  if (option.isCorrect) {
    // Correct selection logic
    showCorrectTransition.value = true;
    speechBubbleText.value = "Hooray! That is correct! Fantastic job!";
    
    // Play generic synth bubble sound if sound is on
    if (soundOn.value && typeof window !== 'undefined' && window.AudioContext) {
      playBubbleSound(true);
    }
    
    setTimeout(() => {
      // Go to next question
      if (currentQuestionIdx.value < questions.value.length - 1) {
        currentQuestionIdx.value++;
        // Reset option state
        selectedOptionText.value = null;
        wrongSelections.value = [];
        speechBubbleText.value = "Here is the next one! You've got this!";
        showCorrectTransition.value = false;
      } else {
        // All questions completed! Mark stage completed and navigate to success screen
        store.completeStage(stageId.value, 3);
        router.push('/success');
      }
    }, 1500);
  } else {
    // Incorrect selection logic
    wrongSelections.value.push(option.text);
    selectedOptionText.value = null;
    speechBubbleText.value = "Oops! That's not it, let's try another option!";
    
    if (soundOn.value && typeof window !== 'undefined' && window.AudioContext) {
      playBubbleSound(false);
    }
  }
};

// Web Audio API custom synthesizer to play bubbly sound rewards
const playBubbleSound = (isSuccess: boolean) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (isSuccess) {
      // Bubbly double chime sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Low buzzy error chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.warn('Web Audio chime could not play', e);
  }
};
</script>

<style scoped>
.active-bubble-pulse {
  animation: pulse-glow-dot 2s infinite;
}

@keyframes pulse-glow-dot {
  0% { box-shadow: 0 0 0 0 rgba(255, 217, 61, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(255, 217, 61, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 217, 61, 0); }
}

.font-display {
  font-family: 'Quicksand', sans-serif;
}
</style>
