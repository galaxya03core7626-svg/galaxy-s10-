import React, { useState } from 'react';
import { MicroTask } from '../types';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, AlertCircle, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface TaskModalProps {
  task: MicroTask;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose }) => {
  const { completeTask, availableBalance } = useApp();

  const questions = task.questions || [
    {
      id: 'default_1',
      question: `Please provide your detailed review and feedback for ${task.title}.`,
      type: 'text' as const,
      options: [],
    },
    {
      id: 'default_2',
      question: 'How would you rate the overall experience and clarity of the instructions?',
      type: 'radio' as const,
      options: ['5 - Exceptional & Clear', '4 - Good', '3 - Average', '2 - Needs Improvement'],
    },
  ];

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentStep];

  const handleSelectOption = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    setError(null);
  };

  const handleNext = () => {
    const currentAnswer = answers[currentQ.id];
    if (!currentAnswer || currentAnswer.trim() === '') {
      setError('Please provide an answer to proceed.');
      return;
    }

    if (currentQ.type === 'text' && currentAnswer.trim().length < 8) {
      setError('Please enter a constructive answer (at least 8 characters).');
      return;
    }

    setError(null);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      completeTask(task.id, answers);
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <DollarSign className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white line-clamp-1">{task.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{task.sponsor}</span>
                <span>·</span>
                <span className="font-mono text-emerald-400 font-bold">+${task.reward.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Step {currentStep + 1} of {questions.length}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{task.estimatedMinutes} min</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question details */}
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h4>

                {currentQ.type === 'radio' && currentQ.options && (
                  <div className="space-y-2 pt-2">
                    {currentQ.options.map((opt, i) => {
                      const isSelected = answers[currentQ.id] === opt;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(currentQ.id, opt)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-emerald-500/15 border-emerald-500 text-white font-medium shadow-sm'
                              : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                            </span>
                            <span>{opt}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQ.type === 'text' && (
                  <div className="pt-2">
                    <textarea
                      rows={4}
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
                      placeholder="Write your honest, detailed feedback here..."
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Minimum 8 characters. Constructive feedback ensures ongoing high-paying sponsor opportunities.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
                  }}
                  disabled={currentStep === 0 || isSubmitting}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-sm shadow-emerald-500/20"
                >
                  <span>{currentStep === questions.length - 1 ? 'Submit & Claim Reward' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Completed Celebration View */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-white">Task Successfully Completed!</h4>
                <p className="text-sm text-slate-400">
                  Your responses have been validated and accepted by <span className="text-slate-200 font-medium">{task.sponsor}</span>.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl max-w-sm mx-auto space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Earned Reward:</span>
                  <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                    +${task.reward.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Updated Available Balance:</span>
                  <span className="font-mono font-semibold text-white tabular-nums">
                    ${availableBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Audited double-entry ledger entry generated</span>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Done & Browse Next Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
