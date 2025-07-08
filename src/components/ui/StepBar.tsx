'use client';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface StepBarProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
}

export default function StepBar({ steps, currentStep, completedSteps }: StepBarProps) {
  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIndex = (stepId: string) => {
    return steps.findIndex(step => step.id === stepId);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        {/* プログレスライン */}
        <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* ステップ */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            
            return (
              <div key={step.id} className="flex flex-col items-center group">
                {/* ステップ番号/アイコン */}
                <div className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${status === 'completed' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                    : status === 'current'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {status === 'completed' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* ステップ情報 */}
                <div className="mt-4 text-center max-w-32">
                  <h3 className={`
                    text-sm font-semibold mb-1 transition-colors duration-300
                    ${status === 'completed' || status === 'current' 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </h3>
                  <p className={`
                    text-xs leading-tight transition-colors duration-300
                    ${status === 'completed' || status === 'current' 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* アニメーション効果 */}
                {status === 'current' && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-blue-400 opacity-20 animate-ping" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* モバイル用の現在ステップ表示 */}
      <div className="md:hidden mt-6 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-900">
              ステップ {currentIndex + 1} / {steps.length}: {steps[currentIndex]?.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}