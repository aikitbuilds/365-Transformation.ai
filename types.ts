export interface PillarProgress {
  week_number: number;
  health_score: number;
  wealth_score: number;
  relationships_score: number;
}

export interface IncomeData {
  month: string;
  sideBusiness: number;
  solarCareer: number;
  gigWork: number;
}

export interface Ritual {
  id: string;
  name: string;
  time: string;
  completed: boolean;
  category: 'morning' | 'evening';
}

export interface Streak {
  id: string;
  name: string;
  count: number;
}

export interface LifeAssessment {
  physical_health: number;
  mental_health: number;
  spiritual_health: number;
  financial_security: number;
  wealth_building: number;
  financial_mindset: number;
  personal_relationships: number;
  professional_relationships: number;
  social_impact: number;
}

export interface GogginsChallenge {
  week: number;
  description: string;
  completed: boolean;
}

export interface Cookie {
  id: string;
  description: string;
  date: string;
}

export interface ScheduleEvent {
  day: string;
  time: string;
  title: string;
  category: 'Health' | 'Wealth' | 'Relationships' | 'Solar Career';
}
