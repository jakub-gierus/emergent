import { usePeople } from '../hooks/useDB';
import { useGameStore } from '../stores/game';

export function SuspectsList() {
  const { data: people, isLoading } = usePeople();
  const { selectedPersonId, setSelectedPerson } = useGameStore();

  if (isLoading) return <div className="p-4">Loading people...</div>;
  if (!people || people.length === 0) return <div className="p-4">No people found</div>;

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">People of Interest</h2>
        <div className="space-y-2">
          {people.map((person) => (
            <button
              key={person.id}
              onClick={() => setSelectedPerson(person.id)}
              className={`w-full text-left p-3 rounded transition ${
                selectedPersonId === person.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="font-semibold">{person.name}</div>
              <div className="text-sm opacity-75">
                {person.age} - {person.occupation}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
