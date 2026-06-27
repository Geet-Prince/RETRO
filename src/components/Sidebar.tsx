import React from "react";
import { Screen, UserProfile } from "../types";
import { 
  Disc, 
  Compass, 
  Heart, 
  Radio, 
  User, 
  LogIn, 
  UserPlus, 
  Home,
  Sliders,
  Sparkles,
  X,
  ListMusic
} from "lucide-react";

interface SidebarProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  user: UserProfile | null;
  logout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  setScreen,
  user,
  logout,
  isDarkMode,
  toggleTheme,
  isOpen,
  onClose
}) => {
  const isPremium = !!user;

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 flex-shrink-0 border-r border-border-tan flex flex-col justify-between bg-surface h-full select-none font-mono transition-transform duration-300 z-50 
        fixed inset-y-0 left-0 md:static md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-5 border-b border-border-tan flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg font-black tracking-widest leading-none uppercase animate-retro-glow-red">RETRO</h1>
                <span className="text-[9px] text-gray-500 font-bold block mt-1 tracking-widest">HI-FI ARCHIVE v2.4</span>
              </div>
            </div>
            
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              aria-label="Close sidebar navigation"
              className="md:hidden p-1.5 rounded border border-border-tan hover:bg-surface-container text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>


          </div>

          {/* Navigation Section */}
          <div className="p-4 flex flex-col gap-6">
            {/* General Terminals */}
            <div>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest block mb-2 px-2">CORE_TERMINALS</span>
              <nav className="flex flex-col gap-1">
                {[
                  { s: Screen.NOW_SPINNING, label: "NOW_SPINNING", icon: Disc },
                  { s: Screen.DISCOVER, label: "DISCOVER_MUSIC", icon: Compass },
                  { s: Screen.LIKED_MUSIC, label: "LIKED_COLLECTION", icon: Heart },
                  { s: Screen.PLAYLIST, label: "PLAYLISTS", icon: ListMusic },
                  { s: Screen.JAM_TOGETHER, label: "JAM_TOGETHER", icon: Radio, badge: "LIVE" },
                  { s: Screen.PROFILE, label: "COLLECTOR_STATS", icon: User }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.s;
                  return (
                    <button
                      key={item.s}
                      onClick={() => {
                        setScreen(item.s);
                        onClose?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs tracking-tight transition-all duration-150 rounded border ${
                        isActive 
                          ? "bg-primary text-white border-primary brutalist-shadow" 
                          : "text-text-charcoal border-transparent hover:bg-surface-container hover:border-border-tan"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                        <span className="font-bold">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[8px] font-bold px-1 py-0.2 rounded border ${
                          isActive ? "bg-white text-primary border-white" : "bg-primary text-white border-primary animate-pulse"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

      {/* Bottom Profile / Account block */}
      <div className="border-t border-border-tan bg-surface-container p-4 font-mono">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img 
              src={
                user?.avatarUrl || 
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCuiYmL89VIWmay1zAOcQoTq8QGw980tcVWW3XmHLcaThUeBAjwtjBVn3zRynpuYkS0r3drGdS4iqPoo1EgCRPtE8-vH7N--o8up0B-NHY9MDWgarI6-nguFRxXcoF-UUyYPupvGFJO7ugI9Qr2PUJkgPOeRCL5MQJdkNWzqj1317kthel5aERuhct1J5CBVhN-Q7Q5zvwLwoOGeh0gBjvTNcNwk2dyMGnyzcx7xzM08AUL5Izd1E19659zyEgCUiVRfK9crKSlmU8"
              }
              alt="Avatar" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-sm border border-border-tan object-cover"
            />
            {isPremium && (
              <span className="absolute -bottom-1 -right-1 bg-primary text-white border border-border-tan text-[8px] font-bold px-1 rounded">
                LV99
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-text-charcoal truncate">
              {user ? user.name : "ANON_COLLECTOR"}
            </h4>
            <span className="text-[9px] text-gray-500 block truncate">
              {user ? user.idCode : "LEVEL_00 // guest"}
            </span>
          </div>
        </div>

        {/* Actions bar (Theme + Logout) */}
        <div className="flex gap-2 justify-between">
          <button 
            onClick={toggleTheme}
            className="flex-1 bg-surface border border-border-tan hover:bg-surface-container-high transition-colors py-1.5 px-2 rounded text-[10px] font-bold text-text-charcoal flex items-center justify-center gap-1.5"
            title="Toggle Visual Theme"
          >
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>THEME: {isDarkMode ? "DARK" : "WARM"}</span>
          </button>
          
          {isPremium && (
            <button 
              onClick={logout}
              className="bg-[#FFEAEA] border border-red-200 hover:bg-red-100 transition-colors px-2 py-1.5 rounded text-[10px] font-bold text-red-700"
              title="Disconnect Collector State"
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
