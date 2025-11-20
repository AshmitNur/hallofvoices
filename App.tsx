import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './components/Icons';
import { GlassCard } from './components/GlassCard';
import { AudioVisualizer } from './components/AudioVisualizer';
import { UploadModal } from './components/UploadModal';
import { MOCK_CLIPS, BACKGROUND_GRADIENT } from './constants';
import { VoiceClip, ViewState, AudioState } from './types';

// --- Sub-Components ---

const Navigation: React.FC<{ 
  currentView: ViewState, 
  setView: (v: ViewState) => void,
  onUploadClick: () => void 
}> = ({ currentView, setView, onUploadClick }) => (
  <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 md:py-6 pointer-events-none">
    <div className="pointer-events-auto flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.LANDING)}>
      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
         <div className="w-3 h-3 bg-slate-800 rounded-full" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Hall Of Voices</h1>
    </div>

    <div className="pointer-events-auto hidden md:flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-xl shadow-slate-100">
      {[
        { id: ViewState.DASHBOARD, icon: Icons.Grid, label: 'Gallery' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
            ${currentView === item.id 
              ? 'bg-white shadow-sm text-slate-900 border border-slate-100' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}
          `}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      ))}
    </div>

    <div className="pointer-events-auto flex items-center gap-4">
      <button 
        onClick={onUploadClick}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-full text-sm font-medium transition-all shadow-sm"
      >
        <Icons.Upload size={18} />
        <span className="hidden sm:inline">Upload</span>
      </button>
      <button 
        onClick={() => setView(ViewState.PROFILE)}
        className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all"
      >
        <Icons.User size={20} />
      </button>
    </div>
  </nav>
);

const LandingView: React.FC<{ onEnter: () => void }> = ({ onEnter }) => (
  <div className="relative flex flex-col items-center justify-center h-screen w-full text-center px-4">
    {/* Background Soft Blobs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-slate-100/50 rounded-full blur-[120px] mix-blend-multiply" />

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="z-10 max-w-3xl"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
        Hall Of Voices
      </h1>
      <p className="text-[16px] text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}>
        Developed by NoOnE
      </p>
      
      <button 
        onClick={onEnter}
        className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-slate-800 transition-all duration-200 bg-white border border-slate-200 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-slate-200 hover:border-slate-300"
      >
        <span className="mr-3">Enter Gallery</span>
        <Icons.Play size={20} className="fill-slate-800" />
      </button>
    </motion.div>
  </div>
);

// 3D Audio Card Component (Vinyl Style)
const ClipBubble: React.FC<{ clip: VoiceClip, onClick: () => void, isPlaying: boolean, index: number }> = ({ clip, onClick, isPlaying, index }) => {
  const sizeClass = 'w-64 h-64';

  return (
    <motion.div
      className="relative flex flex-col items-center m-8 group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
       {/* Vinyl Disc */}
       <div className={`${sizeClass} relative mb-6`}>
          <GlassCard 
            onClick={onClick}
            className="w-full h-full rounded-full border-0 bg-transparent shadow-2xl shadow-slate-400/40"
            hoverEffect={true}
          >
             <motion.div 
                className="w-full h-full rounded-full relative overflow-hidden"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
             >
                 {/* Vinyl Texture Background */}
                <div 
                    className="absolute inset-0 bg-slate-900"
                    style={{
                        background: 'repeating-radial-gradient(#334155 0, #334155 2px, #0f172a 3px, #0f172a 4px)'
                    }}
                />
                
                {/* Label (Thumbnail) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full overflow-hidden border-4 border-slate-800 bg-slate-200 shadow-lg z-10">
                     {clip.imageUrl ? (
                         <img src={clip.imageUrl} alt="label" className="w-full h-full object-cover" />
                     ) : (
                         <div className={`w-full h-full bg-gradient-to-br ${clip.color} flex items-center justify-center`}>
                             <Icons.Music className="text-white/60 w-1/2 h-1/2" />
                         </div>
                     )}
                     {/* Spindle Hole */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border border-slate-700" />
                </div>
            </motion.div>

            {/* Glossy Reflection Overlays (Static) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none mix-blend-overlay" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />

            {/* Hover/Play States */}
             {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                    <AudioVisualizer isPlaying={true} color="bg-white" />
                </div>
             )}
             
             {!isPlaying && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px] z-20 cursor-pointer">
                     <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md transform group-hover:scale-110 transition-transform">
                        <Icons.Play className="text-slate-900 ml-1" size={24} fill="currentColor" />
                     </div>
                </div>
             )}
          </GlassCard>
          
          {/* Floor Shadow */}
          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-4 rounded-[100%] bg-slate-900/20 blur-lg transition-all duration-500 group-hover:w-[90%] group-hover:bg-slate-900/30`} />
       </div>

       {/* Metadata Pill */}
       <GlassCard 
          hoverEffect={false}
          className="px-5 py-2.5 rounded-full bg-white/70 border border-white/50 backdrop-blur-xl shadow-sm flex flex-col items-center text-center min-w-[160px] z-10"
       >
            <h3 className="text-slate-800 font-bold text-sm truncate max-w-[180px] leading-tight">{clip.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-1">
                <span className="uppercase tracking-wider">{clip.date}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{clip.duration}</span>
            </div>
       </GlassCard>
    </motion.div>
  );
};

const DashboardView: React.FC<{ 
  clips: VoiceClip[], 
  onClipClick: (clip: VoiceClip) => void,
  playingClipId: string | undefined
}> = ({ clips, onClipClick, playingClipId }) => (
  <div className="pt-32 pb-32 px-6 md:px-10 w-full min-h-screen z-10 relative overflow-hidden">
    
    {/* Search & Filter Header */}
    <div className="relative z-20 flex flex-col md:flex-row justify-between items-end mb-12 gap-6 max-w-[90rem] mx-auto">
      <div>
        <h2 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">Library</h2>
        <p className="text-slate-500 text-lg">Your sonic collection</p>
      </div>
      <div className="flex gap-3">
        <div className="relative group">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all w-72 shadow-sm"
          />
        </div>
      </div>
    </div>

    {/* 3D Floating Space */}
    <div className="relative w-full max-w-[90rem] mx-auto flex flex-wrap justify-center items-start gap-2 perspective-[1000px]">
      {clips.length > 0 ? (
        clips.map((clip, index) => (
          <ClipBubble 
              key={clip.id} 
              clip={clip} 
              onClick={() => onClipClick(clip)} 
              isPlaying={playingClipId === clip.id}
              index={index}
          />
        ))
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-20 opacity-50">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Icons.Mic className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-400 text-lg font-medium">No voice clips yet</p>
          <p className="text-slate-300 text-sm">Upload a clip to get started</p>
        </div>
      )}
    </div>
  </div>
);

const MiniPlayer: React.FC<{ 
  audioState: AudioState, 
  onTogglePlay: () => void,
  onExpand: () => void 
}> = ({ audioState, onTogglePlay, onExpand }) => {
  if (!audioState.currentClip) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 left-6 right-6 md:left-auto md:right-10 md:w-96 z-40"
    >
      <GlassCard 
        hoverEffect={false}
        className="flex items-center justify-between p-4 pr-6 bg-white/90 border-white/60 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] rounded-2xl backdrop-blur-xl"
        onClick={onExpand}
      >
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative shrink-0`}>
            {audioState.currentClip.imageUrl ? (
                 <img src={audioState.currentClip.imageUrl} className="w-full h-full object-cover" alt="cover" />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${audioState.currentClip.color} flex items-center justify-center`}>
                    <Icons.Mic className="text-white/80 w-6 h-6" />
                </div>
            )}
             {/* Spinner overlay */}
             {audioState.isPlaying && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-slate-800 font-bold text-sm truncate">{audioState.currentClip.title}</span>
            <span className="text-slate-500 text-xs font-medium">Playing now</span>
          </div>
        </div>

        <div className="flex items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
            className="w-12 h-12 rounded-full bg-transparent border border-slate-200 text-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            {audioState.isPlaying ? <Icons.Pause size={20} fill="currentColor" /> : <Icons.Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const FullPlayerOverlay: React.FC<{ 
  audioState: AudioState, 
  onClose: () => void, 
  onTogglePlay: () => void
}> = ({ audioState, onClose, onTogglePlay }) => {
  if (!audioState.currentClip) return null;

  // Calculate progress percentage
  const progress = audioState.currentClip.durationSec > 0 
    ? (audioState.currentTime / audioState.currentClip.durationSec) * 100 
    : 0;
    
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70"
    >
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 p-4 rounded-full bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition-all shadow-sm hover:shadow-md"
      >
        <Icons.Close size={24} />
      </button>

      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-lg p-8 flex flex-col items-center"
      >
        {/* Album Art / Rectangle Cover */}
        <div className="relative w-full max-w-sm aspect-square mb-10 flex items-center justify-center">
          <div className="relative w-full h-full rounded-3xl bg-white shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
             {audioState.currentClip.imageUrl ? (
                 <img 
                    src={audioState.currentClip.imageUrl} 
                    alt="Album Art" 
                    className="w-full h-full object-cover" 
                 />
             ) : (
                 <div className={`w-full h-full bg-gradient-to-br ${audioState.currentClip.color} flex items-center justify-center`}>
                    <Icons.Mic className="w-32 h-32 text-white/50 drop-shadow-md" />
                 </div>
             )}
          </div>
          {/* Soft ambient glow behind */}
          <div className="absolute -inset-4 bg-slate-300/30 blur-2xl rounded-full -z-10" />
        </div>

        {/* Info */}
        <div className="text-center mb-10 w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 tracking-tight leading-tight whitespace-normal break-words">{audioState.currentClip.title}</h2>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">{audioState.currentClip.tags.join(' • ')}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-12 px-2">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
             <div 
               className="h-full bg-slate-800 transition-all duration-200"
               style={{ width: `${progress}%` }}
             />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-bold font-mono tracking-wide">
             <span>{formatTime(audioState.currentTime)}</span>
             <span>{audioState.currentClip.duration}</span>
          </div>
        </div>

        {/* Controls - All Same Size and Monochrome */}
        <div className="flex items-center justify-center gap-6 w-full">
           <button className="w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all hover:shadow-md">
             <Icons.Share size={22} />
           </button>
           
           <button className="w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all hover:shadow-md">
             <Icons.Prev size={26} />
           </button>
           
           <button 
             onClick={onTogglePlay}
             className="w-16 h-16 rounded-full border border-slate-800 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-300/50"
           >
              {audioState.isPlaying ? <Icons.Pause size={26} fill="currentColor" /> : <Icons.Play size={26} fill="currentColor" className="ml-1"/>}
           </button>
           
           <button className="w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-all hover:shadow-md">
             <Icons.Next size={26} />
           </button>
           
           <button className="w-16 h-16 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all hover:shadow-md">
             <Icons.Heart size={22} />
           </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

// --- Main App Logic ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [clips, setClips] = useState<VoiceClip[]>(MOCK_CLIPS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    volume: 1,
    currentClip: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous"; 
    
    const handleEnded = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };
    
    const handleTimeUpdate = () => {
        if(audioRef.current) {
            setAudioState(prev => ({ ...prev, currentTime: audioRef.current!.currentTime }));
        }
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
        if(audioRef.current) {
            audioRef.current.removeEventListener('ended', handleEnded);
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.pause();
        }
    }
  }, []);

  // Manage Play/Pause Effect
  useEffect(() => {
    if (audioState.currentClip && audioRef.current) {
       const currentSrc = audioRef.current.src;
       if (audioState.currentClip.audioUrl && !currentSrc.includes(audioState.currentClip.audioUrl)) {
           audioRef.current.src = audioState.currentClip.audioUrl;
           audioRef.current.load();
       }

       if (audioState.isPlaying) {
           const playPromise = audioRef.current.play();
           if (playPromise !== undefined) {
               playPromise.catch(error => {
                   console.error("Playback failed", error);
                   setAudioState(prev => ({ ...prev, isPlaying: false }));
               });
           }
       } else {
           audioRef.current.pause();
       }
    }
  }, [audioState.currentClip, audioState.isPlaying]);

  // Mouse Parallax for background
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClipClick = (clip: VoiceClip) => {
    if (audioState.currentClip?.id === clip.id) {
        setIsFullPlayerOpen(true);
        if(!audioState.isPlaying) {
             setAudioState(prev => ({ ...prev, isPlaying: true }));
        }
    } else {
        setAudioState(prev => ({
            ...prev,
            currentClip: clip,
            isPlaying: true,
            currentTime: 0
        }));
        setIsFullPlayerOpen(true);
    }
  };

  const togglePlay = () => {
    setAudioState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleUpload = (audioFile: File, imageFile?: File) => {
    const audioUrl = URL.createObjectURL(audioFile);
    let imageUrl = undefined;
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }
    
    const newClip: VoiceClip = {
      id: Date.now().toString(),
      title: audioFile.name.replace(/\.[^/.]+$/, ""),
      duration: '0:00', 
      durationSec: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      tags: ['New', 'Upload'],
      color: 'from-gray-100 to-slate-200',
      audioUrl: audioUrl,
      imageUrl: imageUrl
    };
    
    setTimeout(() => {
      setClips([newClip, ...clips]);
      setIsUploadOpen(false);
      handleClipClick(newClip);
    }, 500);
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${BACKGROUND_GRADIENT} text-slate-800 selection:bg-blue-100 selection:text-slate-900`}>
      
      {/* Background Mesh (Light Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-50/80 rounded-full blur-[120px] transition-transform duration-[4s] ease-out"
          style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-50/80 rounded-full blur-[120px] transition-transform duration-[4s] ease-out"
          style={{ transform: `translate(${mousePos.x * 1}px, ${mousePos.y * 1}px)` }}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <AnimatePresence mode="wait">
        {view === ViewState.LANDING ? (
          <motion.div 
            key="landing"
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <LandingView onEnter={() => setView(ViewState.DASHBOARD)} />
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 h-full min-h-screen"
          >
            <Navigation 
              currentView={view} 
              setView={setView} 
              onUploadClick={() => setIsUploadOpen(true)} 
            />
            
            <main>
              {view === ViewState.DASHBOARD && (
                <DashboardView 
                   clips={clips} 
                   onClipClick={handleClipClick} 
                   playingClipId={audioState.isPlaying ? audioState.currentClip?.id : undefined}
                />
              )}
              {view === ViewState.PROFILE && (
                 <div className="h-screen flex items-center justify-center text-slate-400 font-light text-xl">
                 Profile Settings coming soon...
               </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUpload={handleUpload} 
      />

      <AnimatePresence>
        {isFullPlayerOpen && (
          <FullPlayerOverlay 
            audioState={audioState} 
            onClose={() => setIsFullPlayerOpen(false)} 
            onTogglePlay={togglePlay}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {audioState.currentClip && !isFullPlayerOpen && view !== ViewState.LANDING && (
           <MiniPlayer 
             audioState={audioState} 
             onTogglePlay={togglePlay}
             onExpand={() => setIsFullPlayerOpen(true)}
           />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;