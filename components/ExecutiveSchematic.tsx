
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Settings, PenTool, Box, X, Layers, DollarSign, Target, Activity, Zap } from 'lucide-react';

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
        x: 320, // Shifted right to accommodate gate
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
        x: 580,
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
        x: 580,
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
        x: 580,
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
        x: 820,
        y: 300,
        width: 120,
        height: 380, // Tall bar
        type: 'output'
    }
];

const ExecutiveSchematic: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

    return (
        <div className="w-full flex flex-col gap-0 border-4 border-ink shadow-hard">
            
            {/* 1. VISUALIZATION LAYER */}
            <div className="w-full bg-ink relative overflow-hidden flex flex-col items-center justify-center py-12 select-none group">
                {/* Blueprint Grid Background */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                     style={{ 
                         backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`, 
                         backgroundSize: '20px 20px' 
                     }} 
                />
                
                {/* Metadata Header */}
                <div className="absolute top-0 left-0 w-full bg-ink/90 border-b border-accent/30 text-accent p-2 flex justify-between items-center z-20 backdrop-blur-sm">
                    <div className="flex gap-4 font-mono text-xs">
                        <span>SCHEMATIC_ID: BP-2025-BIZ-LOGIC</span>
                        <span>TYPE: ORGANIZATIONAL_CIRCUIT</span>
                    </div>
                    <div className="font-mono text-xs font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        SYSTEM_ONLINE
                    </div>
                </div>

                {/* Schematic Canvas */}
                <div className="relative w-full max-w-6xl aspect-[16/9] cursor-crosshair">
                    <svg viewBox="0 0 900 600" className="w-full h-full filter drop-shadow-2xl">
                        
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <marker id="solderPad" markerWidth="6" markerHeight="6" refX="3" refY="3">
                                <circle cx="3" cy="3" r="2" fill="var(--color-ink)" stroke="var(--color-accent)" strokeWidth="1" />
                            </marker>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
                            </marker>
                            {/* Logic Gate: AND */}
                            <symbol id="gate-and" viewBox="0 0 40 40">
                                <path d="M0,0 V40 H20 A20,20 0 0,0 20,0 Z" fill="#18181b" stroke="var(--color-accent)" strokeWidth="2" />
                                <circle cx="5" cy="10" r="2" fill="var(--color-accent)" />
                                <circle cx="5" cy="30" r="2" fill="var(--color-accent)" />
                            </symbol>
                            {/* Component: Resistor */}
                            <symbol id="resistor" viewBox="0 0 60 20">
                                <path d="M0,10 L10,10 L15,2 L25,18 L35,2 L45,18 L50,10 L60,10" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="bevel" />
                            </symbol>
                        </defs>

                        {/* --- PCB TRACES (The Logic Flow) --- */}
                        <g filter="url(#glow)">
                            {/* 1. INPUTS -> GATE 1 (AND) */}
                            {/* Strategy Trace */}
                            <path d="M 180 150 L 220 150 L 220 285 L 240 285" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" markerStart="url(#solderPad)" className="opacity-80" />
                            {/* RevOps Trace */}
                            <path d="M 180 450 L 220 450 L 220 315 L 240 315" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" markerStart="url(#solderPad)" className="opacity-80" />
                            
                            {/* Active Pulses to Gate 1 */}
                            <motion.path d="M 180 150 L 220 150 L 220 285 L 240 285" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="10 10" className="animate-[dash_2s_linear_infinite]" />
                            <motion.path d="M 180 450 L 220 450 L 220 315 L 240 315" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="10 10" className="animate-[dash_2s_linear_infinite]" />

                            {/* Gate 1 Placement (Before Product) */}
                            <use href="#gate-and" x="240" y="280" width="40" height="40" />
                            
                            {/* Gate 1 Output -> Product */}
                            <path d="M 280 300 L 320 300" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow)" />

                            {/* 2. PRODUCT -> PROCESSING (Split with Resistors) */}
                            {/* To Engineering */}
                            <path d="M 390 300 L 420 300 L 420 150 L 450 150" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                            <use href="#resistor" x="450" y="140" width="40" height="20" />
                            <path d="M 490 150 L 500 150" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow)" />
                            
                            {/* To Design */}
                            <path d="M 390 300 L 420 300 L 420 450 L 450 450" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                            <use href="#resistor" x="450" y="440" width="40" height="20" />
                            <path d="M 490 450 L 500 450" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow)" />

                            {/* Back Pressure Indicators (Heat on Resistors) */}
                            <motion.circle cx="470" cy="150" r="12" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeOpacity="0.8" 
                                animate={{ r: [12, 18, 12], opacity: [0.8, 0, 0.8], strokeWidth: [2, 1, 2] }} 
                                transition={{ duration: 1, repeat: Infinity }} 
                            />
                            <motion.circle cx="470" cy="450" r="12" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeOpacity="0.8" 
                                animate={{ r: [12, 18, 12], opacity: [0.8, 0, 0.8], strokeWidth: [2, 1, 2] }} 
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} 
                            />

                            {/* 3. PROCESSING -> GATE 2 (AND/Integration) */}
                            {/* Eng Output */}
                            <path d="M 660 150 L 720 150 L 720 285 L 740 285" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerStart="url(#solderPad)" />
                            {/* Design Output */}
                            <path d="M 660 450 L 720 450 L 720 315 L 740 315" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerStart="url(#solderPad)" />

                            {/* Gate 2 Placement (Integration) */}
                            <use href="#gate-and" x="740" y="280" width="40" height="40" />

                            {/* Gate 2 Output -> Deployment */}
                            <path d="M 780 300 L 820 300" fill="none" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow)" />

                            {/* 4. AUTOMATION TAPS (Control Loops) */}
                            <path d="M 580 200 L 580 260" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4 2" />
                            <path d="M 580 400 L 580 340" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="4 2" />
                            <path d="M 650 300 L 740 300" fill="none" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 2" />
                        </g>

                        {/* --- DATA PACKETS --- */}
                        <motion.circle r="3" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 180 150 L 220 150 L 220 285')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <motion.circle r="3" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 180 450 L 220 450 L 220 315')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        
                        {/* High Res Processing Packets */}
                        <motion.circle r="2" fill="var(--color-accent)" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 320 300 L 390 300 L 420 300 L 420 150 L 450 150')" }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn", delay: 0.2 }} />
                        <motion.circle r="2" fill="var(--color-accent)" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 320 300 L 390 300 L 420 300 L 420 450 L 450 450')" }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn", delay: 0.2 }} />
                        
                        {/* Integration Traffic */}
                        <motion.circle r="4" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 660 150 L 720 150 L 720 285')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                        <motion.circle r="4" fill="#ffffff" animate={{ offsetDistance: ["0%", "100%"] }} style={{ offsetPath: "path('M 660 450 L 720 450 L 720 315')" }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />

                        {/* --- NODES (Components) --- */}
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
                                            ? 'bg-accent/20 border-2 border-accent shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                            : 'bg-ink border-2 border-gray-700 hover:border-accent hover:bg-ink/80'
                                        }
                                        rounded-sm
                                    `}
                                >
                                    {/* Tech Lines Decor */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent opacity-50" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent opacity-50" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent opacity-50" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent opacity-50" />
                                    
                                    <div className={`p-2 rounded-full border-2 ${selectedNode?.id === node.id ? 'border-accent bg-accent/20' : 'border-gray-700 bg-ink'} mb-2`}>
                                        <node.icon className={`w-6 h-6 transition-colors ${selectedNode?.id === node.id ? 'text-accent' : 'text-gray-400 group-hover:text-white'}`} />
                                    </div>
                                    
                                    <span className={`font-mono text-[10px] font-bold uppercase text-center leading-tight tracking-wider ${selectedNode?.id === node.id ? 'text-accent' : 'text-gray-300'}`}>
                                        {node.label}
                                    </span>
                                </motion.button>
                            </foreignObject>
                        ))}

                    </svg>

                    {/* --- DIAGNOSTIC POPUP --- */}
                    <AnimatePresence>
                        {selectedNode && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                                className="absolute top-8 right-8 w-72 bg-ink/95 border-2 border-accent shadow-[0_0_30px_rgba(16,185,129,0.3)] z-30 backdrop-blur-md p-0"
                            >
                                <div className="bg-accent/10 p-3 border-b border-accent/30 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-mono font-bold text-accent uppercase text-sm leading-none mb-1">
                                            COMPONENT_DIAGNOSTIC
                                        </h3>
                                        <span className="text-[10px] text-gray-400 font-mono">ID: {selectedNode.id.toUpperCase()}</span>
                                    </div>
                                    <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <p className="font-mono text-xs text-gray-300 mb-4 leading-relaxed border-l-2 border-accent pl-2">
                                        {selectedNode.desc}
                                    </p>

                                    <div className="mb-4">
                                        <div className="text-[10px] font-mono uppercase text-gray-500 mb-2 font-bold">Latency Sources Resolved:</div>
                                        <ul className="space-y-1">
                                            {selectedNode.problemsSolved.map((prob, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                                                    <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                                                    {prob}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-700/50">
                                        {selectedNode.stats.map((stat, i) => (
                                            <div key={i} className="bg-black/50 p-2 border border-gray-700">
                                                <span className="block text-[10px] text-gray-500 uppercase">{stat.label}</span>
                                                <span className={`font-mono text-xs font-bold ${
                                                    stat.status === 'nominal' ? 'text-blue-400' :
                                                    stat.status === 'warning' ? 'text-yellow-400' : 'text-accent'
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
            </div>

            {/* 2. ENTROPY AS A SERVICE SECTION */}
            <div className="bg-paper p-8 md:p-12 border-t-4 border-ink relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-32 h-32 text-ink" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-6 h-6 text-accent fill-current" />
                        <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-ink bg-accent/20 px-2 py-1">
                            Entropy as a Service
                        </h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="font-serif text-2xl md:text-3xl font-bold text-ink leading-tight">
                            "We sell clarity, mostly. Sometimes code."
                        </div>
                        <div className="font-sans text-gray-700 text-sm md:text-base leading-relaxed space-y-4">
                            <p>
                                The above schematic is not a metaphor; it is a promise. Creativity is the <span className="font-bold">input</span>, not the outcome. We begin with the chaotic energy of "What if?" but quickly constrain it through the rigors of engineering discipline.
                            </p>
                            <p>
                                Hard solutions engineering requires that we treat communication as a <span className="font-mono text-xs bg-gray-100 p-0.5 border border-gray-300">Packet Switching Network</span>. If the signal is lost between Strategy and Execution, the system fails. We function as the error-correction layer in your organization's stack.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSchematic;
