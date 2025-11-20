import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { GlassCard } from './GlassCard';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (audioFile: File, imageFile?: File) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
        setAudioFile(null);
        setImageFile(null);
        setImagePreview(null);
    }
  }, [isOpen]);

  // Audio Drag Handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleAudioDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
      }
    }
  }, []);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setAudioFile(e.target.files[0]);
    }
  };

  // Image Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
      if (audioFile) {
          onUpload(audioFile, imageFile || undefined);
      }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/60 backdrop-blur-sm"
        >
          <GlassCard 
            hoverEffect={false} 
            className="relative w-full max-w-lg p-8 mx-4 rounded-3xl border border-white/80 bg-white/70 shadow-2xl shadow-blue-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors z-10"
            >
              <Icons.Close size={24} />
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {audioFile ? 'Customize Clip' : 'Upload Voice Clip'}
              </h2>
            </div>

            {!audioFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleAudioDrop}
                  className={`
                    flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300
                    ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 bg-slate-50'}
                  `}
                >
                  <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-lg shadow-blue-200">
                    <Icons.Upload className="text-white w-8 h-8" />
                  </div>
                  <p className="text-slate-700 font-medium mb-2">Drag & Drop audio</p>
                  <p className="text-xs text-slate-400 mb-6">MP3, WAV, M4A</p>
                  
                  <label className="cursor-pointer px-6 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md border border-slate-100 transition-all text-sm font-semibold text-slate-700">
                    Choose Audio File
                    <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={handleAudioFileChange}
                    />
                  </label>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Selected Audio */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <Icons.Music size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-700 truncate">{audioFile.name}</p>
                            <p className="text-xs text-slate-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => setAudioFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Icons.Trash size={18} />
                        </button>
                    </div>

                    {/* Image Upload */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Cover Image (Optional)</label>
                        <div className="flex items-center gap-4">
                             <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group cursor-pointer shadow-inner">
                                 {imagePreview ? (
                                     <>
                                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <Icons.Upload className="text-white" size={20} />
                                         </div>
                                     </>
                                 ) : (
                                     <Icons.Image className="text-slate-300 group-hover:text-slate-400 transition-colors" size={32} />
                                 )}
                                 <input 
                                     type="file" 
                                     accept="image/*" 
                                     className="absolute inset-0 opacity-0 cursor-pointer"
                                     onChange={handleImageFileChange}
                                 />
                             </div>
                             <div className="flex-1">
                                 <p className="text-xs text-slate-500 mb-2">Upload a custom thumbnail for your voice clip.</p>
                                 {imageFile && (
                                     <button 
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                                     >
                                         <Icons.Trash size={12} /> Remove Image
                                     </button>
                                 )}
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-full font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>Create Clip</span>
                        <Icons.Check size={18} />
                    </button>
                </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};