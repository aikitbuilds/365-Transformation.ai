import React from 'react';

export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Done';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO string
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  subtasks?: Subtask[];
  comments?: Comment[];
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface RoadmapPhase {
  name: string;
  weeks: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export interface ProjectFile {
    name: string;
    type: 'markdown' | 'mermaid';
    content: string;
}

// Types for the Transformation OS Dashboard
export interface Pillar {
    name: string;
    score: number;
    target: number;
    color: string;
}

export interface LifeAssessment {
    category: string;
    score: number;
}

export interface Streak {
    name: string;
    icon: React.ComponentType<{className?: string}>;
    days: number;
}

export interface IncomeData {
    month: string;
    sideBusiness: number;
    solarCareer: number;
    gigWork: number;
}

export interface UserProfile {
    name: string;
    mainGoal: string;
    pillars: Pillar[];
    aiStartingPlan: {
        title: string;
        steps: string[];
    };
}

// New Types for Goals/Milestones
export interface MetricEntry {
    date: string; // YYYY-MM-DD
    value: number;
}

export interface KeyMetric {
    name: string;
    progress: number;
    target: number;
    unit: string;
    history?: MetricEntry[];
}

export type GoalStatus = 'On Track' | 'At Risk' | 'Achieved' | 'Upcoming';
export type GoalPillar = 'Health' | 'Wealth' | 'Relationships' | 'General';

export interface Goal {
    id: string;
    title: string;
    description: string;
    targetDate: string;
    status: GoalStatus;
    pillar: GoalPillar;
    keyMetrics: KeyMetric[];
}