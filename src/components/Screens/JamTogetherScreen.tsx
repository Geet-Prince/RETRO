import React, { useState, useEffect, useRef } from "react";
import { Track, Listener, ChatMessage } from "../../types";
import { Radio, Users, Sparkles, Send, Plus, Volume2, Globe, MessageSquare, DoorOpen } from "lucide-react";
import { seekAudio, getAudioCurrentTime } from "../../utils/audio";
import { 
  listenToJamRooms, 
  joinJamRoom, 
  leaveJamRoom, 
  updateJamRoomTrack, 
  sendJamRoomMessage, 
  sendJamRoomWave 
} from "../../firebase";

interface JamTogetherScreenProps {
  onPlayTrack: (track: Track) => void;
  allTracks: Track[];
  user: any;
  currentTrack: Track;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTrack: (track: Track) => void;
}

interface RoomInfo {
  roomId: string;
  roomName: string;
  hostId: string;
  currentTrack: Track | null;
  isPlaying: boolean;
  progressSecs: number;
  listeners: Listener[];
  messages: ChatMessage[];
  vibe: number;
}

export const JamTogetherScreen: React.FC<JamTogetherScreenProps> = ({
  onPlayTrack,
  allTracks,
  user,
  currentTrack,
  isPlaying,
  setIsPlaying,
  setCurrentTrack
}) => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  
  const [newMsg, setNewMsg] = useState<string>("");
  const [createRoomName, setCreateRoomName] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch rooms list in real-time
  useEffect(() => {
    if (!activeRoomId) {
      const unsubscribe = listenToJamRooms((roomsList) => {
        setRooms(roomsList);
      });
      return () => unsubscribe();
    }
  }, [activeRoomId]);

  // Connect to Firestore Jam Room when joining
  useEffect(() => {
    if (!activeRoomId || !user) return;

    let unsubscribeDoc: (() => void) | null = null;
    let lastTrackId = "";
    let lastIsPlaying = false;

    joinJamRoom(activeRoomId, user, (updatedRoom) => {
      setRoomInfo(updatedRoom);
      
      // Synchronize player for listeners (non-hosts)
      if (updatedRoom.hostId !== user.uid) {
        const track = updatedRoom.currentTrack;
        if (track) {
          if (track.id !== lastTrackId || updatedRoom.isPlaying !== lastIsPlaying) {
            lastTrackId = track.id;
            lastIsPlaying = updatedRoom.isPlaying;
            
            setCurrentTrack(track);
            setIsPlaying(updatedRoom.isPlaying);
            // Small timeout to allow audio component to buffer/load, then seek to host time
            setTimeout(() => {
              seekAudio(updatedRoom.progressSecs);
            }, 500);
          }
        }
      }
    }).then((unsub) => {
      unsubscribeDoc = unsub;
    }).catch((e) => {
      console.error("Failed to join jam room in Firestore", e);
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      leaveJamRoom(activeRoomId, user.uid || "guest", user.name);
      setRoomInfo(null);
    };
  }, [activeRoomId, user]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomInfo?.messages]);

  // Sync state if user is Host/DJ and updates/plays a song
  useEffect(() => {
    if (roomInfo && roomInfo.hostId === user?.uid && activeRoomId) {
      const dbTrack = roomInfo.currentTrack;
      const dbIsPlaying = roomInfo.isPlaying;
      
      // Update room in Firestore if local playback state differs from DB
      if (!dbTrack || dbTrack.id !== currentTrack.id || dbIsPlaying !== isPlaying) {
        updateJamRoomTrack(
          activeRoomId,
          currentTrack,
          isPlaying,
          Math.floor(getAudioCurrentTime())
        );
      }
    }
  }, [currentTrack, isPlaying, roomInfo, activeRoomId, user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeRoomId || !user) return;

    sendJamRoomMessage(activeRoomId, user, newMsg.trim());
    setNewMsg("");
  };

  const handleWave = (listenerName: string) => {
    if (!activeRoomId || !user) return;
    sendJamRoomWave(activeRoomId, user.name, listenerName);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createRoomName.trim()) return;

    const roomId = createRoomName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setActiveRoomId(roomId);
    setShowCreateForm(false);
    setCreateRoomName("");
  };

  const syncLocalHeadset = () => {
    if (roomInfo?.currentTrack) {
      onPlayTrack(roomInfo.currentTrack);
      setIsPlaying(roomInfo.isPlaying);
      setTimeout(() => {
        seekAudio(roomInfo.progressSecs);
      }, 300);
    }
  };

  // If not in a room, render Lobby
  if (!activeRoomId) {
    return (
      <div className="flex-1 flex flex-col gap-6 p-6 font-mono overflow-y-auto scrollbar-hide h-full">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-tan pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-border-tan bg-primary flex items-center justify-center animate-pulse">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest block">FIRESTORE_CHANNELS</span>
              <h2 className="text-base font-bold text-text-charcoal leading-none">JAM LOBBY</h2>
            </div>
          </div>

          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary text-white border border-primary text-[10px] font-bold px-3 py-1.5 rounded hover:bg-opacity-95 shadow cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>CREATE STATION</span>
          </button>
        </div>

        {/* Create room form */}
        {showCreateForm && (
          <form onSubmit={handleCreateRoom} className="bg-[#FAF3E0] border-2 border-[#1A1A1A] p-4 rounded-lg brutalist-shadow flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 flex flex-col gap-1 w-full">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">STATION NAME</label>
              <input 
                type="text" 
                placeholder="e.g. LOFI TAPE RETREAT"
                value={createRoomName}
                onChange={(e) => setCreateRoomName(e.target.value)}
                className="w-full bg-surface border border-border-tan text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-primary text-text-charcoal font-bold"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-primary text-white border-2 border-[#1A1A1A] text-xs font-bold px-4 py-1.5 rounded brutalist-shadow cursor-pointer w-full sm:w-auto"
            >
              LAUNCH
            </button>
          </form>
        )}

        {/* Rooms list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div 
              key={room.roomId}
              className="bg-surface border-2 border-[#1A1A1A] rounded-lg p-4 brutalist-shadow flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-text-charcoal uppercase tracking-wider">{room.roomName}</h3>
                  <span className="bg-[#FFEAEA] border border-red-300 text-red-600 text-[8px] font-bold px-1 py-0.2 rounded flex items-center gap-1 animate-pulse">
                    ● {room.listeners?.length || 0} ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Host: {room.hostId === user?.uid ? "YOU" : room.hostId.substring(0, 12)}</p>
                
                {room.currentTrack ? (
                  <div className="mt-3 bg-surface-container p-2 rounded border border-border-tan flex items-center gap-2">
                    <img 
                      src={room.currentTrack.coverUrl} 
                      alt="Cover" 
                      className="w-8 h-8 rounded object-cover border border-border-tan" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[10px] font-bold text-text-charcoal truncate">{room.currentTrack.title}</h4>
                      <p className="text-[8px] text-gray-400 truncate">{room.currentTrack.artist}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-[9px] text-gray-400 italic">No track spinning currently</div>
                )}
              </div>

              <button 
                onClick={() => setActiveRoomId(room.roomId)}
                className="w-full bg-[#1A1A1A] text-white hover:bg-primary transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                TUNE IN STATION
              </button>
            </div>
          ))}

          {rooms.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-border-tan rounded-lg text-gray-400 text-xs">
              NO ACTIVE STATIONS FOUND
              <span className="block mt-1 text-[10px]">Create a custom station above to start a session</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Room view
  const activeRoomTrack = roomInfo?.currentTrack;
  const roomListeners = roomInfo?.listeners || [];
  const messages = roomInfo?.messages || [];
  const vibe = roomInfo?.vibe || 50;

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 font-mono overflow-y-auto scrollbar-hide h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-tan pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-border-tan bg-primary flex items-center justify-center animate-pulse">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold tracking-widest block">STATION // ACTIVE</span>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text-charcoal leading-none uppercase">{roomInfo?.roomName || "STATION"}</h2>
              <span className="bg-[#FFEAEA] border border-red-300 text-red-600 text-[9px] font-bold px-1.5 py-0.2 rounded animate-pulse">
                ● LIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              const urlCode = `m2d://jam/${activeRoomId}`;
              navigator.clipboard.writeText(urlCode);
              alert(`STATION CODE COPIED:\n${urlCode}`);
            }}
            className="bg-primary text-white border border-primary text-[10px] font-bold px-3 py-1.5 rounded hover:bg-opacity-95 shadow cursor-pointer"
          >
            SHARE STATION
          </button>
          <button 
            onClick={() => setActiveRoomId(null)}
            className="bg-surface border border-border-tan hover:bg-red-50 hover:text-red-600 transition-colors text-[10px] font-bold px-3 py-1.5 rounded text-text-charcoal cursor-pointer flex items-center gap-1"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>LEAVE LOBBY</span>
          </button>
        </div>
      </div>

      {/* Main Grid Splitting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 units): Live Audio Center & Queue */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visualizer Player inside the Live Room */}
          <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] brutalist-shadow rounded-lg p-5 flex flex-col md:flex-row gap-6 items-center relative text-[#fff9ef]">
            <span className="absolute top-2 left-3 text-[8px] text-gray-500 font-bold tracking-widest uppercase">
              ROOM_CURRENT_SPINNING
            </span>

            {/* Micro Disc label rotating */}
            <div className="w-36 h-36 rounded-full bg-black border-4 border-gray-800 flex items-center justify-center shadow-inner relative flex-shrink-0">
              <div className="absolute inset-2 rounded-full border border-gray-900 opacity-60" />
              <div className="absolute inset-6 rounded-full border border-gray-900 opacity-40" />
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${roomInfo?.isPlaying ? "spinning-vinyl" : ""}`}>
                <img 
                  src={activeRoomTrack?.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} 
                  alt="Label" 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-gray-950"
                />
              </div>
              <div className="absolute w-4 h-4 rounded-full bg-surface-container border border-gray-950 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-gray-500" />
              </div>
            </div>

            {/* Song Meta Descriptions and tags */}
            <div className="flex-1 flex flex-col gap-1.5 text-center md:text-left">
              <span className="text-[9px] text-[#C8B89A] font-bold tracking-widest uppercase">
                {roomInfo?.hostId === user?.uid ? "YOU ARE HOST / DJ" : "LISTENING SYNC"}
              </span>
              <h3 className="text-base font-bold text-white tracking-wide leading-none">
                {activeRoomTrack?.title || "NO TRACK SPINNING"}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                {activeRoomTrack?.artist || "The host is choosing a frequency"}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-2">
                <span className="bg-[#a04100]/20 border border-primary/30 text-primary text-[8px] font-bold px-2 py-0.5 rounded">
                  FIRESTORE CHANNEL
                </span>
                <span className="bg-[#C8B89A]/10 border border-border-tan/30 text-border-tan text-[8px] font-bold px-2 py-0.5 rounded">
                  STREAM SYNC
                </span>
              </div>

              {/* Action play button to listen locally */}
              {activeRoomTrack && (
                <button 
                  onClick={syncLocalHeadset}
                  className="mt-3 self-center md:self-start bg-primary text-white border border-primary px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-opacity-95 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>SYNC LOCAL HEADSET</span>
                </button>
              )}
            </div>
          </div>

          {/* Current Listeners Avatars list */}
          <div className="bg-surface border border-border-tan rounded-lg p-4 brutalist-shadow">
            <h3 className="text-xs font-bold text-text-charcoal uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <Users className="w-4 h-4 text-primary" />
              CURRENT LISTENERS ({roomListeners.length})
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {roomListeners.map((lst) => (
                <div 
                  key={lst.id}
                  onClick={() => lst.name !== user.name && handleWave(lst.name)}
                  className="group flex flex-col items-center bg-surface-container border border-border-tan rounded p-2 text-center relative hover:border-primary transition-all cursor-pointer"
                  title={lst.name !== user.name ? `Tap to wave at ${lst.name}` : ""}
                >
                  <div className="relative">
                    <img 
                      src={lst.avatarUrl} 
                      alt="Listener avatar" 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded border border-border-tan object-cover"
                    />
                    {lst.isDj && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold px-1 rounded border border-border-tan">
                        DJ
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-text-charcoal truncate w-full mt-2 group-hover:text-primary">
                    {lst.name}
                  </span>
                  {lst.name !== user.name && <span className="text-[7px] text-gray-400 block mt-0.5">WAVE 👋</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 units): Feed and telemetry */}
        <div className="lg:col-span-4 bg-[#FAF3E0] border border-border-tan p-4 rounded-lg brutalist-shadow flex flex-col gap-4 h-full min-h-[460px]">
          
          {/* Metadata gauges */}
          <div className="border-b border-border-tan pb-3 flex flex-col gap-2">
            <span className="text-[9px] text-gray-400 font-bold tracking-widest block uppercase">
              ROOM_METADATA
            </span>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500">STATION_ID:</span>
              <span className="text-primary truncate max-w-[150px]">{activeRoomId}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-gray-500">SYNC_STATUS:</span>
              <span className="text-text-charcoal bg-white border border-border-tan px-1 rounded text-[8px]">
                {roomInfo?.isPlaying ? "STREAMING" : "PAUSED"}
              </span>
            </div>

            {/* Vibe-O-Meter gauge */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="flex justify-between text-[8px] font-bold">
                <span className="text-gray-500 uppercase">VIBE-O-METER</span>
                <span className="text-primary">{vibe}% HIGH</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded border border-border-tan relative overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${vibe}%` }}
                />
              </div>
            </div>
          </div>

          {/* Activity Chat Feed */}
          <div className="flex-1 flex flex-col justify-between h-[300px]">
            {/* Scroll messages box */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[220px] scrollbar-hide">
              {messages.map((m) => {
                let textCol = "text-text-charcoal";
                let bgCol = "bg-surface";
                let borderCol = "border-border-tan";
                
                if (m.isDj) {
                  textCol = "text-primary font-bold";
                  bgCol = "bg-[#FCF3DE]";
                  borderCol = "border-primary/40";
                } else if (m.isSystem) {
                  textCol = "text-gray-500 italic";
                  bgCol = "bg-transparent";
                  borderCol = "border-transparent";
                }

                return (
                  <div 
                    key={m.id}
                    className={`p-2 rounded border text-[10px] leading-relaxed transition-all ${bgCol} ${borderCol}`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[8px] text-gray-400 font-bold">
                      <span className={m.isDj ? "text-primary" : "text-text-charcoal"}>
                        {m.user}
                      </span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className={textCol}>{m.text}</p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} className="mt-3 pt-2 border-t border-border-tan flex gap-2">
              <input 
                type="text"
                placeholder="Broadcast a frequency..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 bg-surface border border-border-tan text-xs px-2.5 py-1.5 rounded focus:outline-none focus:border-primary text-text-charcoal placeholder-gray-400 font-bold"
              />
              <button 
                type="submit"
                className="bg-primary text-white border border-primary p-2 rounded hover:bg-opacity-95 shadow cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
