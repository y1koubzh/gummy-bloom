import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { formatCurrency, calculateOrderTotal } from '@shared/utils';
import { DEFAULT_FLAVORS, DEFAULT_PACKAGING, BASE_GUMMY_PRICE } from '@shared/constants';
import GummyPreview from '@/components/GummyPreview';
import { motion } from 'framer-motion';

export interface SelectedIngredient {
  name: string;
  category: string;
  priceModifier: number;
}

export default function Builder() {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('flavor');
  const [selectedFlavor, setSelectedFlavor] = useState<number>(1);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<number>(1);
  const [selectedDosage, setSelectedDosage] = useState<number>(1);
  const [formulaName, setFormulaName] = useState('');

  const dosageOptions = [
    { id: 1, label: 'Standard (1x daily)', priceModifier: 0 },
    { id: 2, label: 'Double (2x daily)', priceModifier: 500 },
    { id: 3, label: 'Triple (3x daily)', priceModifier: 1000 },
  ];

  // Sample ingredients (would come from API in production)
  const ingredients = [
    { id: 1, name: 'Vitamin C', category: 'vitamin', priceModifier: 0 },
    { id: 2, name: 'Vitamin D', category: 'vitamin', priceModifier: 200 },
    { id: 3, name: 'Zinc', category: 'mineral', priceModifier: 150 },
    { id: 4, name: 'Magnesium', category: 'mineral', priceModifier: 150 },
    { id: 5, name: 'Turmeric', category: 'herbal', priceModifier: 300 },
    { id: 6, name: 'Ginger', category: 'herbal', priceModifier: 250 },
  ];

  // Calculate price
  const basePrice = BASE_GUMMY_PRICE;
  const flavorModifier = 0; // Flavors don't add cost
  const dosageModifier = dosageOptions.find(d => d.id === selectedDosage)?.priceModifier || 0;
  const ingredientsModifier = selectedIngredients.reduce((sum, ing) => sum + ing.priceModifier, 0);
  const packagingModifier = DEFAULT_PACKAGING.find(p => p.id === selectedPackaging)?.priceModifier || 0;
  const totalPrice = basePrice + flavorModifier + dosageModifier + ingredientsModifier + packagingModifier;

  const currentFlavor = DEFAULT_FLAVORS.find(f => f.id === selectedFlavor) || DEFAULT_FLAVORS[0];

  const steps: { id: BuilderStep; label: string }[] = [
    { id: 'flavor', label: 'Flavor' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'dosage', label: 'Dosage' },
    { id: 'packaging', label: 'Packaging' },
    { id: 'review', label: 'Review' },
  ];

  const handleIngredientToggle = (ingredient: SelectedIngredient) => {
    setSelectedIngredients(prev => {
      const exists = prev.find(i => i.name === ingredient.name);
      if (exists) {
        return prev.filter(i => i.name !== ingredient.name);
      }
      if (prev.length >= 6) return prev; // Max 6 ingredients
      return [...prev, ingredient];
    });
  };

  const handleNextStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Create Your Custom Formula</h1>
          <p className="text-xl opacity-90 font-medium">Personalize every bite to match your lifestyle</p>
        </div>
      </div>

      <div className="container -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Steps Navigation - Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-3xl border border-border p-6 sticky top-24 shadow-xl shadow-slate-200/50">
              <h3 className="font-extrabold text-xl mb-8 flex items-center gap-2">
                <div className="w-2 h-8 bg-primary rounded-full" />
                Customize Steps
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${
                            isActive
                              ? 'bg-primary-foreground text-primary'
                              : 'bg-border text-foreground hover:bg-primary/20'
                          }`}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span className="text-md uppercase tracking-wider">{step.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Summary at bottom of steps */}
              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
                 <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 mb-4">Live Total</p>
                 <p className="text-4xl font-black text-white flex items-center gap-2 mb-1">
                    {formatCurrency(totalPrice)}
                 </p>
                 <p className="text-sm text-white/60 mb-6 italic">Estimated formulation price</p>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      animate={{ width: `${(steps.findIndex(s => s.id === currentStep) + 1) * 20}%` }}
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            <div className="bg-card rounded-3xl border border-border p-10 min-h-[600px] shadow-xl shadow-slate-200/50">
              {/* Flavor Selection */}
              {currentStep === 'flavor' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Select Flavor Profile</h2>
                    <p className="text-muted-foreground text-lg">Every custom formula starts with a delicious base</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {DEFAULT_FLAVORS.map(flavor => (
                      <button
                        key={flavor.id}
                        onClick={() => setSelectedFlavor(flavor.id)}
                        className={`group p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${
                          selectedFlavor === flavor.id
                            ? 'border-primary bg-primary/5 shadow-inner'
                            : 'border-border hover:border-primary/30 hover:bg-muted/10'
                        }`}
                      >
                        <div 
                          className="w-16 h-16 rounded-2xl mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: flavor.color }}
                        />
                        <p className="text-xl font-bold mb-1">{flavor.name}</p>
                        <p className="text-sm text-muted-foreground">Natural sweeteners & infusions</p>
                        
                        {selectedFlavor === flavor.id && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Sparkles size={12} className="text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Selection */}
              {currentStep === 'ingredients' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Active Ingredients</h2>
                    <p className="text-muted-foreground text-lg">Choose up to 6 high-potency extracts</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {ingredients.map(ingredient => {
                      const isSelected = selectedIngredients.some(i => i.name === ingredient.name);
                      return (
                        <button
                          key={ingredient.id}
                          onClick={() => handleIngredientToggle({
                            name: ingredient.name,
                            category: ingredient.category,
                            priceModifier: ingredient.priceModifier,
                          })}
                          className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 text-left flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                              isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {isSelected ? '✓' : '+'}
                            </div>
                            <div>
                              <p className="text-xl font-bold">{ingredient.name}</p>
                              <p className="text-xs uppercase tracking-widest text-muted-foreground font-black">{ingredient.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className={`font-black text-lg ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                               {ingredient.priceModifier > 0 ? `+${formatCurrency(ingredient.priceModifier)}` : 'FREE'}
                             </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dosage Selection */}
              {currentStep === 'dosage' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Concentration Level</h2>
                    <p className="text-muted-foreground text-lg">Adjust the potency of your blend</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {dosageOptions.map(dosage => (
                      <button
                        key={dosage.id}
                        onClick={() => setSelectedDosage(dosage.id)}
                        className={`w-full p-8 rounded-3xl border-2 transition-all duration-500 text-left overflow-hidden relative ${
                          selectedDosage === dosage.id
                            ? 'border-primary bg-primary/5 shadow-2xl'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <p className="text-2xl font-black mb-1">{dosage.label}</p>
                            <p className="text-sm text-muted-foreground">Optimized for biological absorption</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-black ${selectedDosage === dosage.id ? 'text-primary' : 'text-muted-foreground'}`}>
                              {dosage.priceModifier > 0 ? `+${formatCurrency(dosage.priceModifier)}` : 'STANDARD'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Packaging Selection */}
              {currentStep === 'packaging' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Formula Volume</h2>
                    <p className="text-muted-foreground text-lg">Pick the subscription cycle that works for you</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {DEFAULT_PACKAGING.map(pkg => (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackaging(pkg.id)}
                        className={`w-full p-8 rounded-3xl border-2 transition-all duration-300 text-left ${
                          selectedPackaging === pkg.id
                            ? 'border-primary bg-primary/5 shadow-xl'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-black mb-1">{pkg.name}</p>
                            <p className="font-bold text-primary flex items-center gap-2">
                               <Sparkles size={16} />
                               {pkg.quantity} Organic Gummies
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-black ${selectedPackaging === pkg.id ? 'text-primary' : 'text-muted-foreground'}`}>
                              {pkg.priceModifier > 0 ? `+${formatCurrency(pkg.priceModifier)}` : 'INCLUDED'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Review */}
              {currentStep === 'review' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight">Final Checkpoint</h2>
                    <p className="text-muted-foreground text-lg">Review and name your creation</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-black uppercase tracking-widest text-primary">Formula Name</p>
                    <input
                      type="text"
                      placeholder="e.g., Morning Energy Blend"
                      value={formulaName}
                      onChange={(e) => setFormulaName(e.target.value)}
                      className="w-full px-8 py-5 rounded-3xl border-2 border-border bg-muted/30 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-xl placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                     <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Base Profile</p>
                        <p className="text-xl font-bold flex items-center gap-3">
                           <div className="w-4 h-4 rounded-full" style={{ backgroundColor: currentFlavor.color }} />
                           {currentFlavor.name}
                        </p>
                     </div>
                     <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Ingredients</p>
                        <p className="text-lg font-bold line-clamp-1">{selectedIngredients.map(i => i.name).join(', ') || 'Pure Base'}</p>
                     </div>
                     <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Dosage</p>
                        <p className="text-xl font-bold">{dosageOptions.find(d => d.id === selectedDosage)?.label}</p>
                     </div>
                     <div className="p-6 rounded-3xl bg-secondary/20 border border-border">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Quantity</p>
                        <p className="text-xl font-bold">{DEFAULT_PACKAGING.find(p => p.id === selectedPackaging)?.quantity} Gummies</p>
                     </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons Bottom */}
              <div className="flex items-center justify-between mt-12 pt-10 border-t-2 border-border gap-6">
                <Button
                  onClick={handlePrevStep}
                  disabled={currentStep === 'flavor'}
                  variant="ghost"
                  className="h-16 px-8 rounded-2xl flex items-center gap-3 text-lg font-bold hover:bg-muted"
                >
                  <ChevronLeft size={24} />
                  Back
                </Button>

                {currentStep === 'review' ? (
                  <Button className="flex-1 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-3 text-xl font-black rounded-2xl shadow-xl shadow-purple-500/20 transform transition-transform active:scale-95">
                    <ShoppingCart size={24} />
                    Finalize & Add to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-3 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 transform transition-transform active:scale-95"
                  >
                    Continue to Next Step
                    <ChevronRight size={24} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Real-time Preview */}
          <div className="lg:col-span-3">
             <div className="sticky top-24 space-y-6">
                <div className="bg-slate-950 rounded-[40px] p-2 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <GummyPreview 
                      color={currentFlavor.color} 
                      ingredients={selectedIngredients}
                      flavorName={currentFlavor.name}
                   />
                </div>
                
                <div className="bg-card rounded-3xl border border-border p-8 shadow-xl">
                   <h4 className="font-extrabold uppercase tracking-[0.2em] text-xs text-primary mb-6 flex items-center gap-2">
                       <Sparkles size={14} />
                       Formula Health IQ
                   </h4>
                   <div className="space-y-6">
                      <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                         <motion.div 
                            className="absolute inset-0 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            animate={{ width: `${Math.min(100, (selectedIngredients.length / 6) * 100 + 20)}%` }}
                         />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                         {selectedIngredients.length === 0 
                            ? "Start adding ingredients to see your Health IQ increase."
                            : `Your current formulation with ${selectedIngredients.length} active ingredients provides a balanced bioavailability score.`
                         }
                      </p>
                      
                      {selectedIngredients.length > 0 && (
                        <div className="pt-4 border-t border-border mt-6">
                           <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-4">Key Benefits</p>
                           <div className="flex flex-wrap gap-2">
                              {selectedIngredients.map(ing => (
                                <div key={ing.name} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
                                   {ing.category}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type BuilderStep = 'flavor' | 'ingredients' | 'dosage' | 'packaging' | 'review';
