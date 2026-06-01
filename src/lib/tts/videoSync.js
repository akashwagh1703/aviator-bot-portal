/**
 * Audio-master video sync for talking-head avatars.
 *
 * Video stays paused; frames are scrubbed from the TTS audio clock. The talk
 * segment is time-warped over `cycleSec` so mouth motion matches speech pace
 * (pre-recorded clip length ≠ TTS speed).
 */

let videoEl = null;
let segments = { idle: [0, 2.5], talk: [3.2, 9.5], cycleSec: 4.2 };
let syncRaf = null;
let syncCleanup = null;
let syncActive = false;
let masterAudio = null;

const DEFAULT_CYCLE_SEC = 4.2;

function talkRange() {
  const [start, end] = segments.talk ?? [0, 0];
  const len = Math.max(0.05, end - start);
  return { start, end, len };
}

function cycleSeconds() {
  return segments.cycleSec ?? DEFAULT_CYCLE_SEC;
}

function whenReady(el) {
  if (el.readyState >= 2) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    el.addEventListener("canplay", done, { once: true });
    el.addEventListener("error", done, { once: true });
  });
}

function seekTo(time) {
  const el = videoEl;
  if (!el) return Promise.resolve();
  if (Math.abs(el.currentTime - time) < 0.025) return Promise.resolve();
  return Promise.race([
    new Promise((resolve) => {
      el.addEventListener("seeked", resolve, { once: true });
      el.currentTime = time;
    }),
    new Promise((resolve) => setTimeout(resolve, 300)),
  ]);
}

function cancelSyncLoop() {
  if (syncRaf) cancelAnimationFrame(syncRaf);
  syncRaf = null;
}

function teardownSync() {
  cancelSyncLoop();
  if (syncCleanup) {
    syncCleanup();
    syncCleanup = null;
  }
  syncActive = false;
  masterAudio = null;
}

/** Map TTS elapsed seconds → talk segment position (one full mouth cycle per cycleSec). */
function scrubToElapsed(elapsedSec) {
  const el = videoEl;
  if (!el) return;
  const { start, len } = talkRange();
  const cycle = cycleSeconds();
  const progress = (Math.max(0, elapsedSec) % cycle) / cycle;
  const target = start + progress * len;
  if (Math.abs(el.currentTime - target) > 0.02) {
    el.currentTime = target;
  }
}

function bindAudioMasterSync(audio) {
  teardownSync();
  syncActive = true;
  masterAudio = audio;

  const syncNow = () => {
    if (!syncActive || !videoEl) return;
    scrubToElapsed(audio.currentTime);
  };

  const tick = () => {
    if (!syncActive || !videoEl) return;
    if (audio.paused || audio.ended) return;
    syncNow();
    syncRaf = requestAnimationFrame(tick);
  };

  const onPlay = () => {
    syncNow();
    cancelSyncLoop();
    syncRaf = requestAnimationFrame(tick);
  };

  audio.addEventListener("play", onPlay);
  audio.addEventListener("timeupdate", syncNow);

  syncCleanup = () => {
    audio.removeEventListener("play", onPlay);
    audio.removeEventListener("timeupdate", syncNow);
  };

  if (!audio.paused) onPlay();
}

export function bindWallClockSync() {
  teardownSync();
  syncActive = true;
  const t0 = performance.now();

  const tick = () => {
    if (!syncActive || !videoEl) return;
    scrubToElapsed((performance.now() - t0) / 1000);
    syncRaf = requestAnimationFrame(tick);
  };

  syncRaf = requestAnimationFrame(tick);
  syncCleanup = cancelSyncLoop;
}

export function isSyncActive() {
  return syncActive;
}

export function registerAvatarVideo(el, segs) {
  if (!el) return;
  unregisterAvatarVideo(el);
  videoEl = el;
  if (segs) segments = { ...segments, ...segs };
  void warmTalkSegment();
}

export function unregisterAvatarVideo(el) {
  if (el && videoEl !== el) return;
  teardownSync();
  videoEl = null;
}

export function updateAvatarSegments(segs) {
  if (segs) segments = { ...segments, ...segs };
}

export async function warmTalkSegment() {
  const el = videoEl;
  if (!el) return;
  await whenReady(el);
  el.pause();
  await seekTo(talkRange().start);
}

export async function warmIdleFrame() {
  const el = videoEl;
  if (!el) return;
  await whenReady(el);
  el.pause();
  await seekTo(segments.idle?.[0] ?? 0);
}

export async function startSyncedPlayback(audio) {
  if (videoEl) {
    await warmTalkSegment();
    scrubToElapsed(0);
  }

  bindAudioMasterSync(audio);

  try {
    await audio.play();
    scrubToElapsed(audio.currentTime);
    return true;
  } catch {
    teardownSync();
    return false;
  }
}

export function stopSyncedPlayback() {
  teardownSync();
  void warmIdleFrame();
}

export async function startBrowserTalkSync() {
  await warmTalkSegment();
  scrubToElapsed(0);
  bindWallClockSync();
}

export function stopAvatarTalkVideo() {
  stopSyncedPlayback();
}
