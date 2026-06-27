import React, { useState } from "react";
import { UserPlus, Mail, Key, User, ShieldCheck } from "lucide-react";
import { signInWithGoogle, syncUserProfile } from "../../firebase";

interface RegisterScreenProps {
  onRegisterSuccess: (userData: any) => void;
  onGoToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onGoToLogin
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("COLLECTOR_NAME_REQUIRED");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("INVALID_EMAIL_ADDRESS");
      return;
    }
    if (passkey.length < 4) {
      setError("PASSKEY_TOO_SHORT_MIN_4_CHARS");
      return;
    }
    if (passkey !== confirmPass) {
      setError("PASSKEYS_DO_NOT_MATCH");
      return;
    }

    setIsLoading(true);
    try {
      const data = await syncUserProfile(
        `credentials-${name.trim().toLowerCase()}`,
        name.trim(),
        email.trim()
      );
      if (data) {
        onRegisterSuccess(data);
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
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-text-charcoal pb-3 justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-black text-text-charcoal uppercase tracking-wider">
              NEW COLLECTOR REGISTER
            </h2>
          </div>
          <span className="text-[8px] bg-primary text-white border border-border-tan px-1.5 py-0.2 rounded font-bold">
            INITIALIZE
          </span>
        </div>

        {/* Security guidelines box */}
        <div className="bg-[#FAF3E0] p-3 rounded text-[9.5px] text-gray-600 font-bold border border-border-tan leading-relaxed flex gap-2 items-start">
          <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <span>
            Creating an archive identity reserves your unique collector frequency. Lossless high-fidelity streaming is unlocked immediately upon authorization.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              COLLECTOR HANDLE NAME
            </label>
            <div className="relative">
              <input 
                type="text"
                placeholder="e.g. FOCUS_WAVE"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full bg-surface border-2 border-border-tan py-2 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input 
                type="email"
                placeholder="collector@archive.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-surface border-2 border-border-tan py-2 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Passkey */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              ARCHIVE PASSKEY
            </label>
            <div className="relative">
              <input 
                type="password"
                placeholder="••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-surface border-2 border-border-tan py-2 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Confirm passkey */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              CONFIRM ARCHIVE PASSKEY
            </label>
            <div className="relative">
              <input 
                type="password"
                placeholder="••••"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-surface border-2 border-border-tan py-2 pl-9 pr-3 rounded text-xs font-bold text-text-charcoal focus:outline-none focus:border-primary"
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {error && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              REGISTRATION_ERROR: {error}
            </span>
          )}

          {/* Create Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white border-2 border-text-charcoal py-3 rounded text-xs font-black tracking-widest hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 brutalist-shadow cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              "INITIALIZE ARCHIVE ACCESS"
            )}
          </button>
        </form>

        {/* Federated google block */}
        <div className="relative flex py-1 items-center">
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
                  onRegisterSuccess(data);
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
          <span className="w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center">G</span>
          <span>SIGN IN WITH GOOGLE</span>
        </button>

        {/* Go to login */}
        <div className="text-center text-[10px] font-bold text-gray-500 mt-1">
          ALREADY LICENSED?{" "}
          <button 
            onClick={onGoToLogin}
            className="text-primary underline hover:text-opacity-80"
          >
            ACCESS TERMINAL
          </button>
        </div>
      </div>
    </div>
  );
};
