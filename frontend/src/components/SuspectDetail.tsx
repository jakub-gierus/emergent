import { usePerson, useRelationships, useTimelineGaps } from '../hooks/useDB';
import { useGameStore } from '../stores/game';

export function SuspectDetail() {
  const { selectedPersonId, setActiveTab, setInterviewingPerson } = useGameStore();
  const { data: personData } = usePerson(selectedPersonId);
  const { data: relationships } = useRelationships(selectedPersonId);
  const { data: gaps } = useTimelineGaps(selectedPersonId);

  if (!selectedPersonId) {
    return (
      <div className="p-4 text-center text-slate-400">
        Select a person to view details
      </div>
    );
  }

  if (!personData || personData.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  const person = personData[0];

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-4">{person.name}</h2>

      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-slate-400">Age:</span> {person.age}
            </div>
            <div>
              <span className="text-slate-400">Occupation:</span> {person.occupation}
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">Address:</span> {person.home_address}
            </div>
            <div>
              <span className="text-slate-400">Financial Status:</span> {person.financial_status}
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">Profile:</span> {person.psychological_profile}
            </div>
          </div>
        </div>

        {relationships && relationships.length > 0 && (
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-semibold mb-2">Relationships</h3>
            <div className="space-y-2">
              {relationships.map((rel) => (
                <div key={rel.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{rel.other_person_name}</span>
                    <span className="text-slate-400">{rel.relationship_type}</span>
                  </div>
                  <div className={rel.strength < 0 ? 'text-red-400' : 'text-green-400'}>
                    Strength: {rel.strength}/10
                  </div>
                  {rel.secrets && rel.secrets.length > 0 && (
                    <div className="text-slate-400 italic">Secrets: {rel.secrets.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {gaps && gaps.length > 0 && (
          <div className="bg-red-900/30 border border-red-700 p-4 rounded">
            <h3 className="font-semibold mb-2 text-red-400">Timeline Gaps (Suspicious)</h3>
            <div className="space-y-1 text-sm">
              {gaps.map((gap, i) => (
                <div key={i}>
                  {new Date(gap.gap_start).toLocaleTimeString()} - {new Date(gap.gap_end).toLocaleTimeString()}
                  <span className="text-slate-400 ml-2">({gap.gap_minutes} minutes unaccounted for)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setInterviewingPerson(selectedPersonId);
              setActiveTab('interview');
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
          >
            Interview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
          >
            View Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
