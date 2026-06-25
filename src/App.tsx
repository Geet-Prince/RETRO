import React, { useState, useEffect } from "react";
import { Screen, Track, UserProfile } from "./types";
import { MOCK_TRACKS, MOCK_PROFILE } from "./data";
import { playSynthTone, stopSynthTone, updateSynthFrequency, getAudioCurrentTime, seekAudio } from "./utils/audio";
import { toggleLikeTrack, addRecentlyPlayed, joinJamRoom, leaveJamRoom, updateJamRoomTrack, cleanupEmptyRooms } from "./firebase";

import { Sidebar } from "./components/Sidebar";
import { PersistentPlayer } from "./components/PersistentPlayer";

// Screen Components
import { LandingPageScreen } from "./components/Screens/LandingPageScreen";
import { NowSpinningScreen } from "./components/Screens/NowSpinningScreen";
import { DiscoverScreen } from "./components/Screens/DiscoverScreen";
import { SearchScreen } from "./components/Screens/SearchScreen";
import { LikedMusicScreen } from "./components/Screens/LikedMusicScreen";
import { JamTogetherScreen } from "./components/Screens/JamTogetherScreen";
import { ProfileScreen } from "./components/Screens/ProfileScreen";
import { LoginScreen } from "./components/Screens/LoginScreen";
import { RegisterScreen } from "./components/Screens/RegisterScreen";

import { Bell, Settings, Menu, Play, Plus } from "lucide-react";

export default function App() {
  // Navigation & Theme
  const [currentScreen, setScreen] = useState<Screen>(Screen.LANDING);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(MOCK_TRACKS);

  // Master Playback State
  const [currentTrack, setCurrentTrack] = useState<Track>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Search Results State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [albumResults, setAlbumResults] = useState<any[]>([]);
  const [trendingAlbums, setTrendingAlbums] = useState<any[]>([]);
  const [activeAlbumDetails, setActiveAlbumDetails] = useState<any | null>(null);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);

  // Jam Room Global State
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [activeRoomPasscode, setActiveRoomPasscode] = useState<string | null>(null);

  // Load trending songs from JioSaavn API on mount
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("https://jiosavnapi-production.up.railway.app/api/search/songs?query=trending&limit=15");
        const resData = await response.json();
        if (resData.success && resData.data && resData.data.results) {
          const mapped = resData.data.results.map((song: any) => {
            const downloadObj = song.downloadUrl.find((d: any) => d.quality === "320kbps") || song.downloadUrl[song.downloadUrl.length - 1];
            const imageObj = song.image.find((i: any) => i.quality === "500x500") || song.image[song.image.length - 1];
            const durationSec = song.duration || 0;
            const mins = Math.floor(durationSec / 60);
            const secs = durationSec % 60;
            const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            return {
              id: song.id,
              title: song.name,
              artist: song.artists.primary.map((a: any) => a.name).join(", ") || "Unknown Artist",
              album: song.album.name || "Unknown Album",
              duration: durationStr,
              coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
              genre: song.language ? song.language.toUpperCase() : "UNKNOWN",
              listeners: song.playCount ? `${(song.playCount / 1000000).toFixed(1)}M` : "100K",
              audioUrl: downloadObj ? downloadObj.url : ""
            };
          });
          setTrendingTracks(mapped);
          if (mapped.length > 0) {
            setCurrentTrack(mapped[0]);
          }
        }
      } catch (e) {
        console.error("Error loading trending tracks", e);
      }
    };
    const fetchTrendingAlbums = async () => {
      try {
        const response = await fetch("https://jiosavnapi-production.up.railway.app/api/search/albums?query=latest&limit=8");
        const resData = await response.json();
        if (resData.success && resData.data && resData.data.results) {
          const mapped = resData.data.results.map((album: any) => {
            const imageObj = album.image.find((i: any) => i.quality === "500x500") || album.image[album.image.length - 1];
            return {
              id: album.id,
              title: album.name,
              artist: album.artists?.primary?.map((a: any) => a.name).join(", ") || album.artist || "Various Artists",
              coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
              year: album.year
            };
          });
          setTrendingAlbums(mapped);
        }
      } catch (e) {
        console.error("Error loading trending albums", e);
      }
    };
    fetchTrending();
    fetchTrendingAlbums();
  }, []);

  // Sound Synth Side-Effects
  const handleNextTrackRef = React.useRef<() => void>(() => {});

  useEffect(() => {
    if (isPlaying) {
      playSynthTone(currentTrack.audioUrl, () => {
        handleNextTrackRef.current();
      });
    } else {
      stopSynthTone();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      updateSynthFrequency(currentTrack.audioUrl);
    }
  }, [currentTrack]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      stopSynthTone();
    };
  }, []);

  // Refs for current track and playing state to prevent stale closures in global Firestore listeners
  const currentTrackRef = React.useRef(currentTrack);
  const isPlayingRef = React.useRef(isPlaying);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Connect and sync with the active Jam room
  useEffect(() => {
    if (!activeRoomId || !user) return;

    let unsubscribeDoc: (() => void) | null = null;

    joinJamRoom(activeRoomId, user, activeRoomPasscode, (updatedRoom) => {
      setRoomInfo(updatedRoom);

      const dbTrack = updatedRoom.currentTrack;
      if (dbTrack) {
        const localTime = getAudioCurrentTime();
        const isDiffTrack = dbTrack.id !== currentTrackRef.current?.id;
        const isDiffPlayState = updatedRoom.isPlaying !== isPlayingRef.current;
        
        // Loop-fix: calculate estimated database progress using lastUpdated timestamp to prevent resets on chat
        const dbLastUpdated = updatedRoom.lastUpdated || Date.now();
        const elapsedSecs = Math.max(0, Math.floor((Date.now() - dbLastUpdated) / 1000));
        const dbEstimatedProgress = updatedRoom.isPlaying ? (updatedRoom.progressSecs + elapsedSecs) : updatedRoom.progressSecs;
        
        const isTimeDrifted = updatedRoom.isPlaying && Math.abs(localTime - dbEstimatedProgress) > 5;

        if (isDiffTrack || isDiffPlayState || isTimeDrifted) {
          // Update local state without writing back to Firestore (skip sync)
          setCurrentTrack(dbTrack);
          setIsPlaying(updatedRoom.isPlaying);
          if (isDiffTrack || isTimeDrifted) {
            setTimeout(() => {
              seekAudio(dbEstimatedProgress);
            }, 500);
          }
        }
      }
    }).then((unsub) => {
      unsubscribeDoc = unsub;
    }).catch((e) => {
      console.error("Failed to join Jam room globally", e);
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      leaveJamRoom(activeRoomId, user.uid || "guest", user.name);
      setRoomInfo(null);
    };
  }, [activeRoomId, user, activeRoomPasscode]);

  // Host-only periodic playback progress sync (every 8 seconds to prevent db spam)
  useEffect(() => {
    if (!activeRoomId || !roomInfo || roomInfo.hostId !== user?.uid || !isPlaying) return;

    const interval = setInterval(() => {
      updateJamRoomTrack(
        activeRoomId,
        currentTrackRef.current,
        isPlayingRef.current,
        Math.floor(getAudioCurrentTime())
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [activeRoomId, roomInfo, isPlaying, user]);

  // Handle invite links on mount (e.g. ?room=solaris-drift&code=1234)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get("room");
    const urlCode = params.get("code");
    if (urlRoom && user) {
      setActiveRoomId(urlRoom);
      setActiveRoomPasscode(urlCode);
      setScreen(Screen.JAM_TOGETHER);
      // Clean URL params to keep address bar tidy
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user]);

  // Periodic background cleanup of empty private rooms (grace period check)
  useEffect(() => {
    cleanupEmptyRooms();
    const interval = setInterval(() => {
      cleanupEmptyRooms();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Authentication Guard: if not logged in, restrict to LANDING/LOGIN/REGISTER
  useEffect(() => {
    if (!user) {
      if (currentScreen !== Screen.LANDING && currentScreen !== Screen.LOGIN && currentScreen !== Screen.REGISTER) {
        setScreen(Screen.LANDING);
      }
    }
  }, [user, currentScreen]);

  // Auth Callbacks
  const handleLoginSuccess = (userData: any) => {
    setUser(userData.profile);
    setLikedTrackIds(userData.likedTrackIds || []);
    setLikedTracks(userData.likedTracks || []);
    setRecentlyPlayed(userData.recentlyPlayed || []);
    setPlaylists(userData.playlists || []);
    setFriends(userData.friends || []);
    setScreen(Screen.NOW_SPINNING);
  };

  const handleRegisterSuccess = (userData: any) => {
    setUser(userData.profile);
    setLikedTrackIds(userData.likedTrackIds || []);
    setLikedTracks(userData.likedTracks || []);
    setRecentlyPlayed(userData.recentlyPlayed || []);
    setPlaylists(userData.playlists || []);
    setFriends(userData.friends || []);
    setScreen(Screen.NOW_SPINNING);
  };

  const handleLogout = () => {
    if (activeRoomId && user) {
      leaveJamRoom(activeRoomId, user.uid || "guest", user.name);
    }
    setActiveRoomId(null);
    setRoomInfo(null);
    setUser(null);
    setLikedTrackIds([]);
    setLikedTracks([]);
    setRecentlyPlayed([]);
    setPlaylists([]);
    setFriends([]);
    setScreen(Screen.LANDING);
    stopSynthTone();
    setIsPlaying(false);
  };

  // Playback Control Handlers
  const handlePlayTrack = async (track: Track, skipFirebaseSync: boolean = false) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (activeRoomId && !skipFirebaseSync) {
      updateJamRoomTrack(activeRoomId, track, true, 0);
    }
    
    // Save to recently played database
    if (user && user.uid) {
      try {
        const list = await addRecentlyPlayed(user.uid, track);
        setRecentlyPlayed(list);
      } catch (e) {
        console.error("Error saving recently played", e);
      }
    }
  };

  const handleTogglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (activeRoomId) {
      updateJamRoomTrack(activeRoomId, currentTrack, nextPlaying, Math.floor(getAudioCurrentTime()));
    }
  };

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setCurrentTrack(next);
      setIsPlaying(true);
      if (activeRoomId) {
        updateJamRoomTrack(activeRoomId, next, true, 0);
      }
    } else {
      // Loop or go to next index of all trending tracks
      const currentIndex = trendingTracks.findIndex((t) => t.id === currentTrack.id);
      let nextIndex = currentIndex + 1;
      if (nextIndex >= trendingTracks.length || nextIndex < 0) {
        nextIndex = 0;
      }
      if (trendingTracks.length > 0) {
        handlePlayTrack(trendingTracks[nextIndex]);
      }
    }
  };
  
  useEffect(() => {
    handleNextTrackRef.current = handleNextTrack;
  }, [handleNextTrack]);

  const handlePrevTrack = () => {
    const currentIndex = trendingTracks.findIndex((t) => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = trendingTracks.length - 1;
    }
    if (trendingTracks.length > 0 && prevIndex >= 0) {
      handlePlayTrack(trendingTracks[prevIndex]);
    }
  };

  const handleAddToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
    alert(`"${track.title}" ADDED TO QUEUE CONTAINER`);
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleToggleLike = async (track: Track) => {
    // Optimistic UI update
    setLikedTrackIds((prev) => {
      if (prev.includes(track.id)) {
        return prev.filter((id) => id !== track.id);
      } else {
        return [...prev, track.id];
      }
    });
    setLikedTracks((prev) => {
      if (prev.some((t) => t.id === track.id)) {
        return prev.filter((t) => t.id !== track.id);
      } else {
        return [...prev, track];
      }
    });

    if (user && user.uid) {
      try {
        const result = await toggleLikeTrack(user.uid, track);
        setLikedTrackIds(result.likedTrackIds);
        setLikedTracks(result.likedTracks);
      } catch (e) {
        console.error("Error saving like", e);
      }
    }
  };

  const handleShuffleAllLiked = () => {
    // Collect liked tracks from trending or recently played or local database if offline
    const allKnownTracks = [...trendingTracks, ...recentlyPlayed, ...searchResults, ...queue];
    // Remove duplicates
    const uniqueKnownTracks = allKnownTracks.filter((t, index, self) => self.findIndex(x => x.id === t.id) === index);
    const liked = uniqueKnownTracks.filter((t) => likedTrackIds.includes(t.id));
    if (liked.length > 0) {
      const shuffled = [...liked].sort(() => Math.random() - 0.5);
      handlePlayTrack(shuffled[0]);
      setQueue(shuffled.slice(1));
    }
  };

  // Searching Catalogs using JioSaavn API
  const handleSearchExecute = async (query: string) => {
    setSearchQuery(query);
    setSearchResults([]);
    setAlbumResults([]);
    try {
      // 1. Songs Search
      const response = await fetch(`https://jiosavnapi-production.up.railway.app/api/search/songs?query=${encodeURIComponent(query)}`);
      const resData = await response.json();
      if (resData.success && resData.data && resData.data.results) {
        const mapped = resData.data.results.map((song: any) => {
          const downloadObj = song.downloadUrl.find((d: any) => d.quality === "320kbps") || song.downloadUrl[song.downloadUrl.length - 1];
          const imageObj = song.image.find((i: any) => i.quality === "500x500") || song.image[song.image.length - 1];
          const durationSec = song.duration || 0;
          const mins = Math.floor(durationSec / 60);
          const secs = durationSec % 60;
          const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          
          return {
            id: song.id,
            title: song.name,
            artist: song.artists.primary.map((a: any) => a.name).join(", ") || "Unknown Artist",
            album: song.album.name || "Unknown Album",
            duration: durationStr,
            coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
            genre: song.language ? song.language.toUpperCase() : "UNKNOWN",
            listeners: song.playCount ? `${(song.playCount / 1000000).toFixed(1)}M` : "100K",
            audioUrl: downloadObj ? downloadObj.url : ""
          };
        });
        setSearchResults(mapped);
      }

      // 2. Albums Search
      const albResponse = await fetch(`https://jiosavnapi-production.up.railway.app/api/search/albums?query=${encodeURIComponent(query)}`);
      const albData = await albResponse.json();
      if (albData.success && albData.data && albData.data.results) {
        const mappedAlbums = albData.data.results.map((album: any) => {
          const imageObj = album.image.find((i: any) => i.quality === "500x500") || album.image[album.image.length - 1];
          return {
            id: album.id,
            title: album.name,
            artist: album.artists?.primary?.map((a: any) => a.name).join(", ") || album.artist || "Various Artists",
            coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
            year: album.year
          };
        });
        setAlbumResults(mappedAlbums);
      }
    } catch (e) {
      console.error("Search API error", e);
    }
    setScreen(Screen.SEARCH);
  };

  const handleOpenAlbum = async (albumId: string) => {
    setIsAlbumLoading(true);
    try {
      const response = await fetch(`https://jiosavnapi-production.up.railway.app/api/albums?id=${albumId}`);
      const resData = await response.json();
      if (resData.success && resData.data) {
        const mappedSongs = resData.data.songs.map((song: any) => {
          const downloadObj = song.downloadUrl.find((d: any) => d.quality === "320kbps") || song.downloadUrl[song.downloadUrl.length - 1];
          const imageObj = song.image.find((i: any) => i.quality === "500x500") || song.image[song.image.length - 1];
          const durationSec = song.duration || 0;
          const mins = Math.floor(durationSec / 60);
          const secs = durationSec % 60;
          const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          
          return {
            id: song.id,
            title: song.name,
            artist: song.artists.primary.map((a: any) => a.name).join(", ") || "Unknown Artist",
            album: song.album.name || "Unknown Album",
            duration: durationStr,
            coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
            genre: song.language ? song.language.toUpperCase() : "UNKNOWN",
            listeners: song.playCount ? `${(song.playCount / 1000000).toFixed(1)}M` : "100K",
            audioUrl: downloadObj ? downloadObj.url : ""
          };
        });

        const imageObj = resData.data.image.find((i: any) => i.quality === "500x500") || resData.data.image[resData.data.image.length - 1];
        
        setActiveAlbumDetails({
          id: resData.data.id,
          name: resData.data.name,
          artist: resData.data.artists?.primary?.map((a: any) => a.name).join(", ") || resData.data.artist || "Various Artists",
          coverUrl: imageObj ? imageObj.url : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
          year: resData.data.year,
          songs: mappedSongs
        });
      }
    } catch (e) {
      console.error("Error opening album", e);
    } finally {
      setIsAlbumLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setScreen(Screen.DISCOVER);
  };

  // Profile triggers
  const handleShareID = () => {
    const urlCode = `m2d://collector/${user?.idCode || "GUEST"}`;
    navigator.clipboard.writeText(urlCode);
    alert(`COLLECTOR SECURITY CODE COPIED TO CLIPBOARD:\n${urlCode}`);
  };

  // Render Public Gatekeeper Flow when user is not logged in
  if (!user) {
    return (
      <div className={`h-screen flex flex-col font-mono relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "dark bg-[#121212] text-[#fff9ef]" : "bg-[#fff9ef] text-[#1A1A1A]"
      }`}>
        {/* Public Header */}
        <header className="px-6 py-4 border-b border-border-tan flex items-center justify-between select-none bg-surface z-20">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setScreen(Screen.LANDING)}
          >
            <span className="text-sm font-black tracking-widest text-primary uppercase animate-retro-glow">
              RETRO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-xs font-bold text-gray-500 hover:text-primary transition-colors cursor-pointer"
            >
              {isDarkMode ? "LIGHT_MODE" : "DARK_MODE"}
            </button>
            
            {currentScreen !== Screen.LANDING && (
              <button 
                onClick={() => setScreen(Screen.LANDING)}
                className="text-xs font-bold text-gray-500 hover:text-primary transition-colors cursor-pointer"
              >
                HOME
              </button>
            )}

            {currentScreen !== Screen.LOGIN && (
              <button 
                onClick={() => setScreen(Screen.LOGIN)}
                className="bg-white border border-border-tan hover:bg-surface-container px-3 py-1.5 rounded text-[11px] font-bold text-text-charcoal cursor-pointer"
              >
                LOG IN
              </button>
            )}

            {currentScreen !== Screen.REGISTER && (
              <button 
                onClick={() => setScreen(Screen.REGISTER)}
                className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded hover:bg-opacity-90 cursor-pointer"
              >
                SIGN UP
              </button>
            )}
          </div>
        </header>

        {/* Public Views content wrapper */}
        <div className="flex-1 overflow-hidden relative">
          {currentScreen === Screen.LANDING && (
            <LandingPageScreen 
              setScreen={setScreen}
              isLoggedIn={false}
            />
          )}
          {currentScreen === Screen.LOGIN && (
            <LoginScreen 
              onLoginSuccess={handleLoginSuccess}
              onGoToRegister={() => setScreen(Screen.REGISTER)}
            />
          )}
          {currentScreen === Screen.REGISTER && (
            <RegisterScreen 
              onRegisterSuccess={handleRegisterSuccess}
              onGoToLogin={() => setScreen(Screen.LOGIN)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col font-mono relative overflow-hidden transition-colors duration-300 ${
      isDarkMode ? "dark bg-[#121212] text-[#fff9ef]" : "bg-[#fff9ef] text-[#1A1A1A]"
    }`}>
      
      {/* Upper Main workspace layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drawer rail */}
        <Sidebar 
          currentScreen={currentScreen}
          setScreen={setScreen}
          user={user}
          logout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Core content viewport */}
        <main className="flex-grow flex flex-col overflow-hidden relative">
          
          {/* Global Tiny header telemetry */}
          <div className="px-4 md:px-6 py-2.5 border-b border-border-tan flex items-center justify-between select-none bg-surface">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-1 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                title="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                CONSOLE_OUTPUT_PORT_3000 // STABLE
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification bell bell */}
              <button 
                onClick={() => alert("Notification log container cleared. No active errors.")}
                className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="System Bulletins"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => alert("M2D Retro Core Configuration: Web Audio direct-coupling active. High impedance headphones recommended.")}
                className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                title="Hardware Properties"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Views dynamically */}
          <div className="flex-1 overflow-hidden relative">
            {currentScreen === Screen.NOW_SPINNING && (
              <NowSpinningScreen 
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                togglePlay={handleTogglePlay}
                allTracks={trendingTracks}
                onPlayTrack={handlePlayTrack}
                onNext={handleNextTrack}
                onPrev={handlePrevTrack}
                queue={queue}
                removeFromQueue={handleRemoveFromQueue}
                likedTracks={likedTracks}
                onToggleLike={handleToggleLike}
                playlists={playlists}
                onAddToQueue={handleAddToQueue}
              />
            )}
            {currentScreen === Screen.DISCOVER && (
              <DiscoverScreen 
                allTracks={trendingTracks}
                trendingAlbums={trendingAlbums}
                onPlayTrack={handlePlayTrack}
                onAddToQueue={handleAddToQueue}
                onSelectGenre={handleSearchExecute}
                onSearch={handleSearchExecute}
                onOpenAlbum={handleOpenAlbum}
              />
            )}
            {currentScreen === Screen.SEARCH && (
              <SearchScreen 
                query={searchQuery}
                results={searchResults}
                albumResults={albumResults}
                onPlayTrack={handlePlayTrack}
                onAddToQueue={handleAddToQueue}
                onClearSearch={handleClearSearch}
                onOpenAlbum={handleOpenAlbum}
              />
            )}
            {currentScreen === Screen.LIKED_MUSIC && (
              <LikedMusicScreen 
                likedTrackIds={likedTrackIds}
                allTracks={likedTracks}
                onPlayTrack={handlePlayTrack}
                onShuffleAll={handleShuffleAllLiked}
                onToggleLike={handleToggleLike}
              />
            )}
            {currentScreen === Screen.JAM_TOGETHER && (
              <JamTogetherScreen 
                onPlayTrack={handlePlayTrack}
                allTracks={trendingTracks}
                user={user}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setCurrentTrack={setCurrentTrack}
                activeRoomId={activeRoomId}
                setActiveRoomId={setActiveRoomId}
                roomInfo={roomInfo}
                setActiveRoomPasscode={setActiveRoomPasscode}
              />
            )}
            {currentScreen === Screen.PROFILE && (
              <ProfileScreen 
                user={user}
                onShareID={handleShareID}
              />
            )}
          </div>
        </main>
      </div>

      {/* Persistent Bottom HiFi deck */}
      <PersistentPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        queue={queue}
        removeFromQueue={handleRemoveFromQueue}
        isShuffle={isShuffle}
        toggleShuffle={() => setIsShuffle(!isShuffle)}
        isRepeat={isRepeat}
        toggleRepeat={() => setIsRepeat(!isRepeat)}
      />

      {/* Global Album Details Modal */}
      {activeAlbumDetails && (
        <div className="fixed inset-0 bg-black/75 z-[999] flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-2xl bg-[#FAF3E0] border-2 border-[#1A1A1A] rounded-lg brutalist-shadow-thick p-5 max-h-[90vh] overflow-y-auto flex flex-col gap-4 text-text-charcoal relative">
            <button 
              onClick={() => setActiveAlbumDetails(null)}
              className="absolute top-4 right-4 bg-surface border border-border-tan hover:bg-[#1A1A1A] hover:text-white transition-colors px-2.5 py-1 rounded text-xs font-bold cursor-pointer"
            >
              CLOSE [X]
            </button>

            {/* Album Info Row */}
            <div className="flex flex-col md:flex-row gap-4 items-center border-b border-border-tan pb-4">
              <div className="w-28 h-28 border border-border-tan bg-black rounded overflow-hidden flex-shrink-0 relative shadow-md">
                <img 
                  src={activeAlbumDetails.coverUrl} 
                  alt="Album cover" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 text-center md:text-left min-w-0">
                <span className="text-[9px] text-[#C8B89A] font-bold block uppercase tracking-widest">ALBUM_FREQUENCY</span>
                <h3 className="text-lg md:text-xl font-black truncate tracking-wide leading-tight">{activeAlbumDetails.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase truncate mt-1">BY: {activeAlbumDetails.artist}</p>
                <span className="inline-block bg-primary/10 border border-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded mt-2">
                  RELEASE YEAR: {activeAlbumDetails.year} // {activeAlbumDetails.songs?.length || 0} TRACKS
                </span>
              </div>
            </div>

            {/* Album Songs List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] pr-1 scrollbar-hide">
              {activeAlbumDetails.songs?.map((track: Track, idx: number) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <div 
                    key={track.id}
                    className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                      isCurrent
                        ? "bg-[#FCF3DE] border-primary brutalist-shadow"
                        : "bg-surface border-border-tan hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-black text-gray-400 w-5 text-right">{idx + 1}.</span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-text-charcoal truncate">{track.title}</h4>
                        <p className="text-[9px] text-gray-500 font-bold uppercase truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-400 font-bold">{track.duration}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            handlePlayTrack(track);
                          }}
                          className="p-1 rounded bg-[#fff9ef] border border-border-tan hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
                          title="Spin Song"
                        >
                          <Play className="w-3.5 h-3.5 text-primary" />
                        </button>
                        <button
                          onClick={() => handleAddToQueue(track)}
                          className="p-1 rounded bg-[#fff9ef] border border-border-tan hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          title="Add to queue"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
