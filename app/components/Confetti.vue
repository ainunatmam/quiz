<template>
  <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div
      v-for="(piece, index) in confettiPieces"
      :key="index"
      class="confetti-piece"
      :style="{
        left: piece.left,
        animationDuration: piece.duration,
        animationDelay: piece.delay,
        backgroundColor: piece.color,
        transform: `rotate(${piece.rotate}deg)`
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface ConfettiPiece {
  left: string;
  duration: string;
  delay: string;
  color: string;
  rotate: number;
}

const colors = ['#ffd93d', '#4c96fe', '#8ff199', '#ffdad6'];
const confettiPieces = ref<ConfettiPiece[]>([]);

// Generate 50 confetti pieces with randomized styles
for (let i = 0; i < 60; i++) {
  confettiPieces.value.push({
    left: Math.random() * 100 + 'vw',
    duration: (Math.random() * 3 + 2.5) + 's',
    delay: (Math.random() * 2.5) + 's',
    color: colors[Math.floor(Math.random() * colors.length)],
    rotate: Math.floor(Math.random() * 360)
  });
}
</script>
