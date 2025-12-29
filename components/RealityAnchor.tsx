
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, LogOut, X } from 'lucide-react';

interface RealityAnchorProps {
    onTrigger: () => void;
}

const RealityAnchor: React.FC<RealityAnchorProps> = ({ onTrigger }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-32 right-0 z-[90] flex items-end justify-end">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.button
                        key="tab"
                        onClick={() => setIsOpen(true)}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-accent text-ink border-l-2 border-y-2 border-ink shadow-[-4px_4px_0px_0px_rgba(24,24,27,1)] hover:shadow-[-6px_6px_0px_0px_rgba(24,24,27,1)] hover:pr-3 transition-all py-4 px-2 flex flex-col items-center gap-3 rounded-l-sm"
                    >
                         <LogOut className="w-5 h-5" />
                         <span className="[writing-mode:vertical-rl] rotate-180 font-mono text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                            Eject (rm -rf /tmp/Me)
                        </span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="card"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: -16, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative mr-0 md:mr-4"
                    >
                         {/* Card Container */}
                         <div className="bg-paper border-2 border-ink shadow-hard w-72 overflow-hidden">
                            {/* Header */}
                            <div className="bg-ink text-paper px-4 py-2 flex justify-between items-center border-b-2 border-ink">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                                    ESCAPE_PROTOCOL
                                </span>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Body */}
                            <div className="p-6 relative">
                                <div className="absolute inset-0 bg-accent/10 pointer-events-none" />
                                <div className="relative z-10">
                                    <h3 className="font-serif text-3xl font-bold text-ink mb-2 italic leading-none">
                                        Run Away?
                                    </h3>
                                    <p className="font-sans text-sm text-gray-700 mb-6 leading-relaxed font-medium">
                                        Overwhelmed by the shenanigans? Download the official PDF prospectus and return to the safety of standard business documentation.
                                    </p>
                                    
                                    <button 
                                        onClick={() => {
                                            onTrigger();
                                            setIsOpen(false);
                                        }}
                                        className="w-full bg-accent text-ink border-2 border-ink shadow-hard hover:shadow-hard-hover hover:-translate-y-1 transition-all py-3 font-mono text-sm font-bold flex items-center justify-center gap-2 group"
                                    >
                                        <FileDown className="w-4 h-4 group-hover:animate-bounce" />
                                        GET THE PDF
                                    </button>
                                </div>
                            </div>
                            
                            {/* Footer Strip */}
                            <div className="bg-gray-100 border-t-2 border-ink p-2 flex justify-between items-center">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500 border border-ink" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 border border-ink" />
                                    <div className="w-2 h-2 rounded-full bg-green-500 border border-ink" />
                                </div>
                                <span className="font-mono text-[8px] text-gray-400">SECURE_LINK_V2</span>
                            </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RealityAnchor;
