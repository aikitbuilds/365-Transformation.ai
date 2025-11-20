
import { GoogleGenAI, Type, FunctionDeclaration, Schema } from "@google/genai";
import { KanbanColumn, RoadmapPhase, ProjectFile, Task, TaskStatus } from '../types';

const initialTasks: Task[] = [
    { 
        id: 'task-1', 
        title: 'Setup Supabase Project', 
        description: 'Initialize Supabase project, configure database, and set up environment variables.', 
        status: 'Done', 
        priority: 'High', 
        tags: ['backend', 'setup'], 
        dueDate: '2024-08-10',
        estimatedHours: 4,
        actualHours: 3.5,
        subtasks: [
            { id: 'sub-1-1', text: 'Create new Supabase project', completed: true },
            { id: 'sub-1-2', text: 'Set up local environment with CLI', completed: true },
            { id: 'sub-1-3', text: 'Add secrets to project', completed: true },
        ],
        comments: [
            { id: 'com-1-1', author: 'Michael', text: 'Getting started on this now.', createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    { 
        id: 'task-2', 
        title: 'Define Database Schema', 
        description: 'Create SQL scripts for all required tables as per the project brief.', 
        status: 'Done', 
        priority: 'High', 
        tags: ['backend', 'database'], 
        dueDate: '2024-08-15', 
        estimatedHours: 6,
        actualHours: 7.5, 
        subtasks: [], 
        comments: [] 
    },
    { 
        id: 'task-3', 
        title: 'Build Basic Dashboard Layout', 
        description: 'Create the main 6-section wireframe for the dashboard using React components.', 
        status: 'In Progress', 
        priority: 'Medium', 
        tags: ['frontend', 'ui'], 
        estimatedHours: 12,
        actualHours: 4, 
        subtasks: [], 
        comments: [] 
    },
    { 
        id: 'task-4', 
        title: 'Implement User Authentication', 
        description: 'Set up a mock authentication flow (email/password).', 
        status: 'Backlog', 
        priority: 'High', 
        tags: ['backend', 'auth'], 
        estimatedHours: 8,
        subtasks: [], 
        comments: [] 
    },
    { 
        id: 'task-5', 
        title: 'Fix Edge Function Timeout', 
        description: 'The Kin email parser is timing out on large payloads.', 
        status: 'To Do', 
        priority: 'High', 
        tags: ['backend', 'bug'], 
        estimatedHours: 2,
        subtasks: [], 
        comments: [] 
    },
    { 
        id: 'task-6', 
        title: 'Integrate OpenAI API for Insights', 
        description: 'Connect to GPT-4 to generate coaching insights from journal entries.', 
        status: 'Backlog', 
        priority: 'High', 
        tags: ['backend', 'ai'], 
        dueDate: '2024-09-01', 
        estimatedHours: 10,
        subtasks: [], 
        comments: [] 
    },
    {
        id: 'task-7',
        title: 'Mobile Responsiveness Issue on Nav',
        description: 'Navigation bar overlaps content on iPhone SE.',
        status: 'In Progress',
        priority: 'Low',
        tags: ['frontend', 'bug', 'ui'],
        estimatedHours: 1,
        actualHours: 0.5,
        subtasks: [],
        comments: []
    }
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
To create a fully AI-centric life transformation management platform that serves as a personal operating system.

## 2. Key Objectives
*   **Data Ingestion:** Automatically capture and parse daily journal entries.
*   **AI Analysis:** Provide multi-layer analysis.
*   **Interactive Dashboard:** Visualize progress across key life pillars.

## 3. Success Metrics
*   **MVP Launch:** Week 4.
*   **User Goal:** Enable the user to achieve their stated transformation goals.
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

// --- Gemini AI Function Declarations ---

const createTaskTool: FunctionDeclaration = {
    name: 'createTask',
    description: 'Creates a new task in the project backlog.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'The title of the task.' },
            description: { type: Type.STRING, description: 'A brief description of the task.' },
            priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: 'Priority level of the task.' },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of tags (e.g., "bug", "frontend").' }
        },
        required: ['title']
    }
};

const moveTaskTool: FunctionDeclaration = {
    name: 'moveTask',
    description: 'Moves an existing task to a different status column (Backlog, To Do, In Progress, Done).',
    parameters: {
        type: Type.OBJECT,
        properties: {
            taskTitle: { type: Type.STRING, description: 'The title or partial title of the task to move.' },
            newStatus: { type: Type.STRING, enum: ['Backlog', 'To Do', 'In Progress', 'Done'], description: 'The target status column.' }
        },
        required: ['taskTitle', 'newStatus']
    }
};

export const processUserCommand = async (
    command: string, 
    currentColumns: KanbanColumn[]
): Promise<{status: 'success' | 'error', updatedColumns: KanbanColumn[], message?: string}> => {
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const updatedColumns = JSON.parse(JSON.stringify(currentColumns)); // Deep copy for immutability

    // 1. Build Context for the AI
    const allTasks = updatedColumns.flatMap((c: KanbanColumn) => c.tasks);
    const taskContext = allTasks.map((t: Task) => `- "${t.title}" (Status: ${t.status}, Priority: ${t.priority})`).join('\n');

    const prompt = `
        You are an AI Project Manager for the Transformation OS.
        
        Current Tasks on Board:
        ${taskContext}

        User Command: "${command}"

        Instructions:
        - If the user wants to add a task, call 'createTask'.
        - If the user wants to move/update a task, call 'moveTask'. match the task title fuzzily if needed.
        - If the command is unclear, just return a text response explaining why.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [createTaskTool, moveTaskTool] }],
            }
        });

        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            
            if (call.name === 'createTask') {
                const args = call.args as any;
                const newTask: Task = {
                    id: `task-${Date.now()}`,
                    title: args.title,
                    description: args.description || '',
                    priority: args.priority || 'Medium',
                    status: 'Backlog',
                    tags: args.tags || [],
                    subtasks: [],
                    comments: [],
                    dueDate: new Date().toISOString().split('T')[0] // Default to today if needed, or leave undefined
                };
                
                const backlog = updatedColumns.find((c: KanbanColumn) => c.id === 'Backlog');
                if (backlog) {
                    backlog.tasks.push(newTask);
                    return { status: 'success', updatedColumns, message: `Created task: "${newTask.title}"` };
                }
            } 
            else if (call.name === 'moveTask') {
                const args = call.args as any;
                const targetStatus = args.newStatus as TaskStatus;
                const searchTitle = args.taskTitle.toLowerCase();

                // Find task by fuzzy matching title
                let taskToMove: Task | null = null;
                let sourceColId: string | null = null;
                let taskIndex = -1;

                // Simple search strategy: exact match -> includes match
                for (const col of updatedColumns) {
                    const exactIndex = col.tasks.findIndex((t: Task) => t.title.toLowerCase() === searchTitle);
                    if (exactIndex !== -1) {
                        taskIndex = exactIndex;
                        taskToMove = col.tasks[exactIndex];
                        sourceColId = col.id;
                        break;
                    }
                }

                if (!taskToMove) {
                     for (const col of updatedColumns) {
                        const fuzzyIndex = col.tasks.findIndex((t: Task) => t.title.toLowerCase().includes(searchTitle));
                        if (fuzzyIndex !== -1) {
                            taskIndex = fuzzyIndex;
                            taskToMove = col.tasks[fuzzyIndex];
                            sourceColId = col.id;
                            break;
                        }
                    }
                }

                if (taskToMove && sourceColId) {
                    // Remove from old column
                    const sourceCol = updatedColumns.find((c: KanbanColumn) => c.id === sourceColId);
                    sourceCol.tasks.splice(taskIndex, 1);

                    // Update status and add to new column
                    taskToMove.status = targetStatus;
                    const destCol = updatedColumns.find((c: KanbanColumn) => c.id === targetStatus);
                    if (destCol) {
                        destCol.tasks.push(taskToMove);
                        return { status: 'success', updatedColumns, message: `Moved "${taskToMove.title}" to ${targetStatus}` };
                    }
                } else {
                    return { status: 'error', updatedColumns: currentColumns, message: `Could not find task matching "${args.taskTitle}"` };
                }
            }
        }

        // If no function called, return the text
        return { status: 'error', updatedColumns: currentColumns, message: response.text || "I couldn't understand that command." };

    } catch (error: any) {
        console.error("AI Command Processing Error:", error);
        return { status: 'error', updatedColumns: currentColumns, message: "Failed to process command with AI." };
    }
};
