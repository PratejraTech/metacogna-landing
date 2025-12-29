
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Zap, Snowflake, Box, Grid, Plus, Atom, RotateCcw, Network, X } from 'lucide-react';
import { PaperModal } from './PaperComponents';
import MermaidSolutions from './MermaidSolutions';

// Types for the simulation
interface Particle {
    id: string;
    label: string;
    type: 'unit' | 'merged' | 'epiphany';
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    scale: number;
    parents?: string[]; // For graph generation
}

// Scenario 1: Bio-Tech / Nature + Machine
const GROUP_A: Particle[] = [
    { id: 'mycelium', label: "Mycelium", type: 'unit', x: 20, y: 20, vx: 0.05, vy: 0.02, color: "bg-paper text-ink", scale: 1 },
    { id: 'network', label: "Mesh Network", type: 'unit', x: 15, y: 25, vx: 0.03, vy: -0.01, color: "bg-paper text-ink", scale: 1 },
    { id: 'growth', label: "Viral Growth", type: 'unit', x: 25, y: 15, vx: -0.02, vy: 0.04, color: "bg-paper text-ink", scale: 1 },
];

// Scenario 2: Cyber-Social / Human + Algo
const GROUP_B: Particle[] = [
    { id: 'social', label: "Social Graph", type: 'unit', x: 80, y: 20, vx: -0.05, vy: 0.02, color: "bg-paper text-ink", scale: 1 },
    { id: 'algo', label: "Algorithmic Bias", type: 'unit', x: 85, y: 25, vx: -0.03, vy: -0.04, color: "bg-paper text-ink", scale: 1 },
    { id: 'trust', label: "Zero Trust", type: 'unit', x: 75, y: 15, vx: 0.02, vy: 0.01, color: "bg-paper text-ink", scale: 1 },
];

// Scenario 3: Market-Physics / Value + Force
const GROUP_C: Particle[] = [
    { id: 'market', label: "Market Force", type: 'unit', x: 50, y: 80, vx: 0.01, vy: -0.05, color: "bg-paper text-ink", scale: 1 },
    { id: 'gravity', label: "Gravity", type: 'unit', x: 45, y: 85, vx: -0.04, vy: -0.02, color: "bg-paper text-ink", scale: 1 },
    { id: 'velocity', label: "Velocity", type: 'unit', x: 55, y: 85, vx: 0.04, vy: -0.02, color: "bg-paper text-ink", scale: 1 },
];

// Initial set combines all groups
const INITIAL_UNITS: Particle[] = [
    ...GROUP_A, 
    ...GROUP_B, 
    ...GROUP_C,
    { id: 'chaos', label: "Entropy", type: 'unit', x: 50, y: 50, vx: 0.05, vy: -0.05, color: "bg-paper text-ink", scale: 1 }
];

// Recipes that lead to the "3 Coalesced Core Ideas"
const MERGE_RECIPES = [
    // Group A -> "Bio-Digital Fabric"
    { ingredients: ['mycelium', 'network'], result: { label: "Bio-Computing", color: "bg-gray-800 text-green-400 border-green-400" } },
    { ingredients: ['growth', 'Bio-Computing'], result: { label: "CORE: BIO-DIGITAL FABRIC", color: "bg-accent text-ink border-white shadow-hard" } },
    
    // Group B -> "Synthetic Sociology"
    { ingredients: ['social', 'algo'], result: { label: "Echo Chamber", color: "bg-gray-800 text-green-400 border-green-400" } },
    { ingredients: ['trust', 'Echo Chamber'], result: { label: "CORE: SYNTHETIC SOCIOLOGY", color: "bg-accent text-ink border-white shadow-hard" } },

    // Group C -> "Economic Physics"
    { ingredients: ['market', 'gravity'], result: { label: "Asset Heaviness", color: "bg-gray-800 text-green-400 border-green-400" } },
    { ingredients: ['velocity', 'Asset Heaviness'], result: { label: "CORE: ECONOMIC PHYSICS", color: "bg-accent text-ink border-white shadow-hard" } },
];

interface TangentEngineProps {
    mode?: 'BUSINESS' | 'TECHNICAL';
}

const TangentEngine: React.FC<TangentEngineProps> = ({ mode = 'BUSINESS' }) => {
    const [temperature, setTemperature] = useState(0); 
    const [particles, setParticles] = useState<Particle[]>(INITIAL_UNITS);
    const [hoveredParticle, setHoveredParticle] = useState<Particle | null>(null);
    const [isGraphOpen, setIsGraphOpen] = useState(false);
    const [graphCode, setGraphCode] = useState('');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);
    const tempIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const getPhase = (temp: number) => {
        if (temp > 80) return { label: "CHAOS", desc: "Handwritten Reality.", icon: Zap, color: "text-red-500", borderColor: "border-red-500" };
        if (temp > 30) return { label: "FLUX", desc: "Ideas liquefy.", icon: Atom, color: "text-orange-500", borderColor: "border-orange-500" };
        return { label: "ORDER", desc: "Static Lattice.", icon: Snowflake, color: "text-blue-500", borderColor: "border-blue-500" };
    };

    const phase = getPhase(temperature);

    const generateGraph = () => {
        let code = "graph TD\n";
        code += "    classDef default fill:#000000,stroke:#10b981,stroke-width:1px,font-family:monospace,color:#10b981;\n";
        code += "    classDef core fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000,font-weight:bold;\n";
        
        const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_');

        particles.forEach(p => {
            const id = sanitize(p.id);
            const label = p.label;
            
            if (p.label.startsWith("CORE:")) {
                code += `    ${id}["${label}"]:::core\n`;
            } else if (p.type === 'merged') {
                code += `    ${id}["${label}"]\n`;
            } else {
                code += `    ${id}["${label}"]\n`;
            }

            if (p.parents) {
                p.parents.forEach(parentLabel => {
                    const parentId = sanitize(parentLabel);
                    code += `    ${parentId} --> ${id}\n`;
                });
            }
        });
        
        setGraphCode(code);
    };

    // Automated Heating Effect
    useEffect(() => {
        // Reset particles on mount
        setParticles(INITIAL_UNITS.map(p => ({ ...p }))); // Deep copy
        setTemperature(0);

        // Start heating loop
        tempIntervalRef.current = setInterval(() => {
            setTemperature(prev => {
                if (prev >= 95) {
                    if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
                    return 95;
                }
                return prev + 0.5; // slow increase over ~190 steps (approx 10s at 50ms)
            });
        }, 100);

        return () => {
            if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
        };
    }, []);

    const updatePhysics = () => {
        setParticles(prevParticles => {
            let workingParticles = prevParticles.map(p => ({ ...p }));
            const count = workingParticles.length;

            // 1. REPULSION & ATTRACTION
            for (let i = 0; i < count; i++) {
                for (let j = i + 1; j < count; j++) {
                    const p1 = workingParticles[i];
                    const p2 = workingParticles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx*dx + dy*dy;
                    
                    // Repulsion (Prevent Overlap)
                    const repulsionRadius = 8; 
                    if (distSq < repulsionRadius * repulsionRadius && distSq > 0.01) {
                        const dist = Math.sqrt(distSq);
                        const force = (repulsionRadius - dist) * 0.1;
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;
                        p1.vx += fx; p1.vy += fy;
                        p2.vx -= fx; p2.vy -= fy;
                    }

                    // Attraction (Recipe-based)
                    if (temperature > 20) {
                        // Check if they form a recipe
                        const isRecipe = MERGE_RECIPES.some(r => 
                            (r.ingredients.includes(p1.id) || r.ingredients.includes(p1.label)) && 
                            (r.ingredients.includes(p2.id) || r.ingredients.includes(p2.label))
                        );
                        
                        if (isRecipe) {
                            const attractionForce = 0.03; // Strong pull
                            const dist = Math.sqrt(distSq) || 1;
                            const fx = (dx / dist) * attractionForce;
                            const fy = (dy / dist) * attractionForce;
                            p1.vx -= fx; p1.vy -= fy;
                            p2.vx += fx; p2.vy += fy;
                        }
                    }
                }
            }

            // 2. MOVEMENT & WALLS & CORE BOUNCE
            let nextParticles = workingParticles.map(p => {
                // Apply constant "Ambient Heat"
                const ambientX = (Math.random() - 0.5) * 0.01;
                const ambientY = (Math.random() - 0.5) * 0.01;
                p.vx += ambientX;
                p.vy += ambientY;

                const friction = 0.9 + (temperature * 0.0009); 
                p.vx *= Math.min(0.99, friction);
                p.vy *= Math.min(0.99, friction);
                
                if (temperature > 50) {
                    p.vx += (Math.random() - 0.5) * 0.05; 
                    p.vy += (Math.random() - 0.5) * 0.05;
                }
                
                // BOUNCE OFF CENTRAL CORE
                // Core is at 50,50 with radius approx 15% (visual) but let's say 12% physics radius
                const dxCore = p.x - 50;
                const dyCore = p.y - 50;
                const distCore = Math.sqrt(dxCore*dxCore + dyCore*dyCore);
                const coreRadius = 12; 
                
                if (distCore < coreRadius) {
                    // Normalize and reflect
                    const nx = dxCore / distCore;
                    const ny = dyCore / distCore;
                    
                    // Push out
                    p.x = 50 + nx * (coreRadius + 1);
                    p.y = 50 + ny * (coreRadius + 1);
                    
                    // Reflect velocity vector
                    const dot = p.vx * nx + p.vy * ny;
                    p.vx = p.vx - 2 * dot * nx;
                    p.vy = p.vy - 2 * dot * ny;
                    
                    // Add some energy on bounce
                    p.vx *= 1.2;
                    p.vy *= 1.2;
                }

                let nx = p.x + p.vx;
                let ny = p.y + p.vy;

                // Bounce off walls
                if (nx <= 2 || nx >= 98) p.vx *= -1;
                if (ny <= 2 || ny >= 98) p.vy *= -1;
                nx = Math.max(2, Math.min(98, nx));
                ny = Math.max(2, Math.min(98, ny));

                return { ...p, x: nx, y: ny };
            });

            // 3. COLLISION & MERGE LOGIC
            if (temperature > 30) {
                const mergedIndices = new Set<number>();
                const newParticles: Particle[] = [];

                for (let i = 0; i < nextParticles.length; i++) {
                    if (mergedIndices.has(i)) continue;
                    for (let j = i + 1; j < nextParticles.length; j++) {
                        if (mergedIndices.has(j)) continue;
                        const p1 = nextParticles[i];
                        const p2 = nextParticles[j];
                        
                        // Don't merge final cores together
                        if (p1.label.startsWith("CORE:") || p2.label.startsWith("CORE:")) continue;

                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);

                        if (dist < 5) { // Collision threshold
                            // Check recipe by ID or Label (since merged particles have dynamic IDs)
                            const recipe = MERGE_RECIPES.find(r => 
                                (r.ingredients.includes(p1.id) || r.ingredients.includes(p1.label)) && 
                                (r.ingredients.includes(p2.id) || r.ingredients.includes(p2.label))
                            );

                            if (recipe) {
                                mergedIndices.add(i);
                                mergedIndices.add(j);
                                newParticles.push({
                                    id: `merged-${Date.now()}-${i}`,
                                    label: recipe.result.label,
                                    type: recipe.result.label.startsWith("CORE:") ? 'epiphany' : 'merged',
                                    x: (p1.x + p2.x) / 2,
                                    y: (p1.y + p2.y) / 2,
                                    vx: (p1.vx + p2.vx) / 2,
                                    vy: (p1.vy + p2.vy) / 2,
                                    color: recipe.result.color,
                                    scale: recipe.result.label.startsWith("CORE:") ? 2 : 1.2,
                                    parents: [p1.label, p2.label]
                                });
                            } else {
                                // Elastic Collision (Bounce) for non-recipe matches
                                const angle = Math.atan2(dy, dx);
                                const speed1 = Math.sqrt(p1.vx*p1.vx + p1.vy*p1.vy);
                                const speed2 = Math.sqrt(p2.vx*p2.vx + p2.vy*p2.vy);
                                p1.vx = -Math.cos(angle) * speed1;
                                p1.vy = -Math.sin(angle) * speed1;
                                p2.vx = Math.cos(angle) * speed2;
                                p2.vy = Math.sin(angle) * speed2;
                            }
                        }
                    }
                }
                nextParticles = nextParticles.filter((_, i) => !mergedIndices.has(i)).concat(newParticles);
            }

            return nextParticles;
        });
        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [temperature]);

    const resetSimulation = () => {
        setParticles(INITIAL_UNITS.map(p => ({ ...p })));
        setTemperature(0);
        // Restart automation
        if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
        tempIntervalRef.current = setInterval(() => {
            setTemperature(prev => {
                if (prev >= 95) {
                    if (tempIntervalRef.current) clearInterval(tempIntervalRef.current);
                    return 95;
                }
                return prev + 0.5; 
            });
        }, 100);
    };

    return (
        <div className="bg-black relative overflow-hidden min-h-[700px] border-none shadow-none flex flex-col font-sans">
            
            {/* Control Panel */}
            <div className="bg-black text-white p-6 border-b-2 border-accent relative z-20 flex-none shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Grid className="w-4 h-4 text-accent animate-pulse" />
                            <span className="font-mono text-xs font-bold tracking-widest uppercase text-accent border border-accent px-1 bg-accent/10">
                                TANGENT_ENGINE_V2.0 // NEUROPUNK_EDITION
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold leading-none relative text-white">
                            Collision Detector
                            <span className="absolute -top-6 -right-0 md:left-full md:ml-4 md:top-0 w-max font-mono text-[10px] text-accent border border-accent px-2 py-0.5 opacity-80 animate-pulse hidden md:block">
                                ← AUTO_ENTROPY_RISING
                            </span>
                        </h2>
                    </div>

                    {/* Slider */}
                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="font-mono text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                                Thermodynamic Control
                            </span>
                            <span className="font-mono text-[10px] font-bold uppercase text-accent tracking-widest animate-pulse">
                                {phase.label} SEQUENCE ACTIVE ↘
                            </span>
                        </div>
                        
                        <div className="w-full p-4 border border-gray-800 bg-[#0a0a0a] shadow-inner relative group">
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-between px-4">
                                <div className="h-full w-px bg-gray-900 group-hover:bg-accent/20 transition-colors"></div>
                                <div className="h-full w-px bg-gray-900 group-hover:bg-accent/20 transition-colors"></div>
                                <div className="h-full w-px bg-gray-900 group-hover:bg-accent/20 transition-colors"></div>
                            </div>

                            <div className="flex justify-between items-center mb-3 font-mono text-xs relative z-10">
                                <span className={`font-bold flex items-center gap-1 ${temperature < 30 ? 'text-blue-400' : 'text-gray-700'}`}>
                                    <Snowflake className="w-3 h-3" /> ORDER
                                </span>
                                <span className={`font-bold transition-all ${phase.color} text-lg`}>
                                    {Math.round(temperature)}%
                                </span>
                                <span className={`font-bold flex items-center gap-1 ${temperature > 80 ? 'text-red-500' : 'text-gray-700'}`}>
                                    <Zap className="w-3 h-3" /> CHAOS
                                </span>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-800 rounded-none appearance-none cursor-pointer accent-accent relative z-10 border border-gray-700 focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Arena */}
            <div ref={containerRef} className="relative w-full flex-grow bg-black overflow-hidden transition-colors duration-500 flex items-center justify-center">
                
                {/* Neuropunk Grid */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none"
                    style={{ 
                        opacity: 0.2 + (temperature / 200),
                        filter: `blur(${temperature > 80 ? '1px' : '0px'})`
                    }}
                />

                {/* Glitch Overlay */}
                <div 
                    className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-100 mix-blend-color-dodge bg-red-900/30"
                    style={{ 
                        opacity: (temperature > 85 && Math.random() > 0.8 ? 0.2 : 0),
                        transform: `translate(${Math.random() * 4}px, ${Math.random() * 4}px)`
                    }}
                />

                {/* --- CENTRAL CORE --- */}
                <div 
                    onClick={() => { generateGraph(); setIsGraphOpen(true); }}
                    className="absolute z-0 w-32 h-32 border border-accent/50 bg-black/80 backdrop-blur-md flex items-center justify-center cursor-pointer group shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all duration-500 rounded-full"
                >
                    <div className="absolute inset-0 border border-accent opacity-30 scale-125 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-0 border border-accent opacity-20 scale-150 animate-[spin_15s_linear_infinite_reverse]" />
                    
                    <div className="text-center group-hover:scale-110 transition-transform">
                        <Network className="w-8 h-8 text-accent mx-auto mb-2" />
                        <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest block">
                            CORE_LOGIC
                        </span>
                    </div>
                </div>

                {/* Particles */}
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            layoutId={p.id}
                            initial={{ scale: 0 }}
                            onMouseEnter={() => setHoveredParticle(p)}
                            onMouseLeave={() => setHoveredParticle(null)}
                            animate={{ 
                                left: `${p.x}%`, 
                                top: `${p.y}%`,
                                scale: p.scale + (temperature > 80 ? Math.random() * 0.1 : 0),
                                rotate: temperature > 70 ? [0, 5, -5, 0] : 0,
                                x: '-50%',
                                y: '-50%'
                            }}
                            transition={{ 
                                left: { duration: 0 }, 
                                top: { duration: 0 },
                                scale: { type: "spring", stiffness: 200, damping: 20 }
                            }}
                            className={`
                                absolute flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300
                                border-2 shadow-lg
                                ${p.type === 'epiphany' 
                                    ? 'z-50 w-auto min-w-[120px] p-4 bg-accent border-white shadow-[0_0_20px_#10b981]' 
                                    : p.type === 'merged'
                                        ? 'z-20 w-auto min-w-[80px] p-2 rounded-sm border-dashed border-accent bg-gray-900/90'
                                        : 'z-10 w-auto min-w-[60px] p-1 bg-white border-ink'
                                }
                                ${p.color}
                            `}
                        >
                            <div className="pointer-events-none relative z-10">
                                {/* Type Label */}
                                {p.type === 'epiphany' && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-accent px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border border-accent whitespace-nowrap">
                                        EPIPHANY_DETECTED
                                    </div>
                                )}
                                
                                {/* Text Content - Chaos vs Order - Style Persistence */}
                                <div className={`font-bold leading-tight whitespace-nowrap px-1 
                                    ${p.type === 'unit' && temperature > 70
                                        ? 'font-hand text-xl rotate-1' // Chaos Font Mode
                                        : p.type === 'epiphany'
                                            ? 'font-mono text-xs text-black uppercase tracking-widest' // Order Font
                                            : 'font-sans text-[10px]' // Neutral / Standard
                                    }
                                `}>
                                    {p.label}
                                </div>
                            </div>
                            
                            {/* Merge Indicator */}
                            {p.type === 'merged' && (
                                <Plus className="w-3 h-3 text-accent absolute -right-1 -bottom-1 bg-black rounded-full p-0.5" />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Reset Button */}
                {particles.some(p => p.type === 'epiphany') && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[60]">
                        <motion.button 
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            onClick={resetSimulation}
                            className="bg-black text-accent px-6 py-3 font-mono font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all border border-accent flex items-center gap-3 uppercase tracking-widest hover:bg-accent hover:text-black"
                        >
                            <RotateCcw className="w-4 h-4" />
                            System_Reset
                        </motion.button>
                    </div>
                )}

            </div>

            {/* Mermaid Graph Modal */}
            <PaperModal
                isOpen={isGraphOpen}
                onClose={() => setIsGraphOpen(false)}
                title="GENERATED_TOPOLOGY_GRAPH"
                maxWidth="max-w-4xl"
            >
                <div className="flex flex-col gap-4 bg-black p-4 border border-accent">
                    <p className="font-mono text-xs text-accent">
                        /// RENDERING SYSTEM STATE AS DIRECTED ACYCLIC GRAPH...
                    </p>
                    <MermaidSolutions 
                        code={graphCode}
                        onExecute={() => {}} 
                        terminalLines={["Parsing particle state...", "Mapping lineage...", "Graph generated."]}
                    />
                </div>
            </PaperModal>
        </div>
    );
};

export default TangentEngine;
