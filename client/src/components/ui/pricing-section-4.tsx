"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const GUMMY_PLANS = [
  {
    name: "Focus Spark",
    description: "أقراص 'فوكوس سبارك' لمساعدتك على التركيز وزيادة الإنتاجية طوال اليوم.",
    price: 1800,
    yearlyPrice: 1500, // Monthly equivalent if subscribed
    buttonText: "اشتري الآن",
    buttonVariant: "outline" as const,
    includes: [
      "محتويات العلبة:",
      "30 حبة غامي مركزة",
      "خالي من الجيلاتين الحيواني",
      "نكهة الليمون الطبيعي",
      "فيتامين B12 المتطور",
    ],
    popular: false,
  },
  {
    name: "Deep Sleep Melts",
    description: "استمتع بليلة نوم هادئة مع الميلاتونين والبابونج الطبيعي.",
    price: 2500,
    yearlyPrice: 2200,
    buttonText: "جرب الآن",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "فوائد النوم العميق:",
      "60 حبة للاسترخاء",
      "مستخلص جذور الفاليريان",
      "مغنيسيوم عالي الامتصاص",
      "بدون سكر مضاف",
    ],
  },
  {
    name: "Glow Bloom",
    description: "كولاجين وبيوتين ممتاز لبشرة نابضة بالحياة وشعر صحي وقوي.",
    price: 4500,
    yearlyPrice: 3800,
    buttonText: "ابدئي التألق",
    buttonVariant: "outline" as const,
    includes: [
      "باقة الجمال والنمو:",
      "45 علكة بنكهة الفراولة",
      "كولاجين بحري نقي",
      "نسبة عالية من البيوتين",
      "فيتامين E و C للبشرة",
    ],
    popular: false,
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-purple-600 border-purple-600 bg-gradient-to-t from-purple-500 to-purple-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">شراء فردي</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-purple-600 border-purple-600 bg-gradient-to-t from-purple-500 to-purple-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">اشتراك شهري (وفر 20%)</span>
        </button>
      </div>
    </div>
  );
};

export default function GummyPricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden pt-20"
      ref={pricingRef}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
        <SparklesComp
          density={1200}
          direction="bottom"
          speed={1}
          color="#A855F7"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <article className="text-center mb-6 pt-12 max-w-3xl mx-auto space-y-2 relative z-50">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center "
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            {isArabic ? "اختر باقة العناية المثالية لك" : "Choose the perfect health plan for you"}
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400 text-lg"
        >
          {isArabic 
            ? "نحن نساعد الآلاف في الجزائر على تحسين جودة حياتهم من خلال المكملات الغذائية المختبرة علمياً." 
            : "We help thousands in Algeria improve their life quality through scientifically tested supplements."}
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="py-8"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div className="grid md:grid-cols-3 max-w-6xl gap-6 py-6 mx-auto px-4 relative z-50">
        {GUMMY_PLANS.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-white border-neutral-800 backdrop-blur-sm ${
                plan.popular
                  ? "bg-gradient-to-b from-neutral-900/90 to-purple-900/20 shadow-[0px_-13px_150px_0px_#9333ea20] border-purple-500/30 z-20 scale-105"
                  : "bg-neutral-900/50 z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  الأكثر طلباً
                </div>
              )}
              <CardHeader className="text-right ">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">
                    <NumberFlow
                      format={{
                        style: "decimal",
                      }}
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-bold"
                    />
                    <span className="text-xl ms-1">دج</span>
                  </span>
                  <span className="text-gray-400 text-sm">/ علبة</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`w-full mb-6 p-4 text-lg font-bold rounded-xl transition-all ${
                    plan.popular
                      ? "bg-gradient-to-t from-purple-500 to-purple-600 shadow-lg shadow-purple-900/20 text-white hover:scale-[1.02]"
                      : "bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
                  }`}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-3 pt-6 border-t border-neutral-800/50 text-right">
                  <h4 className="font-bold text-sm text-purple-400 mb-3 underline decoration-purple-500/30">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-3">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-right"
                      >
                        <span className="h-1.5 w-1.5 bg-purple-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#a855f7]"></span>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
