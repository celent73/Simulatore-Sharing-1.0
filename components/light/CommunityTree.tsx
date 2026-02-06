import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronDown, Check, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface NodeData {
    id: string;
    label: string;
    role: string;
    level: number;
    children?: NodeData[];
}

const INITIAL_TREE_DATA: NodeData = {
    id: 'me',
    label: 'Tu',
    role: 'Family Pro',
    level: 0,
    children: [
        {
            id: 'marco',
            label: 'Marco G.',
            role: 'Family',
            level: 1,
            children: [
                {
                    id: 'anna',
                    label: 'Anna L.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'filippo', label: 'Filippo', role: 'Member', level: 3 },
                        { id: 'elisa', label: 'Elisa', role: 'Member', level: 3 },
                    ]
                },
                { id: 'luca', label: 'Luca B.', role: 'Member', level: 2 },
            ]
        },
        {
            id: 'elena',
            label: 'Elena R.',
            role: 'Family',
            level: 1,
            children: [
                {
                    id: 'sara',
                    label: 'Sara M.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'matteo', label: 'Matteo', role: 'Member', level: 3 },
                    ]
                },
            ]
        },
        {
            id: 'pietro',
            label: 'Pietro V.',
            role: 'Family Pro',
            level: 1,
            children: [
                { id: 'giulia', label: 'Giulia S.', role: 'Member', level: 2 },
                {
                    id: 'davide',
                    label: 'Davide N.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'chiara', label: 'Chiara', role: 'Member', level: 3 },
                        { id: 'fabio', label: 'Fabio', role: 'Member', level: 3 },
                    ]
                },
            ]
        }
    ]
};

const TreeNodeComponent = ({ node, onUpdate, theme, isProjection }: { node: NodeData; onUpdate: (id: string, newLabel: string) => void; theme: string; isProjection?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(node.label);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasChildren = node.children && node.children.length > 0;
    const isMain = node.level === 0;
    const isLevel3 = node.level >= 3;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        onUpdate(node.id, editValue);
        setIsEditing(false);
    };

    const nodeStyles = {
        glass: isMain
            ? 'bg-gradient-to-br from-union-green-500 to-union-green-700 text-white border-white/20'
            : isLevel3 ? 'bg-white/95 text-union-black border-union-green-500/5' : 'bg-white/90 text-union-black border-union-green-500/10',
        dark: isMain
            ? 'bg-gradient-to-br from-yellow-600 to-yellow-900 text-white border-yellow-400/30'
            : isLevel3 ? 'bg-zinc-800 text-zinc-100 border-zinc-700' : 'bg-zinc-900 text-white border-yellow-600/20',
        minimal: isMain
            ? 'bg-union-black text-white border-black'
            : 'bg-white text-union-black border-gray-200 shadow-sm'
    };

    const connectorColor = theme === 'dark' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(46, 204, 113, 0.2)';

    return (
        <div className="flex flex-col items-center relative">
            <motion.div
                layout
                className={`
          relative rounded-2xl shadow-xl border backdrop-blur-md z-20 transition-all duration-300
          ${nodeStyles[theme as keyof typeof nodeStyles]}
          ${isMain ? 'animate-glow p-4 min-w-[130px]' : isLevel3 ? 'p-2 min-w-[90px]' : 'p-4 min-w-[130px]'}
          ${isProjection ? 'opacity-40 border-dashed scale-95' : ''}
          flex flex-col items-center
        `}
            >
                <div className={`
          p-2 rounded-full mb-1
          ${isMain ? 'bg-white/20' : theme === 'dark' ? 'bg-yellow-600/10 text-yellow-500' : 'bg-union-green-500/10 text-union-green-600'}
          ${isLevel3 ? 'scale-75' : ''}
        `}>
                    {isMain ? <User size={isLevel3 ? 16 : 20} /> : <Users size={isLevel3 ? 14 : 18} />}
                </div>

                {isEditing ? (
                    <div className="flex flex-col items-center gap-2">
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }}
                            onBlur={handleSave}
                            className="bg-union-green-50/20 border border-union-green-500/30 rounded px-2 py-1 text-xs font-bold text-center w-24 outline-none no-export"
                            autoFocus
                        />
                        <div className="flex gap-1 no-export">
                            <button
                                onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
                                className="p-1 bg-union-green-500 text-white rounded-full scale-75"
                            >
                                <Check size={12} />
                            </button>
                            <button
                                onMouseDown={(e) => { e.preventDefault(); setIsEditing(false); setEditValue(node.label); }}
                                className="p-1 bg-red-400 text-white rounded-full scale-75"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => !isProjection && setIsEditing(true)}
                        className="group flex flex-col items-center cursor-edit"
                        title="Clicca per modificare"
                    >
                        <span className={`font-black ${isLevel3 ? 'text-[10px]' : 'text-xs'} ${theme === 'minimal' ? 'text-black' : ''}`}>{node.label}</span>
                        <span className={`${isLevel3 ? 'text-[7px]' : 'text-[9px]'} uppercase font-black opacity-40 tracking-widest`}>{node.role}</span>
                    </div>
                )}

                {hasChildren && (
                    <div
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`mt-1 cursor-pointer transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        <ChevronDown size={14} className={isMain ? 'text-white/50' : 'opacity-40'} />
                    </div>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex gap-4 sm:gap-12 relative justify-center px-4 ${isLevel3 ? 'mt-8' : 'mt-16'}`}
                    >
                        <svg className={`absolute left-0 w-full pointer-events-none overflow-visible z-10 no-export ${isLevel3 ? 'top-[-32px] h-8' : 'top-[-64px] h-16'}`}>
                            {node.children!.map((_, idx) => {
                                const total = node.children!.length;
                                const step = 100 / total;
                                const targetX = (idx * step) + (step / 2);
                                const h = isLevel3 ? 32 : 64;
                                return (
                                    <path
                                        key={idx}
                                        d={`M 50% 0 C 50% ${h / 2}, ${targetX}% ${h / 2}, ${targetX}% ${h}`}
                                        stroke={connectorColor}
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                );
                            })}
                        </svg>
                        {node.children!.map((child) => (
                            <TreeNodeComponent key={child.id} node={child} onUpdate={onUpdate} theme={theme} isProjection={child.id.includes('ghost')} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface TreeProps {
    theme?: 'glass' | 'dark' | 'minimal';
    isProjectionMode?: boolean;
}

const CommunityTree = ({ theme = 'glass', isProjectionMode = false }: TreeProps) => {
    const [treeData, setTreeData] = useState<NodeData>(INITIAL_TREE_DATA);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [manualZoom, setManualZoom] = useState(false);

    const displayData = React.useMemo(() => {
        if (!isProjectionMode) return treeData;

        const injectGhosts = (node: NodeData): NodeData => {
            const children = node.children ? node.children.map(injectGhosts) : [];
            if (node.level < 3) {
                const currentCount = children.length;
                const targetCount = node.level === 0 ? 4 : 2;
                for (let i = currentCount; i < targetCount; i++) {
                    children.push({
                        id: `ghost-${node.id}-${i}`,
                        label: 'Nuovo Partner',
                        role: 'Potential',
                        level: node.level + 1,
                    });
                }
            }
            return { ...node, children };
        };

        return injectGhosts(treeData);
    }, [treeData, isProjectionMode]);

    const handleAutoResize = () => {
        if (containerRef.current && !manualZoom) {
            const viewportWidth = window.innerWidth - 64;
            const contentWidth = containerRef.current.scrollWidth;
            setScale(contentWidth > viewportWidth ? Math.max(0.3, viewportWidth / contentWidth) : 1);
        }
    };

    useEffect(() => {
        handleAutoResize();
        window.addEventListener('resize', handleAutoResize);
        return () => window.removeEventListener('resize', handleAutoResize);
    }, [displayData, manualZoom]);

    const updateNodeLabel = (id: string, newLabel: string) => {
        const updateRecursive = (current: NodeData): NodeData => {
            if (current.id === id) return { ...current, label: newLabel };
            if (current.children) return { ...current, children: current.children.map(updateRecursive) };
            return current;
        };
        setTreeData(updateRecursive(treeData));
    };

    const handleZoomIn = () => {
        setManualZoom(true);
        setScale(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setManualZoom(true);
        setScale(prev => Math.max(prev - 0.1, 0.2));
    };

    const handleResetZoom = () => {
        setManualZoom(false);
        setTimeout(handleAutoResize, 10);
    };

    return (
        <div className={`py-12 overflow-hidden no-scrollbar rounded-3xl min-h-[500px] transition-colors duration-500 relative ${theme === 'dark' ? 'bg-zinc-950/40' : 'bg-gradient-to-b from-transparent to-union-green-500/5'}`} id="export-card-tree">

            <div className="absolute top-4 right-4 flex flex-col gap-2 z-50 no-export">
                <button onClick={handleZoomIn} className="p-2 rounded-xl bg-white shadow-sm hover:translate-y-[-2px] transition-all text-union-green-600">
                    <ZoomIn size={18} />
                </button>
                <button onClick={handleZoomOut} className="p-2 rounded-xl bg-white shadow-sm hover:translate-y-[-2px] transition-all text-union-green-600">
                    <ZoomOut size={18} />
                </button>
                <button onClick={handleResetZoom} className="p-2 rounded-xl bg-white shadow-sm hover:translate-y-[-2px] transition-all text-union-green-600" title="Adatta allo schermo">
                    <Maximize size={18} />
                </button>
            </div>

            <div
                className="transition-transform duration-500 origin-top flex justify-center"
                style={{ transform: `scale(${scale})` }}
            >
                <div ref={containerRef} className="px-10 pb-20">
                    <TreeNodeComponent node={displayData} onUpdate={updateNodeLabel} theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default CommunityTree;
