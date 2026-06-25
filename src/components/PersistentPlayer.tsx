import React, { useState, useEffect } from "react";
import { Track } from "../types";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  ListMusic, 
  AlignLeft,
  X,
  VolumeX,
  Sparkles
} from "lucide-react";
import { seekAudio, setAudioVolume, getAudioCurrentTime } from "../utils/audio";

interface PersistentPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  togglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  queue: Track[];
  removeFromQueue: (idx: number) => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  isRepeat: boolean;
  toggleRepeat: () => void;
}

export const PersistentPlayer: React.FC<PersistentPlayerProps> = ({
  currentTrack,
  isPlaying,
  togglePlay,
  onNext,
  onPrev,
  queue,
  removeFromQueue,
  isShuffle,
  toggleShuffle,
  isRepeat,
  toggleRepeat
}) => {
  // Progress tracker state
  const [progressSecs, setProgressSecs] = useState<number>(0);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Parse duration ("04:12" -> 252 secs)
  const durationParts = (currentTrack?.duration || "00:00").split(":");
  const totalSecs = (parseInt(durationParts[0], 10) || 0) * 60 + (parseInt(durationParts[1], 10) || 0);

  // Sync volume with audio engine
  useEffect(() => {
    setAudioVolume(isMuted ? 0 : volume / 100);
  }, [volume, isMuted]);

  // Timer simulation and stream synchronization
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentTrack.audioUrl && (currentTrack.audioUrl.startsWith("http://") || currentTrack.audioUrl.startsWith("https://"))) {
          const current = Math.floor(getAudioCurrentTime());
          setProgressSecs(current);
          if (current >= totalSecs && totalSecs > 0) {
            if (isRepeat) {
              seekAudio(0);
            } else {
              onNext();
            }
          }
        } else {
          setProgressSecs((prev) => {
            if (prev >= totalSecs) {
              if (isRepeat) {
                return 0; // restart
              } else {
                onNext(); // autoplay next
                return 0;
              }
            }
            return prev + 1;
          });
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSecs, isRepeat, onNext, currentTrack]);

  // Reset progress when track changes
  useEffect(() => {
    setProgressSecs(0);
  }, [currentTrack]);

  // Seconds formatter helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (totalSecs === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const targetSeconds = Math.floor(clickPercent * totalSecs);
    setProgressSecs(targetSeconds);
    seekAudio(targetSeconds);
  };


  // Mock Lyrics DB
  const LYRICS_DATA: Record<string, string[]> = {
    "track-1": [
      "[00:05] Driving through the neon glow...",
      "[00:20] Fading signals on the radio",
      "[00:35] Synthetic echoes call your name",
      "[00:50] Gridlocked dreams, we play the game",
      "[01:10] Analog heart beats on and on",
      "[01:25] Lost inside the retro dawn",
      "[01:40] (Arpeggiator Solo)"
    ],
    "track-2": [
      "[00:05] (Warm tape hiss entry)",
      "[00:15] Saxophone speaks under streetlamp lights",
      "[00:30] Raindrops tap on the glass tonight",
      "[00:45] Smooth blue chords drifting in the breeze",
      "[01:00] Floating between the shadowed trees",
      "[01:20] Chill groove slows down time..."
    ],
    "track-3": [
      "[00:10] Dust from the tape, echo in space",
      "[00:30] Staring at a slow moving face",
      "[00:50] Static bloom, flower of wire",
      "[01:10] Warm tubes burning like golden fire..."
    ],
    "track-4": [
      "[00:05] Just blank canvas in an empty room",
      "[00:25] Minimalist grids, silent loom",
      "[00:45] Zero signal, white space defined",
      "[01:05] Clean frequencies for the mind"
    ]
  };

  const trackLyrics = LYRICS_DATA[currentTrack.id] || [
    "(No transcript available for this high-fidelity selection)",
    "Enjoy the ambient micro-grooves and warm tube acoustics..."
  ];

  return (
    <div className="w-full bg-[#1A1A1A] text-[#fff9ef] border-t-2 border-border-tan h-20 px-4 md:px-6 flex items-center justify-between font-mono relative select-none z-40">
      {/* Top absolute progress bar for mobile */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 md:hidden">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${(progressSecs / totalSecs) * 100}%` }}
        />
      </div>

      {/* Track info panel */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 md:w-72 min-w-0">
        <div className="relative group w-10 h-10 md:w-12 md:h-12 rounded border border-border-tan overflow-hidden flex-shrink-0">
          <img 
            src={currentTrack.coverUrl} 
            alt="Track Cover" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold truncate tracking-wide text-[#fff9ef]">{currentTrack.title}</h5>
          <span className="text-[10px] text-gray-400 block truncate font-medium uppercase tracking-tighter">
            {currentTrack.artist}
          </span>
        </div>
      </div>

      {/* Playback Controls & Progress Bar (Desktop only) */}
      <div className="hidden md:flex flex-1 max-w-xl flex-col items-center gap-1.5 mx-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleShuffle}
            className={`p-1 hover:text-primary transition-colors cursor-pointer ${isShuffle ? "text-primary" : "text-gray-400"}`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={onPrev}
            className="p-1 hover:text-[#fff9ef] text-gray-400 transition-colors cursor-pointer"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded bg-[#fff9ef] text-[#1A1A1A] border border-border-tan flex items-center justify-center hover:bg-primary hover:text-[#fff9ef] transition-colors shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button 
            onClick={onNext}
            className="p-1 hover:text-[#fff9ef] text-gray-400 transition-colors cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleRepeat}
            className={`p-1 hover:text-primary transition-colors cursor-pointer ${isRepeat ? "text-primary" : "text-gray-400"}`}
            title="Toggle Repeat"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Progress */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[9px] text-gray-400 font-bold w-10 text-right">{formatTime(progressSecs)}</span>
          
          <div 
            onClick={handleTimelineClick}
            className="flex-1 relative h-1.5 bg-gray-800 border border-gray-700 rounded-sm flex items-center cursor-pointer"
          >
            <div 
              className="h-full bg-primary"
              style={{ width: `${(progressSecs / totalSecs) * 100}%` }}
            />
            {/* Slider knob */}
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-[#fff9ef] border border-border-tan shadow -ml-1.5 cursor-grab"
              style={{ left: `${(progressSecs / totalSecs) * 100}%` }}
            />
          </div>

          <span className="text-[9px] text-gray-400 font-bold w-10 text-left">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Mobile Playback Controls */}
      <div className="flex md:hidden items-center gap-3 flex-shrink-0">
        <button 
          onClick={onPrev}
          className="p-1 text-gray-400 hover:text-[#fff9ef] transition-colors"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-8 h-8 rounded bg-[#fff9ef] text-[#1A1A1A] flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <button 
          onClick={onNext}
          className="p-1 text-gray-400 hover:text-[#fff9ef] transition-colors"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Volume & Auxiliary panel */}
      <div className="hidden md:flex items-center justify-end gap-4 w-72">
        {/* Interactive Volume */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-primary transition-colors p-1"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="relative w-20 h-1 bg-gray-800 rounded flex items-center">
            <input 
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            <div 
              className="h-full bg-border-tan"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
            <div 
              className="absolute w-3 h-3 rounded-full bg-[#fff9ef] border border-border-tan shadow -ml-1.5"
              style={{ left: `${isMuted ? 0 : volume}%` }}
            />
          </div>
        </div>

        {/* Layout Transcripts / Queue Popovers */}
        <div className="flex items-center gap-2 border-l border-gray-800 pl-3">
          <button 
            onClick={() => {
              setShowLyrics(!showLyrics);
              setShowQueue(false);
            }}
            className={`p-1.5 rounded transition-all border ${
              showLyrics 
                ? "bg-primary text-white border-primary" 
                : "bg-transparent text-gray-400 border-transparent hover:border-gray-800 hover:text-[#fff9ef]"
            }`}
            title="Scrolled Lyrics"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button 
            onClick={() => {
              setShowQueue(!showQueue);
              setShowLyrics(false);
            }}
            className={`p-1.5 rounded transition-all border relative ${
              showQueue 
                ? "bg-primary text-white border-primary" 
                : "bg-transparent text-gray-400 border-transparent hover:border-gray-800 hover:text-[#fff9ef]"
            }`}
            title="Music Queue"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-border-tan">
                {queue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Queue Drawer overlay (floating brutalist card) */}
      {showQueue && (
        <div className="absolute bottom-24 right-6 w-80 bg-surface text-text-charcoal border-2 border-[#1A1A1A] brutalist-shadow rounded p-4 font-mono z-50">
          <div className="flex items-center justify-between border-b border-border-tan pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <ListMusic className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider">UPCOMING_QUEUE</h4>
            </div>
            <button onClick={() => setShowQueue(false)} className="text-gray-400 hover:text-text-charcoal">
              <X className="w-4 h-4" />
            </button>
          </div>

          {queue.length === 0 ? (
            <div className="text-center py-6 text-[10px] text-gray-400">
              QUEUE_EMPTY
              <span className="block mt-1">Add tracks from the catalog explorer</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-hide">
              {queue.map((track, idx) => (
                <div 
                  key={`${track.id}-${idx}`}
                  className="flex items-center gap-2 p-1.5 border border-border-tan hover:bg-surface-container rounded transition-colors"
                >
                  <img 
                    src={track.coverUrl} 
                    alt="Cover" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 object-cover rounded-sm border border-border-tan"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="text-[10px] font-bold truncate leading-tight text-text-charcoal">{track.title}</h6>
                    <span className="text-[8px] text-gray-500 block truncate">{track.artist}</span>
                  </div>
                  <button 
                    onClick={() => removeFromQueue(idx)}
                    className="text-[9px] font-bold text-red-600 hover:bg-red-50 px-1.5 py-0.5 rounded border border-red-200"
                  >
                    DEL
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lyrics teleprompter overlay */}
      {showLyrics && (
        <div className="absolute bottom-24 right-20 w-80 bg-[#1A1A1A] border-2 border-border-tan rounded-lg p-4 font-mono z-50 text-[#fff9ef] brutalist-shadow">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider">SCROLLING_LYRICS</h4>
            </div>
            <button onClick={() => setShowLyrics(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto scrollbar-hide text-[11px] leading-relaxed py-2">
            <span className="text-[9px] text-primary font-bold tracking-widest uppercase">
              {currentTrack.title}
            </span>
            {trackLyrics.map((line, idx) => {
              const isFirst = idx === 0;
              return (
                <p 
                  key={idx} 
                  className={`transition-colors duration-300 ${isFirst ? "text-primary font-bold border-l-2 border-primary pl-2" : "text-gray-400"}`}
                >
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
