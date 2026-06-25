import React, { useState } from "react";
import { LogIn, Key, Sparkles, Terminal } from "lucide-react";
import { signInWithGoogle, syncUserProfile } from "../../firebase";

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onGoToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onGoToRegister
}) => {
  const [idCode, setIdCode] = useState("");
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!idCode.trim()) {
      setError("COLLECTOR_ID_REQUIRED");
      return;
    }
    if (passkey.length < 4) {
      setError("PASSKEY_MUST_BE_AT_LEAST_4_CHARS");
      return;
    }

    setIsLoading(true);
    try {
      const data = await syncUserProfile(
        `credentials-${idCode.trim().toLowerCase()}`,
        idCode.trim(),
        `${idCode.trim().toLowerCase()}@retro.music`
      );
      if (data) {
        onLoginSuccess(data);
      } else {
        setError("BACKEND_SYNC_FAILED");
      }
    } catch (err: any) {
      setError("DATABASE_OFFLINE_OR_FAILED");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 font-mono bg-background overflow-y-auto h-full">
      <div className="w-full max-w-md bg-[#FAF3E0] border-2 border-[#1A1A1A] rounded-lg p-6 brutalist-shadow-thick flex flex-col gap-6 select-none">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b-2 border-text-charcoal pb-3 justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-black text-text-charcoal uppercase tracking-wider">
              VAULT_ACCESS_TERMINAL
            </h2>
          </div>
          <span className="text-[8px] bg-primary text-white border border-border-tan px-1.5 py-0.2 rounded font-bold">
            SECURE_v2.4
          </span>
        </div>

        {/* Diagnostic logs lines */}
        <div className="bg-[#1A1A1A] p-3 rounded text-[9px] text-green-500 font-mono leading-relaxed border border-gray-800">
          <p className="opacity-80">&gt; INITIALIZING SECURE LINK...</p>
          <p className="opacity-80">&gt; SHIELD_IP_ROUTING: VERIFIED (PORT_3000)</p>
          <p className="text-primary font-bold">&gt; GUEST_PROMPT: IDLE. ENTER IDENTIFICATION.</p>
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              COLLECTOR ID / USERNAME
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="AXONOMETRIC"
                value={idCode}
                onChange={(e) => setIdCode(e.target.value)}
                className="w-full bg-surface border-2 border-border-tan py-2.5 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <LogIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              SECURE PASSKEY
            </label>
            <div className="relative">
              <input 
                type="password"
                placeholder="••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="w-full bg-surface border-2 border-border-tan py-2.5 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {error && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              DIAGNOSTIC_ERROR: {error}
            </span>
          )}

          {/* Enter vault button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white border-2 border-text-charcoal py-3 rounded text-xs font-black tracking-widest hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 brutalist-shadow cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <>
                <span>ENTER THE VAULT</span>
                <span className="text-sm">→</span>
              </>
            )}
          </button>
        </form>

        {/* Separator / Google Sign In Mock */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border-tan"></div>
          <span className="flex-shrink mx-3 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
            OR_FEDERATED_SIGN_IN
          </span>
          <div className="flex-grow border-t border-border-tan"></div>
        </div>

        <button 
          onClick={async () => {
            setIsLoading(true);
            setError("");
            try {
              const result = await signInWithGoogle();
              if (result && result.user) {
                const data = await syncUserProfile(
                  result.user.uid,
                  result.user.displayName || "Google Curator",
                  result.user.email || "",
                  result.user.photoURL || undefined
                );
                if (data) {
                  onLoginSuccess(data);
                } else {
                  setError("BACKEND_SYNC_FAILED");
                }
              }
            } catch (err: any) {
              setError("GOOGLE_AUTH_FAILED");
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          }}
          className="w-full bg-white border border-border-tan py-2.5 rounded text-xs font-bold text-text-charcoal flex items-center justify-center gap-2 hover:bg-surface-container transition-colors cursor-pointer"
        >
          {/* Flat stylized Google logo visual */}
          <span className="w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center">G</span>
          <span>SIGN IN WITH GOOGLE</span>
        </button>

        {/* Go to register link */}
        <div className="text-center text-[10px] font-bold text-gray-500 mt-2">
          NEW COLLECTOR?{" "}
          <button 
            onClick={onGoToRegister}
            className="text-primary underline hover:text-opacity-80"
          >
            INITIALIZE ARCHIVE ACCESS
          </button>
        </div>
      </div>
    </div>
  );
};
