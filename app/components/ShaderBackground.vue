<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <canvas ref="canvasRef" class="block w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId = 0;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  function syncSize() {
    if (!canvas) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
  }
  syncSize();

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vs = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fs = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;

    void main() {
      vec2 uv = v_texCoord;
      
      // Create a playful, flowing sky background
      vec3 color1 = vec3(0.5, 0.8, 1.0); // Sky blue
      vec3 color2 = vec3(0.8, 0.95, 1.0); // Very light blue
      
      float wave = sin(uv.x * 3.0 + u_time * 0.5) * 0.1;
      wave += sin(uv.y * 2.0 - u_time * 0.3) * 0.05;
      
      float mixFactor = smoothstep(0.2, 0.8, uv.y + wave);
      vec3 finalColor = mix(color1, color2, mixFactor);
      
      // Add some subtle sparkles
      float sparkle = pow(fract(sin(dot(uv * u_time, vec2(12.9898, 78.233))) * 43758.5453), 20.0);
      finalColor += sparkle * 0.3;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  function compileShader(type: number, src: string) {
    const s = gl!.createShader(type);
    if (!s) return null;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
      console.error(gl!.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
  if (!vertexShader || !fragmentShader) return;

  const prog = gl.createProgram();
  if (!prog) return;
  gl.attachShader(prog, vertexShader);
  gl.attachShader(prog, fragmentShader);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return;
  }

  gl.useProgram(prog);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
  const onMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width && rect.height) {
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas.width;
      mouse.y = ny * canvas.height;
    }
  };

  window.addEventListener('mousemove', onMouseMove);

  function render(t: number) {
    if (!gl || !canvas) return;
    syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrameId = requestAnimationFrame(render);
  }

  render(0);

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
    cancelAnimationFrame(animationFrameId);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    // Clean up WebGL resources
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  });
});
</script>
