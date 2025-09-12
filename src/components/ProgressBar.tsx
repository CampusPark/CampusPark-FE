type ProgressBarProps = {
  /** 현재 단계 (1 ~ 4) */
  currentStep: number;
  /** 총 단계 (기본값 4) */
  totalSteps?: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps = 5,
}: ProgressBarProps) {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full bg-neutral-300 rounded-3xl overflow-hidden">
      <div
        className="h-2 bg-blue-500 rounded-3xl transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
}
