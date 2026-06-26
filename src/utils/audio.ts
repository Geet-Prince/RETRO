let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let analyser: AnalyserNode | null = null;

// HTML5 audio elements for real audio streams
let htmlAudio: HTMLAudioElement | null = null;
let onAudioEndedCallback: (() => void) | null = null;

// Global playhead tracking for synth tones
let synthPlayhead = 0;
let synthPlayheadInterval: NodeJS.Timeout | null = null;
let lastSource: string | undefined = undefined;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function connectAudioSource(audioElement: HTMLAudioElement) {
  try {
    initAudio();
    if (!audioCtx) return;
    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
    }
    const source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  } catch (e) {
    console.warn("Failed to connect HTML Audio to Web Audio API (CORS/Node limit):", e);
  }
}

let simPhase = 0;
function getSimulatedAnalyserData() {
  const playing = htmlAudio ? !htmlAudio.paused : false;
  if (!playing) {
    simPhase += 0.005;
    return {
      bass: 0.05 + Math.sin(simPhase) * 0.02,
      mid: 0.03 + Math.cos(simPhase * 1.5) * 0.01,
      treble: 0.02 + Math.sin(simPhase * 2.2) * 0.01
    };
  }
  simPhase += 0.03;
  const beat = Math.pow(Math.sin(simPhase * 0.8), 4);
  return {
    bass: 0.15 + beat * 0.45 + Math.sin(simPhase * 2.3) * 0.1,
    mid: 0.12 + Math.sin(simPhase * 1.7) * 0.15 + Math.cos(simPhase * 3.1) * 0.08,
    treble: 0.08 + Math.cos(simPhase * 4.5) * 0.12 + Math.sin(simPhase * 2.9) * 0.06
  };
}

export function getAnalyserData() {
  if (!audioCtx || !analyser) {
    return getSimulatedAnalyserData();
  }
  try {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    for (let i = 0; i < 8; i++) bassSum += dataArray[i];
    for (let i = 8; i < 35; i++) midSum += dataArray[i];
    for (let i = 35; i < 80; i++) trebleSum += dataArray[i];

    return {
      bass: (bassSum / 8) / 255,
      mid: (midSum / 27) / 255,
      treble: (trebleSum / 45) / 255
    };
  } catch (err) {
    return getSimulatedAnalyserData();
  }
}

export function playAudioStream(url: string, onEnded?: () => void) {
  try {
    const isResuming = (url === lastSource);
    lastSource = url;
    if (!isResuming) {
      synthPlayhead = 0;
    }

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
    htmlAudio.crossOrigin = "anonymous";
    connectAudioSource(htmlAudio);
    
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
  synthPlayhead = seconds;
}

export function getAudioCurrentTime(): number {
  if (htmlAudio && htmlAudio.src && (htmlAudio.src.startsWith("http://") || htmlAudio.src.startsWith("https://"))) {
    return htmlAudio.currentTime;
  }
  return synthPlayhead;
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

    // Reset or keep playhead
    const isResuming = (frequencyStr === lastSource);
    lastSource = frequencyStr;
    if (!isResuming) {
      synthPlayhead = 0;
    }

    // Stop existing oscillator first
    stopSynthTone();

    // Start synth playhead tracking interval
    synthPlayheadInterval = setInterval(() => {
      synthPlayhead += 1;
    }, 1000);

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
  if (synthPlayheadInterval) {
    clearInterval(synthPlayheadInterval);
    synthPlayheadInterval = null;
  }
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
