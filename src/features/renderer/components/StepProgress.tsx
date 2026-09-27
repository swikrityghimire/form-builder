import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  fields: unknown[];
}

interface StepProgressProps {
  steps: Step[];
  currentIndex: number;
  onStepClick?: (index: number) => void;
}

export function StepProgress({
  steps,
  currentIndex,
  onStepClick,
}: StepProgressProps) {
  const totalSteps = steps.length;
  if (totalSteps === 0) return null;

  const fillPercentage =
    totalSteps > 1 ? (currentIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="relative mb-10 px-4">
      {/* Background Line */}
      <div className="absolute top-5 left-[12%] right-[12%] h-[3px] bg-gray-200 z-0 rounded-full" />

      {/* Filled Progress Line (animated) */}
      <div
        className="absolute top-5 left-[12%] h-[3px] bg-indigo-600 transition-all duration-500 ease-out z-0 rounded-full"
        style={{ width: `${fillPercentage * 0.76}%` }}
      />

      {/* Steps */}
      <div className="relative flex justify-between z-10">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isClickable = !!onStepClick;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center gap-2 flex-1 bg-transparent border-0 p-0",
                isClickable && "cursor-pointer",
                !isClickable && "cursor-default"
              )}
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold border-[3px] transition-all duration-300 bg-white",
                  isActive &&
                    "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200",
                  isCompleted && "bg-green-500 border-green-500 text-white",
                  !isActive &&
                    !isCompleted &&
                    "bg-white border-gray-300 text-gray-400",
                  isClickable && !isActive && "hover:border-indigo-400"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs text-center font-medium transition-colors max-w-[120px] truncate",
                  isActive && "text-indigo-600 font-semibold",
                  isCompleted && "text-green-600",
                  !isActive && !isCompleted && "text-gray-400"
                )}
                title={step.title}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}