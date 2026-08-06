import { reactive, watch } from 'vue';

interface StageProgress {
  stars: number;
  completed: boolean;
}

interface GameState {
  stars: number;
  level: number;
  xp: number;
  worldProgress: number;
  completedStages: Record<number, StageProgress>;
  currentStage: number;
}

const DEFAULT_STATE: GameState = {
  stars: 120,
  level: 5,
  xp: 1200,
  worldProgress: 75,
  completedStages: {
    1: { stars: 3, completed: true },
    2: { stars: 2, completed: true },
    3: { stars: 3, completed: true },
    4: { stars: 0, completed: false },
    5: { stars: 0, completed: false }
  },
  currentStage: 4
};

const state = reactive<GameState>({ ...DEFAULT_STATE });

// Helper to load state from localStorage
const loadState = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kids_quest_adventure_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(state, parsed);
      } catch (e) {
        console.error('Error parsing saved game state', e);
      }
    }
  }
};

// Helper to save state to localStorage
const saveState = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kids_quest_adventure_state', JSON.stringify(state));
  }
};

// Initialize state
if (typeof window !== 'undefined') {
  loadState();
  // Set up watch to save state whenever it changes
  watch(state, () => {
    saveState();
  }, { deep: true });
}

export function useGameStore() {
  const completeStage = (stageNum: number, starsEarned: number) => {
    state.completedStages[stageNum] = {
      stars: starsEarned,
      completed: true
    };
    
    // Add rewards
    state.stars += 10;
    state.xp += 25;
    
    // Level up logic (e.g. level up every 100 XP or just automatic level up for stage 4 completion)
    if (stageNum === 4) {
      state.level = 6;
      state.worldProgress = 100;
      state.currentStage = 5;
    } else {
      state.currentStage = Math.max(state.currentStage, stageNum + 1);
      // Recalculate progress: count completed out of 5 stages
      const completedCount = Object.values(state.completedStages).filter(s => s.completed).length;
      state.worldProgress = Math.round((completedCount / 5) * 100);
    }
  };

  const resetGame = () => {
    Object.assign(state, JSON.parse(JSON.stringify(DEFAULT_STATE)));
    saveState();
  };

  return {
    state,
    completeStage,
    resetGame
  };
}
