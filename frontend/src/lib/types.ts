export interface Person {
  id: string;
  name: string;
  age: number;
  occupation: string;
  home_address: string;
  financial_status: string;
  psychological_profile: string;
}

export interface TimelineEvent {
  id: string;
  person_id: string;
  timestamp: string;
  location_id: string;
  location_name: string;
  activity: string;
  witnesses: string[];
  evidence_ids: string[];
  verified: boolean;
  source: string;
}

export interface Relationship {
  id: string;
  person_a: string;
  person_b: string;
  relationship_type: string;
  strength: number;
  secrets: string[];
}

export interface Evidence {
  id: string;
  type: string;
  location_id: string;
  location_name: string;
  description: string;
  collected_at: string | null;
  analyzed: boolean;
  analysis_results: string | null;
}

export interface Interview {
  id: string;
  person_id: string;
  timestamp: string;
  questions: InterviewQA[];
  stress_level: number;
}

export interface InterviewQA {
  question: string;
  answer: string;
  body_language?: string;
}

export interface CaseInfo {
  victim_name: string;
  victim_id: string;
  location: string;
  time_of_death: string;
  method: string;
  case_opened: string;
}

export interface GameState {
  id: number;
  victim_id: string;
  case_opened: string;
  current_day: number;
  budget_remaining: number;
  reputation: number;
  case_solved: boolean;
  accused_person_id: string | null;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
}
