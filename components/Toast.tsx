
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailCheck } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, rotate: 5 }}
                    animate={{ opacity: 1, y: 0, rotate: -2 }}
                    exit={{ opacity: 0, y: 20, rotate: 10 }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <div className="bg-paper border-2 border-ink shadow-hard px-6 py-4 flex items-center gap-4 min-w-[300px] relative overflow-hidden">
                        {/* Stamp Effect */}
                        <div className="absolute -right-4 -top-4 border-2 border-emerald-600/30 w-16 h-16 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
                            <span className="text-[10px] font-mono text-emerald-600/30 font-bold">SENT</span>
                        </div>

                        <div className="w-10 h-10 bg-ink text-paper flex items-center justify-center">
                            <MailCheck className="w-5 h-5" />
                        </div>
                        
                        <div>
                            <div className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Status Report</div>
                            <div className="font-serif font-bold text-lg text-ink leading-none">{message}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
