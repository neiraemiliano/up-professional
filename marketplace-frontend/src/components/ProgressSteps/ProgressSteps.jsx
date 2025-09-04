import { Check } from "lucide-react";
import clsx from "clsx";

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Step circle */}
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
              index < currentStep 
                ? "bg-violet-900 border-violet-900 text-white" 
                : index === currentStep 
                ? "bg-white border-violet-900 text-violet-900" 
                : "bg-gray-100 border-gray-300 text-gray-500"
            )}>
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <span className={clsx(
              "text-xs mt-2 text-center max-w-16",
              index <= currentStep ? "text-violet-900" : "text-gray-500"
            )}>
              {step}
            </span>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className={clsx(
                "absolute h-0.5 top-4 w-full max-w-20 left-1/2 transform translate-x-4",
                index < currentStep ? "bg-violet-900" : "bg-gray-300"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;