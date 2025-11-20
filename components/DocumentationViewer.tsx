import React, { useEffect, useRef } from 'react';
import { ProjectFile } from '../types';

declare global {
    interface Window {
        mermaid: any;
    }
}

const renderMarkdown = (text: string) => {
    // A simple markdown renderer
    let html = text
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 border-b border-slate-700 pb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-sm rounded px-1 py-0.5">$1</code>')
        .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside pl-4"><li>$1</li></ul>') // crude list
        .replace(/\n/g, '<br />');
    
    // Consolidate lists
    html = html.replace(/<\/ul><br \/><ul class="list-disc list-inside pl-4">/g, '');

    return { __html: html };
};


export const DocumentationViewer: React.FC<{ file: ProjectFile }> = ({ file }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (file.type === 'mermaid' && mermaidRef.current) {
            mermaidRef.current.removeAttribute('data-processed');
            mermaidRef.current.innerHTML = file.content;
            try {
                window.mermaid.run({ nodes: [mermaidRef.current] });
            } catch (e) {
                console.error("Mermaid rendering error:", e);
                mermaidRef.current.innerHTML = "Error rendering diagram."
            }
        }
    }, [file]);

    if (!file) return null;

    if (file.type === 'mermaid') {
        return <div ref={mermaidRef} className="mermaid flex justify-center">{file.content}</div>;
    }

    return (
        <div 
            className="prose prose-invert prose-sm max-w-none text-slate-300" 
            dangerouslySetInnerHTML={renderMarkdown(file.content)} 
        />
    );
};
