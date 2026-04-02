import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Leaf, Shield, Heart } from 'lucide-react';
import type { SelectedIngredient } from '@/pages/Builder';

interface GummyPreviewProps {
  color: string;
  ingredients: { name: string; category: string; priceModifier: number }[];
  packagingId?: number;
  flavorName?: string;
}

export default function GummyPreview({ 
  color, 
  ingredients, 
  packagingId,
  flavorName 
}: GummyPreviewProps) {
  
  // Map ingredient categories to icons/effects
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vitamin': return <Zap className="text-yellow-400 w-4 h-4" />;
      case 'mineral': return <Shield className="text-blue-400 w-4 h-4" />;
      case 'herbal': return <Leaf className="text-green-400 w-4 h-4" />;
      default: return <Sparkles className="text-white w-4 h-4" />;
    }
  };

  return (
    <div className="relative group w-full aspect-square flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-inner">
      {/* Dynamic Background Glow */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
        animate={{ 
          backgroundColor: color,
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      {/* Main Gummy Body */}
      <motion.div 
        className="relative w-48 h-48 cursor-pointer group"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow behind gummy */}
        <motion.div 
          className="absolute inset-0 rounded-full blur-3xl opacity-40"
          animate={{ backgroundColor: color }}
        />
        
        {/* Gummy Shape (3D-like with multiple layers) */}
        <div className="relative w-full h-full">
          {/* Main Base */}
          <div 
            className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl transition-all duration-700 ease-in-out border-t-2 border-white/30 backdrop-blur-sm"
            style={{ 
              backgroundColor: color, 
              boxShadow: `0 20px 40px -10px ${color}66, inset -10px -20px 40px rgba(0,0,0,0.3)` 
            }}
          />
          
          {/* Highlight / Sheen */}
          <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-white/40 rounded-full blur-md rotate-[-45deg]" />
          
          {/* Sub-surface Scattering Layer */}
          <div 
            className="absolute inset-[15%] rounded-full opacity-40 blur-sm"
            style={{ backgroundColor: '#fff' }}
          />

          {/* Ingredient Particles / Effects */}
          <AnimatePresence>
            {ingredients.map((ing, i) => (
              <motion.div
                key={`${ing.name}-${i}`}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0.8, 
                  scale: 1,
                  x: Math.sin(i * 1.5) * 50,
                  y: Math.cos(i * 1.5) * 50
                }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute left-1/2 top-1/2 -ml-3 -mt-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg z-20"
                transition={{ type: "spring", stiffness: 100 }}
              >
                {getCategoryIcon(ing.category)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Floating Labels */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {flavorName && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold"
            >
              {flavorName}
            </motion.span>
          )}
          {ingredients.map((ing, i) => (
            <motion.span 
              key={ing.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-[10px] font-semibold"
            >
              {ing.name}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive Helper */}
      <div className="absolute top-4 right-4 text-white/40 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-widest">Real-time Preview</span>
        <Sparkles size={12} />
      </div>
    </div>
  );
}
