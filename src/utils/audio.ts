/**
 * Synthesizes vintage book audio effects via Web Audio API.
 * 100% self-contained, lightweight, and zero external network requests.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

// Cached shared buffers to eliminate GC churn and synchronous allocation loops
let sharedNoiseBuffer: AudioBuffer | null = null;
let sharedSnapBuffer: AudioBuffer | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function getSharedNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!sharedNoiseBuffer || sharedNoiseBuffer.sampleRate !== ctx.sampleRate) {
    const bufferSize = Math.floor(ctx.sampleRate * 1.5);
    sharedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = sharedNoiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.85;
    }
  }
  return sharedNoiseBuffer;
}

function getSharedSnapBuffer(ctx: AudioContext): AudioBuffer {
  if (!sharedSnapBuffer || sharedSnapBuffer.sampleRate !== ctx.sampleRate) {
    const snapDuration = 0.05;
    const snapBufferSize = Math.floor(ctx.sampleRate * snapDuration);
    sharedSnapBuffer = ctx.createBuffer(1, snapBufferSize, ctx.sampleRate);
    const snapData = sharedSnapBuffer.getChannelData(0);
    for (let i = 0; i < snapBufferSize; i++) {
      const decay = Math.exp(-i / (snapBufferSize * 0.28));
      snapData[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  return sharedSnapBuffer;
}

export function toggleAudioMute(): boolean {
  isAudioMuted = !isAudioMuted;
  return isAudioMuted;
}

export function getAudioMuted(): boolean {
  return isAudioMuted;
}

/**
 * Realistic dry parchment page-turn sound with tactile binding release 'snap'
 * transient and smooth layered fluttering aerodynamic envelope.
 */
export function playPageFlipSound(snapFactor = 0.7): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.58 + snapFactor * 0.08;

    // 1. Tactile Binding Release 'Snap' Transient (from cached buffer)
    const snapSource = ctx.createBufferSource();
    snapSource.buffer = getSharedSnapBuffer(ctx);

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(2400 + snapFactor * 800, now);
    snapFilter.Q.setValueAtTime(2.2, now);

    const snapGain = ctx.createGain();
    const snapVol = 0.12 * snapFactor;
    snapGain.gain.setValueAtTime(snapVol, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    snapSource.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapSource.start(now);
    snapSource.stop(now + 0.05);

    // 2. Paper flutter (from cached shared noise buffer)
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = getSharedNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600 + snapFactor * 300, now);
    filter.frequency.exponentialRampToValueAtTime(1050, now + duration * 0.35);
    filter.frequency.exponentialRampToValueAtTime(550, now + duration * 0.75);
    filter.frequency.exponentialRampToValueAtTime(320, now + duration);
    filter.Q.setValueAtTime(1.4, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.18 + snapFactor * 0.05, now + 0.06);
    gainNode.gain.linearRampToValueAtTime(0.12, now + duration * 0.45);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch {
    // Graceful fallback
  }
}

/**
 * Heavy antique leather hardcover opening / closing resonant thud and creak.
 */
export function playBookOpenSound(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Low resonant thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.45);

    oscGain.gain.setValueAtTime(0.24, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);

    // Paper flutter layered on top
    setTimeout(() => {
      playPageFlipSound();
    }, 120);
  } catch {
    // Graceful fallback
  }
}

export function playBookCloseSound(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);

    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Graceful fallback
  }
}

/**
 * Ink quill scratch sound when signing or adding a margin note.
 */
export function playQuillSound(): void {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.16;

    const noise = ctx.createBufferSource();
    noise.buffer = getSharedNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2800, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  } catch {
    // Graceful fallback
  }
}
