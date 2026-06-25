import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForDevelopment123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "music2d-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "music2d-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "music2d-auth.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export { signInWithPopup, signOut };

// Helper to perform Google OAuth Login
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error("Firebase Login Error:", error);
    throw error;
  }
}

// Firestore Sync/Fetch User data (create if new) with LocalStorage fallback
export async function syncUserProfile(uid: string, name: string, email: string, avatarUrl?: string) {
  const localKey = `music2d_user_${uid}`;
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUser = {
        profile: {
          uid,
          name: name || "NEW_COLLECTOR",
          email: email || "",
          idCode: `CURATOR_ID: ${Math.floor(1000 + Math.random() * 9000)}-XP`,
          isPremium: true,
          location: "TOKYO_SUB",
          memberSince: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }).toUpperCase(),
          level: 1,
          minutesCount: 0,
          tracksCount: 0,
          collectionCount: 0,
          avatarUrl: avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCuiYmL89VIWmay1zAOcQoTq8QGw980tcVWW3XmHLcaThUeBAjwtjBVn3zRynpuYkS0r3drGdS4iqPoo1EgCRPtE8-vH7N--o8up0B-NHY9MDWgarI6-nguFRxXcoF-UUyYPupvGFJO7ugI9Qr2PUJkgPOeRCL5MQJdkNWzqj1317kthel5aERuhct1J5CBVhN-Q7Q5zvwLwoOGeh0gBjvTNcNwk2dyMGnyzcx7xzM08AUL5Izd1E19659zyEgCUiVRfK9crKSlmU8"
        },
        recentlyPlayed: [],
        likedTrackIds: [],
        likedTracks: [],
        playlists: [],
        friends: [
          { name: "ISOMETRIC_GIRL", status: "Listening to:", detail: "ORBITAL_PATH", timeAgo: "2M_AGO", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKOy4iNXQNlHhKL9ABmdT8BFOEk-IKV8e22OnD0bwUqH45y1XDA3LyypfiS7EQjDdnfGjaU-whTD8aEyUz5_fIOM-pceNPgcr8RHkU1RLc-JkRY2601_xu6DEnoxEGQqvoVSxeiOcE0Xey_beLUp-ba-8lMfAfyNABJU8qBKRoO9VQk7Zi4KxYegOQynYtORSl-sjvGgI5kuCttPu9_kES5l9FO_SrZvANvptYdxA2WfMV7ldYTIP7PL4Xj3iFRoNprN7pZk0iCxo", active: true },
          { name: "LOW_PASS_FILTER", status: "Saved:", detail: "ANALOG_DREAMS", timeAgo: "15M_AGO", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrIHIprdKs-SxteKgTU2sWOkyu51TswExd1BZvxNdFGbLTtMapKNZ1_FXQIHrI8wvBe9nPVvbMb6uTS86Rm59MiOXgEEsyMPeBHWSEV4H6JN2v8kc8lJPHPv27wG1Td7ywH5U8P1Kw55s4QAAUCDp5X2GTp5DsFPqrEMKzl2DQ-P_wg6IQzZ4sKbC8pb_XCvSFohmaeSY2rc77Ib--EDG5t4CFTp8cME-RKZOfAuiPPKQs_DgbPlo9I-fu3WWuBcx7TK8NDrkjjbY", active: false }
        ]
      };
      await setDoc(userDocRef, newUser);
      // Cache locally
      localStorage.setItem(localKey, JSON.stringify(newUser));
      return newUser;
    }
    const data = userDoc.data();
    if (data) {
      localStorage.setItem(localKey, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.warn("Firestore syncUserProfile failed. Falling back to LocalStorage:", error);
    
    // Check local cache
    const cachedData = localStorage.getItem(localKey);
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        console.error("Failed to parse cached user data:", e);
      }
    }

    // Default fallback profile if no cache exists
    const fallbackUser = {
      profile: {
        uid,
        name: name || "LOCAL_COLLECTOR",
        email: email || "",
        idCode: `CURATOR_ID: ${Math.floor(1000 + Math.random() * 9000)}-XP`,
        isPremium: true,
        location: "TOKYO_SUB (LOCAL)",
        memberSince: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }).toUpperCase(),
        level: 1,
        minutesCount: 0,
        tracksCount: 0,
        collectionCount: 0,
        avatarUrl: avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCuiYmL89VIWmay1zAOcQoTq8QGw980tcVWW3XmHLcaThUeBAjwtjBVn3zRynpuYkS0r3drGdS4iqPoo1EgCRPtE8-vH7N--o8up0B-NHY9MDWgarI6-nguFRxXcoF-UUyYPupvGFJO7ugI9Qr2PUJkgPOeRCL5MQJdkNWzqj1317kthel5aERuhct1J5CBVhN-Q7Q5zvwLwoOGeh0gBjvTNcNwk2dyMGnyzcx7xzM08AUL5Izd1E19659zyEgCUiVRfK9crKSlmU8"
      },
      recentlyPlayed: [],
      likedTrackIds: [],
      likedTracks: [],
      playlists: [],
      friends: [
        { name: "ISOMETRIC_GIRL", status: "Listening to:", detail: "ORBITAL_PATH", timeAgo: "2M_AGO", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKOy4iNXQNlHhKL9ABmdT8BFOEk-IKV8e22OnD0bwUqH45y1XDA3LyypfiS7EQjDdnfGjaU-whTD8aEyUz5_fIOM-pceNPgcr8RHkU1RLc-JkRY2601_xu6DEnoxEGQqvoVSxeiOcE0Xey_beLUp-ba-8lMfAfyNABJU8qBKRoO9VQk7Zi4KxYegOQynYtORSl-sjvGgI5kuCttPu9_kES5l9FO_SrZvANvptYdxA2WfMV7ldYTIP7PL4Xj3iFRoNprN7pZk0iCxo", active: true },
        { name: "LOW_PASS_FILTER", status: "Saved:", detail: "ANALOG_DREAMS", timeAgo: "15M_AGO", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrIHIprdKs-SxteKgTU2sWOkyu51TswExd1BZvxNdFGbLTtMapKNZ1_FXQIHrI8wvBe9nPVvbMb6uTS86Rm59MiOXgEEsyMPeBHWSEV4H6JN2v8kc8lJPHPv27wG1Td7ywH5U8P1Kw55s4QAAUCDp5X2GTp5DsFPqrEMKzl2DQ-P_wg6IQzZ4sKbC8pb_XCvSFohmaeSY2rc77Ib--EDG5t4CFTp8cME-RKZOfAuiPPKQs_DgbPlo9I-fu3WWuBcx7TK8NDrkjjbY", active: false }
      ]
    };
    localStorage.setItem(localKey, JSON.stringify(fallbackUser));
    return fallbackUser;
  }
}

// Firestore Toggle Like Song with LocalStorage fallback
export async function toggleLikeTrack(uid: string, track: any) {
  const localKey = `music2d_user_${uid}`;
  let likedIds: string[] = [];
  let likedTracksList: any[] = [];

  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("User not found in Firestore");

    const userData = userDoc.data();
    likedIds = userData.likedTrackIds || [];
    likedTracksList = userData.likedTracks || [];

    const index = likedIds.indexOf(track.id);
    if (index > -1) {
      likedIds.splice(index, 1);
      likedTracksList = likedTracksList.filter((t: any) => t.id !== track.id);
    } else {
      likedIds.push(track.id);
      likedTracksList.push(track);
    }

    await updateDoc(userDocRef, {
      likedTrackIds: likedIds,
      likedTracks: likedTracksList,
      "profile.collectionCount": likedIds.length
    });

    // Sync to local storage cache
    const cachedData = localStorage.getItem(localKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        parsed.likedTrackIds = likedIds;
        parsed.likedTracks = likedTracksList;
        if (!parsed.profile) parsed.profile = {};
        parsed.profile.collectionCount = likedIds.length;
        localStorage.setItem(localKey, JSON.stringify(parsed));
      } catch (e) {}
    }

    return { likedTrackIds: likedIds, likedTracks: likedTracksList };
  } catch (error) {
    console.warn("Firestore toggleLikeTrack failed. Using LocalStorage fallback:", error);
    
    const cachedData = localStorage.getItem(localKey);
    let parsed: any = { likedTrackIds: [], likedTracks: [], profile: { collectionCount: 0 } };
    if (cachedData) {
      try {
        parsed = JSON.parse(cachedData);
      } catch (e) {}
    }
    
    likedIds = parsed.likedTrackIds || [];
    likedTracksList = parsed.likedTracks || [];

    const index = likedIds.indexOf(track.id);
    if (index > -1) {
      likedIds.splice(index, 1);
      likedTracksList = likedTracksList.filter((t: any) => t.id !== track.id);
    } else {
      likedIds.push(track.id);
      likedTracksList.push(track);
    }
    
    parsed.likedTrackIds = likedIds;
    parsed.likedTracks = likedTracksList;
    if (!parsed.profile) parsed.profile = {};
    parsed.profile.collectionCount = likedIds.length;
    localStorage.setItem(localKey, JSON.stringify(parsed));
    return { likedTrackIds: likedIds, likedTracks: likedTracksList };
  }
}

// Firestore Save Recently Played Song with LocalStorage fallback
export async function addRecentlyPlayed(uid: string, track: any) {
  const localKey = `music2d_user_${uid}`;
  let list: any[] = [];

  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("User not found in Firestore");

    const userData = userDoc.data();
    list = userData.recentlyPlayed || [];
    list = list.filter((t: any) => t.id !== track.id);
    list.unshift(track);
    if (list.length > 20) list.pop();

    await updateDoc(userDocRef, {
      recentlyPlayed: list,
      "profile.tracksCount": list.length
    });

    // Sync to local storage cache
    const cachedData = localStorage.getItem(localKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        parsed.recentlyPlayed = list;
        parsed.profile.tracksCount = list.length;
        localStorage.setItem(localKey, JSON.stringify(parsed));
      } catch (e) {}
    }

    return list;
  } catch (error) {
    console.warn("Firestore addRecentlyPlayed failed. Using LocalStorage fallback:", error);
    
    const cachedData = localStorage.getItem(localKey);
    let parsed: any = { recentlyPlayed: [], profile: { tracksCount: 0 } };
    if (cachedData) {
      try {
        parsed = JSON.parse(cachedData);
      } catch (e) {}
    }
    
    list = parsed.recentlyPlayed || [];
    list = list.filter((t: any) => t.id !== track.id);
    list.unshift(track);
    if (list.length > 20) list.pop();
    
    parsed.recentlyPlayed = list;
    if (!parsed.profile) parsed.profile = {};
    parsed.profile.tracksCount = list.length;
    localStorage.setItem(localKey, JSON.stringify(parsed));
    return list;
  }
}

// Firestore Create Playlist with LocalStorage fallback
export async function addPlaylist(uid: string, name: string, coverUrl: string, tracks: any[]) {
  const localKey = `music2d_user_${uid}`;
  let playlists: any[] = [];

  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw new Error("User not found in Firestore");

    const userData = userDoc.data();
    playlists = userData.playlists || [];
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      coverUrl: coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
      tracks: tracks || []
    };

    playlists.push(newPlaylist);
    await updateDoc(userDocRef, { playlists });

    // Sync to local storage cache
    const cachedData = localStorage.getItem(localKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        parsed.playlists = playlists;
        localStorage.setItem(localKey, JSON.stringify(parsed));
      } catch (e) {}
    }

    return playlists;
  } catch (error) {
    console.warn("Firestore addPlaylist failed. Using LocalStorage fallback:", error);
    
    const cachedData = localStorage.getItem(localKey);
    let parsed: any = { playlists: [] };
    if (cachedData) {
      try {
        parsed = JSON.parse(cachedData);
      } catch (e) {}
    }
    
    playlists = parsed.playlists || [];
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      coverUrl: coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
      tracks: tracks || []
    };
    playlists.push(newPlaylist);
    
    parsed.playlists = playlists;
    localStorage.setItem(localKey, JSON.stringify(parsed));
    return playlists;
  }
}

// --- FIRESTORE REALTIME JAM ROOM SYNC ---

// 1. Get active rooms list in real-time
export function listenToJamRooms(onUpdate: (rooms: any[]) => void) {
  const roomsCol = collection(db, "rooms");
  return onSnapshot(roomsCol, (snapshot) => {
    const list: any[] = [];
    snapshot.forEach((doc) => {
      list.push({ roomId: doc.id, ...doc.data() });
    });
    // Add default solaris-drift room if it doesn't exist in the list
    if (!list.some(r => r.roomId === "solaris-drift")) {
      list.unshift({
        roomId: "solaris-drift",
        roomName: "SOLARIS DRIFT REC",
        hostId: "STITCH_DJ",
        currentTrack: {
          id: "track-room",
          title: "SOLARIS DRIFT",
          artist: "MONO ECHO & THE CURATORS",
          album: "SPACE SHIFT SELECTIONS",
          duration: "04:45",
          coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmDcABelGW7FvSoaw5aZxCeVtTEFBRCv0dvPINsKgsPwVAZva5kjSwW-zx0Mgv-7a4i-q-r5lTxb6bEO3Y1jypc03Yk2kM3kG6Qqwxl9qBT1u8WZ3yZCC-bQWl2oDLuPBcpATGf1ZXIJ70ghbzEpGVbhFq9XTZ_yiwSYT6ZcNMsQYnw-ED8DbFc05uKgZ5AwWE01QzJYD2juCq69mytTavIYLReuE6OR3b1FOnTqK5r7u9ezncIH_0jsgTQqAsu04QP1um1NOMYJ4",
          genre: "AMBIENT",
          audioUrl: "https://aac.saavncdn.com/392/8ab72e5058ec1438fa910f135b5bb27d_160.mp4"
        },
        isPlaying: true,
        progressSecs: 45,
        listeners: [
          { id: "STITCH_DJ", name: "Stitch (DJ)", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGmeCkoVquhy-m8Wte3R2DcLiclHPKOGO5VuMEqxBYIAruLB_zTodjOPmN7JU5OIrPHAhbjwk8cY7Kp0THzcdmgaNVbyG9oIj_yl2T5cSuv94aQiUjVPw_3jpEVTnnj_BHZrOepyIrINdGNknlshROqesC3brDrNfi2sB7dJQ8E4mCj2PETuYzDpkKIAWWECH_xhVPb-5bNTJa2GqvvSIQ4sTIZ9somhHC5NY-beOV6zEY0TYqMqyfE9V8liqrbhEx4CezJ5Yclms", isDj: true }
        ],
        messages: [
          { id: "msg-1", user: "Stitch (DJ)", text: "Welcome to the drift session. Turning up the bass for this next one.", timestamp: "12:45 PM", isDj: true }
        ],
        vibe: 85
      });
    }
    onUpdate(list);
  }, (err) => {
    console.error("Firestore listenToJamRooms error:", err);
  });
}

// 2. Join a jam room
export async function joinJamRoom(roomId: string, user: any, onUpdate: (room: any) => void) {
  const roomDocRef = doc(db, "rooms", roomId);
  const userId = user.uid || `guest-${Date.now()}`;
  const newListener = {
    id: userId,
    name: user.name,
    avatarUrl: user.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCuiYmL89VIWmay1zAOcQoTq8QGw980tcVWW3XmHLcaThUeBAjwtjBVn3zRynpuYkS0r3drGdS4iqPoo1EgCRPtE8-vH7N--o8up0B-NHY9MDWgarI6-nguFRxXcoF-UUyYPupvGFJO7ugI9Qr2PUJkgPOeRCL5MQJdkNWzqj1317kthel5aERuhct1J5CBVhN-Q7Q5zvwLwoOGeh0gBjvTNcNwk2dyMGnyzcx7xzM08AUL5Izd1E19659zyEgCUiVRfK9crKSlmU8",
    isDj: false
  };

  const welcomeMsg = {
    id: `msg-system-${Date.now()}`,
    user: "SYSTEM",
    text: `${user.name} joined the room.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isSystem: true
  };

  try {
    const roomSnap = await getDoc(roomDocRef);
    if (!roomSnap.exists()) {
      // Create new room
      const initialRoom = {
        roomId,
        roomName: `${user.name.toUpperCase()}'s STATION`,
        hostId: userId,
        currentTrack: null,
        isPlaying: false,
        progressSecs: 0,
        lastUpdated: Date.now(),
        listeners: [{ ...newListener, isDj: true }],
        messages: [welcomeMsg],
        vibe: 50
      };
      await setDoc(roomDocRef, initialRoom);
    } else {
      const roomData = roomSnap.data();
      const currentListeners = roomData.listeners || [];
      const currentMessages = roomData.messages || [];

      // Avoid duplicates
      if (!currentListeners.some((l: any) => l.id === userId)) {
        currentListeners.push(newListener);
      }
      currentMessages.push(welcomeMsg);

      await updateDoc(roomDocRef, {
        listeners: currentListeners,
        messages: currentMessages
      });
    }

    // Subscribe to updates
    return onSnapshot(roomDocRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate({ roomId: docSnap.id, ...docSnap.data() });
      }
    });

  } catch (err) {
    console.error("Firestore joinJamRoom error:", err);
    throw err;
  }
}

// 3. Leave a jam room
export async function leaveJamRoom(roomId: string, userId: string, userName: string) {
  const roomDocRef = doc(db, "rooms", roomId);
  try {
    const roomSnap = await getDoc(roomDocRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      let currentListeners = roomData.listeners || [];
      const currentMessages = roomData.messages || [];

      currentListeners = currentListeners.filter((l: any) => l.id !== userId);
      
      currentMessages.push({
        id: `msg-system-${Date.now()}`,
        user: "SYSTEM",
        text: `${userName} left the room.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });

      // If empty and not default solaris room, delete it
      if (currentListeners.length === 0 && roomId !== "solaris-drift") {
        await deleteDoc(roomDocRef);
      } else {
        await updateDoc(roomDocRef, {
          listeners: currentListeners,
          messages: currentMessages
        });
      }
    }
  } catch (err) {
    console.error("Firestore leaveJamRoom error:", err);
  }
}

// 4. Update track sync
export async function updateJamRoomTrack(roomId: string, currentTrack: any, isPlaying: boolean, progressSecs: number) {
  const roomDocRef = doc(db, "rooms", roomId);
  try {
    await updateDoc(roomDocRef, {
      currentTrack,
      isPlaying,
      progressSecs,
      lastUpdated: Date.now()
    });
  } catch (err) {
    console.error("Firestore updateJamRoomTrack error:", err);
  }
}

// 5. Send message
export async function sendJamRoomMessage(roomId: string, user: any, text: string) {
  const roomDocRef = doc(db, "rooms", roomId);
  try {
    const roomSnap = await getDoc(roomDocRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const currentMessages = roomData.messages || [];
      const isDj = roomData.hostId === user.uid;
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        user: user.name,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDj
      };
      
      currentMessages.push(newMsg);
      const newVibe = Math.min((roomData.vibe || 50) + 3, 100);

      await updateDoc(roomDocRef, {
        messages: currentMessages,
        vibe: newVibe
      });
    }
  } catch (err) {
    console.error("Firestore sendJamRoomMessage error:", err);
  }
}

// 6. Wave
export async function sendJamRoomWave(roomId: string, senderName: string, targetName: string) {
  const roomDocRef = doc(db, "rooms", roomId);
  try {
    const roomSnap = await getDoc(roomDocRef);
    if (roomSnap.exists()) {
      const roomData = roomSnap.data();
      const currentMessages = roomData.messages || [];

      currentMessages.push({
        id: `msg-wave-${Date.now()}`,
        user: "SYSTEM",
        text: `${senderName} waved 👋 at ${targetName}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      });

      await updateDoc(roomDocRef, {
        messages: currentMessages
      });
    }
  } catch (err) {
    console.error("Firestore sendJamRoomWave error:", err);
  }
}
