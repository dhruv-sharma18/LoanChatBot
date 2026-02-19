import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithBot } from '../api';

const quickPrompts = [
    { label: 'Loan Types', text: 'What types of loans are available?' },
    { label: 'Check Eligibility', text: 'How do I check my loan eligibility?' },
    { label: 'Calculate EMI', text: 'Help me calculate my EMI.' },
    { label: 'Interest Rates', text: 'What are the current interest rates?' },
];

const ChatSection = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your AI Loan Assistant. How can I facilitate your financial journey today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { id: Date.now(), text: trimmed, sender: 'user', timestamp }]);
        setInput('');
        setIsLoading(true);

        try {
            const data = await chatWithBot(trimmed, sessionId);
            if (data.session_id && !sessionId) setSessionId(data.session_id);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Unable to connect to the server. Please ensure the backend is running.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto" style={{ height: 'calc(100vh - 130px)' }}>

            {/* Assistant Header Card */}
            <div className="mb-5 flex items-center justify-between px-5 py-3.5 rounded-2xl"
                style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--ink)' }}>
                            <Bot className="w-5 h-5" style={{ color: 'var(--amber-light)' }} />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                            style={{ background: 'var(--sage)' }} />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
                            LoanBot Pro Assistant
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--sage)' }} />
                            <span style={{ color: 'var(--sage)', fontSize: '0.68rem', fontWeight: 500 }}>Online · Ready to help</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: 'var(--amber-pale)', border: '1px solid rgba(200,135,44,0.2)' }}>
                    <Sparkles className="w-3 h-3" style={{ color: 'var(--amber)' }} />
                    <span style={{ color: 'var(--amber-dark)', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                        AI Powered
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2.5 max-w-[78%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>

                                {/* Avatar */}
                                <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mb-4"
                                    style={{
                                        background: msg.sender === 'bot' ? 'var(--ink)' : 'var(--amber-pale)',
                                        border: '1px solid var(--border)'
                                    }}>
                                    {msg.sender === 'bot'
                                        ? <Bot className="w-3.5 h-3.5" style={{ color: 'var(--amber-light)' }} />
                                        : <User className="w-3.5 h-3.5" style={{ color: 'var(--amber-dark)' }} />
                                    }
                                </div>

                                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                                    <div className="px-4 py-3 rounded-2xl"
                                        style={{
                                            background: msg.sender === 'user' ? 'var(--ink)' : 'white',
                                            color: msg.sender === 'user' ? 'var(--cream)' : 'var(--ink)',
                                            border: msg.sender === 'bot' ? '1px solid var(--border)' : 'none',
                                            borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.6',
                                            fontWeight: 400,
                                        }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: '0.62rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
                                        {msg.timestamp}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex items-center gap-2.5 ml-9">
                            <div className="px-4 py-3 rounded-2xl flex items-center gap-2"
                                style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px' }}>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--amber)' }} />
                                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Thinking…</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={scrollRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-4">
                    {quickPrompts.map((p) => (
                        <button key={p.label} onClick={() => sendMessage(p.text)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{
                                background: 'white',
                                border: '1px solid var(--border)',
                                color: 'var(--ink-soft)',
                                fontSize: '0.75rem',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--amber-pale)';
                                e.currentTarget.style.borderColor = 'var(--amber)';
                                e.currentTarget.style.color = 'var(--amber-dark)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--ink-soft)';
                            }}>
                            {p.label}
                        </button>
                    ))}
                </motion.div>
            )}

            {/* Input */}
            <div className="shrink-0">
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all"
                        style={{
                            background: 'white',
                            border: '1.5px solid var(--border)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }}
                        onFocus={() => { }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about loans, eligibility, rates…"
                            className="flex-1 bg-transparent outline-none border-none"
                            style={{ color: 'var(--ink)', fontSize: '0.875rem', fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <div style={{ color: 'var(--muted)', fontSize: '0.62rem', fontFamily: "'DM Mono', monospace" }} className="hidden sm:flex items-center gap-1 mr-2">
                            <CornerDownLeft className="w-3 h-3" /> Send
                        </div>
                        <button type="submit" disabled={!input.trim() || isLoading}
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                            style={{
                                background: input.trim() && !isLoading ? 'var(--ink)' : 'var(--cream-mid)',
                                color: input.trim() && !isLoading ? 'var(--amber-light)' : 'var(--muted)',
                            }}>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3" style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    LoanBot Pro · Secure Session · AI Powered
                </div>
            </div>
        </div>
    );
};

export default ChatSection;