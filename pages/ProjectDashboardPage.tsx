import React, { useState, useEffect, useContext } from 'react';
import { KanbanBoard } from '../components/KanbanBoard';
import { Roadmap } from '../components/Roadmap';
import { DocumentationViewer } from '../components/DocumentationViewer';
import { ProjectStats } from '../components/ProjectStats';
import { VoiceInteraction } from '../components/VoiceInteraction';
import { getInitialProjectData, processUserCommand } from '../services/projectAiService';
import { KanbanColumn, RoadmapPhase, ProjectFile, TaskStatus } from '../types';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const ProjectDashboardPage: React.FC = () => {
  const authCtx = useContext(AuthContext);
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [commandResponse, setCommandResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getProjectDocRef = () => {
    if (!authCtx?.user || authCtx.isDemo) return null;
    return doc(db, 'users', authCtx.user.uid, 'projects', 'default');
  }

  useEffect(() => {
    const fetchProjectData = async () => {
      // Handle Demo Mode
      if (authCtx?.isDemo) {
          const initialData = getInitialProjectData();
          setColumns(initialData.columns);
          setRoadmap(initialData.roadmap);
          setFiles(initialData.files);
          setActiveFile(initialData.files[0]);
          setIsLoading(false);
          return;
      }

      const projectDocRef = getProjectDocRef();
      if (!projectDocRef) return;

      setIsLoading(true);
      try {
        const docSnap = await getDoc(projectDocRef);

        if (docSnap.exists()) {
            const projectData = docSnap.data();
            setColumns(projectData.columns || []);
            setRoadmap(projectData.roadmap || []);
            setFiles(projectData.files || []);
            setActiveFile(projectData.files?.[0] || null);
        } else {
            const initialData = getInitialProjectData();
            await setDoc(projectDocRef, initialData);
            setColumns(initialData.columns);
            setRoadmap(initialData.roadmap);
            setFiles(initialData.files);
            setActiveFile(initialData.files[0]);
        }
      } catch (error) {
          console.error("Error fetching project data: ", error);
          // Fallback to initial data on error to keep UI usable
          const initialData = getInitialProjectData();
          setColumns(initialData.columns);
          setRoadmap(initialData.roadmap);
          setFiles(initialData.files);
          setActiveFile(initialData.files[0]);
      } finally {
          setIsLoading(false);
      }
    };

    if (authCtx?.user) {
      fetchProjectData();
    }
  }, [authCtx?.user, authCtx?.isDemo]);

  const updateColumnsInFirestore = async (newColumns: KanbanColumn[]) => {
      if (authCtx?.isDemo) return; // Skip Firestore update in demo mode

      const projectDocRef = getProjectDocRef();
      if (!projectDocRef) return;
      try {
        await updateDoc(projectDocRef, { columns: newColumns });
      } catch(e) {
        console.error("Error updating columns in Firestore: ", e);
      }
  }

  const handleSetColumns = (newColumns: KanbanColumn[] | ((prevState: KanbanColumn[]) => KanbanColumn[])) => {
    if (typeof newColumns === 'function') {
        setColumns(prevColumns => {
            const updatedColumns = newColumns(prevColumns);
            updateColumnsInFirestore(updatedColumns);
            return updatedColumns;
        });
    } else {
        setColumns(newColumns);
        updateColumnsInFirestore(newColumns);
    }
  };


  const handleCommand = async (command: string) => {
    setIsProcessingCommand(true);
    setCommandResponse(null);
    const result = await processUserCommand(command, columns);
    if (result.status === 'success') {
      handleSetColumns(result.updatedColumns);
      setCommandResponse(`Success: Command executed.`);
    } else {
      setCommandResponse(`Error: ${result.message}`);
    }
    setIsProcessingCommand(false);
  };

  const handleDragEnd = (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColId = source.droppableId as TaskStatus;
        const destColId = destination.droppableId as TaskStatus;

        let newColumns = JSON.parse(JSON.stringify(columns)); // Deep copy to avoid mutation issues
        const sourceCol = newColumns.find((c: KanbanColumn) => c.id === sourceColId);
        const destCol = newColumns.find((c: KanbanColumn) => c.id === destColId);
        
        if(!sourceCol || !destCol) return;

        const task = sourceCol.tasks.find((t: any) => t.id === draggableId);
        if(!task) return;
        
        const taskIndex = sourceCol.tasks.findIndex((t: any) => t.id === draggableId);
        sourceCol.tasks.splice(taskIndex, 1);

        task.status = destColId;
        destCol.tasks.splice(destination.index, 0, task);
        
        handleSetColumns(newColumns);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Project OS...</div>;
  }


  return (
    <div className="p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Project OS: Transformation App</h1>
        <p className="text-slate-400">Collaborative dashboard for building your personal operating system.</p>
      </header>

      <ProjectStats tasks={columns.flatMap(c => c.tasks)} />

      <Roadmap phases={roadmap} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
            <KanbanBoard columns={columns} onDragEnd={handleDragEnd} setColumns={handleSetColumns} />
        </div>
        <div className="space-y-6 sticky top-24">
            <VoiceInteraction onCommand={handleCommand} isProcessing={isProcessingCommand} />
             <div>
                <h3 className="text-lg font-semibold mb-2">Documentation Hub</h3>
                <div className="flex space-x-2 mb-4">
                    {files.map(file => (
                        <button key={file.name} onClick={() => setActiveFile(file)}
                            className={`px-3 py-1 text-xs rounded-md ${activeFile?.name === file.name ? 'bg-violet-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                            {file.name}
                        </button>
                    ))}
                </div>
                {activeFile && <DocumentationViewer file={activeFile} />}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;