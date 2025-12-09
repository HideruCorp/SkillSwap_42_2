import './progress-bar.scss';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="progress-bar">
      <h2 className="progress-bar__title">
        Шаг {currentStep} из {totalSteps}
      </h2>

      <div className="progress-bar__list">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={`progress-bar__item ${index < currentStep ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
};
