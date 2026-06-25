let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

// HTML5 audio elements for real audio streams
let htmlAudio: HTMLAudioElement | null = null;
let onAudioEndedCallback: (() => void) | null = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function playAudioStream(url: string, onEnded?: () => void) {
  try {
    stopSynthTone();
    
    // Check if we are just resuming the same track
    if (htmlAudio && (htmlAudio.src === url || htmlAudio.src === encodeURI(url))) {
      htmlAudio.play().catch(err => {
        console.warn("Autoplay was blocked or audio error", err);
      });
      return;
    }
    
    if (htmlAudio) {
      htmlAudio.pause();
      htmlAudio.src = "";
    }
    
    htmlAudio = new Audio(url);
    
    if (onEnded) {
      onAudioEndedCallback = onEnded;
      htmlAudio.addEventListener("ended", onAudioEndedCallback);
      htmlAudio.addEventListener("error", (e) => {
        console.error("Audio stream error (CORS/expired URL?):", e);
      });
    }
    
    htmlAudio.play().catch(err => {
      console.warn("Autoplay was blocked or audio error", err);
    });
  } catch (e) {
    console.error("HTML Audio play error", e);
  }
}

export function setAudioVolume(volume: number) {
  // volume is 0 to 1
  if (htmlAudio) {
    htmlAudio.volume = volume;
  }
}

export function seekAudio(seconds: number) {
  if (htmlAudio && isFinite(seconds)) {
    htmlAudio.currentTime = seconds;
  }
}

export function getAudioCurrentTime(): number {
  return htmlAudio ? htmlAudio.currentTime : 0;
}

export function playSynthTone(frequencyStr: string | undefined, onEnded?: () => void) {
  // If the audio URL is actually a full link (HTTP/HTTPS), run playAudioStream instead!
  if (frequencyStr && (frequencyStr.startsWith("http://") || frequencyStr.startsWith("https://"))) {
    playAudioStream(frequencyStr, onEnded);
    return;
  }

  try {
    if (htmlAudio) {
      htmlAudio.pause();
    }
    initAudio();
    if (!audioCtx) return;

    // Stop existing oscillator first
    stopSynthTone();

    const freq = parseFloat(frequencyStr || "220");
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    // Warm retro triangle or sine wave
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Filter to make it warmer
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    // Envelope for soft entry
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.15); // soft warm volume

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    
    // Simulate ended event for synth beep (e.g. after 3 seconds)
    if (onEnded) {
      setTimeout(() => {
        if (oscillator) {
          onEnded();
        }
      }, 3000);
    }
  } catch (e) {
    console.warn("Web Audio is restricted or unsupported", e);
  }
}

export function stopSynthTone() {
  if (htmlAudio) {
    htmlAudio.pause();
  }
  try {
    if (gainNode && audioCtx) {
      // Fade out to avoid clicks
      const currTime = audioCtx.currentTime;
      gainNode.gain.cancelScheduledValues(currTime);
      gainNode.gain.setValueAtTime(gainNode.gain.value, currTime);
      gainNode.gain.linearRampToValueAtTime(0, currTime + 0.1);
      
      const oscToStop = oscillator;
      setTimeout(() => {
        try {
          if (oscToStop) {
            oscToStop.stop();
          }
        } catch (e) {}
      }, 150);
    }
  } catch (e) {}
  oscillator = null;
  gainNode = null;
}

export function updateSynthFrequency(frequencyStr: string | undefined) {
  if (frequencyStr && (frequencyStr.startsWith("http://") || frequencyStr.startsWith("https://"))) {
    return; // Streams don't update via synth frequency sweep
  }
  if (oscillator && audioCtx) {
    const freq = parseFloat(frequencyStr || "220");
    oscillator.frequency.exponentialRampToValueAtTime(freq, audioCtx.currentTime + 0.3);
  }
}
