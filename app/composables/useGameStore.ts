import { reactive, watch, computed } from 'vue';

export interface Option {
  text: string;
  icon: string;
  isCorrect: boolean;
}

export interface Question {
  prompt: string;
  options: Option[];
}

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
  questionsByStage: Record<number, Question[]>;
  stageIcons: Record<number, string>;
}

export const DEFAULT_QUESTIONS: Record<number, Question[]> = {
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

export const DEFAULT_STAGE_ICONS: Record<number, string> = {
  1: 'pets',
  2: 'category',
  3: 'nutrition',
  4: 'park',
  5: 'crown'
};

const DEFAULT_STATE: GameState = {
  stars: 0,
  level: 1,
  xp: 0,
  worldProgress: 0,
  completedStages: {
    1: { stars: 0, completed: false },
    2: { stars: 0, completed: false },
    3: { stars: 0, completed: false },
    4: { stars: 0, completed: false },
    5: { stars: 0, completed: false }
  },
  currentStage: 1,
  questionsByStage: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
  stageIcons: { ...DEFAULT_STAGE_ICONS }
};

const state = reactive<GameState>({ ...DEFAULT_STATE });

// Helper to load state from localStorage
const loadState = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kids_quest_adventure_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure questionsByStage exists if loaded from older localStorage
        if (!parsed.questionsByStage) {
          parsed.questionsByStage = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
        }
        if (!parsed.stageIcons) {
          parsed.stageIcons = { ...DEFAULT_STAGE_ICONS };
        }
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

    const stageKeys = Object.keys(state.questionsByStage).map(Number);
    const totalStages = stageKeys.length || 5;

    state.currentStage = Math.min(totalStages, Math.max(state.currentStage, stageNum + 1));
    state.level = Math.max(state.level, stageNum + 1);

    const completedCount = Object.values(state.completedStages).filter(s => s.completed).length;
    state.worldProgress = Math.round((completedCount / totalStages) * 100);
  };

  const resetGame = () => {
    state.stars = 0;
    state.level = 1;
    state.xp = 0;
    state.worldProgress = 0;
    state.currentStage = 1;

    // Reset completion status for all existing stages, preserving stage structure & questions
    for (const stageKey of Object.keys(state.questionsByStage)) {
      const num = Number(stageKey);
      state.completedStages[num] = { stars: 0, completed: false };
    }

    saveState();
  };

  // Stage mutators
  const getStageIcon = (stageNum: number): string => {
    if (state.stageIcons && state.stageIcons[stageNum]) {
      return state.stageIcons[stageNum];
    }
    return DEFAULT_STAGE_ICONS[stageNum] || 'help';
  };

  const updateStageIcon = (stageNum: number, icon: string) => {
    if (!state.stageIcons) {
      state.stageIcons = { ...DEFAULT_STAGE_ICONS };
    }
    state.stageIcons[stageNum] = icon;
    saveState();
  };

  const addStage = () => {
    const stageKeys = Object.keys(state.questionsByStage).map(Number);
    const nextStageNum = (stageKeys.length > 0 ? Math.max(...stageKeys) : 0) + 1;

    state.questionsByStage[nextStageNum] = [
      {
        prompt: `[Stage ${nextStageNum}] Pertanyaan pertama untuk Stage ${nextStageNum}!`,
        options: [
          { text: 'Pilihan Benar', icon: 'grade', isCorrect: true },
          { text: 'Pilihan B', icon: 'pets', isCorrect: false },
          { text: 'Pilihan C', icon: 'eco', isCorrect: false },
          { text: 'Pilihan D', icon: 'water', isCorrect: false }
        ]
      }
    ];

    if (!state.completedStages[nextStageNum]) {
      state.completedStages[nextStageNum] = { stars: 0, completed: false };
    }

    if (!state.stageIcons) {
      state.stageIcons = { ...DEFAULT_STAGE_ICONS };
    }
    state.stageIcons[nextStageNum] = 'help';

    saveState();
    return nextStageNum;
  };

  const deleteStage = (stageNum: number) => {
    const stageKeys = Object.keys(state.questionsByStage).map(Number);
    if (stageKeys.length <= 1) {
      alert('Minimal harus ada 1 Stage!');
      return;
    }

    delete state.questionsByStage[stageNum];
    delete state.completedStages[stageNum];
    if (state.stageIcons && state.stageIcons[stageNum]) {
      delete state.stageIcons[stageNum];
    }

    if (state.currentStage === stageNum) {
      state.currentStage = Math.max(1, stageNum - 1);
    }

    saveState();
  };

  // Question mutators
  const addQuestion = (stageNum: number, question: Question) => {
    if (!state.questionsByStage[stageNum]) {
      state.questionsByStage[stageNum] = [];
    }
    state.questionsByStage[stageNum].push(question);
    saveState();
  };

  const updateQuestion = (stageNum: number, index: number, question: Question) => {
    if (state.questionsByStage[stageNum] && state.questionsByStage[stageNum][index]) {
      state.questionsByStage[stageNum][index] = question;
      saveState();
    }
  };

  const deleteQuestion = (stageNum: number, index: number) => {
    if (state.questionsByStage[stageNum]) {
      state.questionsByStage[stageNum].splice(index, 1);
      saveState();
    }
  };

  const resetQuestionsToDefault = () => {
    state.questionsByStage = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
    state.stageIcons = { ...DEFAULT_STAGE_ICONS };
    saveState();
  };

  const exportQuizData = (stageNum?: number) => {
    let questionsToExport: Record<number, Question[]> = {};
    let iconsToExport: Record<number, string> = {};

    if (stageNum && state.questionsByStage[stageNum]) {
      questionsToExport[stageNum] = JSON.parse(JSON.stringify(state.questionsByStage[stageNum]));
      if (state.stageIcons && state.stageIcons[stageNum]) {
        iconsToExport[stageNum] = state.stageIcons[stageNum];
      }
    } else {
      questionsToExport = JSON.parse(JSON.stringify(state.questionsByStage));
      iconsToExport = JSON.parse(JSON.stringify(state.stageIcons || DEFAULT_STAGE_ICONS));
    }

    return {
      appName: 'QuizQuest Adventure',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      questionsByStage: questionsToExport,
      stageIcons: iconsToExport
    };
  };

  const importQuizData = (importedData: any, overwrite: boolean = true) => {
    if (!importedData || typeof importedData !== 'object') {
      throw new Error('Data JSON tidak valid!');
    }

    const questionsObj = importedData.questionsByStage || importedData;

    if (typeof questionsObj !== 'object' || Array.isArray(questionsObj)) {
      throw new Error('Format pertanyaan tidak valid!');
    }

    if (overwrite) {
      state.questionsByStage = {};
      state.stageIcons = {};
      state.completedStages = {};
    }

    for (const [key, questions] of Object.entries(questionsObj)) {
      const stageNum = Number(key);
      if (isNaN(stageNum) || !Array.isArray(questions)) continue;

      if (!state.questionsByStage[stageNum] || overwrite) {
        state.questionsByStage[stageNum] = [];
      }

      for (const q of questions as any[]) {
        if (q && typeof q === 'object' && q.prompt && Array.isArray(q.options)) {
          state.questionsByStage[stageNum].push({
            prompt: String(q.prompt),
            options: q.options.map((opt: any) => ({
              text: String(opt.text || ''),
              icon: String(opt.icon || 'help'),
              isCorrect: Boolean(opt.isCorrect)
            }))
          });
        }
      }

      if (!state.completedStages[stageNum]) {
        state.completedStages[stageNum] = { stars: 0, completed: false };
      }
    }

    if (importedData.stageIcons && typeof importedData.stageIcons === 'object') {
      if (!state.stageIcons) state.stageIcons = {};
      for (const [key, icon] of Object.entries(importedData.stageIcons)) {
        state.stageIcons[Number(key)] = String(icon);
      }
    }

    saveState();
  };

  const isMaxLevel = computed(() => {
    const stageKeys = Object.keys(state.questionsByStage).map(Number);
    const maxStageNum = stageKeys.length > 0 ? Math.max(...stageKeys) : 5;
    const completedCount = Object.values(state.completedStages).filter(s => s.completed).length;

    return state.level > maxStageNum ||
      (stageKeys.length > 0 && completedCount >= stageKeys.length) ||
      state.worldProgress >= 100;
  });

  return {
    state,
    isMaxLevel,
    completeStage,
    resetGame,
    addStage,
    deleteStage,
    getStageIcon,
    updateStageIcon,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    resetQuestionsToDefault,
    exportQuizData,
    importQuizData
  };
}
