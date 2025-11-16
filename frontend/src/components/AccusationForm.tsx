import { useState } from 'react';
import { usePeople, useAccuse, useGameState } from '../hooks/useDB';

export function AccusationForm() {
  const { data: people } = usePeople();
  const { data: gameState } = useGameState();
  const accuseMutation = useAccuse();
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAccuse = () => {
    if (!selectedPersonId) return;
    accuseMutation.mutate(selectedPersonId);
    setShowConfirm(false);
  };

  if (gameState?.case_solved) {
    const correct = gameState.accused_person_id === 'P002';
    return (
      <div className="p-4">
        <div
          className={`p-6 rounded-lg ${
            correct
              ? 'bg-green-900/50 border-2 border-green-500'
              : 'bg-red-900/50 border-2 border-red-500'
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            {correct ? 'CASE SOLVED!' : 'WRONG ACCUSATION'}
          </h2>
          {correct ? (
            <div className="space-y-2">
              <p className="text-lg">You correctly identified Thomas Webb as the killer!</p>
              <div className="mt-4 p-4 bg-slate-800 rounded">
                <h3 className="font-semibold mb-2">The Truth:</h3>
                <p className="text-sm">
                  Thomas Webb killed his ex-wife Margaret Chen during an argument at
                  Riverside Park on March 15th around 7:15pm. The argument was about their
                  ongoing custody battle over their daughter Sarah.
                </p>
                <p className="text-sm mt-2">
                  Key evidence: Security camera footage, neighbor testimony, new boot
                  purchase, and timeline gaps in his alibi.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg">
                You accused the wrong person. The real killer was Thomas Webb (P002).
              </p>
              <p>The case remains unsolved, and the killer goes free.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-red-900/30 border border-red-700 p-4 rounded mb-4">
        <h2 className="text-xl font-bold text-red-400 mb-2">Make Accusation</h2>
        <p className="text-sm text-slate-300">
          WARNING: You only get ONE chance. Be absolutely certain before accusing someone of
          murder.
        </p>
      </div>

      <div className="bg-slate-800 p-4 rounded">
        <label className="block mb-2 font-semibold">Select Suspect:</label>
        <select
          value={selectedPersonId}
          onChange={(e) => setSelectedPersonId(e.target.value)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded"
        >
          <option value="">-- Select a person --</option>
          {people?.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} - {person.occupation}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!selectedPersonId}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 px-4 py-3 rounded font-semibold"
        >
          ACCUSE OF MURDER
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Accusation</h3>
            <p className="mb-4">
              Are you absolutely certain you want to accuse{' '}
              <span className="font-bold text-red-400">
                {people?.find((p) => p.id === selectedPersonId)?.name}
              </span>{' '}
              of murder?
            </p>
            <p className="text-sm text-slate-400 mb-4">
              This action cannot be undone. If you are wrong, the case will be closed and the
              real killer will go free.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAccuse}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
              >
                Yes, Accuse
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
