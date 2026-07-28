<template>
  <div>
    <!-- State A: Character Selection View -->
    <div v-if="!isShowingResults" class="flex flex-col lg:flex-row gap-xl">
      <!-- Left Column: Character Selection -->
      <aside class="lg:w-[40%] flex flex-col gap-lg">
        <div class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm h-fit">
          <div class="mb-lg">
            <h2 class="font-headline-md text-headline-md text-on-surface mb-xs font-semibold">Character Selection</h2>
            <p class="text-on-surface-variant font-body-md text-sm">Select characters to explore word combinations.</p>
          </div>
          <div class="flex gap-sm mb-lg">
            <button @click="selectAll" class="px-md py-sm rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              Select All
            </button>
            <button @click="clearAll" class="px-md py-sm rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
              Clear All
            </button>
          </div>
          
          <!-- Character Grid -->
          <div class="grid grid-cols-5 gap-sm mb-xl max-h-[400px] overflow-y-auto custom-scroll pr-2">
            <button
              v-for="item in characters"
              :key="item.char"
              @click="toggleSelect(item.char)"
              :class="{
                'bg-primary-container text-on-primary-container border-primary shadow-inner scale-95': selectedChars.has(item.char),
                'bg-surface hover:bg-surface-container-low border-outline-variant': !selectedChars.has(item.char)
              }"
              class="flex flex-col items-center justify-center p-sm border rounded-lg transition-all h-16 cursor-pointer"
            >
              <span class="font-character-study text-[24px] leading-none">{{ item.char }}</span>
              <span class="font-label-sm text-[10px] text-on-surface-variant mt-1 uppercase font-semibold">{{ item.romaji }}</span>
            </button>
          </div>

          <!-- Combination Settings -->
          <div class="border border-outline-variant rounded-xl overflow-hidden mb-lg">
            <div class="bg-surface-container-low px-md py-sm flex items-center gap-sm border-b border-outline-variant">
              <span class="material-symbols-outlined text-primary text-base">settings</span>
              <span class="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider text-xs">Combination Settings</span>
            </div>
            <div class="p-md flex flex-col gap-md">
              <!-- Combination Length Toggle (multi-select) -->
              <div>
                <p class="text-xs text-outline font-semibold uppercase tracking-wider mb-sm">Combination Length <span class="text-primary normal-case">(multi-select)</span></p>
                <div class="flex gap-sm">
                  <button
                    v-for="len in availableLengths"
                    :key="len"
                    @click="toggleLength(len)"
                    :class="selectedLengths.has(len)
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                      : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'"
                    class="flex-1 py-sm px-sm rounded-lg font-label-sm text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-0.5"
                  >
                    <span>{{ len }}</span>
                    <span class="text-[9px] opacity-60 font-normal">char</span>
                  </button>
                </div>
              </div>
              <!-- Limit Toggle -->
              <div>
                <p class="text-xs text-outline font-semibold uppercase tracking-wider mb-sm">Display Limit</p>
                <div class="flex gap-sm flex-wrap">
                  <button
                    v-for="opt in limitOptions"
                    :key="opt.value"
                    @click="comboLimit = opt.value"
                    :class="comboLimit === opt.value
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high border'"
                    class="flex-1 py-sm px-sm rounded-lg font-label-sm text-xs font-semibold transition-all cursor-pointer"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button @click="generateCombinations" class="w-full bg-primary text-on-primary font-headline-md text-headline-md py-md rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-md cursor-pointer shadow-sm">
            <span class="material-symbols-outlined">auto_awesome</span>
            Generate Combinations
          </button>
        </div>

        <!-- Atmosphere Watermark Card -->
        <div class="relative overflow-hidden h-40 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center p-lg">
          <div class="relative z-10 text-center">
            <span class="font-character-study text-on-surface-variant opacity-30 text-[80px] leading-none select-none">和</span>
            <p class="font-label-sm text-label-sm text-on-surface-variant mt-sm italic">"Wa" — Harmony in learning</p>
          </div>
        </div>
      </aside>

      <!-- Right Column: Results Placeholder (Selection View) -->
      <section class="flex-grow flex flex-col gap-lg">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-md text-headline-md text-on-surface font-semibold">Possible Combinations</h2>
          <span class="font-label-sm text-label-sm px-md py-1 bg-surface-container-high rounded-full text-on-surface-variant">0 words found</span>
        </div>
        <div class="py-xl text-center flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl opacity-60 min-h-[400px]">
          <span class="material-symbols-outlined text-[48px] mb-md text-outline">inventory_2</span>
          <p class="font-body-lg text-body-lg text-outline">Select characters and click generate to see results.</p>
        </div>
      </section>
    </div>

    <!-- State B: Practice Results View -->
    <div v-else class="space-y-xl">
      <!-- Summary Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-surface-container-highest pb-lg">
        <div>
          <button @click="backToSelection" class="flex items-center gap-xs text-primary font-semibold hover:underline mb-sm transition-all group cursor-pointer">
            <span class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            Back to Selection
          </button>
          <h1 class="font-headline-md text-display-lg-mobile md:text-headline-md text-on-surface font-bold">Word Combinator Results</h1>
          <p class="text-on-surface-variant mt-xs flex items-center gap-sm">
            <span>{{ generatedWords.length }} Combinations Found for:</span>
            <span class="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-sm font-bold text-sm">
              {{ Array.from(selectedChars).join(', ') }}
            </span>
          </p>
        </div>
        <div class="flex items-center gap-md">
          <button @click="savePractice" class="flex items-center gap-sm px-lg py-sm rounded-lg border border-on-background text-on-background font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
            <span class="material-symbols-outlined">save</span>
            Save Practice
          </button>
          <button @click="exportList" class="flex items-center gap-sm px-lg py-sm rounded-lg bg-primary text-on-primary font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
            <span class="material-symbols-outlined">file_download</span>
            Export List
          </button>
        </div>
      </div>

      <!-- Practice Statistics -->
      <div class="bg-surface-container-low border border-outline-variant p-md rounded-xl flex flex-wrap gap-lg items-center justify-between">
        <div class="flex items-center gap-md">
          <span class="material-symbols-outlined text-primary text-2xl">emoji_events</span>
          <div>
            <p class="text-xs text-outline uppercase font-semibold">Your Score</p>
            <p class="font-bold text-lg">{{ score }} / {{ generatedWords.length }} Correct</p>
          </div>
        </div>
        <div class="h-2 flex-grow max-w-md bg-surface-container-highest rounded-full overflow-hidden">
          <div class="h-full bg-secondary transition-all duration-500" :style="{ width: `${progressPercent}%` }"></div>
        </div>
        <div class="text-sm font-mono text-outline">{{ progressPercent }}% Done</div>
      </div>

      <!-- Results Bento/Notebook Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        <div
          v-for="word in generatedWords"
          :key="word.jp"
          :class="{
            'border-secondary shadow-sm bg-secondary-container/5': isCorrect(word),
            'border-primary shadow-[0_4px_12px_rgba(134,78,90,0.08)]': focusedWord === word.jp,
            'border-error bg-error-container/5': isIncorrect(word),
            'border-[#E5E1DA] hover:border-outline': !isCorrect(word) && !isIncorrect(word) && focusedWord !== word.jp
          }"
          class="bg-surface-container-lowest border p-lg rounded-xl flex flex-col justify-between transition-all duration-300 relative min-h-[220px]"
        >
          <div class="flex justify-between items-start mb-md">
            <span class="text-on-tertiary-fixed-variant font-label-sm uppercase tracking-widest text-xs font-semibold">
              {{ word.meaning.includes('Phonetic') ? 'Combination' : 'N5 Vocabulary' }}
            </span>
            
            <button @click="speakWord(word.jp)" class="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer p-1" title="Pronounce">
              volume_up
            </button>
          </div>

          <div class="flex flex-col items-center py-md cursor-pointer" @click="speakWord(word.jp)">
            <span class="font-character-study text-character-study text-on-surface mb-sm font-bold tracking-wider select-all">{{ word.jp }}</span>
            <p class="text-xs text-outline italic font-medium">{{ word.meaning }}</p>
          </div>

          <div class="relative pt-sm">
            <input
              type="text"
              placeholder="Type Romaji..."
              v-model="userAnswers[word.jp]"
              @focus="focusedWord = word.jp"
              @blur="focusedWord = null"
              :disabled="isCorrect(word)"
              :class="{
                'border-secondary text-secondary font-semibold bg-secondary-container/10': isCorrect(word),
                'border-error text-error bg-error-container/10': isIncorrect(word),
                'border-primary': focusedWord === word.jp,
                'border-outline-variant': focusedWord !== word.jp && !isCorrect(word) && !isIncorrect(word)
              }"
              class="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 focus:ring-0 text-center font-body-lg text-on-surface py-2 transition-all outline-none"
            />
            <label
              v-if="isCorrect(word)"
              class="absolute -top-1 left-0 text-[10px] text-secondary font-bold uppercase tracking-tighter"
            >
              Correct
            </label>
            <label
              v-else-if="focusedWord === word.jp"
              class="absolute -top-1 left-0 text-[10px] text-primary font-bold uppercase tracking-tighter"
            >
              Current
            </label>
            <label
              v-else-if="isIncorrect(word)"
              class="absolute -top-1 left-0 text-[10px] text-error font-bold uppercase tracking-tighter animate-pulse"
            >
              Try Again
            </label>
          </div>
        </div>
      </div>

      <!-- Collapsible Character Drawer at Bottom -->
      <div class="mt-xl border-t border-surface-container-highest pt-md">
        <button
          @click="isBottomDrawerOpen = !isBottomDrawerOpen"
          class="flex items-center justify-between w-full p-md bg-surface-container-low rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer font-semibold"
        >
          <div class="flex items-center gap-md">
            <span class="material-symbols-outlined text-primary">tune</span>
            <span>Edit Character Selection</span>
          </div>
          <span class="material-symbols-outlined transition-transform duration-200" :class="{ 'rotate-180': isBottomDrawerOpen }">
            expand_more
          </span>
        </button>

        <div v-show="isBottomDrawerOpen" class="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-inner mt-sm">
          <div class="flex gap-sm mb-lg">
            <button @click="selectAll" class="px-md py-sm rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low cursor-pointer">
              Select All
            </button>
            <button @click="clearAll" class="px-md py-sm rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-low cursor-pointer">
              Clear All
            </button>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-sm max-h-[250px] overflow-y-auto custom-scroll pr-2">
            <button
              v-for="item in characters"
              :key="item.char"
              @click="toggleSelect(item.char)"
              :class="{
                'bg-primary-container text-on-primary-container border-primary shadow-inner scale-95': selectedChars.has(item.char),
                'bg-surface hover:bg-surface-container-low border-outline-variant': !selectedChars.has(item.char)
              }"
              class="flex flex-col items-center justify-center p-sm border rounded-lg transition-all h-16 cursor-pointer"
            >
              <span class="font-character-study text-[20px] leading-none">{{ item.char }}</span>
              <span class="font-label-sm text-[9px] text-on-surface-variant mt-1 uppercase font-semibold">{{ item.romaji }}</span>
            </button>
          </div>

          <!-- Settings in drawer -->
          <div class="mt-lg border-t border-outline-variant pt-md flex flex-col gap-md">
            <div>
              <p class="text-xs text-outline font-semibold uppercase tracking-wider mb-sm">Combination Length <span class="text-primary normal-case">(multi-select)</span></p>
              <div class="flex gap-sm">
                <button
                  v-for="len in availableLengths"
                  :key="len"
                  @click="toggleLength(len)"
                  :class="selectedLengths.has(len)
                    ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'"
                  class="flex-1 py-sm px-sm rounded-lg font-label-sm text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-0.5"
                >
                  <span>{{ len }}</span>
                  <span class="text-[9px] opacity-60 font-normal">char</span>
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs text-outline font-semibold uppercase tracking-wider mb-sm">Display Limit</p>
              <div class="flex gap-sm flex-wrap">
                <button
                  v-for="opt in limitOptions"
                  :key="opt.value"
                  @click="comboLimit = opt.value"
                  :class="comboLimit === opt.value
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high border'"
                  class="flex-1 py-sm px-sm rounded-lg font-label-sm text-xs font-semibold transition-all cursor-pointer"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <button @click="generateCombinations" class="mt-lg w-full bg-primary text-on-primary py-sm rounded-lg font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'

useHead({
  title: 'Word Combinator | Hitomoji Learn'
})

interface Character {
  char: string
  romaji: string
}

interface Word {
  jp: string
  romaji: string
  meaning: string
}

const hiraganaMap: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n'
}

const characters: Character[] = [
  { char: 'あ', romaji: 'a' }, { char: 'い', romaji: 'i' }, { char: 'う', romaji: 'u' }, { char: 'え', romaji: 'e' }, { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' }, { char: 'き', romaji: 'ki' }, { char: 'く', romaji: 'ku' }, { char: 'け', romaji: 'ke' }, { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' }, { char: 'し', romaji: 'shi' }, { char: 'す', romaji: 'su' }, { char: 'せ', romaji: 'se' }, { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' }, { char: 'ち', romaji: 'chi' }, { char: 'つ', romaji: 'tsu' }, { char: 'て', romaji: 'te' }, { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' }, { char: 'に', romaji: 'ni' }, { char: 'ぬ', romaji: 'nu' }, { char: 'ね', romaji: 'ne' }, { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' }, { char: 'ひ', romaji: 'hi' }, { char: 'ふ', romaji: 'fu' }, { char: 'へ', romaji: 'he' }, { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' }, { char: 'み', romaji: 'mi' }, { char: 'む', romaji: 'mu' }, { char: 'め', romaji: 'me' }, { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' }, { char: 'ゆ', romaji: 'yu' }, { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' }, { char: 'り', romaji: 'ri' }, { char: 'る', romaji: 'ru' }, { char: 'れ', romaji: 're' }, { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' }, { char: 'を', romaji: 'wo' }, { char: 'ん', romaji: 'n' }
]

// State management
const selectedChars = ref<Set<string>>(new Set())
const isShowingResults = ref<boolean>(false)
const isBottomDrawerOpen = ref<boolean>(false)
const generatedWords = ref<Word[]>([])
const userAnswers = ref<Record<string, string>>({})
const focusedWord = ref<string | null>(null)

// Combination settings
type LimitValue = 6 | 12 | 24 | 48 | 0

// Multi-select: user can pick multiple lengths (2, 3, 4, 5)
const selectedLengths = ref<Set<number>>(new Set([2, 3]))
const comboLimit = ref<LimitValue>(12)

const availableLengths = [2, 3, 4, 5]

const toggleLength = (len: number) => {
  const s = new Set(selectedLengths.value)
  if (s.has(len)) {
    if (s.size > 1) s.delete(len) // at least one must be selected
  } else {
    s.add(len)
  }
  selectedLengths.value = s
}

const limitOptions: { label: string; value: LimitValue }[] = [
  { label: '6', value: 6 },
  { label: '12', value: 12 },
  { label: '24', value: 24 },
  { label: '48', value: 48 },
  { label: 'All', value: 0 },
]

// Generic recursive N-length combination generator
const generateNLengthCombos = (pool: string[], length: number): string[][] => {
  if (length === 1) return pool.map(c => [c])
  const result: string[][] = []
  const sub = generateNLengthCombos(pool, length - 1)
  for (const combo of sub) {
    for (const c of pool) {
      // Avoid same char directly adjacent
      if (combo[combo.length - 1] !== c) {
        result.push([...combo, c])
      }
    }
  }
  return result
}

// Selectors
const toggleSelect = (char: string) => {
  const newSet = new Set(selectedChars.value)
  if (newSet.has(char)) {
    newSet.delete(char)
  } else {
    newSet.add(char)
  }
  selectedChars.value = newSet
}

const selectAll = () => {
  selectedChars.value = new Set(characters.map(c => c.char))
}

const clearAll = () => {
  selectedChars.value = new Set()
}

// Combinations logic - Generic N-length Generator
const generateCombinations = () => {
  if (selectedChars.value.size === 0) {
    alert('Please select at least one character.')
    return
  }

  // Cap the pool to 6 chars for longer combos to avoid browser freeze
  const fullList = Array.from(selectedChars.value)
  const tempCombinations: Word[] = []

  const sortedLengths = Array.from(selectedLengths.value).sort()

  for (const len of sortedLengths) {
    if (fullList.length < len) continue // skip if not enough chars
    // For longer combos, limit pool to prevent combinatorial explosion
    const pool = len >= 4 ? fullList.slice(0, Math.min(fullList.length, 6)) : fullList
    const combos = generateNLengthCombos(pool, len)
    for (const combo of combos) {
      const jp = combo.join('')
      const romaji = combo.map(c => hiraganaMap[c] || '').join('')
      tempCombinations.push({
        jp,
        romaji,
        meaning: `${len}-char: ${combo.join(' + ')}`
      })
    }
  }

  // Shuffle generated combinations
  const shuffled = tempCombinations.sort(() => 0.5 - Math.random())

  // Apply user-defined limit (0 = show all)
  const limit = comboLimit.value === 0 ? shuffled.length : Math.min(comboLimit.value, shuffled.length)
  generatedWords.value = shuffled.slice(0, limit)

  // Reset user answers
  userAnswers.value = {}
  generatedWords.value.forEach(word => {
    userAnswers.value[word.jp] = ''
  })

  isShowingResults.value = true
  isBottomDrawerOpen.value = false
}

const backToSelection = () => {
  isShowingResults.value = false
}

// Answer state checkers
const isCorrect = (word: Word) => {
  const ans = (userAnswers.value[word.jp] || '').trim().toLowerCase()
  return ans === word.romaji.toLowerCase()
}

const isIncorrect = (word: Word) => {
  const ans = (userAnswers.value[word.jp] || '').trim().toLowerCase()
  return ans.length >= word.romaji.length && ans !== word.romaji.toLowerCase()
}

// Practice stats
const score = computed(() => {
  return generatedWords.value.filter(word => isCorrect(word)).length
})

const progressPercent = computed(() => {
  if (generatedWords.value.length === 0) return 0
  return Math.round((score.value / generatedWords.value.length) * 100)
})

// Pronunciation
const speakWord = (jpText: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(jpText)
  utterance.lang = 'ja-JP'
  window.speechSynthesis.speak(utterance)
}

// Save to history
const savePractice = () => {
  if (generatedWords.value.length === 0) return
  
  const practiceRecord = {
    date: new Date().toLocaleDateString(),
    chars: Array.from(selectedChars.value),
    score: score.value,
    total: generatedWords.value.length
  }

  if (typeof localStorage !== 'undefined') {
    const existing = localStorage.getItem('practice_history')
    const history = existing ? JSON.parse(existing) : []
    history.unshift(practiceRecord)
    localStorage.setItem('practice_history', JSON.stringify(history))
  }

  alert(`Practice saved! Score: ${score.value}/${generatedWords.value.length}`)
}

// CSV Export
const exportList = () => {
  if (generatedWords.value.length === 0) return
  const headers = "Japanese,Romaji,Meaning\n"
  const rows = generatedWords.value.map(w => `"${w.jp}","${w.romaji}","${w.meaning}"`).join("\n")
  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "word_combinations.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #d6c2c4;
  border-radius: 10px;
}
</style>
