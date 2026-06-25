import React, { useState, useEffect } from "react";

interface WaveformVisualizerProps {
  isPlaying: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ isPlaying }) => {
  const [heights, setHeights] = useState<number[]>(new Array(30).fill(15));

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setHeights(
          Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 5)
        );
      }, 100);
    } else {
      // Fade down gently to a flat warm line
      setHeights(new Array(30).fill(8));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#1A1A1A] border border-border-tan rounded-lg p-4 font-mono select-none relative overflow-hidden brutalist-shadow">
      {/* Grid lines in the background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,184,154,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(200,184,154,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />

      {/* Threshold indicator lines */}
      <div className="absolute top-4 left-4 right-4 border-t border-dashed border-[#ff6b00]/20 flex justify-between">
        <span className="text-[7px] text-[#ff6b00]/60 -mt-2">PEAK +3dB</span>
        <span className="text-[7px] text-[#ff6b00]/60 -mt-2">LIMIT</span>
      </div>
      <div className="absolute top-1/2 left-4 right-4 border-t border-dashed border-gray-700 flex justify-between">
        <span className="text-[7px] text-gray-500/80 -mt-2">UNITY 0dB</span>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {/* Header telemetry details */}
        <div className="flex items-center justify-between text-[8px] text-gray-400 font-bold tracking-widest uppercase">
          <span>CH1_ANALOG_OUT</span>
          <span className="text-[#ff6b00]">
            {isPlaying ? "ACTIVE SIGNAL // 24-BIT LOSSLESS" : "NO_SIGNAL // STANDBY"}
          </span>
          <span>44.1 kHz</span>
        </div>

        {/* Bouncing Bars */}
        <div className="flex items-end justify-between h-16 pt-4 gap-[2px]">
          {heights.map((h, idx) => {
            // Determine gradient colors based on frequency index or height
            let color = "bg-[#C8B89A]"; // default tan
            if (isPlaying) {
              if (h > 40) {
                color = "bg-primary"; // Red-orange at peak
              } else if (h > 20) {
                color = "bg-[#a04100]"; // Deep orange
              } else {
                color = "bg-border-tan"; // Warm beige
              }
            }

            return (
              <div
                key={idx}
                className={`w-full transition-all duration-100 ease-out rounded-t-xs`}
                style={{
                  height: `${h}px`,
                  backgroundColor: isPlaying && h > 40 ? '#9c3f00' : isPlaying && h > 20 ? '#C8B89A' : '#e2d9c5'
                }}
              />
            );
          })}
        </div>

        {/* Frequencies markings footer */}
        <div className="flex justify-between text-[7px] text-gray-500 font-bold tracking-widest px-1">
          <span>20 Hz</span>
          <span>500 Hz</span>
          <span>1 kHz</span>
          <span>5 kHz</span>
          <span>20 kHz</span>
        </div>
      </div>
    </div>
  );
};
