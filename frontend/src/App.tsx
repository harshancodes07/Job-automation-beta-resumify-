import { Toaster } from 'sonner';
import AnimatedBackground from './components/layout/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import WorkspacePage from './pages/WorkspacePage';
import { useAppStore } from './stores/useAppStore';

function App() {
  const showWorkspace = useAppStore((s) => s.entered);

  return (
    <>
      <AnimatedBackground />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#12122a',
            border: '1px solid rgba(108, 92, 231, 0.3)',
            color: '#e0e0f0',
          },
        }}
      />
      {showWorkspace ? <WorkspacePage /> : <LandingPage />}
    </>
  );
}

export default App;
