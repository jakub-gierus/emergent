import { useTimeline } from '../hooks/useDB';
import { useGameStore } from '../stores/game';

export function TimelineList() {
  const { selectedPersonId } = useGameStore();
  const { data: events, isLoading } = useTimeline(selectedPersonId);

  if (isLoading) return <div className="p-4">Loading timeline...</div>;
  if (!events || events.length === 0) return <div className="p-4">No timeline events</div>;

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">
        Timeline {selectedPersonId ? '(Filtered)' : '(All Events)'}
      </h2>

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-3 rounded border ${
              event.verified
                ? 'bg-slate-800 border-slate-700'
                : 'bg-yellow-900/20 border-yellow-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-mono text-sm text-slate-400">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              {event.verified ? (
                <span className="text-green-400 text-xs">✓ VERIFIED</span>
              ) : (
                <span className="text-yellow-400 text-xs">⚠ UNVERIFIED</span>
              )}
            </div>

            {event.person_name && (
              <div className="font-semibold mb-1">{event.person_name}</div>
            )}

            <div className="text-sm">
              <div>
                <span className="text-slate-400">Location:</span> {event.location_name}
              </div>
              <div>
                <span className="text-slate-400">Activity:</span> {event.activity}
              </div>
              <div>
                <span className="text-slate-400">Source:</span> {event.source}
              </div>

              {event.witnesses && event.witnesses.length > 0 && (
                <div>
                  <span className="text-slate-400">Witnesses:</span> {event.witnesses.length}
                </div>
              )}

              {event.evidence_ids && event.evidence_ids.length > 0 && (
                <div>
                  <span className="text-slate-400">Evidence:</span> {event.evidence_ids.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
