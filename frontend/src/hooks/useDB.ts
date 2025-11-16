import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { query, execute } from '../lib/db';
import type { Person, TimelineEvent, Evidence, Relationship, GameState, Location } from '../lib/types';

export function usePeople() {
  return useQuery({
    queryKey: ['people'],
    queryFn: () => query<Person>('SELECT * FROM people ORDER BY name'),
  });
}

export function usePerson(id: string | null) {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => query<Person>(`SELECT * FROM people WHERE id = '${id}'`),
    enabled: !!id,
  });
}

export function useTimeline(personId?: string | null) {
  return useQuery({
    queryKey: ['timeline', personId],
    queryFn: async () => {
      const sql = personId
        ? `SELECT t.*, l.name as location_name
           FROM timeline_events t
           JOIN locations l ON t.location_id = l.id
           WHERE t.person_id = '${personId}'
           ORDER BY t.timestamp`
        : `SELECT t.*, l.name as location_name, p.name as person_name
           FROM timeline_events t
           JOIN locations l ON t.location_id = l.id
           JOIN people p ON t.person_id = p.id
           ORDER BY t.timestamp`;
      return query<TimelineEvent & { person_name?: string }>(sql);
    },
  });
}

export function useEvidence() {
  return useQuery({
    queryKey: ['evidence'],
    queryFn: async () => {
      return query<Evidence & { location_name: string }>(
        `SELECT e.*, l.name as location_name
         FROM evidence e
         JOIN locations l ON e.location_id = l.id
         ORDER BY e.id`
      );
    },
  });
}

export function useRelationships(personId: string | null) {
  return useQuery({
    queryKey: ['relationships', personId],
    queryFn: async () => {
      if (!personId) return [];
      return query<Relationship & { other_person_name: string }>(
        `SELECT r.*, p.name as other_person_name
         FROM relationships r
         JOIN people p ON (
           CASE
             WHEN r.person_a = '${personId}' THEN r.person_b = p.id
             WHEN r.person_b = '${personId}' THEN r.person_a = p.id
           END
         )
         WHERE r.person_a = '${personId}' OR r.person_b = '${personId}'`
      );
    },
    enabled: !!personId,
  });
}

export function useGameState() {
  return useQuery({
    queryKey: ['gameState'],
    queryFn: async () => {
      const result = await query<GameState & { victim_name: string }>(
        `SELECT g.*, p.name as victim_name
         FROM game_state g
         JOIN people p ON g.victim_id = p.id
         WHERE g.id = 1`
      );
      return result[0];
    },
  });
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => query<Location>('SELECT * FROM locations ORDER BY name'),
  });
}

export function useCollectEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evidenceId: string) => {
      await execute(
        `UPDATE evidence
         SET collected_at = CURRENT_TIMESTAMP
         WHERE id = '${evidenceId}'`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}

export function useAnalyzeEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ evidenceId, results }: { evidenceId: string; results: string }) => {
      await execute(
        `UPDATE evidence
         SET analyzed = TRUE, analysis_results = '${results}'
         WHERE id = '${evidenceId}'`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}

export function useAccuse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (personId: string) => {
      await execute(
        `UPDATE game_state
         SET case_solved = TRUE, accused_person_id = '${personId}'
         WHERE id = 1`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameState'] });
    },
  });
}

export function useTimelineGaps(personId: string | null) {
  return useQuery({
    queryKey: ['timeline-gaps', personId],
    queryFn: async () => {
      if (!personId) return [];
      return query<{ gap_start: string; gap_end: string; gap_minutes: number }>(
        `WITH events AS (
          SELECT
            timestamp,
            LEAD(timestamp) OVER (ORDER BY timestamp) as next_timestamp
          FROM timeline_events
          WHERE person_id = '${personId}'
            AND timestamp BETWEEN '2024-03-15 18:00:00' AND '2024-03-15 20:00:00'
        )
        SELECT
          timestamp as gap_start,
          next_timestamp as gap_end,
          EXTRACT(MINUTE FROM next_timestamp - timestamp) as gap_minutes
        FROM events
        WHERE next_timestamp IS NOT NULL
          AND EXTRACT(MINUTE FROM next_timestamp - timestamp) > 15
        ORDER BY gap_start`
      );
    },
    enabled: !!personId,
  });
}
