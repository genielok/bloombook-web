"use client";

import { Check } from "lucide-react";

interface Step {
  value: number;
  label: string;
}

const STEPS: Step[] = [
  { value: 1, label: "Choose service" },
  { value: 2, label: "Date & time" },
  { value: 3, label: "Your details" },
  // { value: 4, label: "Payment" },
];

interface BookingStepperProps {
  currentStep: number;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, index) => {
        const isComplete = step.value < currentStep;
        const isActive = step.value === currentStep;

        return (
          <div key={step.value} className="flex items-center">
            <div className="flex  items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isComplete
                    ? "bg-bloom-success text-white"
                    : isActive
                      ? "bg-bloom-accent text-white"
                      : "bg-bloom-border text-bloom-subtle"
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : step.value}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isActive ? "text-bloom-text font-medium" : "text-bloom-subtle"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`self-center w-6 h-px mx-2 sm:w-16 ${
                  step.value < currentStep
                    ? "bg-bloom-success"
                    : "bg-bloom-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
