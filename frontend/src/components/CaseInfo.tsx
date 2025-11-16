import { useGameState } from '../hooks/useDB';

export function CaseInfo() {
  const { data: gameState, isLoading } = useGameState();

  if (isLoading) return <div className="p-4">Loading case info...</div>;
  if (!gameState) return <div className="p-4">No case loaded</div>;

  return (
    <div className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-red-400">COLD CASE</h1>
          <p className="text-lg mt-1">The Riverbank Killing</p>
        </div>
        <div className="text-right text-sm">
          <div>Day {gameState.current_day}</div>
          <div className="text-green-400">Budget: ${gameState.budget_remaining.toLocaleString()}</div>
          <div>Reputation: {gameState.reputation}/100</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Victim:</span> {gameState.victim_name}
        </div>
        <div>
          <span className="text-slate-400">Case Opened:</span> {new Date(gameState.case_opened).toLocaleDateString()}
        </div>
        <div>
          <span className="text-slate-400">Status:</span>{' '}
          <span className={gameState.case_solved ? 'text-green-400' : 'text-yellow-400'}>
            {gameState.case_solved ? 'SOLVED' : 'ACTIVE'}
          </span>
        </div>
        {gameState.accused_person_id && (
          <div>
            <span className="text-slate-400">Accused:</span> {gameState.accused_person_id}
          </div>
        )}
      </div>
    </div>
  );
}
