import React, { useState } from "react";
import { Track } from "../../types";
import { Heart, Play, Shuffle, ArrowUpDown, RefreshCw, Signal, Plus } from "lucide-react";

interface LikedMusicScreenProps {
  likedTrackIds: string[];
  allTracks: Track[];
  onPlayTrack: (track: Track) => void;
  onShuffleAll: () => void;
  onToggleLike: (track: Track) => void;
  onTriggerAddToPlaylist: (track: Track) => void;
}

export const LikedMusicScreen: React.FC<LikedMusicScreenProps> = ({
  likedTrackIds,
  allTracks,
  onPlayTrack,
  onShuffleAll,
  onToggleLike,
  onTriggerAddToPlaylist
}) => {
  const [sortOrder, setSortOrder] = useState<"recent" | "title">("recent");

  // Filter liked tracks
  const likedTracks = allTracks.filter((t) => likedTrackIds.includes(t.id));

  // Sort logic
  const sortedTracks = [...likedTracks];
  if (sortOrder === "title") {
    sortedTracks.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Get favorite genres based on liked tracks
  const genresCount: Record<string, number> = {};
  likedTracks.forEach((t) => {
    genresCount[t.genre] = (genresCount[t.genre] || 0) + 1;
  });
  const sortedGenres = Object.entries(genresCount)
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0]);

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-6 p-6 font-mono overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-tan pb-3">
        <div>
          <span className="text-[10px] text-primary font-bold tracking-widest block">SAVED_COLLECTIONS</span>
          <h2 className="text-lg font-bold text-text-charcoal flex items-center gap-2">
            LIKED MUSIC <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
          </h2>
        </div>
        <div className="text-right">
          <span className="text-[14px] font-bold text-primary block">{likedTracks.length} TRACKS</span>
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">ARCHIVE_VOLUME_SIZE</span>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container p-3 border border-border-tan rounded">
        <div className="flex items-center gap-2">
          <button 
            onClick={onShuffleAll}
            disabled={likedTracks.length === 0}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 hover:bg-opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>SHUFFLE ALL</span>
          </button>
          
          <div className="flex items-center gap-1 bg-surface border border-border-tan rounded px-2.5 py-1 text-[11px] font-bold text-text-charcoal">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span>SORT: </span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "recent" | "title")}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recent">RECENTLY_ADDED</option>
              <option value="title">ALPHABETICAL_A_Z</option>
            </select>
          </div>
        </div>

        <span className="text-[9px] text-gray-500 font-bold">MUTABILITY: SAFE_READ_WRITE</span>
      </div>

      {/* Multi-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Grid: Left 8 Columns */}
        <div className="lg:col-span-8">
          {sortedTracks.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border-tan bg-surface rounded-lg flex flex-col items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-gray-300" />
              <h4 className="text-xs font-bold text-text-charcoal">COLLECTION_CONTAINER_EMPTY</h4>
              <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">
                Explore the Discover archives or player selectors and tap the heart icon on any selection to save them to your active collection container.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedTracks.map((track) => (
                <div 
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className="group relative flex items-center p-3 bg-surface border border-border-tan rounded hover:border-primary transition-all brutalist-shadow cursor-pointer"
                >
                  {/* CD Jewel Case Mock */}
                  <div className="relative w-16 h-16 rounded border border-gray-400 bg-black overflow-hidden jewel-case flex-shrink-0 flex items-center justify-center mr-3">
                    <img 
                      src={track.coverUrl} 
                      alt="Cover" 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-xs"
                    />
                    <div className="absolute w-5 h-5 rounded-full bg-surface-container/60 cd-inner-ring border border-gray-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    </div>
                  </div>

                  {/* Text meta details */}
                  <div className="flex-1 min-w-0 pr-10">
                    <h4 className="text-xs font-bold text-text-charcoal truncate group-hover:text-primary transition-colors">
                      {track.title}
                    </h4>
                    <span className="text-[9px] text-gray-400 block truncate uppercase tracking-tighter mt-0.5">
                      {track.artist}
                    </span>
                    <span className="text-[8px] font-bold text-primary mt-1.5 inline-block bg-primary/5 px-1 py-0.2 rounded border border-primary/10">
                      {track.genre}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPlayTrack(track); }}
                      className="p-1 rounded bg-primary text-white hover:bg-opacity-90 transition-opacity hidden lg:block"
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTriggerAddToPlaylist(track); }}
                      className="p-1 rounded bg-surface border border-border-tan text-text-charcoal hover:bg-primary hover:text-white transition-colors"
                      title="Add to Playlist"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleLike(track); }}
                      className="p-1 rounded bg-surface border border-border-tan text-primary hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Remove from Liked"
                    >
                      <Heart className="w-3 h-3 fill-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info panel: Right 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-5 bg-[#FAF3E0] border border-border-tan p-4 rounded-lg brutalist-shadow">
          {/* Favorites metadata summary */}
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase mb-1.5">
              FAVORITE_GENRES
            </span>
            {sortedGenres.length === 0 ? (
              <span className="text-[10px] text-gray-400">NO_DATA</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {sortedGenres.map((g) => (
                  <span 
                    key={g}
                    className="text-[9px] font-bold bg-surface border border-[#C8B89A] px-2 py-0.5 rounded"
                  >
                    {g} ({genresCount[g]} TRACKS)
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recently Liked small log list */}
          <div>
            <span className="text-[9px] text-gray-400 font-bold block uppercase mb-2">
              RECENTLY_LIKED_LOG
            </span>
            <div className="flex flex-col gap-2">
              {likedTracks.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-2 border-b border-border-tan pb-1.5 last:border-0">
                  <img 
                    src={t.coverUrl} 
                    alt="Small Art" 
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 object-cover rounded-xs border border-border-tan"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[10px] font-bold text-text-charcoal truncate leading-none">{t.title}</h5>
                    <span className="text-[8px] text-gray-400 truncate block mt-0.5">{t.artist}</span>
                  </div>
                </div>
              ))}
              {likedTracks.length === 0 && (
                <span className="text-[10px] text-gray-400">NO_ENTRIES_AVAILABLE</span>
              )}
            </div>
          </div>

          {/* Graphic visualizer card */}
          <div className="border border-border-tan rounded p-3 bg-surface flex flex-col gap-2">
            <span className="text-[8px] text-gray-400 font-bold block">SIGNAL_STRENGTH_VU</span>
            <div className="flex items-end gap-1.5 h-12 pt-2 justify-center">
              {[60, 80, 40, 95, 30, 85].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col gap-1 items-center">
                  <div className="w-full bg-gray-200 h-8 rounded-xs relative overflow-hidden border border-border-tan">
                    <div 
                      className="absolute bottom-0 w-full bg-primary"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span className="text-[7px] text-gray-400 font-bold">VU_{idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
