import { useAppStore } from '../stores/useAppStore';
import PageTransition from '../components/layout/PageTransition';
import ResumeInput from '../components/resume/ResumeInput';
import SearchForm from '../components/jobs/SearchForm';
import JobResults from '../components/jobs/JobResults';
import TailorPanel from '../components/tailor/TailorPanel';

export default function WorkspacePage() {
  const step = useAppStore((s) => s.step);

  const renderStep = () => {
    switch (step) {
      case 'resume':
        return <ResumeInput />;
      case 'search':
        return <SearchForm />;
      case 'results':
        return <JobResults />;
      case 'tailor':
        return <TailorPanel />;
      default:
        return <ResumeInput />;
    }
  };

  const stepLabels = [
    { key: 'resume', label: 'Resume' },
    { key: 'search', label: 'Search' },
    { key: 'results', label: 'Results' },
    { key: 'tailor', label: 'Tailor' },
  ] as const;

  const currentIdx = stepLabels.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
            onClick={() => useAppStore.getState().reset()}
          >
            Resumify
          </h1>

          <div className="flex gap-1">
            {stepLabels.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    i <= currentIdx
                      ? 'bg-primary/30 text-primary-light border border-primary/50'
                      : 'bg-dark-card text-text-muted border border-dark-border'
                  }`}
                >
                  {i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`w-6 h-px mx-1 ${
                      i < currentIdx ? 'bg-primary/50' : 'bg-dark-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <PageTransition keyVal={step}>{renderStep()}</PageTransition>
      </div>
    </div>
  );
}
