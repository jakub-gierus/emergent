import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDB } from './lib/db';
import { loadRiverbankCase } from './lib/case';
import { useGameStore } from './stores/game';
import { CaseInfo } from './components/CaseInfo';
import { SuspectsList } from './components/SuspectsList';
import { SuspectDetail } from './components/SuspectDetail';
import { TimelineList } from './components/TimelineList';
import { EvidenceList } from './components/EvidenceList';
import { Interview } from './components/Interview';
import { AccusationForm } from './components/AccusationForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function GameContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeTab, setActiveTab } = useGameStore();

  useEffect(() => {
    async function init() {
      try {
        await initDB();
        await loadRiverbankCase();
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading COLD CASE...</div>
          <div className="text-slate-400">Initializing database...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-red-400">Error</div>
          <div className="text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CaseInfo />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
          <SuspectsList />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-slate-800 border-b border-slate-700 flex">
            <button
              onClick={() => setActiveTab('suspects')}
              className={`px-4 py-2 ${
                activeTab === 'suspects'
                  ? 'bg-slate-700 border-b-2 border-blue-500'
                  : 'hover:bg-slate-700'
              }`}
            >
              Suspect Details
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 ${
                activeTab === 'timeline'
                  ? 'bg-slate-700 border-b-2 border-blue-500'
                  : 'hover:bg-slate-700'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2 ${
                activeTab === 'evidence'
                  ? 'bg-slate-700 border-b-2 border-blue-500'
                  : 'hover:bg-slate-700'
              }`}
            >
              Evidence
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-4 py-2 ${
                activeTab === 'interview'
                  ? 'bg-slate-700 border-b-2 border-blue-500'
                  : 'hover:bg-slate-700'
              }`}
            >
              Interview
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'suspects' && <SuspectDetail />}
            {activeTab === 'timeline' && <TimelineList />}
            {activeTab === 'evidence' && <EvidenceList />}
            {activeTab === 'interview' && <Interview />}
          </div>
        </div>

        <div className="w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto">
          <AccusationForm />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContent />
    </QueryClientProvider>
  );
}
