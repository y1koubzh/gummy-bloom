"use client";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { GetStartedButton } from "@/components/ui/get-started-button";

type Point = {
  x: number;
  y: number;
};

interface WaveConfig {
  offset: number;
  amplitude: number;
  frequency: number;
  color: string;
  opacity: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function GlowyWavesHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 });
  const targetMouseRef = useRef<Point>({ x: 0, y: 0 });
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animationId: number;
    let time = 0;

    const computeThemeColors = () => {
      // Premium Gummy Bloom Palette
      return {
        backgroundTop: "#050914",
        backgroundBottom: "#0a0c10",
        wavePalette: [
          {
            offset: 0,
            amplitude: 70,
            frequency: 0.003,
            color: "#9333ea", // Purple
            opacity: 0.45,
          },
          {
            offset: Math.PI / 2,
            amplitude: 90,
            frequency: 0.0026,
            color: "#3b82f6", // Blue
            opacity: 0.35,
          },
          {
            offset: Math.PI,
            amplitude: 60,
            frequency: 0.0034,
            color: "#ec4899", // Pink
            opacity: 0.3,
          },
        ] satisfies WaveConfig[],
      };
    };

    let themeColors = computeThemeColors();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const recenterMouse = () => {
      const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };
      mouseRef.current = centerPoint;
      targetMouseRef.current = centerPoint;
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeave = () => {
      recenterMouse();
    };

    resizeCanvas();
    recenterMouse();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const drawWave = (wave: WaveConfig) => {
      ctx.save();
      ctx.beginPath();

      for (let x = 0; x <= canvas.width; x += 4) {
        const dx = x - mouseRef.current.x;
        const dy = canvas.height / 2 - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 400);
        const mouseEffect =
          influence * 50 * Math.sin(time * 0.001 + x * 0.01 + wave.offset);

        const y =
          canvas.height / 2 +
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) *
            wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) *
            (wave.amplitude * 0.45) +
          mouseEffect;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      time += 1;

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, themeColors.backgroundTop);
      gradient.addColorStop(1, themeColors.backgroundBottom);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      themeColors.wavePalette.forEach(drawWave);

      animationId = window.requestAnimationFrame(animate);
    };

    animationId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white"
      role="region"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-24 text-center md:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-purple-300 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-purple-400" aria-hidden="true" />
            {isArabic ? "مستقبل المكملات الغذائية" : "The Future of Supplements"}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-8 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            {isArabic ? "عالم " : "Welcome to "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic">
              Gummy Bloom
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-3xl text-xl text-gray-300 md:text-3xl font-light leading-relaxed"
          >
            {isArabic 
              ? "صمم مكملاتك الغذائية المخصصة بدقة علمية وتجربة بصرية غامرة. الصحة لم تكن بهذا الجمال من قبل." 
              : "Design your personalized supplements with scientific precision and immersive visual experience. Health has never looked this beautiful."}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <GetStartedButton 
              onClick={() => window.location.href = '/products'}
            />
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/products'}
              className="rounded-xl border-white/10 bg-white/5 px-10 py-7 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
            >
              {isArabic ? "تصفح المتجر" : "Explore Shop"}
            </Button>
          </motion.div>

          <motion.div
            className="grid gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl sm:grid-cols-3 max-w-4xl mx-auto"
          >
            {[
              { label: isArabic ? "طلب ناجح" : "Live Orders", value: "1,200+" },
              { label: isArabic ? "نقاوة المنتج" : "Product Purity", value: "100%" },
              { label: isArabic ? "زبائن سعداء" : "Happy Clients", value: "500+" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="space-y-2 text-center"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                  {stat.label}
                </div>
                <div className="text-4xl font-black text-white bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
