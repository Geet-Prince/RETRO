import React from "react";
import { Screen } from "../../types";
import { Disc, Sparkles, ArrowRight, Shield, Cpu, Activity, Music, Check, ChevronLeft, ChevronRight, Radio, User } from "lucide-react";

interface LandingPageScreenProps {
  setScreen: (screen: Screen) => void;
  isLoggedIn: boolean;
}

export const LandingPageScreen: React.FC<LandingPageScreenProps> = ({
  setScreen,
  isLoggedIn
}) => {
  return (
    <div className="flex-1 flex flex-col font-mono overflow-y-auto overflow-x-hidden scrollbar-hide h-full bg-background relative select-none">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,184,154,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(200,184,154,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Hero Section inspired by HTML & IMAGE_13 */}
      <section className="relative min-h-[85vh] flex flex-col items-center text-center px-4 md:px-8 overflow-hidden bg-surface-container-low border-b-4 border-text-charcoal pt-0">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Huge overlapping background vinyl disk - Exact hemicircle */}
          <div className="relative mx-auto w-[120vw] h-[60vw] md:w-[1000px] md:h-[500px] overflow-hidden">
            <div className="w-[120vw] h-[120vw] md:w-[1000px] md:h-[1000px] absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-black border-[16px] md:border-[20px] border-text-charcoal spinning-slow shadow-2xl">
              
              {/* Vinyl grooved rings */}
              <div className="absolute inset-1 md:inset-2 rounded-full border border-gray-800 opacity-90" />
              <div className="absolute inset-4 md:inset-8 rounded-full border border-gray-950 opacity-95" />
              <div className="absolute inset-8 md:inset-16 rounded-full border border-gray-900 opacity-80" />
              <div className="absolute inset-12 md:inset-24 rounded-full border border-gray-950 opacity-90" />
              <div className="absolute inset-16 md:inset-32 rounded-full border border-gray-900 opacity-60" />

              {/* Shiny reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full transform -rotate-45" />

              {/* Center record label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/4 h-1/4 bg-primary rounded-full border-2 md:border-4 border-text-charcoal flex items-center justify-center">
                  <div className="w-6 h-6 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 md:w-4 md:h-4 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero text branding */}
          <div className="relative flex flex-col items-center max-w-3xl pt-6 md:pt-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-0 mt-4 md:mt-8">
              <h1 className="text-[80px] sm:text-[120px] md:text-[180px] leading-[0.8] uppercase tracking-tighter text-text-charcoal font-black italic">
                BUZZ
              </h1>
              <h1 className="text-[80px] sm:text-[120px] md:text-[180px] leading-[0.8] uppercase tracking-tighter text-text-charcoal font-black">
                <span className="text-primary italic ml-4">IT</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 font-bold max-w-lg mt-8 mb-8 px-4 leading-relaxed">
              Welcome to a high-density tactile hifi universe. Stream pure tape loops, direct-drive quartz turntables, and modular synthesisers directly onto your master console. No filler. Just perfect lossless frequencies.
            </p>

            {/* Access CTAs */}
            <div className="flex gap-4 mb-16 z-20">
              {isLoggedIn ? (
                <button 
                  onClick={() => setScreen(Screen.NOW_SPINNING)}
                  className="bg-primary text-white border-2 border-text-charcoal px-6 py-3.5 text-xs font-black tracking-widest hover:bg-opacity-95 transition-all flex items-center gap-2 brutalist-shadow-thick cursor-pointer"
                >
                  <span>ENTER THE MASTER DECK</span>
                  <ArrowRight className="w-4 h-4 animate-bounce" />
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setScreen(Screen.LOGIN)}
                    className="bg-primary text-white border-2 border-text-charcoal px-6 py-3.5 text-xs font-black tracking-widest hover:bg-opacity-95 transition-all flex items-center gap-2 brutalist-shadow-thick cursor-pointer"
                  >
                    <span>LOG IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setScreen(Screen.REGISTER)}
                    className="bg-white border-2 border-[#C8B89A] hover:bg-surface-container px-6 py-3.5 text-xs font-bold text-text-charcoal cursor-pointer brutalist-shadow"
                  >
                    CREATE ACCOUNT
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Marquee Social Proof */}
      <div className="bg-text-charcoal text-white py-2 border-b-4 border-text-charcoal overflow-hidden select-none relative z-10">
        <div className="marquee font-semibold uppercase">
          <div className="marquee-content text-[11px] md:text-xs tracking-widest font-bold flex gap-12 whitespace-nowrap">
            <span className="mx-4">JOIN 50,000+ COLLECTORS REDISCOVERING THE ART OF THE ALBUM</span>
            <span className="text-primary">///</span>
            <span className="mx-4">24-BIT LOSSLESS AUDIO STREAMING</span>
            <span className="text-primary">///</span>
            <span className="mx-4">AUTHENTIC VINYL CRACKLE SIMULATION</span>
            <span className="text-primary">///</span>
            <span className="mx-4">JOIN 50,000+ COLLECTORS REDISCOVERING THE ART OF THE ALBUM</span>
            <span className="text-primary">///</span>
            <span className="mx-4">24-BIT LOSSLESS AUDIO STREAMING</span>
            <span className="text-primary">///</span>
            <span className="mx-4">AUTHENTIC VINYL CRACKLE SIMULATION</span>
            <span className="text-primary">///</span>
          </div>
        </div>
      </div>

      {/* Feature Showcase: Redesigned for High Impact */}
      <section className="bg-surface relative z-10">
        
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-text-charcoal group">
          <div className="p-8 md:p-16 space-y-4 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-text-charcoal group-hover:bg-primary transition-colors duration-500">
            <span className="text-[10px] font-bold text-primary tracking-widest group-hover:text-white uppercase">FEATURE_01</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-text-charcoal group-hover:text-white leading-none">
              TACTILE<br />INTERFACE
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed group-hover:text-white/90">
              Focus on the CD jewel case cards and 3D interactions. Every interaction is designed to feel physical, weighted, and deliberate. Drag, flip, and stack your virtual collection.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setScreen(isLoggedIn ? Screen.NOW_SPINNING : Screen.LOGIN)}
                className="px-6 py-3 border-2 border-text-charcoal bg-white font-bold text-xs uppercase text-text-charcoal group-hover:shadow-[4px_4px_0px_0px_#000] transition-shadow duration-300"
              >
                EXPLORE MECHANICS
              </button>
            </div>
          </div>
          <div className="bg-surface-container h-[350px] md:h-auto relative overflow-hidden flex items-center justify-center p-8">
            <div className="relative w-56 h-72 border-2 border-text-charcoal bg-white shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700 overflow-hidden">
              <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQSXhgxp--NX1lLz1n7beU5AdQ7b4FTCkZPz0OMGC-GkTNsAASAjvjILeYoTF_gIQhtY-ePym69xmtiFUmcaXz5zZMCfal513DYIsYuFUstkhTvnvi-5MHPSOsx9xX-i-HYRSjAWnOqBo4Rb6VcIFxFc70MxkvSI1C48W1OFpYGz71vcSZ-2GqwHY7UxbK0QuPG3ysAa5ETAbcVFmwWb_rofMIAgKMDEFJrwysydDEtwCrseVKl2ybnTJJSOEE3P890-6BIs6PzXc" 
                alt="Tactile UI Preview"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-text-charcoal group">
          <div className="bg-surface-container-high h-[300px] md:h-auto order-2 md:order-1 relative flex items-center justify-center p-8">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-primary border-2 border-text-charcoal flex items-center justify-center text-white animate-bounce shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div className="w-14 h-14 rounded-full bg-secondary border-2 border-text-charcoal flex items-center justify-center text-white animate-bounce [animation-delay:200ms] shadow-md">
                <Radio className="w-6 h-6" />
              </div>
              <div className="w-14 h-14 rounded-full bg-text-charcoal border-2 border-text-charcoal flex items-center justify-center text-white animate-bounce [animation-delay:400ms] shadow-md">
                <Music className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="p-8 md:p-16 space-y-4 flex flex-col justify-center border-b-4 md:border-b-0 md:border-l-4 border-text-charcoal order-1 md:order-2 group-hover:bg-primary transition-colors duration-500">
            <span className="text-[10px] font-bold text-primary tracking-widest group-hover:text-white uppercase">FEATURE_02</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-text-charcoal group-hover:text-white leading-none">
              JAM<br />TOGETHER
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed group-hover:text-white/90">
              Join collaborative listening rooms and live vinyl spinning sessions. Real-time audio sync for the ultimate curated experience. Community-driven playlists that live and breathe.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setScreen(isLoggedIn ? Screen.JAM_TOGETHER : Screen.LOGIN)}
                className="px-6 py-3 border-2 border-text-charcoal bg-white font-bold text-xs uppercase text-text-charcoal group-hover:shadow-[4px_4px_0px_0px_#000] transition-shadow duration-300"
              >
                JOIN A ROOM
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-text-charcoal group">
          <div className="p-8 md:p-16 space-y-4 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-text-charcoal group-hover:bg-primary transition-colors duration-500">
            <span className="text-[10px] font-bold text-primary tracking-widest group-hover:text-white uppercase">FEATURE_03</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-text-charcoal group-hover:text-white leading-none">
              LOSSLESS<br />FOCUS
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-bold leading-relaxed group-hover:text-white/90">
              High-fidelity 24-bit audio streams wrapped in retro-brutalist aesthetics. No compression, no compromise, no distractions. Hear every detail exactly as the artist intended.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => alert("Lossless Stream Active: Core frequency verified at 44.1kHz / 24-bit PCM. No dynamic range compression applied.")}
                className="px-6 py-3 border-2 border-text-charcoal bg-white font-bold text-xs uppercase text-text-charcoal group-hover:shadow-[4px_4px_0px_0px_#000] transition-shadow duration-300"
              >
                TECH SPECS
              </button>
            </div>
          </div>
          <div className="bg-surface-dim h-[300px] md:h-auto flex items-center justify-center p-8">
            <div className="border-2 border-text-charcoal bg-white p-6 w-full max-w-sm space-y-3 shadow-xl">
              <div className="h-4 bg-primary w-full" />
              <div className="h-4 bg-primary w-3/4" />
              <div className="h-4 bg-primary w-1/2" />
              <div className="h-28 border-2 border-text-charcoal bg-surface-container flex items-center justify-center">
                <span className="text-3xl font-black italic text-primary uppercase">LOSSLESS</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Membership Access Levels */}
      <section className="px-4 md:px-8 py-16 bg-surface border-b-4 border-text-charcoal relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">ACCESS LEVELS</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3 text-text-charcoal">
            OWN THE LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-bold max-w-lg mx-auto">
            Select your entry point into the world's most curated high-fidelity digital archive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* TIER 01 */}
          <div className="border-2 border-text-charcoal bg-white p-6 md:p-8 space-y-4 flex flex-col justify-between hover:shadow-[8px_8px_0px_0px_#C8B89A] transition-shadow">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TIER 01 / PUBLIC</div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-text-charcoal">LISTENER</h3>
              <div className="text-3xl font-black text-text-charcoal tracking-tighter">FREE</div>
              <ul className="space-y-2 text-[11px] font-bold text-gray-500 py-4 border-y-2 border-border-tan/30">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> LOSSLESS STREAMING</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> COMMUNITY ROOMS</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> WEB PLAYER ACCESS</li>
                <li className="flex items-center gap-2 opacity-30 italic"><span className="w-3.5 h-3.5 flex items-center justify-center">✗</span> EXCLUSIVE BOX-SETS</li>
              </ul>
            </div>
            <button 
              onClick={() => setScreen(isLoggedIn ? Screen.NOW_SPINNING : Screen.LOGIN)}
              className="w-full py-3.5 border-2 border-text-charcoal bg-white text-text-charcoal hover:bg-surface-container font-bold text-xs uppercase tracking-wider transition-colors"
            >
              INITIALIZE SESSION
            </button>
          </div>

          {/* TIER 02 */}
          <div className="border-2 border-text-charcoal bg-primary text-white p-6 md:p-8 space-y-4 flex flex-col justify-between relative overflow-hidden hover:shadow-[8px_8px_0px_0px_#1A1A1A] transition-shadow">
            <div className="absolute top-4 right-4 bg-white text-primary font-bold px-3 py-1 border border-text-charcoal text-[9px] tracking-wider uppercase">
              VERIFIED
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">TIER 02 / ELITE</div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">COLLECTOR</h3>
              <div className="text-3xl font-black tracking-tighter">$12.99 <span className="text-xs font-normal">/ MO</span></div>
              <ul className="space-y-2 text-[11px] font-bold py-4 border-y-2 border-white/20">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white flex-shrink-0" /> 24-BIT ULTRA FIDELITY</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white flex-shrink-0" /> PHYSICAL JEWEL CARDS</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white flex-shrink-0" /> OFFLINE MASTER ACCESS</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-white flex-shrink-0" /> PRIORITY BOX-SET DROPS</li>
              </ul>
            </div>
            <button 
              onClick={() => setScreen(Screen.REGISTER)}
              className="w-full py-3.5 bg-white text-primary border-2 border-text-charcoal hover:bg-surface-container font-bold text-xs uppercase tracking-wider transition-colors"
            >
              UPGRADE TO COLLECTOR
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
