<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <!-- Left Sidebar: Configuration -->
      <aside class="lg:col-span-4 space-y-lg">
        <div class="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-lg shadow-sm">
          <h2 class="font-headline-md text-headline-md mb-md flex items-center gap-sm font-semibold">
            <span class="material-symbols-outlined text-primary">tune</span>
            Configuration
          </h2>
          
          <!-- Character Types -->
          <div class="mb-lg">
            <label class="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-sm block">Character Types</label>
            <div class="space-y-sm">
              <label class="flex items-center gap-sm cursor-pointer p-sm hover:bg-surface-container-low rounded-lg transition-colors">
                <input value="hiragana" v-model="charTypes" class="rounded border-outline text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
                <span class="font-body-md">Hiragana <span class="text-outline text-sm ml-1">(あ)</span></span>
              </label>
              <!-- <label class="flex items-center gap-sm cursor-pointer p-sm hover:bg-surface-container-low rounded-lg transition-colors">
                <input value="katakana" v-model="charTypes" class="rounded border-outline text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
                <span class="font-body-md">Katakana <span class="text-outline text-sm ml-1">(ア)</span></span>
              </label>
              <label class="flex items-center gap-sm cursor-pointer p-sm hover:bg-surface-container-low rounded-lg transition-colors">
                <input value="kanji" v-model="charTypes" class="rounded border-outline text-primary focus:ring-primary h-5 w-5" type="checkbox"/>
                <span class="font-body-md">Kanji <span class="text-outline text-sm ml-1">(漢)</span></span>
              </label> -->
            </div>
          </div>

          <!-- Mode -->
          <div class="mb-lg">
            <label class="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-sm block">Generation Mode</label>
            <div class="flex gap-sm p-unit bg-surface-container-low rounded-xl">
              <label class="flex-1">
                <input type="radio" value="word" v-model="mode" class="hidden peer" name="mode" />
                <div class="text-center py-sm rounded-lg peer-checked:bg-white peer-checked:shadow-sm cursor-pointer transition-all text-on-surface-variant peer-checked:text-primary font-semibold">
                  Single Word
                </div>
              </label>
              <label class="flex-1">
                <input type="radio" value="sentence" v-model="mode" class="hidden peer" name="mode" />
                <div class="text-center py-sm rounded-lg peer-checked:bg-white peer-checked:shadow-sm cursor-pointer transition-all text-on-surface-variant peer-checked:text-primary font-semibold">
                  Full Sentence
                </div>
              </label>
            </div>
          </div>

          <!-- Length Slider -->
          <div class="mb-xl">
            <div class="flex justify-between items-center mb-sm">
              <label class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Target Length</label>
              <span class="font-bold text-primary font-mono text-lg">{{ targetLength }}</span>
            </div>
            <input class="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer" max="20" min="1" type="range" v-model="targetLength"/>
            <div class="flex justify-between text-xs text-outline mt-2">
              <span>Short</span>
              <span>Complex</span>
            </div>
          </div>

          <!-- Specific Characters -->
          <div class="mb-lg">
            <div class="flex justify-between items-center mb-sm">
              <label class="font-label-sm text-label-sm uppercase tracking-wider text-outline">Specific Characters</label>
              <div class="flex gap-sm">
                <button @click="selectAllChars" class="text-xs font-bold text-primary hover:underline cursor-pointer">Select All</button>
                <span class="text-outline text-xs">|</span>
                <button @click="clearAllChars" class="text-xs font-bold text-primary hover:underline cursor-pointer">Clear All</button>
              </div>
            </div>
            <div class="grid grid-cols-5 gap-xs p-sm bg-surface-container-low rounded-xl">
              <label v-for="char in specificCharsList" :key="char" class="relative flex items-center justify-center">
                <input type="checkbox" :value="char" v-model="selectedSpecificChars" class="peer hidden" />
                <div class="w-full py-2 text-center rounded-lg border border-outline-variant bg-white text-on-surface-variant peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all cursor-pointer font-semibold text-sm">
                  {{ char }}
                </div>
              </label>
            </div>
            <p class="text-[10px] text-outline mt-2 italic">* Filter applies to the selected character types above.</p>
          </div>

          <!-- Generate Button -->
          <button @click="generateText" class="w-full py-md bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-sm generate-btn transition-all hover:opacity-90 shadow-md cursor-pointer">
            <span class="material-symbols-outlined" :class="{ 'animate-spin': isGenerating }">auto_awesome</span>
            {{ isGenerating ? 'Generating...' : 'Generate Text' }}
          </button>
        </div>

        <!-- Tip Card -->
        <div class="bg-secondary-container/20 border border-secondary/20 rounded-xl p-md flex gap-md items-start">
          <span class="material-symbols-outlined text-secondary">lightbulb</span>
          <p class="text-on-secondary-fixed-variant text-sm">
            Tip: Including Kanji helps with context and natural reading flow for advanced learners.
          </p>
        </div>
      </aside>

      <!-- Right Panel: Display Area -->
      <section class="lg:col-span-8 flex flex-col gap-lg">
        <div class="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm min-h-[350px]">
          <!-- Decorative background elements -->
          <div class="absolute top-0 right-0 p-lg opacity-10 pointer-events-none">
            <span class="font-character-study text-[120px] select-none">和</span>
          </div>

          <div :class="{ 'opacity-0 translate-y-2': isGenerating, 'opacity-100 translate-y-0': !isGenerating }" class="w-full max-w-2xl space-y-xl transition-all duration-300" id="output-canvas">
            <!-- Japanese Display -->
            <div class="space-y-md">
              <h1 class="font-character-study text-character-study text-on-surface tracking-widest break-all select-all font-bold">
                {{ currentJp }}
              </h1>
              <div class="h-1 w-24 bg-primary-container mx-auto rounded-full"></div>
            </div>

            <!-- Transliterations -->
            <div class="space-y-sm">
              <p class="font-headline-md text-headline-md text-primary italic font-semibold">{{ currentRomaji }}</p>
              <p class="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
                {{ currentEnglish }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap items-center justify-center gap-md pt-lg">
              <button @click="copyText" class="flex items-center gap-xs px-lg py-sm rounded-full border border-outline text-on-surface-variant hover:bg-surface-container-low transition-all font-semibold active:scale-95 cursor-pointer">
                <span class="material-symbols-outlined">{{ copied ? 'check' : 'content_copy' }}</span>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
              <button @click="speakText" :class="{ 'animate-pulse bg-secondary/80': isSpeaking, 'bg-secondary hover:bg-secondary/90': !isSpeaking }" class="flex items-center gap-xs px-lg py-sm rounded-full text-on-secondary transition-all font-semibold active:scale-95 cursor-pointer">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">volume_up</span>
                {{ isSpeaking ? 'Speaking' : 'Listen' }}
              </button>
              <button @click="saveItem" class="flex items-center gap-xs px-lg py-sm rounded-full bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-all font-semibold active:scale-95 cursor-pointer">
                <span class="material-symbols-outlined">bookmark</span>
                Save
              </button>
            </div>
          </div>
        </div>

        <!-- Saved Vocabulary Card -->
        <div class="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-lg shadow-sm">
          <h3 class="font-headline-md text-headline-md mb-md flex items-center gap-sm font-semibold">
            <span class="material-symbols-outlined text-primary">bookmark</span>
            Saved Words / Sentences
          </h3>
          <div v-if="savedItems.length === 0" class="text-outline text-sm py-4">
            No saved words yet. Click "Save" on generated words to add them here.
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-sm">
            <div v-for="(item, index) in savedItems" :key="index" class="p-md border border-surface-container-highest bg-background rounded-lg flex justify-between items-center group hover:border-primary/50 transition-colors">
              <div>
                <p class="font-character-study font-bold text-on-surface text-xl">{{ item.jp }}</p>
                <p class="text-xs text-primary italic font-semibold mt-1">{{ item.ro }}</p>
                <p class="text-xs text-on-surface-variant mt-1">{{ item.en }}</p>
              </div>
              <button @click="removeSavedItem(index)" class="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-pointer">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

useHead({
  title: 'Generator | Hitomoji Learn'
})

interface VocabItem {
  jp: string
  ro: string
  en: string
  mode: 'word' | 'sentence'
}

const vocabularyDb: VocabItem[] = [
  { jp: "一期一会", ro: "Ichigo Ichie", en: "Once in a lifetime encounter; treasure every moment.", mode: "word" },
  { jp: "猫が大好きです", ro: "Neko ga daisuki desu", en: "I love cats very much.", mode: "sentence" },
  { jp: "桜の花が咲いています", ro: "Sakura no hana ga saite imasu", en: "The cherry blossoms are blooming.", mode: "sentence" },
  { jp: "不思議", ro: "Fushigi", en: "Wonder, mystery, or curiosity.", mode: "word" },
  { jp: "明日も頑張りましょう", ro: "Ashita mo ganbarimashou", en: "Let's do our best tomorrow too.", mode: "sentence" },
  { jp: "静寂", ro: "Seijaku", en: "Silence, stillness, or tranquility.", mode: "word" },
  { jp: "日本語を勉強しています", ro: "Nihongo o benkyou shite imasu", en: "I am studying Japanese.", mode: "sentence" },
  { jp: "あおい", ro: "Aoi", en: "Blue color.", mode: "word" },
  { jp: "あめ", ro: "Ame", en: "Rain or candy.", mode: "word" },
  { jp: "こころ", ro: "Kokoro", en: "Heart, mind, or spirit.", mode: "word" },
  { jp: "さくら", ro: "Sakura", en: "Cherry blossoms.", mode: "word" },
  { jp: "ともだち", ro: "Tomodachi", en: "Friend or companion.", mode: "word" },
  { jp: "いぬ", ro: "Inu", en: "Dog.", mode: "word" },
  { jp: "ねこ", ro: "Neko", en: "Cat.", mode: "word" },
  { jp: "うみ", ro: "Umi", en: "Sea or ocean.", mode: "word" },
  { jp: "えき", ro: "Eki", en: "Train station.", mode: "word" },
  { jp: "カメラ", ro: "Kamera", en: "Camera.", mode: "word" },
  { jp: "パソコン", ro: "Pasokon", en: "Personal computer (PC).", mode: "word" },
  { jp: "カラオケ", ro: "Karaoke", en: "Karaoke.", mode: "word" },
  { jp: "アニメ", ro: "Anime", en: "Japanese animation.", mode: "word" },
  { jp: "パン", ro: "Pan", en: "Bread.", mode: "word" },
  { jp: "コーヒー", ro: "Koohii", en: "Coffee.", mode: "word" },
  { jp: "ビール", ro: "Biiru", en: "Beer.", mode: "word" },
  { jp: "ホテル", ro: "Hoteru", en: "Hotel.", mode: "word" },
  { jp: "日本", ro: "Nihon", en: "Japan.", mode: "word" },
  { jp: "先生", ro: "Sensei", en: "Teacher or doctor.", mode: "word" },
  { jp: "学生", ro: "Gakusei", en: "Student.", mode: "word" },
  { jp: "学校", ro: "Gakkoo", en: "School.", mode: "word" },
  { jp: "明日", ro: "Ashita", en: "Tomorrow.", mode: "word" },
  { jp: "時間", ro: "Jikan", en: "Time or hours.", mode: "word" },
  { jp: "自由", ro: "Jiyuu", en: "Freedom or liberty.", mode: "word" },
  { jp: "平和", ro: "Heiwa", en: "Peace or harmony.", mode: "word" },
  { jp: "花火", ro: "Hanabi", en: "Fireworks.", mode: "word" },
  { jp: "お元気ですか？", ro: "Ogenki desu ka?", en: "How are you?", mode: "sentence" },
  { jp: "美味しいご飯を食べました", ro: "Oishii gohan o tabemashita", en: "I ate delicious food.", mode: "sentence" },
  { jp: "今日は天気がとてもいいですね", ro: "Kyou wa tenki ga totemo ii desu ne", en: "The weather is very nice today.", mode: "sentence" },
  { jp: "海で泳ぐのが好きです", ro: "Umi de oyogu no ga suki desu", en: "I like swimming in the sea.", mode: "sentence" },
  { jp: "どこに行きますか？", ro: "Doko ni ikimasu ka?", en: "Where are you going?", mode: "sentence" },
  { jp: "日本へ旅行に行きたいです", ro: "Nihon e ryokou ni ikitai desu", en: "I want to travel to Japan.", mode: "sentence" },
  { jp: "ありがとうございます", ro: "Arigatou gozaimasu", en: "Thank you very much.", mode: "sentence" },
  { jp: "すみません、駅はどこですか？", ro: "Sumimasen, eki wa doko desu ka?", en: "Excuse me, where is the station?", mode: "sentence" }
]

// Configuration States
const charTypes = ref<string[]>(['hiragana', 'katakana', 'kanji'])
const mode = ref<'word' | 'sentence'>('word')
const targetLength = ref<number>(5)

const specificCharsList = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ']
const selectedSpecificChars = ref<string[]>([])

// Display States
const currentJp = ref<string>('木漏れ日')
const currentRomaji = ref<string>('Hitomoji')
const currentEnglish = ref<string>('Sunlight filtering through the leaves of trees.')

// Interactions States
const isGenerating = ref<boolean>(false)
const copied = ref<boolean>(false)
const isSpeaking = ref<boolean>(false)
const savedItems = ref<VocabItem[]>([])

// Functions
const selectAllChars = () => {
  selectedSpecificChars.value = [...specificCharsList]
}

const clearAllChars = () => {
  selectedSpecificChars.value = []
}

const generateText = () => {
  isGenerating.value = true
  
  setTimeout(() => {
    // 1. Filter by mode (word vs sentence)
    let pool = vocabularyDb.filter(item => item.mode === mode.value)
    
    // 2. Filter by character types
    pool = pool.filter(item => {
      const hasKanji = /[\u4e00-\u9faf]/.test(item.jp)
      const hasKatakana = /[\u30a0-\u30ff]/.test(item.jp)
      const hasHiragana = /[\u3040-\u309f]/.test(item.jp)
      
      const allowHiragana = charTypes.value.includes('hiragana')
      const allowKatakana = charTypes.value.includes('katakana')
      const allowKanji = charTypes.value.includes('kanji')
      
      if (hasKanji && !allowKanji) return false
      if (hasKatakana && !allowKatakana) return false
      // Only filter out Hiragana items if NOT selected. For sentences, mixed chars are tolerated
      if (hasHiragana && !allowHiragana && item.mode === 'word') return false
      
      return true
    })
    
    // 3. Filter by Specific Characters
    if (selectedSpecificChars.value.length > 0) {
      pool = pool.filter(item => {
        return selectedSpecificChars.value.some(char => item.jp.includes(char))
      })
    }
    
    // Fallback if filters are too restrictive and return empty pool
    if (pool.length === 0) {
      pool = vocabularyDb.filter(item => item.mode === mode.value)
    }
    
    // 4. Sort and select by length closeness
    pool.sort((a, b) => {
      const diffA = Math.abs(a.jp.replace(/[。？\s]/g, '').length - targetLength.value)
      const diffB = Math.abs(b.jp.replace(/[。？\s]/g, '').length - targetLength.value)
      return diffA - diffB
    })
    
    // Take from the top candidates and pick one randomly
    const topCandidates = pool.slice(0, Math.min(3, pool.length))
    const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)]
    
    if (selected) {
      currentJp.value = selected.jp
      currentRomaji.value = selected.ro
      currentEnglish.value = selected.en
    }
    
    isGenerating.value = false
  }, 300)
}


const copyText = () => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  navigator.clipboard.writeText(currentJp.value).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

const speakText = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  
  if (isSpeaking.value) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }
  
  const utterance = new SpeechSynthesisUtterance(currentJp.value)
  utterance.lang = 'ja-JP'
  
  utterance.onend = () => {
    isSpeaking.value = false
  }
  utterance.onerror = () => {
    isSpeaking.value = false
  }
  
  isSpeaking.value = true
  window.speechSynthesis.speak(utterance)
}

const saveItem = () => {
  if (savedItems.value.some(item => item.jp === currentJp.value)) return
  
  savedItems.value.push({
    jp: currentJp.value,
    ro: currentRomaji.value,
    en: currentEnglish.value,
    mode: mode.value
  })
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('saved_words', JSON.stringify(savedItems.value))
  }
}

const removeSavedItem = (index: number) => {
  savedItems.value.splice(index, 1)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('saved_words', JSON.stringify(savedItems.value))
  }
}

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('saved_words')
    if (saved) {
      savedItems.value = JSON.parse(saved)
    }
  }
})
</script>
