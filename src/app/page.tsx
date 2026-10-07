'use client';

import React, { useState } from 'react';
import { ModelType, CalculatorFormValues, CalculatedResults } from '@/types/queueing';
import { executeQueueCalculation } from '@/lib/queueing';

import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/hero/Hero';
import { CalculatorSection } from '@/components/calculator/CalculatorSection';
import { QueueVisualization } from '@/components/visualization/QueueVisualization';
import { ModelExplanations } from '@/components/models/ModelExplanations';
import { PSOStudySection } from '@/components/dataset/PSOStudySection';
import { Footer } from '@/components/layout/Footer';

const EMPTY_FORM_VALUES: CalculatorFormValues = {
  interArrivalTime: '',
  arrivalRate: '',
  serviceTime: '',
  serviceRate: '',
  serviceVarianceOption: 'variance',
  serviceVariance: '',
  serviceStdDev: '',
  arrivalStdDev: '',
};

export default function Home() {
  const [model, setModel] = useState<ModelType>('MM1');
  const [formValues, setFormValues] = useState<CalculatorFormValues>(EMPTY_FORM_VALUES);
  const [results, setResults] = useState<CalculatedResults | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [psoLoadedFeedback, setPsoLoadedFeedback] = useState<string | null>(null);

  // Model switch handler (resets model-specific errors/values if needed)
  const handleModelChange = (newModel: ModelType) => {
    setModel(newModel);
    setErrors({});
    // If results were previously calculated, re-run with the new model if valid, or clear
    if (results) {
      const outcome = executeQueueCalculation(newModel, formValues);
      if (outcome.success && outcome.results) {
        setResults(outcome.results);
      } else {
        setResults(null);
      }
    }
  };

  // Calculate Handler
  const handleCalculate = () => {
    const outcome = executeQueueCalculation(model, formValues);
    if (!outcome.success) {
      setErrors(outcome.errors || {});
      setResults(null);
    } else if (outcome.results) {
      setErrors({});
      setResults(outcome.results);
      setPsoLoadedFeedback(null);
      
      // Step 1: Smoothly scroll to Step 4 (Queueing Results)
      setTimeout(() => {
        const step4El = document.getElementById('step-4');
        if (step4El) {
          step4El.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);

      // Step 2: After user reviews Step 4 metrics (~2.2s), automatically scroll to System Schematic
      setTimeout(() => {
        const schematicEl = document.getElementById('system-schematic');
        if (schematicEl) {
          schematicEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 2200);
    }
  };

  // Clear All Handler
  const handleClearAll = () => {
    setFormValues(EMPTY_FORM_VALUES);
    setResults(null);
    setErrors({});
    setPsoLoadedFeedback(null);
  };

  // Load PSO Example (explicit user click only, never automatic)
  const handleLoadPSOExample = () => {
    setFormValues({
      interArrivalTime: '1.60',
      arrivalRate: '37.50',
      serviceTime: '4.52',
      serviceRate: '13.27',
      serviceVarianceOption: 'variance',
      serviceVariance: '4.41',
      serviceStdDev: '2.10',
      arrivalStdDev: '1.30',
    });
    setErrors({});
    setResults(null);
    setPsoLoadedFeedback(
      'PSO observation values (1.60 min arrival, 4.52 min fueling) loaded as an example. Click "Calculate Queue" to evaluate.'
    );

    // Smooth scroll to calculator
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090b0f] text-[#f0f2f5] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* 1. Header Navigation */}
      <Navbar onOpenCalculator={handleOpenCalculator} />

      <main className="flex-1">
        {/* 2. Hero Header Card */}
        <Hero
          onSelectModel={handleModelChange}
          onOpenCalculator={handleOpenCalculator}
          onOpenPSOStudy={() => {
            const el = document.getElementById('pso-study');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onLoadPSOExample={handleLoadPSOExample}
        />

        {/* 3. The Interactive Calculator (STEP 1: Model, STEP 2: Input, STEP 3: Calculate, STEP 4: Results) */}
        <CalculatorSection
          model={model}
          setModel={handleModelChange}
          formValues={formValues}
          setFormValues={setFormValues}
          results={results}
          errors={errors}
          onCalculate={handleCalculate}
          onClear={handleClearAll}
          onLoadPSOExample={handleLoadPSOExample}
          psoLoadedFeedback={psoLoadedFeedback}
        />

        {/* 4. Queue Visualization (Shows only after calculation or dynamically responds) */}
        <QueueVisualization results={results} />

        {/* 5. Model Explanations Reference */}
        <ModelExplanations
          activeModel={model}
          onSelectModel={handleModelChange}
        />

        {/* 6. About the PSO Study (Reference Only) */}
        <PSOStudySection onLoadPSOExample={handleLoadPSOExample} />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
