import { useEvidence, useCollectEvidence, useAnalyzeEvidence } from '../hooks/useDB';

export function EvidenceList() {
  const { data: evidence, isLoading } = useEvidence();
  const collectMutation = useCollectEvidence();
  const analyzeMutation = useAnalyzeEvidence();

  if (isLoading) return <div className="p-4">Loading evidence...</div>;
  if (!evidence || evidence.length === 0) return <div className="p-4">No evidence found</div>;

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Evidence Log</h2>

      <div className="space-y-3">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 p-4 rounded border border-slate-700"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-mono text-sm text-blue-400">{item.id}</span>
                <span className="ml-2 text-xs bg-slate-700 px-2 py-1 rounded">
                  {item.type}
                </span>
              </div>
              {item.analyzed ? (
                <span className="text-green-400 text-xs">✓ ANALYZED</span>
              ) : item.collected_at ? (
                <span className="text-yellow-400 text-xs">COLLECTED</span>
              ) : (
                <span className="text-slate-400 text-xs">AVAILABLE</span>
              )}
            </div>

            <div className="text-sm space-y-1">
              <div>
                <span className="text-slate-400">Location:</span> {item.location_name}
              </div>
              <div className="mt-2">{item.description}</div>

              {item.collected_at && (
                <div className="text-xs text-slate-400">
                  Collected: {new Date(item.collected_at).toLocaleString()}
                </div>
              )}

              {item.analysis_results && (
                <div className="mt-2 p-2 bg-blue-900/30 border border-blue-700 rounded text-sm">
                  <div className="font-semibold text-blue-400 mb-1">Analysis:</div>
                  {item.analysis_results}
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              {!item.collected_at && (
                <button
                  onClick={() => collectMutation.mutate(item.id)}
                  disabled={collectMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-3 py-1 rounded text-sm"
                >
                  Collect
                </button>
              )}

              {item.collected_at && !item.analyzed && (
                <button
                  onClick={() =>
                    analyzeMutation.mutate({
                      evidenceId: item.id,
                      results: 'Analysis pending (auto-generated result would go here)',
                    })
                  }
                  disabled={analyzeMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 px-3 py-1 rounded text-sm"
                >
                  Analyze
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
