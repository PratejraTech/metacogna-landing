
import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool, Hammer, Server, RefreshCw, Terminal } from 'lucide-react';

const NODES = [
    { id: 'discovery', label: '1. DISCOVERY', icon: Search, x: 400, y: 100 },
    { id: 'design', label: '2. DESIGN', icon: PenTool, x: 650, y: 280 },
    { id: 'build', label: '3. BUILD', icon: Hammer, x: 550, y: 550 },
    { id: 'deploy', label: '4. DEPLOY', icon: Server, x: 250, y: 550 },
    { id: 'iterate', label: '5. ITERATE', icon: RefreshCw, x: 150, y: 280 },
];

const CyclicPipeline: React.FC = () => {
    // Helper to calculate path data for a smooth cycle
    // Using a rounded pentagon shape logic for the path
    const pathData = "M 400 140 L 610 290 L 510 510 L 290 510 L 190 290 Z";

    return (
        <div className="w-full bg-ink border-4 border-ink shadow-hard relative overflow-hidden flex flex-col items-center justify-center py-12 select-none min-h-[600px] text-paper">
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full bg-ink/90 border-b border-accent/30 text-accent p-3 flex justify-between items-center z-20 backdrop-blur-sm">
                <div className="flex gap-4 font-mono text-xs">
                    <span className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        PIPELINE_STATUS: ACTIVE
                    </span>
                    <span className="opacity-50">/// CONTINUOUS_INTEGRATION_DETECTED</span>
                </div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest animate-pulse text-accent">
                    RUNNING_CYCLE
                </div>
            </div>

            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`, 
                     backgroundSize: '30px 30px' 
                 }} 
            />

            <div className="relative w-full max-w-4xl aspect-[4/3] md:aspect-[16/9]">
                <svg viewBox="0 0 800 650" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    
                    {/* Connecting Lines (The Cycle) */}
                    <path 
                        d={pathData} 
                        fill="none" 
                        stroke="var(--color-paper)" 
                        strokeWidth="4"
                        className="opacity-20"
                    />
                    <path 
                        d={pathData} 
                        fill="none" 
                        stroke="var(--color-accent)" 
                        strokeWidth="2" 
                        strokeDasharray="8 8"
                        className="opacity-40"
                    />

                    {/* Animated Flow Particle */}
                    <motion.circle 
                        r="6" 
                        fill="#ffffff" 
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        animate={{ offsetDistance: ["0%", "100%"] }} 
                        style={{ offsetPath: `path('${pathData}')` }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
                    />
                    
                    {/* Secondary Particle (Opposite Phase) */}
                    <motion.circle 
                        r="4" 
                        fill="var(--color-accent)" 
                        animate={{ offsetDistance: ["0%", "100%"] }} 
                        style={{ offsetPath: `path('${pathData}')` }} 
                        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 4 }} 
                    />

                    {/* Nodes */}
                    {NODES.map((node, i) => (
                        <foreignObject 
                            key={node.id} 
                            x={node.x - 70} 
                            y={node.y - 40} 
                            width={140} 
                            height={80}
                        >
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.2, type: "spring" }}
                                className="w-full h-full flex flex-col items-center justify-center bg-ink border-2 border-accent/50 hover:border-accent hover:bg-ink/90 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all group cursor-default p-2 rounded-sm"
                            >
                                <node.icon className="w-6 h-6 text-accent mb-1 group-hover:scale-110 transition-transform" />
                                <span className="font-mono text-[10px] font-bold text-paper tracking-wider">
                                    {node.label}
                                </span>
                            </motion.div>
                        </foreignObject>
                    ))}

                    {/* Center Hub */}
                    <foreignObject x={300} y={275} width={200} height={100}>
                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                            <div className="text-accent font-mono text-xs mb-1 animate-pulse">
                                CORE_PROCESS
                            </div>
                            <div className="text-paper font-serif font-bold text-xl leading-none">
                                Negative Entropy
                            </div>
                        </div>
                    </foreignObject>

                </svg>
            </div>

            <div className="absolute bottom-6 w-full text-center">
                <p className="text-accent/60 font-mono text-[10px] uppercase tracking-[0.2em]">
                    System Architecture Loop v1.0
                </p>
            </div>
        </div>
    );
};

export default CyclicPipeline;
