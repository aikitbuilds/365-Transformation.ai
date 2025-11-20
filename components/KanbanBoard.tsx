import React, { useState } from 'react';
import { KanbanColumn, Task, TaskStatus, Subtask, Comment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { TagIcon, CalendarIcon, XIcon, CheckSquareIcon, MessageSquareIcon, CheckCircleIcon, UserCircleIcon } from './icons/IconComponents';

const priorityColors = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const columnStyles = {
    Backlog: 'border-t-slate-500',
    'To Do': 'border-t-blue-500',
    'In Progress': 'border-t-yellow-500',
    Done: 'border-t-green-500',
}

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
    onUpdateTask: (updatedTask: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onUpdateTask }) => {
    const [newSubtaskText, setNewSubtaskText] = useState('');
    const [newCommentText, setNewCommentText] = useState('');

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubtaskText.trim()) return;
        const newSubtask: Subtask = {
            id: `sub-${Date.now()}`,
            text: newSubtaskText.trim(),
            completed: false,
        };
        const updatedTask = {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask],
        };
        onUpdateTask(updatedTask);
        setNewSubtaskText('');
    };

    const handleToggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        const updatedTask = { ...task, subtasks: updatedSubtasks };
        onUpdateTask(updatedTask);
    };
    
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: 'Michael', // In a real app, this would come from an auth context
            text: newCommentText.trim(),
            createdAt: new Date().toISOString(),
        };
        const updatedTask = {
            ...task,
            comments: [...(task.comments || []), newComment],
        };
        onUpdateTask(updatedTask);
        setNewCommentText('');
    };

    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;


    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <Card className="w-full">
                    <CardHeader className="flex justify-between items-start">
                        <div>
                            <CardTitle>{task.title}</CardTitle>
                             <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                                <span className="flex items-center gap-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${priorityColors[task.priority]}`}></div>
                                    {task.priority} Priority
                                </span>
                                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <p className="text-sm text-slate-300">{task.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                                {task.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-xs bg-slate-700 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-700/50 pt-4">
                            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-blue-400" />Sub-tasks</h4>
                            <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s' }}></div>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {task.subtasks?.map(subtask => (
                                    <div key={subtask.id} className="flex items-center gap-2 text-sm p-1 rounded-md hover:bg-slate-800/50">
                                        <input type="checkbox" checked={subtask.completed} onChange={() => handleToggleSubtask(subtask.id)} 
                                            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-violet-500" />
                                        <span className={subtask.completed ? 'line-through text-slate-500' : 'text-slate-300'}>{subtask.text}</span>
                                    </div>
                                ))}
                            </div>
                             <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
                                <input type="text" value={newSubtaskText} onChange={(e) => setNewSubtaskText(e.target.value)} placeholder="Add a new sub-task..."
                                       className="flex-grow p-2 text-sm bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                <button type="submit" className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">Add</button>
                            </form>
                        </div>
                        
                        <div className="border-t border-slate-700/50 pt-4">
                            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2"><MessageSquareIcon className="w-5 h-5 text-green-400" />Comments</h4>
                             <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                {task.comments?.map(comment => (
                                    <div key={comment.id} className="flex items-start gap-3">
                                        <UserCircleIcon className="w-8 h-8 text-slate-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold text-sm text-slate-200">{comment.author}</span>
                                                <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm bg-slate-800/70 p-2 rounded-lg mt-1">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <form onSubmit={handleAddComment} className="flex items-start gap-2 mt-4">
                                <textarea value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment..." rows={2}
                                          className="flex-grow p-2 text-sm bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none" />
                                <button type="submit" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors self-end">Post</button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    isDragging: boolean;
    isEditingDueDate: boolean;
    // Fix: Updated prop type to accept MouseEvent for compatibility with onClick handlers.
    onSetEditingDueDate: (e: React.MouseEvent) => void;
    onUpdateDueDate: (newDate: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging, isEditingDueDate, onSetEditingDueDate, onUpdateDueDate }) => (
    <Card className={`mb-3 p-3 text-sm shadow-lg ${isDragging ? 'opacity-80' : ''}`}>
        <div className="flex justify-between items-start">
            <p className="font-semibold text-slate-200">{task.title}</p>
            <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}></div>
        </div>
        <p className="text-slate-400 mt-1 text-xs">{task.description}</p>
        <div className="flex items-center justify-between mt-3 text-slate-500">
            <div className="flex items-center gap-2">
                <TagIcon className="w-3 h-3" />
                <div className="flex gap-1.5">
                    {task.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 text-xs bg-slate-700 rounded-md">{tag}</span>
                    ))}
                </div>
            </div>
             <div className="flex items-center gap-1 text-xs">
                {isEditingDueDate ? (
                    <input
                        type="date"
                        defaultValue={task.dueDate || ''}
                        onBlur={(e) => onUpdateDueDate(e.target.value)}
                        autoFocus
                        className="bg-slate-800 border-slate-600 rounded-md text-xs p-1 focus:ring-1 focus:ring-violet-500 focus:outline-none"
                         style={{ colorScheme: 'dark' }}
                    />
                ) : (
                    <button onClick={onSetEditingDueDate} className="flex items-center gap-1 text-xs hover:text-white transition-colors p-1 rounded-md">
                        <CalendarIcon className="w-3 h-3" />
                        {task.dueDate ? (
                             <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                        ) : (
                            <span className="text-slate-500">Set date</span>
                        )}
                    </button>
                )}
            </div>
        </div>
    </Card>
);

interface AddTaskFormProps {
    onAddTask: (taskData: Omit<Task, 'id' | 'status'>) => void;
    onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    const [tags, setTags] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddTask({
            title,
            description,
            priority,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            dueDate: dueDate || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-20 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
                            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">Create Task</button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

interface KanbanBoardProps {
    columns: KanbanColumn[];
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
    onDragEnd: (result: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns, setColumns, onDragEnd }) => {
    const [draggedItem, setDraggedItem] = useState<{task: Task, colId: TaskStatus} | null>(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [editingDueDateTaskId, setEditingDueDateTaskId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task, colId: TaskStatus) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem({task, colId});
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColId: TaskStatus) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { task, colId: sourceColId } = draggedItem;
        
        if (sourceColId === targetColId) {
            setDraggedItem(null);
            return;
        }

        const mockResult = {
            draggableId: task.id,
            source: { droppableId: sourceColId, index: columns.find(c=>c.id === sourceColId)!.tasks.findIndex(t=>t.id===task.id) },
            destination: { droppableId: targetColId, index: columns.find(c=>c.id === targetColId)!.tasks.length }
        };

        onDragEnd(mockResult);
        setDraggedItem(null);
    };

    const handleAddTask = (taskData: Omit<Task, 'id' | 'status'>) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            status: 'Backlog',
            ...taskData,
            subtasks: [],
            comments: [],
        };

        const newColumns = columns.map(col => {
            if (col.id === 'Backlog') {
                return { ...col, tasks: [...col.tasks, newTask] };
            }
            return col;
        });

        setColumns(newColumns);
        setIsAddingTask(false);
    };
    
    const handleUpdateDueDate = (taskId: string, newDueDate: string) => {
        const newColumns = columns.map(col => ({
            ...col,
            tasks: col.tasks.map(t => {
                if (t.id === taskId) {
                    return { ...t, dueDate: newDueDate || undefined }; // Set to undefined if date is cleared
                }
                return t;
            })
        }));
        setColumns(newColumns);
        setEditingDueDateTaskId(null); // Exit editing mode
    };

    const handleUpdateTask = (updatedTask: Task) => {
        const newColumns = columns.map(column => ({
            ...column,
            tasks: column.tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        }));
        setColumns(newColumns);
        setSelectedTask(updatedTask); // Keep modal updated
    };

    return (
        <div>
            {isAddingTask && <AddTaskForm onAddTask={handleAddTask} onCancel={() => setIsAddingTask(false)} />}
            {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} onUpdateTask={handleUpdateTask} />}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Project Kanban Board</h3>
                <button 
                    onClick={() => setIsAddingTask(true)}
                    className="px-3 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                >
                    + Add Task
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {columns.map(column => (
                <div key={column.id} 
                     onDragOver={handleDragOver}
                     onDrop={(e) => handleDrop(e, column.id)}
                >
                    <Card className={`border-t-4 ${columnStyles[column.id]}`}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{column.title}</CardTitle>
                                <span className="text-xs font-bold text-slate-400 bg-slate-700/50 rounded-full px-2 py-0.5">{column.tasks.length}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="min-h-[200px] space-y-3">
                            {column.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task, column.id)}
                                    className="cursor-grab"
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <TaskCard 
                                        task={task} 
                                        isDragging={draggedItem?.task.id === task.id}
                                        isEditingDueDate={editingDueDateTaskId === task.id}
                                        onSetEditingDueDate={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            setEditingDueDateTaskId(task.id)
                                        }}
                                        onUpdateDueDate={(newDate) => handleUpdateDueDate(task.id, newDate)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            ))}
            </div>
        </div>
    );
};