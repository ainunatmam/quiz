<template>
  <div class="bg-[#f5eddd] text-[#1f1b12] min-h-screen flex flex-col pt-[90px] pb-[90px] md:pb-12 overflow-x-hidden">
    <!-- Top Navigation Header -->
    <QuizHeader showBack backTo="/journey" />

    <!-- Main Content Canvas -->
    <main class="flex-grow flex flex-col items-center justify-start px-6 py-6 max-w-5xl mx-auto w-full gap-6">
      <!-- Title & Header Banner -->
      <div class="w-full bg-white rounded-3xl p-6 border-4 border-[#d0c6ad] shadow-[0px_6px_0px_0px_#d0c6ad] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-[#ffd93d]/30 border-2 border-[#ffd93d] flex items-center justify-center text-[#725e00]">
              <span class="material-symbols-outlined text-3xl font-bold">edit_note</span>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-extrabold text-[#705d00] font-display">
                Kelola & Input Soal Kuis
              </h1>
              <p class="text-sm font-semibold text-[#6b624a] font-display">
                Atur pertanyaan stage 1-5, isi 4 petak jawaban, dan tentukan mana jawaban yang benar.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="showStageIconModal = true"
            class="bubbly-btn bg-[#e8f2ff] text-[#005db8] border-[#005db8] shadow-[0px_6px_0px_0px_#005db8] px-4 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:scale-105 active:translate-y-1 active:shadow-none transition-all font-display text-sm md:text-base select-none"
          >
            <span class="material-symbols-outlined text-2xl font-bold">image</span>
            Ganti Logo Stage {{ selectedStage }}
          </button>
          <button
            @click="handleAddNewStage"
            class="bubbly-btn bg-[#8ff199] text-[#006e29] border-[#006e29] shadow-[0px_6px_0px_0px_#006e29] px-4 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:scale-105 active:translate-y-1 active:shadow-none transition-all font-display text-sm md:text-base select-none"
          >
            <span class="material-symbols-outlined text-2xl font-bold">add_location_alt</span>
            + Stage Baru
          </button>
          <button
            @click="openAddModal"
            class="bubbly-btn bg-[#ffd93d] text-[#725e00] border-[#705d00] shadow-[0px_6px_0px_0px_#705d00] px-5 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:scale-105 active:translate-y-1 active:shadow-none transition-all font-display text-sm md:text-base select-none"
          >
            <span class="material-symbols-outlined text-2xl font-bold">add_circle</span>
            Tambah Soal
          </button>
          <button
            @click="confirmResetQuestions"
            title="Kembalikan semua soal ke standar awal"
            class="p-3 bg-white text-[#ba1a1a] border-2 border-[#ba1a1a] rounded-2xl font-bold flex items-center justify-center hover:bg-[#ffdad6] hover:scale-105 active:scale-95 transition-all select-none"
          >
            <span class="material-symbols-outlined text-2xl">restart_alt</span>
          </button>
        </div>
      </div>

      <!-- Stage Selector Tabs (Dynamic 1..N) -->
      <div class="w-full flex items-center justify-between gap-2 overflow-x-auto pb-2 select-none">
        <div
          v-for="s in availableStages"
          :key="s"
          class="flex-1 min-w-[130px] relative group"
        >
          <button
            @click="selectedStage = s"
            :class="[
              selectedStage === s
                ? 'bg-[#005db8] text-white border-[#002e60] shadow-[0px_6px_0px_0px_#002e60] scale-105'
                : 'bg-white text-[#4d4633] border-[#d0c6ad] shadow-[0px_4px_0px_0px_#d0c6ad] hover:bg-[#fff8ef]'
            ]"
            class="w-full py-3.5 px-4 rounded-2xl border-2 font-extrabold flex flex-col items-center justify-center gap-1 transition-all duration-200 font-display"
          >
            <span class="text-xs uppercase tracking-wider opacity-90">Peta / Stage</span>
            <span class="text-lg md:text-xl font-black flex items-center gap-1">
              <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">
                {{ getStageIcon(s) }}
              </span>
              Stage {{ s }}
            </span>
            <span class="text-[11px] px-2 py-0.5 rounded-full font-bold" :class="selectedStage === s ? 'bg-white/20 text-white' : 'bg-[#f5eddd] text-[#705d00]'">
              {{ getQuestionsCount(s) }} Soal
            </span>
          </button>

          <!-- Stage Delete Button (Only if >1 stage exists) -->
          <button
            v-if="availableStages.length > 1"
            @click.stop="handleDeleteStage(s)"
            title="Hapus Stage ini"
            class="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-[#ba1a1a] text-white text-xs font-bold items-center justify-center hidden group-hover:flex hover:scale-110 transition-transform shadow-md"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Question List for Selected Stage -->
      <div class="w-full flex flex-col gap-4">
        <!-- Empty State -->
        <div v-if="currentStageQuestions.length === 0" class="w-full bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#d0c6ad] flex flex-col items-center justify-center gap-3">
          <span class="material-symbols-outlined text-6xl text-[#d0c6ad]">quiz</span>
          <h3 class="text-xl font-bold text-[#705d00] font-display">Belum ada soal untuk Stage {{ selectedStage }}</h3>
          <p class="text-sm text-[#6b624a]">Klik tombol "Tambah Soal Baru" di atas untuk menambahkan pertanyaan pertama!</p>
          <button
            @click="openAddModal"
            class="mt-2 bg-[#ffd93d] text-[#725e00] border-2 border-[#705d00] px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all"
          >
            + Tambah Soal Stage {{ selectedStage }}
          </button>
        </div>

        <!-- Question Cards -->
        <div
          v-for="(q, qIdx) in currentStageQuestions"
          :key="qIdx"
          class="w-full bg-white rounded-3xl p-6 border-2 border-[#d0c6ad] shadow-sm flex flex-col gap-4 relative hover:shadow-md transition-shadow"
        >
          <!-- Question Header Row -->
          <div class="flex items-start justify-between gap-4 border-b pb-3 border-[#f5eddd]">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-[#006e29] text-white font-extrabold flex items-center justify-center text-sm font-display shrink-0">
                #{{ qIdx + 1 }}
              </span>
              <h3 class="text-lg md:text-xl font-extrabold text-[#1f1b12] font-display">
                {{ q.prompt }}
              </h3>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="openEditModal(qIdx)"
                class="p-2 bg-[#e8f2ff] text-[#005db8] border-2 border-[#005db8] rounded-xl font-bold flex items-center gap-1 text-xs hover:bg-[#d0e4ff] hover:scale-105 active:scale-95 transition-all"
              >
                <span class="material-symbols-outlined text-base">edit</span>
                Edit
              </button>
              <button
                @click="deleteQuestionItem(qIdx)"
                class="p-2 bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#ba1a1a] rounded-xl font-bold flex items-center gap-1 text-xs hover:bg-[#ffb4ab] hover:scale-105 active:scale-95 transition-all"
              >
                <span class="material-symbols-outlined text-base">delete</span>
                Hapus
              </button>
            </div>
          </div>

          <!-- Options Grid Preview (4 Options) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(opt, optIdx) in q.options"
              :key="optIdx"
              :class="[
                opt.isCorrect
                  ? 'bg-[#8ff199]/30 border-[#006e29] text-[#00702a]'
                  : 'bg-[#fff8ef] border-[#d0c6ad] text-[#4d4633]'
              ]"
              class="p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 relative font-display"
            >
              <div class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-xl bg-white border border-[#d0c6ad] flex items-center justify-center text-xs font-bold text-[#705d00] shrink-0">
                  {{ optIdx + 1 }}
                </span>
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">
                  {{ opt.icon || 'help' }}
                </span>
                <span class="font-bold text-sm md:text-base">{{ opt.text }}</span>
              </div>

              <!-- Correct Answer Badge -->
              <span
                v-if="opt.isCorrect"
                class="bg-[#006e29] text-white text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0"
              >
                <span class="material-symbols-outlined text-xs">check_circle</span>
                BENAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Form Tambah / Edit Soal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-3xl border-4 border-[#705d00] shadow-2xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-pop-in">
        <!-- Modal Title -->
        <div class="flex items-center justify-between border-b pb-4 border-[#f5eddd]">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-3xl text-[#705d00]" style="font-variation-settings: 'FILL' 1;">
              {{ isEditing ? 'edit_square' : 'add_task' }}
            </span>
            <h2 class="text-xl md:text-2xl font-extrabold text-[#705d00] font-display">
              {{ isEditing ? `Edit Soal Stage ${selectedStage}` : `Tambah Soal Baru (Stage ${selectedStage})` }}
            </h2>
          </div>
          <button @click="showModal = false" class="text-[#7e7761] hover:text-black p-1 rounded-full hover:bg-[#f5eddd]">
            <span class="material-symbols-outlined text-2xl font-bold">close</span>
          </button>
        </div>

        <!-- Question Prompt Input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-extrabold text-[#4d4633] font-display flex items-center gap-1">
            <span class="material-symbols-outlined text-lg text-[#005db8]">help</span>
            Pertanyaan / Prompt Soal:
          </label>
          <input
            v-model="form.prompt"
            type="text"
            placeholder="Contoh: Manakah hewan yang bisa terbang tinggi?"
            class="w-full px-4 py-3 rounded-2xl border-2 border-[#d0c6ad] bg-[#fff8ef] focus:bg-white focus:border-[#005db8] outline-none font-bold text-[#1f1b12] text-base font-display transition-colors"
          />
        </div>

        <!-- Option Inputs (Petak 1-4) & Correct Answer Selector -->
        <div class="flex flex-col gap-3">
          <label class="text-sm font-extrabold text-[#4d4633] font-display flex items-center justify-between">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-lg text-[#ffd93d]" style="font-variation-settings: 'FILL' 1;">grid_view</span>
              Isi 4 Petak Jawaban & Pilih Jawaban yang Benar:
            </span>
            <span class="text-xs text-[#006e29] font-bold">*Klik lingkaran nomor untuk memilih petak jawaban benar</span>
          </label>

          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="(opt, idx) in form.options"
              :key="idx"
              :class="[
                form.correctIndex === idx
                  ? 'bg-[#8ff199]/20 border-[#006e29] ring-2 ring-[#006e29]'
                  : 'bg-[#fff8ef] border-[#d0c6ad]'
              ]"
              class="p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center gap-3 transition-all"
            >
              <!-- Correct Answer Radio Tile Selector -->
              <button
                type="button"
                @click="form.correctIndex = idx"
                :class="[
                  form.correctIndex === idx
                    ? 'bg-[#006e29] text-white border-[#006e29]'
                    : 'bg-white text-[#d0c6ad] border-[#d0c6ad] hover:border-[#006e29]'
                ]"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer"
                title="Tandai sebagai jawaban benar"
              >
                <span v-if="form.correctIndex === idx" class="material-symbols-outlined text-base font-bold">check</span>
                <span v-else class="text-xs font-bold text-[#4d4633]">{{ idx + 1 }}</span>
              </button>

              <!-- Option Text Input -->
              <div class="flex-grow w-full">
                <input
                  v-model="opt.text"
                  type="text"
                  :placeholder="`Teks Pilihan Jawaban ${idx + 1}`"
                  class="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#d0c6ad] bg-white focus:border-[#005db8] outline-none font-bold text-sm text-[#1f1b12] font-display"
                />
              </div>

              <!-- Option Icon Picker Dropdown -->
              <div class="w-full sm:w-48 shrink-0 flex items-center gap-2">
                <span class="material-symbols-outlined text-2xl text-[#725e00] shrink-0" style="font-variation-settings: 'FILL' 1;">
                  {{ opt.icon || 'help' }}
                </span>
                <select
                  v-model="opt.icon"
                  class="w-full px-2.5 py-2 rounded-xl border-2 border-[#d0c6ad] bg-white text-xs font-bold text-[#4d4633] outline-none cursor-pointer"
                >
                  <option v-for="icon in iconPresets" :key="icon.val" :value="icon.val">
                    {{ icon.label }} ({{ icon.val }})
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Action Footer -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#f5eddd]">
          <button
            type="button"
            @click="showModal = false"
            class="px-5 py-2.5 rounded-xl font-bold border-2 border-[#d0c6ad] text-[#7e7761] hover:bg-[#f5eddd] transition-all font-display text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            @click="saveQuestionForm"
            class="px-6 py-2.5 rounded-xl font-black bg-[#ffd93d] text-[#725e00] border-2 border-[#705d00] shadow-[0px_4px_0px_0px_#705d00] hover:scale-105 active:translate-y-1 active:shadow-none transition-all font-display text-sm select-none"
          >
            {{ isEditing ? 'Simpan Perubahan' : 'Tambah Soal' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form Ganti Logo Stage -->
    <div
      v-if="showStageIconModal"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-3xl border-4 border-[#005db8] shadow-2xl max-w-xl w-full p-6 md:p-8 flex flex-col gap-6 animate-pop-in">
        <div class="flex items-center justify-between border-b pb-4 border-[#f5eddd]">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-3xl text-[#005db8]" style="font-variation-settings: 'FILL' 1;">
              image
            </span>
            <h2 class="text-xl md:text-2xl font-extrabold text-[#005db8] font-display">
              Pilih Logo / Icon Stage {{ selectedStage }}
            </h2>
          </div>
          <button @click="showStageIconModal = false" class="text-[#7e7761] hover:text-black p-1 rounded-full hover:bg-[#f5eddd]">
            <span class="material-symbols-outlined text-2xl font-bold">close</span>
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
          <button
            v-for="icon in iconPresets"
            :key="icon.val"
            @click="selectStageIcon(icon.val)"
            :class="[
              getStageIcon(selectedStage) === icon.val
                ? 'bg-[#005db8] text-white border-[#002e60] shadow-md scale-105'
                : 'bg-[#fff8ef] text-[#4d4633] border-[#d0c6ad] hover:bg-white'
            ]"
            class="p-3 rounded-2xl border-2 font-bold flex flex-col items-center justify-center gap-2 transition-all font-display cursor-pointer"
          >
            <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">
              {{ icon.val }}
            </span>
            <span class="text-xs text-center font-bold">{{ icon.label }}</span>
          </button>
        </div>

        <div class="flex justify-end pt-2">
          <button
            @click="showStageIconModal = false"
            class="px-6 py-2.5 rounded-xl font-black bg-[#ffd93d] text-[#725e00] border-2 border-[#705d00] shadow-[0px_4px_0px_0px_#705d00] hover:scale-105 active:translate-y-1 active:shadow-none transition-all font-display text-sm select-none"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore, type Question, type Option } from '~/composables/useGameStore';

const store = useGameStore();

useHead({
  title: 'Input & Kelola Soal - QuizQuest Adventure',
  meta: [
    { name: 'description', content: 'Kelola soal kuis stage 1-5 dan atur petak jawaban benar.' }
  ]
});

const selectedStage = ref<number>(1);
const showModal = ref(false);
const showStageIconModal = ref(false);
const isEditing = ref(false);
const editingIdx = ref<number>(-1);

// Preset Material Symbols icons for quick choice
const iconPresets = [
  { val: 'pets', label: 'Hewan / Pet' },
  { val: 'category', label: 'Bentuk / Geometri' },
  { val: 'nutrition', label: 'Makanan / Gizi' },
  { val: 'park', label: 'Hutan / Taman' },
  { val: 'crown', label: 'Mahkota / Final' },
  { val: 'waves', label: 'Gelombang Laut' },
  { val: 'eco', label: 'Daun / Alam' },
  { val: 'flight', label: 'Burung / Terbang' },
  { val: 'water', label: 'Air' },
  { val: 'nature', label: 'Pohon / Alam' },
  { val: 'crop_square', label: 'Persegi / Kotak' },
  { val: 'fiber_manual_record', label: 'Lingkaran' },
  { val: 'change_history', label: 'Segitiga' },
  { val: 'grade', label: 'Bintang' },
  { val: 'diamond', label: 'Berlian' },
  { val: 'apple', label: 'Apel' },
  { val: 'grass', label: 'Rumput' },
  { val: 'filter_hdr', label: 'Gunung' },
  { val: 'grain', label: 'Anggur / Biji' },
  { val: 'landscape', label: 'Batu / Pemandangan' },
  { val: 'water_drop', label: 'Tetes Air' },
  { val: 'light_mode', label: 'Matahari' },
  { val: 'dark_mode', label: 'Bulan' },
  { val: 'auto_awesome', label: 'Kilau' },
  { val: 'circle', label: 'Bulatan' },
  { val: 'forest', label: 'Jamur / Hutan' },
  { val: 'rocket_launch', label: 'Roket' },
  { val: 'castle', label: 'Kastil / Istana' },
  { val: 'sports_esports', label: 'Game / Mainan' },
  { val: 'music_note', label: 'Musik / Nada' }
];

// Form state
const form = ref<{
  prompt: string;
  correctIndex: number;
  options: Array<{ text: string; icon: string }>;
}>({
  prompt: '',
  correctIndex: 0,
  options: [
    { text: '', icon: 'waves' },
    { text: '', icon: 'pets' },
    { text: '', icon: 'eco' },
    { text: '', icon: 'flight' }
  ]
});

const currentStageQuestions = computed<Question[]>(() => {
  return store.state.questionsByStage[selectedStage.value] || [];
});

const getStageIcon = (stageNum: number) => {
  return store.getStageIcon(stageNum);
};

const selectStageIcon = (iconVal: string) => {
  store.updateStageIcon(selectedStage.value, iconVal);
};

const getQuestionsCount = (stageNum: number) => {
  return store.state.questionsByStage[stageNum]?.length || 0;
};

const openAddModal = () => {
  isEditing.value = false;
  editingIdx.value = -1;
  form.value = {
    prompt: '',
    correctIndex: 0,
    options: [
      { text: '', icon: 'waves' },
      { text: '', icon: 'pets' },
      { text: '', icon: 'eco' },
      { text: '', icon: 'flight' }
    ]
  };
  showModal.value = true;
};

const openEditModal = (idx: number) => {
  const targetQ = currentStageQuestions.value[idx];
  if (!targetQ) return;

  isEditing.value = true;
  editingIdx.value = idx;

  const correctIdx = targetQ.options.findIndex(o => o.isCorrect);

  form.value = {
    prompt: targetQ.prompt,
    correctIndex: correctIdx >= 0 ? correctIdx : 0,
    options: targetQ.options.map(o => ({
      text: o.text,
      icon: o.icon || 'help'
    }))
  };

  showModal.value = true;
};

const saveQuestionForm = () => {
  if (!form.value.prompt.trim()) {
    alert('Harap isi teks pertanyaan!');
    return;
  }

  for (let i = 0; i < 4; i++) {
    if (!form.value.options[i].text.trim()) {
      alert(`Harap isi teks pilihan jawaban ke-${i + 1}!`);
      return;
    }
  }

  const constructedOptions: Option[] = form.value.options.map((opt, i) => ({
    text: opt.text.trim(),
    icon: opt.icon || 'help',
    isCorrect: i === form.value.correctIndex
  }));

  const newQuestion: Question = {
    prompt: form.value.prompt.trim(),
    options: constructedOptions
  };

  if (isEditing.value && editingIdx.value >= 0) {
    store.updateQuestion(selectedStage.value, editingIdx.value, newQuestion);
  } else {
    store.addQuestion(selectedStage.value, newQuestion);
  }

  showModal.value = false;
};

const deleteQuestionItem = (idx: number) => {
  if (confirm(`Apakah Anda yakin ingin menghapus soal #${idx + 1} di Stage ${selectedStage.value}?`)) {
    store.deleteQuestion(selectedStage.value, idx);
  }
};

const availableStages = computed<number[]>(() => {
  const keys = Object.keys(store.state.questionsByStage).map(Number);
  return keys.sort((a, b) => a - b);
});

const handleAddNewStage = () => {
  const newStageNum = store.addStage();
  selectedStage.value = newStageNum;
};

const handleDeleteStage = (stageNum: number) => {
  if (confirm(`Apakah Anda yakin ingin menghapus Stage ${stageNum} dan seluruh soal di dalamnya?`)) {
    store.deleteStage(stageNum);
    if (!store.state.questionsByStage[selectedStage.value]) {
      const remaining = Object.keys(store.state.questionsByStage).map(Number).sort((a, b) => a - b);
      selectedStage.value = remaining[0] || 1;
    }
  }
};
</script>

<style scoped>
.font-display {
  font-family: 'Quicksand', sans-serif;
}
</style>
