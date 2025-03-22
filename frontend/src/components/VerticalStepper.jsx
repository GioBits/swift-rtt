import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { STEP_DEFINITIONS } from '../constants/stepper';

const VerticalStepper = ({ currentStep }) => {
  const [animatedStep, setAnimatedStep] = useState(null);

  useEffect(() => {
    setAnimatedStep(currentStep);

    const timeout = setTimeout(() => {
      setAnimatedStep(null);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  const steps = Object.values(STEP_DEFINITIONS);

  return (
    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 m-6">
      {steps.map((step) => (
        <li key={step.id} className="mb-10 ms-6">
          {/* Icon */}
          <span
            className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 ${
              step.id <= currentStep
                ? step.id === 1
                  ? "bg-cerulean dark:bg-cerulean"
                  : `bg-${step.color}-200 dark:bg-${step.color}-900`
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {step.icon}
          </span>

          {/* Title and label */}
          <h3
            className={`font-medium leading-tight transition-all duration-500 ease-in-out ${
              step.id <= currentStep
                ? step.id === 1
                  ? "text-blueMetal dark:blueMetal"
                  : `text-${step.color}-500 dark:text-${step.color}-400`
                : ""
            } ${
              animatedStep === step.id && step.id !== 1
                ? "transform scale-150 translate-x-12 -translate-y-6"
                : "transform scale-100"
            }`}
          >
            {step.label}
          </h3>
          <p className="text-sm">{step.description}</p>
        </li>
      ))}
    </ol>
  );
};

VerticalStepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default VerticalStepper;