
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Zap, Factory, Settings, PenTool, Database, Box, X, Code, Terminal, Layers, DollarSign, Users, Target } from 'lucide-react';

interface NodeData {
    id: string;
    label: string;
    icon: React.ElementType;
    desc: string;
    problemsSolved: string[];
    stats: { label: string; value: string; status: 'nominal' | 'warning' | 'optimal' }[];
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'input' | 'process' | 'output';
}

// Technical Blueprint Layout - Business Logic Flow
// Flow: (Strategy + RevOps) -> Product -> (Engineering + Design) -> [Automated by QC] -> Deployment
const NODES: NodeData[] = [
    // --- INPUTS (The "Why" and "How Much") ---
    {
        id: 'strategy',
        label: 'EXECUTIVE STRATEGY',
        icon: Target,
        desc: 'The Control Unit (CPU). Defines the mission, sets the clock speed, and determines the "Instruction Set Architecture" for the business.',
        problemsSolved: ['Lack of Focus', 'Conflicting Priorities', 'Pivot Paralysis'],
        stats: [
            { label: 'Vision', value: 'Clear', status: 'optimal' },
            { label: 'Clock', value: 'Quarterly', status: 'nominal' }
        ],
        x: 100,
        y: 150,
        width: 160,
        height: 100,
        type: 'input'
    },
    {
        id: 'rev_ops',
        label: 'REVENUE OPERATIONS',
        icon: DollarSign,
        desc: 'Power Supply Unit (PSU) & Sensors. Provides the capital voltage required to run the circuit and feeds back market telemetry.',
        problemsSolved: ['Runway Shortage', 'Inefficient Spend', 'Unit Economics'],
        stats: [
            { label: 'Voltage', value: 'Stable', status: 'nominal' },
            { label: 'Burn Rate', value: 'Optimized', status: 'optimal' }
        ],
        x: 100,
        y: 450,
        width: 160,
        height: 100,
        type: 'input'
    },

    // --- LOGIC GATE (The "What") ---
    {
        id: 'product',
        label: 'PRODUCT MANAGEMENT',
        icon: Layers,
        desc: 'The Logic Gate. Intersects Strategy signals with RevOps constraints to define feasible requirements. Rejects bad inputs.',
        problemsSolved: ['Feature Creep', 'Market Misalignment', 'Vague Requirements'],
        stats: [
            { label: 'Backlog', value: 'Groomed', status: 'optimal' },
            { label: 'Spec Clarity', value: '99%', status: 'optimal' }
        ],
        x: 280,
        y: 300,
        width: 140,
        height: 120,
        type: 'process'
    },

    // --- PROCESSING (The "Build") ---
    {
        id: 'engineering',
        label: 'ENGINEERING CORE',
        icon: Code,
        desc: 'Arithmetic Logic Unit (ALU). High-throughput execution. Turns requirements into functional binary reality.',
        problemsSolved: ['Technical Debt', 'Scalability Limits', 'Bug Regression'],
        stats: [
            { label: 'Velocity', value: 'High', status: 'optimal' },
            { label: 'Uptime', value: '99.99%', status: 'optimal' }
        ],
        x: 500,
        y: 150,
        width: 160,
        height: 100,
        type: 'process'
    },
    {
        id: 'design',
        label: 'EXPERIENCE DESIGN',
        icon: PenTool,
        desc: 'Graphics Processing Unit (GPU). Renders the binary logic into human-readable, emotional interfaces.',
        problemsSolved: ['User Confusion', 'Ugly Interfaces', 'Brand Inconsistency'],
        stats: [
            { label: 'UX Friction', value: 'Low', status: 'optimal' },
            { label: 'Aesthetics', value: 'High', status: 'nominal' }
        ],
        x: 500,
        y: 450,
        width: 160,
        height: 100,
        type: 'process'
    },

    // --- CONTROL (The "Safe") ---
    {
        id: 'automation',
        label: 'QUALITY & AUTOMATION',
        icon: Settings,
        desc: 'Watchdog Timer & Garbage Collector. Automates governance, compliance, and testing to prevent system crashes.',
        problemsSolved: ['Manual Drudgery', 'Compliance Risk', 'Process Entropy'],
        stats: [
            { label: 'Test Cov', value: '94%', status: 'optimal' },
            { label: 'Gov Check', value: 'Pass', status: 'optimal' }
        ],
        x: 500,
        y: 300,
        width: 140,
        height: 80,
        type: 'process'
    },

    // --- OUTPUT (The "Value") ---
    {
        id: 'deployment',
        label: 'MARKET DEPLOYMENT',
        icon: Box,
        desc: 'I/O Interface. The point where internal value is successfully transmitted to the external customer environment.',
        problemsSolved: ['Deployment Failures', 'User Churn', 'Market Silence'],
        stats: [
            { label: 'Latency', value: 'Low', status: 'optimal' },
            { label: 'CSAT', value: '4.8/5', status: 'optimal' }
        ],
        x: 720,
        y: 300,
        width: 120,
        height: 380, // Tall bar
        type: 'output'
    }
];

const BlueprintSchematic: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    return (
        <div className="w-full bg-[#0f172a] border-4 border-[#1e293b] shadow-hard relative overflow-hidden flex flex-col items-center justify-center py-12 select-none group">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
                 style={{ 
                     backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`, 
                     backgroundSize: '20px 20px' 
                 }} 
            />
            
            {/* Metadata Header */}
            <div className="absolute top-0 left-0 w-full bg-[#1e293b]/90 border-b border-[#38bdf8]/30 text-[#38bdf8] p-2 flex justify-between items-center z-20 backdrop-blur-sm">
                <div className="flex gap-4 font-mono text-xs">
                    <span>SCHEMATIC_ID: BP-2025-BIZ-LOGIC</span>
                    <span>TYPE: ORGANIZATIONAL_CIRCUIT</span>
                </div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#38bdf8] rounded-full"></div>
                    SYSTEM_ONLINE
                </div>
            </div>

            {/* Schematic Canvas */}
            <div className="relative w-full max-w-5xl aspect-[16/9]">
                <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    
                    {/* --- TRACES (The Logic Flow) --- */}
                    
                    {/* 1. INPUTS TO PRODUCT */}
                    {/* Strategy (100, 150) -> Product (280, 300) */}
                    <path d="M 180 150 L 220 150 L 220 280 L 280 280" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 180 150 L 220 150 L 220 280 L 280 280" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    
                    {/* RevOps (100, 450) -> Product (280, 300) */}
                    <path d="M 180 450 L 220 450 L 220 320 L 280 320" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 180 450 L 220 450 L 220 320 L 280 320" fill="none" stroke="#38bdf8" strokeWidth="1.5" />


                    {/* 2. PRODUCT SPLIT TO ENG & DESIGN */}
                    {/* Product (280, 300) -> Eng (500, 150) */}
                    <path d="M 350 300 L 380 300 L 380 150 L 420 150" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 350 300 L 380 300 L 380 150 L 420 150" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Product (280, 300) -> Design (500, 450) */}
                    <path d="M 350 300 L 380 300 L 380 450 L 420 450" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 350 300 L 380 300 L 380 450 L 420 450" fill="none" stroke="#38bdf8" strokeWidth="1.5" />


                    {/* 3. AUTOMATION INTERSECT */}
                    {/* Intersects Eng Line */}
                    <path d="M 500 200 L 500 260" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    {/* Intersects Design Line */}
                    <path d="M 500 400 L 500 340" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                    {/* Gate to Deployment */}
                    <path d="M 570 300 L 660 300" fill="none" stroke="#38bdf8" strokeWidth="1.5" />


                    {/* 4. CONVERGENCE TO DEPLOYMENT */}
                    {/* Eng (500, 150) -> Deploy (720, 300) */}
                    <path d="M 580 150 L 620 150 L 620 280 L 660 280" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 580 150 L 620 150 L 620 280 L 660 280" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Design (500, 450) -> Deploy (720, 300) */}
                    <path d="M 580 450 L 620 450 L 620 320 L 660 320" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <path d="M 580 450 L 620 450 L 620 320 L 660 320" fill="none" stroke="#38bdf8" strokeWidth="1.5" />


                    {/* --- ANIMATIONS (Packets) --- */}
                    {/* Packet 1: Strategy -> Product */}
                    <motion.circle r="3" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 180 150 L 220 150 L 220 280 L 280 280')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                    
                    {/* Packet 2: RevOps -> Product */}
                    <motion.circle r="3" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 180 450 L 220 450 L 220 320 L 280 320')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />

                    {/* Packet 3: Product -> Eng */}
                    <motion.circle r="3" fill="#38bdf8" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 350 300 L 380 300 L 380 150 L 420 150')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                    
                    {/* Packet 4: Product -> Design */}
                    <motion.circle r="3" fill="#38bdf8" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 350 300 L 380 300 L 380 450 L 420 450')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />

                    {/* Packet 5: Automation Check */}
                    <motion.circle r="2" fill="#emerald-500" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 570 300 L 660 300')" }} transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }} />

                    {/* Packet 6: Eng -> Deploy */}
                    <motion.circle r="4" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 580 150 L 620 150 L 620 280 L 660 280')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }} />

                    {/* Packet 7: Design -> Deploy */}
                    <motion.circle r="4" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 580 450 L 620 450 L 620 320 L 660 320')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }} />


                    {/* Solder Joints / Intersections */}
                    <circle cx="220" cy="150" r="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="220" cy="450" r="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="380" cy="300" r="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="620" cy="150" r="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="620" cy="450" r="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />


                    {/* --- COMPONENTS --- */}
                    {NODES.map(node => (
                        <foreignObject 
                            key={node.id} 
                            x={node.x - node.width/2} 
                            y={node.y - node.height/2} 
                            width={node.width} 
                            height={node.height}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedNode(node)}
                                className={`
                                    w-full h-full flex flex-col items-center justify-center p-2 relative group overflow-hidden transition-all duration-300
                                    ${selectedNode?.id === node.id 
                                        ? 'bg-[#38bdf8]/20 border-2 border-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.5)]' 
                                        : 'bg-[#1e293b] border border-[#475569] hover:border-[#38bdf8] hover:bg-[#1e293b]/80'
                                    }
                                `}
                            >
                                {/* Tech Lines Decor */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#38bdf8] opacity-50" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#38bdf8] opacity-50" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#38bdf8] opacity-50" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#38bdf8] opacity-50" />
                                
                                <node.icon className={`w-8 h-8 mb-2 transition-colors ${selectedNode?.id === node.id ? 'text-[#38bdf8]' : 'text-slate-400 group-hover:text-white'}`} />
                                
                                <span className={`font-mono text-[10px] font-bold uppercase text-center leading-tight ${selectedNode?.id === node.id ? 'text-[#38bdf8]' : 'text-slate-300'}`}>
                                    {node.label}
                                </span>
                            </motion.button>
                        </foreignObject>
                    ))}

                </svg>

                {/* --- DIAGNOSTIC POPUP (Fixed Position relative to container) --- */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="absolute top-8 right-8 w-72 bg-[#0f172a]/95 border border-[#38bdf8] shadow-[0_0_20px_rgba(0,0,0,0.5)] z-30 backdrop-blur-md p-0"
                        >
                            {/* Header */}
                            <div className="bg-[#38bdf8]/10 p-3 border-b border-[#38bdf8]/30 flex justify-between items-start">
                                <div>
                                    <h3 className="font-mono font-bold text-[#38bdf8] uppercase text-sm leading-none mb-1">
                                        COMPONENT_DIAGNOSTIC
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-mono">ID: {selectedNode.id.toUpperCase()}</span>
                                </div>
                                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4">
                                <p className="font-mono text-xs text-slate-300 mb-4 leading-relaxed border-l-2 border-[#38bdf8] pl-2">
                                    {selectedNode.desc}
                                </p>

                                {/* Problems Solved List */}
                                <div className="mb-4">
                                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-2 font-bold">Latency Sources Resolved:</div>
                                    <ul className="space-y-1">
                                        {selectedNode.problemsSolved.map((prob, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                                                <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                                {prob}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-700/50">
                                    {selectedNode.stats.map((stat, i) => (
                                        <div key={i} className="bg-[#1e293b] p-2 border border-slate-700">
                                            <span className="block text-[10px] text-slate-500 uppercase">{stat.label}</span>
                                            <span className={`font-mono text-xs font-bold ${
                                                stat.status === 'nominal' ? 'text-blue-400' :
                                                stat.status === 'warning' ? 'text-yellow-400' : 'text-[#38bdf8]'
                                            }`}>
                                                {stat.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-8 text-xs font-mono text-slate-500 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-[#38bdf8]"></div> 
                    PARALLEL_DATA_BUS
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 border border-[#38bdf8] bg-[#38bdf8]/20"></div> 
                    LOGIC_GATE
                </div>
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-[#38bdf8]" /> 
                    EXECUTION_NODE
                </div>
            </div>
        </div>
    );
};

export default BlueprintSchematic;
