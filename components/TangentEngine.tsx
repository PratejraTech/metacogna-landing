
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Zap, Snowflake, Box, Grid, Plus, Atom, RotateCcw } from 'lucide-react';

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
}

// Initial Data Sets (Expanded)
const INITIAL_UNITS: Particle[] = [
    { id: 'alpha', label: "AlphaFold 3 Weights", type: 'unit', x: 10, y: 15, vx: 0.15, vy: 0.05, color: "bg-paper text-ink", scale: 1 },
    { id: 'towel', label: "Terry Cloth Physics", type: 'unit', x: 80, y: 20, vx: -0.1, vy: 0.15, color: "bg-paper text-ink", scale: 1 },
    { id: 'gpu', label: "H100 Grid", type: 'unit', x: 20, y: 80, vx: 0.1, vy: -0.1, color: "bg-paper text-ink", scale: 1 },
    { id: 'origami', label: "Riemannian Geometry", type: 'unit', x: 85, y: 75, vx: -0.05, vy: -0.15, color: "bg-paper text-ink", scale: 1 },
    { id: 'laundry', label: "Domestic Chores", type: 'unit', x: 50, y: 50, vx: 0.05, vy: 0.05, color: "bg-paper text-ink", scale: 1 },
    { id: 'kafka', label: "Kafka Streams", type: 'unit', x: 30, y: 40, vx: 0.12, vy: -0.08, color: "bg-paper text-ink", scale: 1 },
    { id: 'jazz', label: "Jazz Improvisation", type: 'unit', x: 60, y: 30, vx: -0.08, vy: 0.12, color: "bg-paper text-ink", scale: 1 },
    { id: 'fungi', label: "Mycelium Network", type: 'unit', x: 40, y: 70, vx: 0.08, vy: 0.08, color: "bg-paper text-ink", scale: 1 },
    { id: 'brutal', label: "Brutalist Concrete", type: 'unit', x: 70, y: 60, vx: -0.1, vy: -0.05, color: "bg-paper text-ink", scale: 1 },
    // New Particles
    { id: 'quantum', label: "Quantum Entanglement", type: 'unit', x: 15, y: 35, vx: 0.09, vy: -0.04, color: "bg-paper text-ink", scale: 1 },
    { id: 'sourdough', label: "Sourdough Starter", type: 'unit', x: 75, y: 85, vx: -0.06, vy: 0.03, color: "bg-paper text-ink", scale: 1 },
    { id: 'supply', label: "Supply Chain", type: 'unit', x: 55, y: 10, vx: 0.04, vy: 0.1, color: "bg-paper text-ink", scale: 1 },
    { id: 'dopamine', label: "Dopamine Receptors", type: 'unit', x: 25, y: 65, vx: -0.07, vy: -0.09, color: "bg-paper text-ink", scale: 1 },
    { id: 'synth', label: "Vintage Synths", type: 'unit', x: 90, y: 45, vx: -0.1, vy: 0.02, color: "bg-paper text-ink", scale: 1 },
];

const MERGE_RECIPES = [
    { ingredients: ['alpha', 'towel'], result: { label: "Predictive Linen Folding", color: "bg-gray-100 text-ink" } },
    { ingredients: ['gpu', 'laundry'], result: { label: "High-Performance Washing", color: "bg-gray-100 text-ink" } },
    { ingredients: ['origami', 'towel'], result: { label: "Topo-Textiles", color: "bg-gray-100 text-ink" } },
    { ingredients: ['kafka', 'jazz'], result: { label: "Event-Driven Syncopation", color: "bg-gray-100 text-ink" } },
    { ingredients: ['fungi', 'gpu'], result: { label: "Biological Compute", color: "bg-gray-100 text-ink" } },
    { ingredients: ['brutal', 'origami'], result: { label: "Folded Concrete Structures", color: "bg-gray-100 text-ink" } },
    { ingredients: ['jazz', 'laundry'], result: { label: "Rhythmic Tumbling", color: "bg-gray-100 text-ink" } },
    // New Recipes
    { ingredients: ['quantum', 'supply'], result: { label: "Teleportation Logistics", color: "bg-gray-100 text-ink" } },
    { ingredients: ['sourdough', 'fungi'], result: { label: "Hyper-Active Yeast", color: "bg-gray-100 text-ink" } },
    { ingredients: ['synth', 'jazz'], result: { label: "Analog Improvisation", color: "bg-gray-100 text-ink" } },
    { ingredients: ['dopamine', 'gpu'], result: { label: "Addictive Compute", color: "bg-gray-100 text-ink" } },
    { ingredients: ['brutal', 'sourdough'], result: { label: "Edible Architecture", color: "bg-gray-100 text-ink" } },
];

const EPIPHANIES = [
    "The Optimal Towel State",
    "Self-Organizing Laundry",
    "Entropic Fabric Singularity",
    "Sentient Concrete",
    "Fungal Cloud Infrastructure",
    "Infinite Bread Loops"
];

interface TangentEngineProps {
    mode?: 'BUSINESS' | 'TECHNICAL';
}

const TangentEngine: React.FC<TangentEngineProps> = ({ mode = 'BUSINESS' }) => {
    const [temperature, setTemperature] = useState(0); 
    const [particles, setParticles] = useState<Particle[]>(INITIAL_UNITS);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number | null>(null);

    // Helper to determine phase based on temperature
    const getPhase = (temp: number) => {
        if (temp > 80) return { label: "PHASE 3: SUBLIMATION", desc: "Solid -> Gas. Epiphanies form.", icon: Zap, color: "text-red-500" };
        if (temp > 40) return { label: "PHASE 2: FUSION", desc: "Collisions create new compounds.", icon: Atom, color: "text-orange-500" };
        return { label: "PHASE 1: LATTICE", desc: "Static concepts. Potential energy only.", icon: Snowflake, color: "text-blue-500" };
    };

    const phase = getPhase(temperature);

    // Physics Loop
    const updatePhysics = () => {
        setParticles(prevParticles => {
            // Create mutable working copy
            let workingParticles = prevParticles.map(p => ({ ...p }));
            const count = workingParticles.length;

            // 1. REPULSION / REBOUND LOGIC
            // Apply forces to avoid sticking
            for (let i = 0; i < count; i++) {
                for (let j = i + 1; j < count; j++) {
                    const p1 = workingParticles[i];
                    const p2 = workingParticles[j];
                    
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx*dx + dy*dy;
                    
                    // Repulsion radius (percentage of container width roughly)
                    // Increased radius to create more vigorous bounce
                    const repulsionRadius = 15; 
                    const repulsionSq = repulsionRadius * repulsionRadius;

                    if (distSq < repulsionSq && distSq > 0.01) {
                        const dist = Math.sqrt(distSq);
                        // Force increases closer they are
                        const force = (repulsionRadius - dist) * 0.08; // Strong rebound factor
                        
                        const fx = (dx / dist) * force;
                        const fy = (dy / dist) * force;

                        p1.vx += fx;
                        p1.vy += fy;
                        p2.vx -= fx;
                        p2.vy -= fy;
                    }
                }
            }

            // 2. MOVEMENT & STATE LOGIC
            let nextParticles = workingParticles.map(p => {
                // Friction / Damping to prevent explosion from repulsion
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Base movement speed depends on temperature
                // At temp 0, speedMult is 0, but repulsion might still nudge them if they overlap
                let speedMult = temperature * 0.008;
                
                // UNIFICATION LOGIC: Epiphanies float to Top Center
                if (p.type === 'epiphany') {
                    const targetX = 50;
                    const targetY = 15; // Top Center
                    
                    // Attraction Force
                    p.vx += (targetX - p.x) * 0.05;
                    p.vy += (targetY - p.y) * 0.05;
                    
                    // Strong damping to stop at target
                    p.vx *= 0.8;
                    p.vy *= 0.8;
                    
                    // Epiphanies move independently of temperature
                    speedMult = 0.2; 
                } 
                
                let nx = p.x + p.vx * speedMult;
                let ny = p.y + p.vy * speedMult;

                // Bounce off walls (Standard & Merged)
                if (p.type !== 'epiphany') {
                    if (nx <= 5 || nx >= 95) p.vx *= -1;
                    if (ny <= 5 || ny >= 95) p.vy *= -1;

                    // Keep in bounds
                    nx = Math.max(5, Math.min(95, nx));
                    ny = Math.max(5, Math.min(95, ny));

                    // Jitter at high temp
                    if (temperature > 70) {
                        nx += (Math.random() - 0.5) * 0.5; 
                        ny += (Math.random() - 0.5) * 0.5;
                    }
                } else {
                    // Epiphany bounds (looser to allow exit if needed, but mainly for centering)
                    nx = Math.max(0, Math.min(100, nx));
                    ny = Math.max(0, Math.min(100, ny));
                }

                return { ...p, x: nx, y: ny };
            });

            // 3. COLLISION & MERGE LOGIC (Only > 40 Temp)
            if (temperature > 40) {
                const mergedIndices = new Set<number>();
                const newParticles: Particle[] = [];

                for (let i = 0; i < nextParticles.length; i++) {
                    if (mergedIndices.has(i)) continue;
                    for (let j = i + 1; j < nextParticles.length; j++) {
                        if (mergedIndices.has(j)) continue;

                        const p1 = nextParticles[i];
                        const p2 = nextParticles[j];
                        
                        // Epiphany Merging (Singularity)
                        if (p1.type === 'epiphany' && p2.type === 'epiphany') {
                             const dx = p1.x - p2.x;
                             const dy = p1.y - p2.y;
                             if (Math.sqrt(dx*dx + dy*dy) < 10) {
                                 mergedIndices.add(i);
                                 mergedIndices.add(j);
                                 newParticles.push({
                                     ...p1,
                                     id: `singularity-${Date.now()}`,
                                     label: "TOTALITY", // The Single State
                                     scale: Math.min(3, p1.scale + 0.5), // Grow bigger
                                     x: 50,
                                     y: 15
                                 });
                             }
                             continue;
                        }

                        // Standard Merging
                        if (p1.type === 'epiphany' || p2.type === 'epiphany') continue; // Don't merge epiphany with normal

                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);

                        // Merge radius needs to be smaller than repulsion radius so they "fight" to merge
                        if (dist < 8) {
                            // Check recipes
                            const recipe = MERGE_RECIPES.find(r => 
                                (r.ingredients.includes(p1.id) && r.ingredients.includes(p2.id)) ||
                                (p1.type === 'unit' && p2.type === 'unit') // Generic merge fallback
                            );

                            if (recipe || (p1.type === 'unit' && p2.type === 'unit')) {
                                mergedIndices.add(i);
                                mergedIndices.add(j);
                                
                                newParticles.push({
                                    id: `merged-${Date.now()}-${i}`,
                                    label: recipe ? recipe.result.label : `${p1.label.split(' ')[0]} + ${p2.label.split(' ')[0]}`,
                                    type: 'merged',
                                    x: (p1.x + p2.x) / 2,
                                    y: (p1.y + p2.y) / 2,
                                    vx: (p1.vx + p2.vx) / 2,
                                    vy: (p1.vy + p2.vy) / 2,
                                    color: recipe ? recipe.result.color : 'bg-gray-100 text-ink',
                                    scale: 1.2
                                });
                            }
                        }
                    }
                }

                // Filter out merged, add new
                nextParticles = nextParticles.filter((_, i) => !mergedIndices.has(i)).concat(newParticles);
            }

            // EXPLOSION LOGIC (Only > 80 Temp)
            if (temperature > 85) {
                nextParticles = nextParticles.map(p => {
                    if (p.type === 'merged' && Math.random() > 0.98) { // Slower explosion rate
                        return {
                            ...p,
                            type: 'epiphany',
                            label: EPIPHANIES[Math.floor(Math.random() * EPIPHANIES.length)],
                            color: 'bg-accent text-ink',
                            scale: 1.5,
                            vx: 0,
                            vy: 0
                        };
                    }
                    return p;
                });
            }

            return nextParticles;
        });

        requestRef.current = requestAnimationFrame(updatePhysics);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updatePhysics);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [temperature]);

    const resetSimulation = () => {
        setParticles(INITIAL_UNITS);
        setTemperature(0);
    };

    return (
        <div className="bg-surface relative overflow-hidden min-h-[600px] border-none shadow-none flex flex-col">
            
            {/* Neo-Brutalist Control Panel */}
            <div className="bg-ink text-paper p-6 border-b-4 border-accent relative z-20 flex-none shadow-hard">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Grid className="w-4 h-4 text-accent animate-pulse" />
                            <span className="font-mono text-xs font-bold tracking-widest uppercase text-accent border border-accent px-1">
                                TANGENT_ENGINE_V2.0
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold leading-none relative">
                            Collision Detector
                            {/* "Increase Entropy" label positioned relative to title/controls as requested */}
                            <span className="absolute -top-6 -right-0 md:left-full md:ml-4 md:top-0 w-max font-mono text-[10px] text-accent border border-accent px-2 py-0.5 opacity-80 animate-pulse hidden md:block">
                                ← INCREASE ENTROPY
                            </span>
                        </h2>
                    </div>

                    {/* Industrial Slider */}
                    <div className="w-full md:w-1/2 flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="font-mono text-[10px] font-bold uppercase text-gray-500 tracking-widest">
                                Thermodynamic Control
                            </span>
                            <span className="font-mono text-[10px] font-bold uppercase text-accent tracking-widest animate-pulse">
                                Increase Entropy ↘
                            </span>
                        </div>
                        
                        <div className="w-full p-4 border-2 border-gray-700 bg-[#111] shadow-inner relative">
                            {/* Scale Marks */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-between px-4">
                                <div className="h-full w-px bg-gray-800"></div>
                                <div className="h-full w-px bg-gray-800"></div>
                                <div className="h-full w-px bg-gray-800"></div>
                                <div className="h-full w-px bg-gray-800"></div>
                            </div>

                            <div className="flex justify-between items-center mb-3 font-mono text-xs relative z-10">
                                <span className="text-blue-400 font-bold flex items-center gap-1">
                                    <Snowflake className="w-3 h-3" /> LATTICE (0K)
                                </span>
                                <span className={`font-bold transition-colors ${phase.color}`}>
                                    CURRENT_TEMP: {temperature * 10}K
                                </span>
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                    <Zap className="w-3 h-3" /> PLASMA (1000K)
                                </span>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                className="w-full h-4 bg-gray-800 rounded-none appearance-none cursor-pointer accent-accent relative z-10 border border-gray-600 focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualization Arena */}
            <div ref={containerRef} className="relative w-full flex-grow bg-surface overflow-hidden transition-colors duration-500">
                
                {/* Background Grid Pattern */}
                <div 
                    className="absolute inset-0 bg-[linear-gradient(rgba(24,24,27,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.1)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none transition-opacity duration-700"
                    style={{ opacity: 1 - (temperature / 150) }}
                />

                {/* High Temp Noise Overlay */}
                <div 
                    className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-700 mix-blend-overlay bg-red-900/20"
                    style={{ opacity: (temperature > 80 ? 0.3 : 0) }}
                />

                {/* Particles */}
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            layoutId={p.id}
                            initial={{ scale: 0 }}
                            animate={{ 
                                left: `${p.x}%`, 
                                top: `${p.y}%`,
                                scale: p.scale + (temperature > 80 ? Math.random() * 0.1 : 0),
                                rotate: temperature > 60 ? [0, 2, -2, 0] : 0,
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
                                border-2 border-ink shadow-hard
                                ${p.type === 'epiphany' 
                                    ? 'z-50 w-64 h-auto p-6 bg-accent border-4 shadow-hard-hover' 
                                    : p.type === 'merged'
                                        ? 'z-20 w-40 h-24 p-2 rounded-full border-dashed bg-paper'
                                        : 'z-10 w-32 h-20 p-2 bg-paper'
                                }
                                ${p.color}
                            `}
                        >
                            <div className="pointer-events-none relative z-10">
                                {p.type === 'unit' && (
                                    <div className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-1 border-b border-gray-200 pb-1">
                                        UNIT_ID: {p.id.substring(0,3).toUpperCase()}
                                    </div>
                                )}
                                
                                {p.type === 'merged' && (
                                    <div className="text-[9px] font-mono font-bold text-gray-500 mb-1 flex items-center justify-center gap-1">
                                        <Plus className="w-3 h-3" /> COMPOUND
                                    </div>
                                )}
                                
                                {p.type === 'epiphany' && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-paper px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest border border-accent">
                                        {p.label === "TOTALITY" ? "SINGULARITY" : "EPIPHANY"}
                                    </div>
                                )}
                                
                                <div className={`font-bold leading-tight ${p.type === 'epiphany' ? 'text-xl font-serif text-ink' : 'text-xs font-sans text-ink'}`}>
                                    {p.label}
                                </div>
                            </div>

                            {/* Glitch Effect for Epiphanies */}
                            {p.type === 'epiphany' && (
                                <div className="absolute inset-0 border-2 border-white opacity-20 animate-pulse" />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Reset Button */}
                {particles.some(p => p.type === 'epiphany') && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
                        <motion.button 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onClick={resetSimulation}
                            className="bg-ink text-paper px-8 py-4 font-mono font-bold text-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all border-2 border-paper flex items-center gap-3"
                        >
                            <RotateCcw className="w-5 h-5" />
                            RESET_ENTROPY
                        </motion.button>
                    </div>
                )}

                {/* Phase Indicator Overlay */}
                <div className="absolute bottom-6 right-6 bg-paper border-2 border-ink p-4 shadow-hard z-30 flex items-center gap-4 max-w-xs">
                     <div className={`p-2 border-2 border-ink ${phase.color === 'text-red-500' ? 'bg-red-100' : 'bg-gray-50'}`}>
                        <phase.icon className={`w-6 h-6 ${phase.color}`} />
                     </div>
                     <div>
                        <div className={`font-mono text-xs font-bold uppercase tracking-widest ${phase.color}`}>{phase.label}</div>
                        <div className="font-sans text-xs text-gray-600 leading-tight mt-1">{phase.desc}</div>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default TangentEngine;
