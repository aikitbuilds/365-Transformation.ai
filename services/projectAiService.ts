import { KanbanColumn, RoadmapPhase, ProjectFile, Task, TaskStatus } from '../types';

const initialTasks: Task[] = [
    { 
        id: 'task-1', 
        title: 'Setup Supabase Project', 
        description: 'Initialize Supabase project, configure database, and set up environment variables.', 
        status: 'To Do', 
        priority: 'High', 
        tags: ['backend', 'setup'], 
        dueDate: '2024-08-10',
        subtasks: [
            { id: 'sub-1-1', text: 'Create new Supabase project', completed: true },
            { id: 'sub-1-2', text: 'Set up local environment with CLI', completed: false },
            { id: 'sub-1-3', text: 'Add secrets to project', completed: false },
        ],
        comments: [
            { id: 'com-1-1', author: 'Michael', text: 'Getting started on this now.', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    { id: 'task-2', title: 'Define Database Schema', description: 'Create SQL scripts for all required tables as per the project brief.', status: 'To Do', priority: 'High', tags: ['backend', 'database'], dueDate: '2024-08-15', subtasks: [], comments: [] },
    { id: 'task-3', title: 'Build Basic Dashboard Layout', description: 'Create the main 6-section wireframe for the dashboard using React components.', status: 'To Do', priority: 'Medium', tags: ['frontend', 'ui'], subtasks: [], comments: [] },
    { id: 'task-4', title: 'Implement User Authentication', description: 'Set up a mock authentication flow (email/password).', status: 'Backlog', priority: 'High', tags: ['backend', 'auth'], subtasks: [], comments: [] },
    { id: 'task-5', title: 'Create Kin Email Parsing Function', description: 'Develop a Supabase Edge Function to parse incoming emails.', status: 'Backlog', priority: 'Medium', tags: ['backend', 'integration'], subtasks: [], comments: [] },
    { id: 'task-6', title: 'Integrate OpenAI API for Insights', description: 'Connect to GPT-4 to generate coaching insights from journal entries.', status: 'Backlog', priority: 'High', tags: ['backend', 'ai'], dueDate: '2024-09-01', subtasks: [], comments: [] },
];

const initialColumns: KanbanColumn[] = [
    { id: 'Backlog', title: 'Backlog', tasks: initialTasks.filter(t => t.status === 'Backlog') },
    { id: 'To Do', title: 'To Do', tasks: initialTasks.filter(t => t.status === 'To Do') },
    { id: 'In Progress', title: 'In Progress', tasks: initialTasks.filter(t => t.status === 'In Progress') },
    { id: 'Done', title: 'Done', tasks: initialTasks.filter(t => t.status === 'Done') },
];

const initialRoadmap: RoadmapPhase[] = [
    { name: 'Phase 1: Foundation', weeks: 'Weeks 1-2', description: 'Setup project, database, auth, and basic UI layout.', status: 'In Progress' },
    { name: 'Phase 2: Core Features', weeks: 'Weeks 3-5', description: 'Implement daily rituals, AI analysis pipeline, and streak counters.', status: 'Upcoming' },
    { name: 'Phase 3: Advanced Features', weeks: 'Weeks 6-8', description: 'Integrate real-time updates, income tracking, and external APIs.', status: 'Upcoming' },
    { name: 'Phase 4: Polish & Deploy', weeks: 'Weeks 9-10', description: 'Optimize for mobile, performance tune, and deploy to Vercel.', status: 'Upcoming' },
];

const initialFiles: ProjectFile[] = [
    {
        name: 'PROJECT_CHARTER.md',
        type: 'markdown',
        content: `
# Project Charter: Transformation OS

## 1. Project Overview
To create a fully AI-centric life transformation management platform that serves as a personal operating system for managing a 12-month personal growth journey. The app will function as an AI Coach, Mentor, and Analyst.

## 2. Key Objectives
*   **Data Ingestion:** Automatically capture and parse daily journal entries from Kin emails.
*   **AI Analysis:** Provide multi-layer analysis (sentiment, themes, actions, insights).
*   **Interactive Dashboard:** Visualize progress across key life pillars (Health, Wealth, Relationships).
*   **Systematic Coaching:** Offer AI-generated coaching, redundancy alerts, and optimization suggestions.

## 3. Success Metrics
*   **MVP Launch:** Week 4 - Manual journal entry, daily rituals, basic AI insights.
*   **Full App Launch:** Week 10 - All features implemented, including calendar sync and mobile optimization.
*   **User Goal:** Enable the user to achieve their stated transformation goals by Nov 5, 2026.
        `
    },
    {
        name: 'APP_WORKFLOW.mermaid',
        type: 'mermaid',
        content: `
graph TD
    A[Kin Email] -->|Webhook| B(Supabase Edge Function);
    B -->|Parse Email| C{Structured Journal Data};
    C --> D[Save to 'journal_entries' table];
    D -->|DB Trigger| E(Multi-Model AI Analysis);
    E -->|GPT-4| F{Generated Insights};
    F --> G[Save to 'ai_analyses' table];
    G -->|Supabase Real-time| H(Dashboard UI);
    H -->|User Interaction| A;
        `
    }
];


export const getInitialProjectData = () => {
    return {
        columns: initialColumns,
        roadmap: initialRoadmap,
        files: initialFiles,
    };
};

export const processUserCommand = async (command: string, currentColumns: KanbanColumn[]): Promise<{status: 'success' | 'error', updatedColumns: KanbanColumn[], message?: string}> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate AI processing time

    const updatedColumns = JSON.parse(JSON.stringify(currentColumns));

    // Command: "create task: [title] desc: [description] priority: [high/med/low]"
    if (command.toLowerCase().startsWith('create task:')) {
        try {
            const titleMatch = command.match(/create task: (.*?)(desc: |priority:|$)/i);
            const descMatch = command.match(/desc: (.*?)(priority:|$)/i);
            const priorityMatch = command.match(/priority: (high|medium|low)/i);

            const title = titleMatch ? titleMatch[1].trim() : 'New Task';
            const description = descMatch ? descMatch[1].trim() : '';
            const priority = priorityMatch ? (priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1)) as Task['priority'] : 'Medium';

            const newTask: Task = {
                id: `task-${Date.now()}`,
                title,
                description,
                priority,
                status: 'Backlog',
                tags: ['new'],
                subtasks: [],
                comments: [],
            };

            const backlog = updatedColumns.find((c: KanbanColumn) => c.id === 'Backlog');
            if (backlog) {
                backlog.tasks.push(newTask);
                return { status: 'success', updatedColumns };
            }
        } catch (e) {
            return { status: 'error', updatedColumns: currentColumns, message: 'Could not parse create task command.' };
        }
    }
    
    // Command: "update task [id] to [status]"
    const updateMatch = command.toLowerCase().match(/update task (.*?) to (backlog|to do|in progress|done)/i);
    if(updateMatch) {
        const taskId = updateMatch[1].trim();
        const newStatus = updateMatch[2].trim().replace(/\b\w/g, l => l.toUpperCase()) as TaskStatus; // Capitalize

        let taskToMove: Task | null = null;
        
        // Find and remove
        for (const col of updatedColumns) {
            const taskIndex = col.tasks.findIndex((t:Task) => t.id === taskId);
            if (taskIndex !== -1) {
                [taskToMove] = col.tasks.splice(taskIndex, 1);
                break;
            }
        }
        
        // Add to new column
        if(taskToMove) {
            taskToMove.status = newStatus;
            const newCol = updatedColumns.find((c:KanbanColumn) => c.id === newStatus);
            newCol?.tasks.push(taskToMove);
            return { status: 'success', updatedColumns };
        } else {
             return { status: 'error', updatedColumns: currentColumns, message: `Task with ID "${taskId}" not found.` };
        }
    }

    return { status: 'error', updatedColumns: currentColumns, message: 'Command not recognized.' };
};