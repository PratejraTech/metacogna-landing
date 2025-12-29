
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperCard, PaperButton, PaperModal } from './PaperComponents';
import { Briefcase, Terminal, Book, Filter, X, ChevronDown, ChevronUp, Anchor, Zap, Activity, ArrowDown, ArrowLeft, Cpu, Network, ScanLine, Snowflake, Flame, Lock, ExternalLink } from 'lucide-react';
import MermaidSolutions from './MermaidSolutions';
import ExecutiveSchematic from './ExecutiveSchematic';
import TangentEngine from './TangentEngine';
import CyclicPipeline from './CyclicPipeline';
import { metacognaProfile } from '../data/profile';

interface ServicesBaseProps {
    onBack: () => void;
}

const RAW_MERMAID = `graph LR
    RCA[Root Cause Analysis] --> Disc[Discovery]
    Disc --> Req[Requirements]
    Req --> Data[Data Analysis]
    Data --> Mkt[Market Analysis]
    Mkt --> Sol[Solution Design]
    Sol --> UX[UI/UX Planning]
    UX --> Prod[Product Design]
    Prod --> Dev[High Velocity Build]
    Dev --> Deploy[Deployment]
    Deploy --> Test[User Testing]
    Deploy --> Document[Document & Further Solutions]
`;

// Combine relevant services for the PRD List View
const BUSINESS_SERVICES_RAW = [
    { 
        category: "I. CREATIVE SOLUTION DEVELOPMENT (TANGENT ENGINE)", 
        items: metacognaProfile.services.creativeSolutions,
        example: "Example: Transforming a static academic framework into a dynamic, user-friendly SaaS product like Compilar.app."
    },
    { 
        category: "II. SOLUTIONS ARCHITECTURE (THE BLUEPRINT)", 
        items: metacognaProfile.services.solutionsDesign,
        example: "Example: Turning 5 years of unstructured email data into a queryable knowledge graph for instant organizational recall."
    },
    { 
        category: "III. EXECUTIVE OPERATIONS (THE C-SUITE)", 
        items: metacognaProfile.services.executiveOps,
        example: "Example: Identifying the exact cash-burn bottleneck in your org chart before it requires a layoff."
    }
];

// --- Internal Visual Components ---

const SectionSeparator: React.FC<{ icon?: React.ElementType }> = ({ icon: Icon }) => (
    <div className="flex items-center justify-center py-20 opacity-30">
        <div className="h-0.5 bg-ink w-24 md:w-48"></div>
        <div className="mx-6 text-ink border-2 border-ink p-3 bg-paper shadow-hard-sm transform rotate-45">
            <div className="transform -rotate-45">
                 {Icon ? <Icon className="w-5 h-5" /> : <Anchor className="w-5 h-5" />}
            </div>
        </div>
        <div className="h-0.5 bg-ink w-24 md:w-48"></div>
    </div>
);

const ViewToggle: React.FC<{ 
    mode: 'BUSINESS' | 'TECHNICAL', 
    setMode: (m: 'BUSINESS' | 'TECHNICAL') => void 
}> = ({ mode, setMode }) => (
    <div className="flex justify-center mb-16">
        <div className="inline-flex items-center bg-paper border-2 border-ink p-1.5 shadow-hard">
            <button 
                onClick={() => setMode('BUSINESS')}
                className={`flex items-center gap-3 px-8 py-3 font-mono text-xs font-bold transition-all border-2 ${
                    mode === 'BUSINESS' 
                        ? 'bg-ink text-paper border-ink shadow-sm' 
                        : 'bg-transparent text-gray-500 border-transparent hover:text-ink hover:bg-surface'
                }`}
            >
                <Briefcase className="w-4 h-4" />
                BUSINESS_LOGIC
            </button>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <button 
                onClick={() => setMode('TECHNICAL')}
                className={`flex items-center gap-3 px-8 py-3 font-mono text-xs font-bold transition-all border-2 ${
                    mode === 'TECHNICAL' 
                        ? 'bg-ink text-paper border-ink shadow-sm' 
                        : 'bg-transparent text-gray-500 border-transparent hover:text-ink hover:bg-surface'
                }`}
            >
                <Terminal className="w-4 h-4" />
                TECHNICAL_EXECUTION
            </button>
        </div>
    </div>
);

// --- Main Component ---

const ServicesBase: React.FC<ServicesBaseProps> = ({ onBack }) => {
    const [isCompiled, setIsCompiled] = useState(false); // For Technical View
    const [isSchematicBuilt, setIsSchematicBuilt] = useState(false); // For Business View
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'BUSINESS' | 'TECHNICAL'>('BUSINESS');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isEntropyModalOpen, setIsEntropyModalOpen] = useState(false);
    
    // Accordion State - Default closed (empty array)
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        BUSINESS_SERVICES_RAW.forEach(cat => {
            cat.items.forEach(item => {
                item.tags.forEach(tag => tags.add(tag));
            });
        });
        return Array.from(tags).sort();
    }, []);

    // Filter services based on selected tags
    const filteredServices = useMemo(() => {
        if (selectedTags.length === 0) return BUSINESS_SERVICES_RAW;

        return BUSINESS_SERVICES_RAW.map(cat => ({
            ...cat,
            items: cat.items.filter(item => 
                item.tags.some(tag => selectedTags.includes(tag))
            )
        })).filter(cat => cat.items.length > 0);
    }, [selectedTags]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
        // Automatically open categories that have matches when filtering
        if (!selectedTags.includes(tag)) {
            const categoriesWithTag = BUSINESS_SERVICES_RAW
                .filter(cat => cat.items.some(item => item.tags.includes(tag)))
                .map(cat => cat.category);
            setOpenCategories(prev => [...new Set([...prev, ...categoriesWithTag])]);
        }
    };

    const handleExecuteTechnical = () => {
        const steps = [
            "Initializing render pipeline...",
            "Parsing graph topology...",
            "Resolving dependencies...",
            "Optimizing for clarity...",
            "Compiling cycle visualization...",
            "Render complete."
        ];
        runTerminalSequence(steps, () => setIsCompiled(true));
    };

    const handleBuildSchematic = () => {
        const steps = [
            "Importing CAD files...",
            "Placing IC components...",
            "Routing copper traces...",
            "Calculating resistance...",
            "Powering on system..."
        ];
        runTerminalSequence(steps, () => setIsSchematicBuilt(true));
    };

    const runTerminalSequence = (steps: string[], onComplete: () => void) => {
        setTerminalLines([]);
        let i = 0;
        const runStep = () => {
            if (i < steps.length) {
                setTerminalLines(prev => [...prev, steps[i]]);
                i++;
                setTimeout(runStep, Math.random() * 200 + 100);
            } else {
                setTimeout(onComplete, 400);
            }
        };
        runStep();
    };

    const handleModeSwitch = (mode: 'BUSINESS' | 'TECHNICAL') => {
        setViewMode(mode);
        setIsSchematicBuilt(false);
        setIsCompiled(false);
        setTerminalLines([]);
    };

    return (
        <div className="min-h-screen w-full pb-32 bg-surface">
            {/* 1. Header Section */}
            <div className="w-full bg-paper border-b-2 border-ink pt-28 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                    <div className="mb-12 w-full flex justify-start max-w-5xl">
                        <button 
                            onClick={onBack}
                            className="bg-ink text-paper px-4 py-2 font-mono text-xs flex items-center gap-3 hover:bg-accent hover:text-ink transition-colors shadow-hard-sm border-2 border-transparent hover:border-ink"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>cd ../home</span>
                        </button>
                    </div>

                    <div className="max-w-4xl w-full">
                        <div className="inline-flex items-center gap-3 bg-surface border-2 border-ink px-4 py-1.5 mb-8 shadow-hard-sm mx-auto">
                             <Terminal className="w-4 h-4 text-accent" />
                             <span className="font-mono text-xs font-bold tracking-widest text-ink">SERVICES_REGISTRY_V1</span>
                        </div>
                        
                        {/* Title */}
                        <h1 className="font-serif text-6xl md:text-8xl font-bold text-ink mb-12 leading-[0.9]">
                            Negative <span className="relative inline-block px-4">
                                <span className="relative z-10">Entropy</span>
                                <span className="absolute inset-0 bg-accent transform -rotate-2 -z-0 border-2 border-ink shadow-hard-sm"></span>
                            </span> 
                            <br/>as a Service
                        </h1>
                        
                        <div className="flex flex-col items-center justify-center">
                            <div className="max-w-2xl text-center px-4">
                                <p className="font-sans text-xl text-ink leading-relaxed font-medium mb-8">
                                    Tangential thinking injected as controlled randomness. Transformed into rapid ideation, systems, and solutions design.
                                </p>
                            </div>

                            <button 
                                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-8 inline-block border-b-4 border-ink pb-1 font-mono text-sm text-ink hover:text-accent hover:border-accent transition-colors font-bold tracking-widest cursor-pointer uppercase flex items-center gap-3"
                            >
                                Improbability High <ArrowDown className="w-4 h-4 animate-bounce" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative mt-20">
                
                <SectionSeparator icon={Book} />

                {/* 2. Solutions Catalog */}
                <section id="catalog" className="w-full flex flex-col items-center scroll-mt-24">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-5xl font-bold text-ink mb-4">The Catalog</h2>
                        <p className="font-mono text-sm text-gray-500 bg-paper inline-block px-2 border border-gray-300">/// SELECT_VIEW_MODE</p>
                    </div>

                    <ViewToggle mode={viewMode} setMode={handleModeSwitch} />

                    {/* Neuropunk Banner for Tangent Engine */}
                    <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={viewMode} // Re-animate on mode switch
                        onClick={() => setIsEntropyModalOpen(true)}
                        className="w-full max-w-5xl mb-16 group cursor-pointer relative overflow-hidden bg-ink border-2 border-ink shadow-[4px_4px_0px_0px_#10b981] hover:shadow-[8px_8px_0px_0px_#10b981] hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Glitch Overlay & Cyber Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent opacity-80"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent opacity-80"></div>

                        <div className="p-10 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-6 text-accent">
                                    <Activity className="w-5 h-5 animate-pulse" />
                                    <span className="font-mono text-xs font-bold uppercase tracking-widest border border-accent px-2 py-1 bg-accent/10">
                                        {viewMode === 'BUSINESS' ? 'STRATEGIC_DIVERGENCE_PROTOCOL' : 'SYSTEM_CHAOS_ENGINE'}
                                    </span>
                                </div>
                                
                                <div className="mb-6">
                                    <h3 className="font-serif text-4xl font-bold text-paper leading-tight flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                                        Tangent Engine
                                        <span className="font-mono text-xs font-bold text-gray-500 tracking-normal normal-case opacity-70 relative top-[-2px]">
                                            (v2.4.1)
                                        </span>
                                    </h3>
                                </div>
                                
                                <p className="font-sans text-lg text-gray-300 leading-relaxed max-w-2xl border-l-4 border-accent pl-6">
                                    {viewMode === 'BUSINESS' 
                                        ? "The power of creativity paired with engineering and design. A full specification product machine where disparate inputs collide to form novel, high-value strategies."
                                        : "Tangential Thinking as an engine for creation and temporary ideation chaos preceding rigorous application. This simulation visualizes the application of this force to raw primitives."
                                    }
                                </p>
                            </div>
                            
                            <div className="flex-shrink-0 relative">
                                <div className="absolute -inset-2 bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"></div>
                                <div className="relative w-full md:w-auto bg-black border-2 border-accent text-accent px-10 py-5 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-ink transition-all flex items-center gap-4 group-hover:animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <Zap className="w-5 h-5" /> 
                                    [ LAUNCH_{viewMode === 'BUSINESS' ? 'IDEATION' : 'SIMULATION'} ]
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Catalogue Card */}
                    <div className="w-full max-w-5xl">
                        <AnimatePresence mode="wait">
                            {viewMode === 'BUSINESS' ? (
                                !isSchematicBuilt ? (
                                    <motion.div
                                        key="business-list"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <PaperCard noPadding className="bg-paper border-2 border-ink min-h-[50vh] relative overflow-hidden font-sans text-sm shadow-hard">
                                            {/* PRD Header */}
                                            <div className="w-full h-20 border-b-2 border-ink flex items-center justify-between px-8 md:px-10 bg-surface">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-paper border border-ink shadow-sm">
                                                        <Book className="w-5 h-5 text-ink" />
                                                    </div>
                                                    <span className="font-serif font-bold text-xl text-ink">Executive Briefing</span>
                                                </div>
                                                <div className="text-xs font-mono font-bold text-gray-400 hidden md:block border border-gray-300 px-2 py-1 bg-white">
                                                    DOC_ID: PRD-2025-V1
                                                </div>
                                            </div>

                                            <div className="p-8 md:p-12">
                                                {/* Filters */}
                                                <div className="mb-12 pb-8 border-b-2 border-dashed border-gray-200">
                                                    <div className="flex items-center gap-3 mb-6 font-mono text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                        <Filter className="w-4 h-4" /> Filter Capabilities
                                                    </div>
                                                    <div className="flex flex-wrap gap-3">
                                                        {allTags.map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={() => toggleTag(tag)}
                                                                className={`px-3 py-1.5 text-xs font-mono border-2 transition-all font-bold ${
                                                                    selectedTags.includes(tag)
                                                                        ? 'bg-ink text-paper border-ink shadow-hard-sm'
                                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-ink hover:text-ink'
                                                                }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                        {selectedTags.length > 0 && (
                                                            <button
                                                                onClick={() => { setSelectedTags([]); setOpenCategories([]); }}
                                                                className="px-3 py-1.5 text-xs font-mono border-2 border-transparent text-red-500 hover:bg-red-50 flex items-center gap-2 font-bold"
                                                            >
                                                                <X className="w-3 h-3" /> CLEAR
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Accordion List */}
                                                <div className="space-y-6">
                                                    {filteredServices.length === 0 ? (
                                                         <div className="text-center py-16 text-gray-400 font-mono border-2 border-dashed border-gray-200 bg-surface">
                                                            /// NO_SERVICES_MATCHING_CRITERIA
                                                         </div>
                                                    ) : (
                                                        filteredServices.map((section, idx) => (
                                                            <div key={idx} className="border-2 border-ink rounded-sm overflow-hidden transition-all duration-300 bg-white shadow-sm hover:shadow-md">
                                                                <button 
                                                                    onClick={() => toggleCategory(section.category)}
                                                                    className={`w-full flex items-center justify-between p-6 text-left transition-colors ${
                                                                        openCategories.includes(section.category) 
                                                                            ? 'bg-surface border-b-2 border-ink' 
                                                                            : 'bg-white hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <h3 className="font-mono text-sm font-bold text-ink uppercase tracking-widest">
                                                                        {section.category}
                                                                    </h3>
                                                                    {openCategories.includes(section.category) 
                                                                        ? <ChevronUp className="w-5 h-5 text-accent" /> 
                                                                        : <ChevronDown className="w-5 h-5 text-gray-400" />
                                                                    }
                                                                </button>
                                                                
                                                                <AnimatePresence>
                                                                    {openCategories.includes(section.category) && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                        >
                                                                            <div className="p-8 space-y-12 bg-white">
                                                                                {section.items.map((item) => (
                                                                                    <div key={item.id} className="group relative pl-6 border-l-4 border-gray-100 hover:border-accent transition-colors">
                                                                                        <div className="flex items-baseline justify-between mb-3">
                                                                                            <h4 className="font-serif text-2xl font-bold text-ink group-hover:text-accent transition-colors flex items-center gap-3">
                                                                                                {item.name}
                                                                                                {item.link && (
                                                                                                    <a 
                                                                                                        href={item.link} 
                                                                                                        target="_blank" 
                                                                                                        rel="noopener noreferrer"
                                                                                                        className="opacity-50 hover:opacity-100 text-ink"
                                                                                                    >
                                                                                                        <ExternalLink className="w-4 h-4" />
                                                                                                    </a>
                                                                                                )}
                                                                                            </h4>
                                                                                            <span className="font-mono text-[10px] text-gray-300 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                ID: {item.id}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-gray-700 leading-relaxed max-w-3xl mb-6 text-base font-sans">
                                                                                            {item.description}
                                                                                        </p>
                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            {item.tags.map(tag => (
                                                                                                <span 
                                                                                                    key={tag} 
                                                                                                    className={`text-[10px] font-mono px-2 py-1 border rounded-sm uppercase tracking-wider font-bold transition-colors ${
                                                                                                        selectedTags.includes(tag) 
                                                                                                            ? 'bg-accent text-ink border-accent' 
                                                                                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                                                                                    }`}
                                                                                                >
                                                                                                    {tag}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                                
                                                                                {/* Category Example Footer */}
                                                                                <div className="pt-8 border-t border-dashed border-gray-200 mt-8">
                                                                                    <p className="font-sans font-bold text-ink text-sm">
                                                                                        {section.example}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                {/* Terminal Overlay */}
                                                <AnimatePresence>
                                                    {terminalLines.length > 0 && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto mb-8 mx-4 bg-black text-accent p-6 font-mono text-xs border-t-4 border-accent shadow-2xl z-50 rounded-sm"
                                                        >
                                                            {terminalLines.map((line, idx) => (
                                                                <div key={idx} className="mb-2">
                                                                    <span className="opacity-50 mr-3 text-white">&gt;</span>
                                                                    {line}
                                                                </div>
                                                            ))}
                                                            <div className="w-3 h-5 bg-accent inline-block animate-pulse mt-2"/>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </PaperCard>

                                        <div className="flex justify-center mt-16">
                                            <PaperButton 
                                                onClick={handleBuildSchematic} 
                                                className="bg-ink text-paper hover:bg-accent hover:text-ink font-bold border-2 border-transparent shadow-hard transform hover:-translate-y-1 transition-all"
                                                size="lg"
                                            >
                                                <Zap className="w-5 h-5 mr-3 fill-current" />
                                                [ GENERATE_SYSTEM_DIAGRAM ]
                                            </PaperButton>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="business-schematic"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex justify-between items-end mb-8 border-b-2 border-ink pb-4">
                                            <div>
                                                <h2 className="font-serif text-4xl font-bold text-ink">Systems Logic</h2>
                                                <p className="font-mono text-xs text-gray-500 mt-2">/// VISUALIZING_DEPENDENCIES</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsSchematicBuilt(false)}
                                                className="text-xs font-mono font-bold underline hover:text-accent flex items-center gap-2"
                                            >
                                                <X className="w-4 h-4" /> RETURN TO CATALOG
                                            </button>
                                        </div>
                                        <ExecutiveSchematic />
                                        <div className="mt-10 text-center max-w-3xl mx-auto border-l-4 border-accent pl-6 py-2">
                                             <p className="font-serif text-lg text-ink italic font-medium">
                                                "A business is a circuit. If the 'Product' gate is flawed, no amount of 'Engineering' voltage can save the output."
                                             </p>
                                        </div>
                                    </motion.div>
                                )
                            ) : (
                                /* TECHNICAL VIEW */
                                !isCompiled ? (
                                    <motion.div
                                        key="tech-raw"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <MermaidSolutions 
                                            code={RAW_MERMAID} 
                                            onExecute={handleExecuteTechnical}
                                            terminalLines={terminalLines}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="tech-compiled"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col gap-10"
                                    >
                                        {/* Compiled View Visual - Cyclic Pipeline */}
                                        <CyclicPipeline />
                                        
                                        <div className="p-8 bg-black border-2 border-ink font-mono text-xs text-left overflow-x-auto w-full mb-8 shadow-hard text-green-400">
                                            <div className="text-gray-500 mb-4 border-b border-gray-800 pb-2 font-bold">/// SOURCE_GRAPH_REFERENCE</div>
                                            {RAW_MERMAID.split('\n').map((l, i) => <div key={i} className="mb-1">{l}</div>)}
                                        </div>
                                        <div className="text-center">
                                            <button 
                                                onClick={() => setIsCompiled(false)}
                                                className="text-sm font-mono font-bold border-b-2 border-ink hover:text-accent hover:border-accent transition-colors"
                                            >
                                                RESET_SOURCE_CODE
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Modal for Tangent Engine */}
                <PaperModal
                    isOpen={isEntropyModalOpen}
                    onClose={() => setIsEntropyModalOpen(false)}
                    title="NEGATIVE_ENTROPY_GENERATOR"
                    maxWidth="max-w-6xl"
                >
                    <div className="p-0 border-none bg-ink">
                        <TangentEngine mode={viewMode} />
                    </div>
                </PaperModal>

            </div>
        </div>
    );
};

export default ServicesBase;
