import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithBot } from '../api';

const ChatSection = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Loan Assistant. How can I facilitate your financial journey today?", sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await chatWithBot(input, sessionId);
            if (data.session_id && !sessionId) setSessionId(data.session_id);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "System communication error. Please ensure the neural gateway (backend) is active.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Banner / Info */}
            <div className="mb-6 flex items-center justify-between px-4 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Sparkles className="text-indigo-400 w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-indigo-100">AI Personalization Enabled</p>
                </div>
                <button className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 hover:text-indigo-300">View Data Policy</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                                <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`shrink-0 p-2 rounded-xl h-10 w-10 flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                                        } border border-white/5`}>
                                        {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                                    </div>
                                    <div className={`relative p-4 shadow-xl ${msg.sender === 'user'
                                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none'
                                            : 'bg-slate-900/80 border border-white/10 text-slate-100 rounded-2xl rounded-bl-none'
                                        }`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 px-12">
                                    {msg.timestamp}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl rounded-bl-none text-slate-400 flex items-center gap-3">
                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Processing request...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={scrollRef} className="h-4" />
            </div>

            {/* Fixed Input bar at the bottom */}
            <div className="pt-6 pb-2 px-4">
                <form onSubmit={handleSend} className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-xl group-focus-within:bg-indigo-500/20 transition-all opacity-50" />
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl focus-within:border-indigo-500/50 transition-all">
                        <button type="button" className="p-2 text-slate-500 hover:text-white transition-colors">
                            <PlusCircle size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Query the LoanBot Pro Neural Network..."
                            className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-medium text-white placeholder:text-slate-600"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`p-3 rounded-xl transition-all ${input.trim() && !isLoading
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95'
                                    : 'bg-slate-800 text-slate-600'
                                }`}
                        >
                            <Send size={18} className={isLoading ? 'animate-pulse' : ''} />
                        </button>
                    </div>
                </form>
                <p className="text-[10px] text-center text-slate-600 mt-4 font-bold uppercase tracking-[0.2em]">
                    Powered by LoanBot Pro Intelligence • Session Secured
                </p>
            </div>
        </div>
    );
};

export default ChatSection;
