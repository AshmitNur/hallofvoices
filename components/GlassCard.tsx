import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !hoverEffect) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    setRotateX(yPct * -10); // Reduced rotation for subtler effect
    setRotateY(xPct * 10);
  };

  const handleMouseLeave = () => {
    if (!hoverEffect) return;
    setRotateX(0);
    setRotateY(0);
  };

  // Updated defaults for Light Theme: bg-white/40, light borders, soft dark shadows
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden border border-white/60 bg-white/40 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all duration-200 ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX,
        rotateY,
        scale: hoverEffect && (rotateX !== 0 || rotateY !== 0) ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Reflection Shine - adjusted for light theme */}
      <div 
        className="pointer-events-none absolute -inset-[100%] block opacity-40 bg-gradient-to-br from-transparent via-white/80 to-transparent"
        style={{
            transform: `translate(${rotateY * 2}%, ${rotateX * 2}%) rotate(45deg)`
        }}
      />
      
      {children}
    </motion.div>
  );
};