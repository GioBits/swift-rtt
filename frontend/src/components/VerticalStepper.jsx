import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VerticalStepper = ({ currentStep }) => {
  const [animatedStep, setAnimatedStep] = useState(null);

  useEffect(() => {
    setAnimatedStep(currentStep);

    const timeout = setTimeout(() => {
      setAnimatedStep(null);
    }, 500);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  const steps = [
    {
      id: 1,
      label: "Bienvenido",
      description: "Sube un archivo de audio para comenzar el proceso",
      icon: (
        <svg
          className="w-5 h-5 text-white dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Subir archivo",
      description: "Carga tu archivo de audio",
      icon: (
        <svg
          className="w-5 h-5 text-green-500 dark:text-green-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Procesar media",
      description: "Preparando el archivo para su procesamiento",
      icon: (
        <svg
          className="w-5 h-5 text-blue-500 dark:text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Transcripción",
      description: "Generando la transcripción del audio",
      icon: (
        <svg
          className="w-5 h-5 text-yellow-500 dark:text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
    },
    {
      id: 5,
      label: "Traducción",
      description: "Traduciendo el contenido del audio",
      icon: (
        <svg
          className="w-5 h-5 text-purple-500 dark:text-purple-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
      ),
    },
    {
      id: 6,
      label: "Texto a voz",
      description: "Generando audio en el idioma seleccionado",
      icon: (
        <svg
          className="w-5 h-5 text-red-500 dark:text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3h6a3 3 0 013 3v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
    },
  ];

  return (
    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 m-6">
      {steps.map((step) => (
        <li key={step.id} className="mb-10 ms-6">
          {/* Icon */}
          <span
            className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 ${step.id <= currentStep
                ? step.id === 1
                  ? "bg-cerulean dark:bg-cerulean"
                  : "bg-green-200 dark:bg-green-900"
                : "bg-gray-100 dark:bg-gray-700"
              }`}
          >
            {step.icon}
          </span>

          {/* Title and label */}
          <h3
            className={`font-medium leading-tight transition-all duration-500 ease-in-out ${step.id <= currentStep
                ? step.id === 1
                  ? "text-blueMetal dark:blueMetal"
                  : "text-green-500 dark:text-green-400"
                : ""
              } ${animatedStep === step.id && step.id !== 1
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