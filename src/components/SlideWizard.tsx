import React, { ReactNode, useState } from 'react';
import { useSlideAnimation, SlideDirection } from '../hooks/useSlideAnimation';
import { SlideContainer } from './SlideContainer';

interface WizardStep {
  id: string;
  component: ReactNode;
  title?: string;
}

interface SlideWizardProps {
  steps: WizardStep[];
  initialStep?: number;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  onComplete?: () => void;
  className?: string;
  slideDirection?: 'horizontal' | 'vertical';
}

export function SlideWizard({
  steps,
  initialStep = 0,
  onStepChange,
  onComplete,
  className = '',
  slideDirection = 'horizontal'
}: SlideWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const slideAnimation = useSlideAnimation({
    duration: 300,
    onAnimationComplete: () => {
      slideAnimation.resetAnimation();
    }
  });

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length || stepIndex === currentStep) {
      return;
    }

    const direction: SlideDirection = slideDirection === 'horizontal'
      ? (stepIndex > currentStep ? 'right' : 'left')
      : (stepIndex > currentStep ? 'down' : 'up');

    const previousStep = currentStep;
    
    slideAnimation.startSlideAnimation(direction, () => {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex, previousStep);
      
      if (stepIndex === steps.length - 1) {
        onComplete?.();
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const goToFirstStep = () => goToStep(0);
  const goToLastStep = () => goToStep(steps.length - 1);

  return (
    <div className={`slide-wizard ${className}`}>
      <SlideContainer
        isVisible={true}
        slideDirection={slideAnimation.slideDirection || undefined}
        isAnimating={slideAnimation.isAnimating}
      >
        {steps[currentStep]?.component}
      </SlideContainer>
      
      {/* Wizard kontrolleri için context sağlama */}
      <div style={{ display: 'none' }}>
        {JSON.stringify({
          currentStep,
          totalSteps: steps.length,
          canGoNext: currentStep < steps.length - 1,
          canGoPrevious: currentStep > 0,
          isAnimating: slideAnimation.isAnimating
        })}
      </div>
    </div>
  );
}

// Wizard kontrollerini kullanmak için context hook
export function useWizardControls() {
  return {
    nextStep: () => {}, // Bu parent component'ten prop olarak geçilecek
    previousStep: () => {},
    goToStep: (step: number) => {},
    goToFirstStep: () => {},
    goToLastStep: () => {}
  };
}