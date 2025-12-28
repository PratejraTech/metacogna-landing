
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperCard, PaperButton, PaperModal } from './PaperComponents';
import { Briefcase, Terminal, Book, Filter, X, ChevronDown, ChevronUp, Anchor, Zap, Activity, ArrowDown, ArrowLeft, Cpu, Network, ScanLine } from 'lucide-react';
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
    { category: "I. EXECUTIVE OPERATIONS (THE C-SUITE)", items: metacognaProfile.services.executiveOps },
    { category: "II. SOLUTIONS ARCHITECTURE (THE BLUEPRINT)", items: metacognaProfile.services.solutionsDesign }
];

// --- Internal Visual Components ---

const SectionSeparator: React.FC<{ icon?: React.ElementType }> = ({ icon: Icon }) => (
    <div className="flex items-center justify-center py-16 opacity-50">
        <div className="h-px bg-ink w-32 md:w-64"></div>
        <div className="mx-4 text-ink border-2 border-ink p-2 rounded-full bg-surface">
            {Icon ? <Icon className="w-4 h-4" /> : <Anchor className="w-4 h-4" />}
        </div>
        <div className="h-px bg-ink w-32 md:w-64"></div>
    </div>
);

const ViewToggle: React.FC<{ 
    mode: 'BUSINESS' | 'TECHNICAL', 
    setMode: (m: 'BUSINESS' | 'TECHNICAL') => void 
}> = ({ mode, setMode }) => (
    <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-paper border-2 border-ink p-1 shadow-hard">
            <button 
                onClick={() => setMode('BUSINESS')}
                className={`flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold transition-all ${
                    mode === 'BUSINESS' 
                        ? 'bg-ink text-paper shadow-sm' 
                        : 'text-gray-500 hover:text-ink hover:bg-surface'
                }`}
            >
                <Briefcase className="w-4 h-4" />
                BUSINESS_LOGIC
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
                onClick={() => setMode('TECHNICAL')}
                className={`flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold transition-all ${
                    mode === 'TECHNICAL' 
                        ? 'bg-ink text-paper shadow-sm' 
                        : 'text-gray-500 hover:text-ink hover:bg-surface'
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
        <div className="min-h-screen w-full pb-32">
            <div className="max-w-7xl mx-auto px-4 relative">
                
                {/* 1. Header Section */}
                <header className="pt-20 pb-20 flex flex-col items-center justify-center text-center">
                    <div className="mb-8 w-full flex justify-start">
                        <button 
                            onClick={onBack}
                            className="bg-ink text-paper px-3 py-2 font-mono text-xs flex items-center gap-2 hover:bg-accent hover:text-ink transition-colors shadow-hard-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>cd ../home</span>
                        </button>
                    </div>

                    <div className="max-w-5xl">
                        <div className="inline-flex items-center gap-2 bg-paper border border-ink px-3 py-1 mb-6 shadow-sm mx-auto">
                             <Terminal className="w-4 h-4 text-accent" />
                             <span className="font-mono text-xs font-bold tracking-widest text-ink">SERVICES_REGISTRY_V1</span>
                        </div>
                        
                        {/* Title with separated blocks to strictly prevent overlap */}
                        <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink mb-12 flex flex-col gap-8 md:gap-12 items-center">
                            <span className="block">
                                Negative <span className="bg-accent text-ink px-3 py-1 inline-block transform -rotate-2 shadow-hard-sm mx-2">Entropy</span> as a
                            </span>
                            <span className="block">
                                <span className="bg-accent text-ink px-3 py-1 inline-block transform rotate-2 shadow-hard-sm">Service</span>
                            </span>
                        </h1>
                        
                        <div className="flex flex-col items-center justify-center">
                            <div className="max-w-3xl text-center px-2">
                                <p className="font-sans text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium mb-6">
                                    Tangential thinking is the source of the controlled randomness into rapid ideation, systems and solutions design.
                                </p>
                            </div>

                            <button 
                                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-8 inline-block border-b-2 border-ink pb-1 font-mono text-sm text-ink hover:text-accent transition-colors font-bold tracking-wider cursor-pointer uppercase flex items-center gap-2"
                            >
                                Improbability High <ArrowDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <SectionSeparator icon={Book} />

                {/* 2. Solutions Catalog */}
                <section id="catalog" className="w-full flex flex-col items-center scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-4xl font-bold text-ink mb-2">The Catalog</h2>
                        <p className="font-mono text-sm text-gray-500">/// SELECT_VIEW_MODE</p>
                    </div>

                    <ViewToggle mode={viewMode} setMode={handleModeSwitch} />

                    {/* NEW: Neuropunk Banner for Negative Entropy */}
                    <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={viewMode} // Re-animate on mode switch
                        onClick={() => setIsEntropyModalOpen(true)}
                        className="w-full max-w-5xl mb-12 group cursor-pointer relative overflow-hidden bg-[#0d0d0d] border-2 border-ink shadow-[4px_4px_0px_0px_#10b981] hover:shadow-[6px_6px_0px_0px_#10b981] hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Glitch Overlay & Cyber Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[length:20px_20px] pointer-events-none" />
                        <div className="absolute inset-0 bg-paper/5 opacity-0 group-hover:opacity-100 mix-blend-overlay pointer-events-none transition-opacity bg-[length:4px_4px] bg-[radial-gradient(#10b981_1px,transparent_1px)]" />
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent opacity-50"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent opacity-50"></div>

                        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 text-accent">
                                    <Activity className="w-4 h-4 animate-pulse" />
                                    <span className="font-mono text-xs font-bold uppercase tracking-widest border border-accent px-2 py-0.5 bg-accent/10">
                                        {viewMode === 'BUSINESS' ? 'STRATEGIC_DIVERGENCE_PROTOCOL' : 'SYSTEM_CHAOS_ENGINE'}
                                    </span>
                                    <span className="font-mono text-[10px] text-gray-500 hidden md:block">/// v2.4.1</span>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className="font-serif text-3xl font-bold text-paper leading-tight flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                                        NEaaS
                                        <span className="font-mono text-xs font-normal text-gray-400 tracking-normal normal-case opacity-70 relative top-[-2px]">
                                            (Acronyms, we need more acronyms)
                                        </span>
                                    </h3>
                                </div>
                                
                                <p className="font-sans text-base text-gray-300 leading-relaxed max-w-2xl border-l-2 border-accent/30 pl-4">
                                    {viewMode === 'BUSINESS' 
                                        ? "Markets are noisy. Logic is linear. To find the non-obvious solution, we must inject noise into the signal. This engine simulates the collision of disparate concepts to force an epiphany."
                                        : "Standard engineering minimizes variance. We maximize it—temporarily. Use this tool to visualize how unrelated technical primitives collide to form novel architectures."
                                    }
                                </p>
                            </div>
                            
                            <div className="flex-shrink-0 relative">
                                <div className="absolute -inset-1 bg-accent/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"></div>
                                <div className="relative w-full md:w-auto bg-black border-2 border-accent text-accent px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-ink transition-all flex items-center gap-3 group-hover:animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <Zap className="w-5 h-5" /> 
                                    [ INITIATE_{viewMode === 'BUSINESS' ? 'IDEATION' : 'SIMULATION'} ]
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
                                        <PaperCard noPadding className="bg-paper border-ink min-h-[50vh] relative overflow-hidden font-sans text-sm shadow-hard">
                                            {/* PRD Header */}
                                            <div className="w-full h-16 border-b-2 border-ink flex items-center justify-between px-6 md:px-8 bg-surface">
                                                <div className="flex items-center gap-3">
                                                    <Book className="w-5 h-5 text-accent" />
                                                    <span className="font-serif font-bold text-lg text-ink">Executive Briefing</span>
                                                </div>
                                                <div className="text-xs font-mono font-bold text-gray-400 hidden md:block">DOC_ID: PRD-2025-V1</div>
                                            </div>

                                            <div className="p-6 md:p-12">
                                                {/* Filters */}
                                                <div className="mb-10 pb-8 border-b border-dashed border-gray-300">
                                                    <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <Filter className="w-3 h-3" /> Filter Capabilities
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {allTags.map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={() => toggleTag(tag)}
                                                                className={`px-3 py-1 text-xs font-mono border transition-all ${
                                                                    selectedTags.includes(tag)
                                                                        ? 'bg-ink text-paper border-ink shadow-hard-sm'
                                                                        : 'bg-white text-gray-600 border-gray-300 hover:border-ink hover:text-ink'
                                                                }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                        {selectedTags.length > 0 && (
                                                            <button
                                                                onClick={() => { setSelectedTags([]); setOpenCategories([]); }}
                                                                className="px-3 py-1 text-xs font-mono border border-transparent text-red-500 hover:bg-red-50 flex items-center gap-1"
                                                            >
                                                                <X className="w-3 h-3" /> CLEAR
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Accordion List */}
                                                <div className="space-y-4">
                                                    {filteredServices.length === 0 ? (
                                                         <div className="text-center py-12 text-gray-400 font-mono border-2 border-dashed border-gray-200">
                                                            /// NO_SERVICES_MATCHING_CRITERIA
                                                         </div>
                                                    ) : (
                                                        filteredServices.map((section, idx) => (
                                                            <div key={idx} className="border-2 border-gray-100 hover:border-ink rounded-sm overflow-hidden transition-all duration-300 bg-white">
                                                                <button 
                                                                    onClick={() => toggleCategory(section.category)}
                                                                    className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                                                                        openCategories.includes(section.category) 
                                                                            ? 'bg-surface border-b-2 border-ink' 
                                                                            : 'bg-white hover:bg-surface'
                                                                    }`}
                                                                >
                                                                    <h3 className="font-mono text-sm font-bold text-ink uppercase tracking-wider">
                                                                        {section.category}
                                                                    </h3>
                                                                    {openCategories.includes(section.category) 
                                                                        ? <ChevronUp className="w-4 h-4 text-accent" /> 
                                                                        : <ChevronDown className="w-4 h-4 text-gray-400" />
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
                                                                            <div className="p-6 md:p-8 space-y-10 bg-white">
                                                                                {section.items.map((item) => (
                                                                                    <div key={item.id} className="group relative pl-4 border-l-2 border-gray-200 hover:border-accent transition-colors">
                                                                                        <div className="flex items-baseline justify-between mb-2">
                                                                                            <h4 className="font-serif text-xl font-bold text-ink">
                                                                                                {item.name}
                                                                                            </h4>
                                                                                            <span className="font-mono text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                                ID: {item.id.toUpperCase()}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-gray-600 leading-relaxed max-w-3xl mb-4 text-base">
                                                                                            {item.description}
                                                                                        </p>
                                                                                        <div className="flex gap-2">
                                                                                            {item.tags.map(tag => (
                                                                                                <span 
                                                                                                    key={tag} 
                                                                                                    className={`text-[10px] font-mono px-1.5 py-0.5 border border-gray-200 rounded-sm transition-colors ${
                                                                                                        selectedTags.includes(tag) 
                                                                                                            ? 'bg-accent text-ink font-bold border-accent' 
                                                                                                            : 'bg-surface text-gray-500'
                                                                                                    }`}
                                                                                                >
                                                                                                    {tag}
                                                                                                </span>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
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
                                                            className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto mb-8 mx-4 bg-black/95 text-green-500 p-4 font-mono text-xs border-t-2 border-green-500 shadow-xl z-50 rounded-sm"
                                                        >
                                                            {terminalLines.map((line, idx) => (
                                                                <div key={idx} className="mb-1">
                                                                    <span className="opacity-50 mr-2">&gt;</span>
                                                                    {line}
                                                                </div>
                            ))}
                                                            <div className="w-3 h-4 bg-green-500 inline-block animate-pulse mt-1"/>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </PaperCard>

                                        <div className="flex justify-center mt-12">
                                            <PaperButton 
                                                onClick={handleBuildSchematic} 
                                                className="bg-ink text-paper hover:bg-accent hover:text-ink font-bold border-2 border-transparent shadow-xl transform hover:-translate-y-1 transition-all"
                                                size="lg"
                                            >
                                                <Zap className="w-4 h-4 mr-2 fill-current" />
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
                                        <div className="flex justify-between items-end mb-6">
                                            <div>
                                                <h2 className="font-serif text-3xl font-bold">Systems Logic</h2>
                                                <p className="font-mono text-xs text-gray-500 mt-1">/// VISUALIZING_DEPENDENCIES</p>
                                            </div>
                                            <button 
                                                onClick={() => setIsSchematicBuilt(false)}
                                                className="text-xs font-mono underline hover:text-accent flex items-center gap-1"
                                            >
                                                <X className="w-3 h-3" /> RETURN TO CATALOG
                                            </button>
                                        </div>
                                        <ExecutiveSchematic />
                                        <div className="mt-8 text-center max-w-2xl mx-auto">
                                             <p className="font-sans text-sm text-gray-500 italic">
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
                                        className="flex flex-col gap-6"
                                    >
                                        {/* Compiled View Visual - Cyclic Pipeline */}
                                        <CyclicPipeline />
                                        
                                        <div className="p-6 bg-surface border border-ink font-mono text-xs text-left overflow-x-auto max-w-4xl mx-auto w-full mb-8">
                                            <div className="text-gray-400 mb-2 border-b border-gray-300 pb-2">/// SOURCE_GRAPH_REFERENCE</div>
                                            {RAW_MERMAID.split('\n').map((l, i) => <div key={i} className="text-gray-600">{l}</div>)}
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => setIsCompiled(false)}
                                                className="text-xs font-mono font-bold underline hover:text-accent"
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
                    maxWidth="max-w-5xl"
                >
                    <div className="p-0 border-none">
                        <TangentEngine mode={viewMode} />
                    </div>
                </PaperModal>

            </div>
        </div>
    );
};

export default ServicesBase;
