import React, { useState } from 'react';
import {
    MessageSquare,
    Calculator,
    ShieldCheck,
    LayoutGrid,
    User,
    Settings,
    ChevronLeft,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'chat', label: 'AI Assistant', icon: MessageSquare, tag: 'Live' },
        { id: 'emi', label: 'EMI Calculator', icon: Calculator, tag: null },
        { id: 'eligibility', label: 'Eligibility Check', icon: ShieldCheck, tag: null },
        { id: 'catalog', label: 'Loan Products', icon: LayoutGrid, tag: null },
    ];

    const activeItem = menuItems.find(i => i.id === activeTab);

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--cream)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

            {/* ── Sidebar ── */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 68 : 252 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="relative flex flex-col z-20 shrink-0 overflow-hidden"
                style={{
                    background: 'var(--ink)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--amber)' }}>
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F7F2E8', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                                    Loan<span style={{ color: 'var(--amber)' }}>Bot</span>
                                </div>
                                <div style={{ color: 'var(--muted-light)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2, whiteSpace: 'nowrap' }}>
                                    Financial Intelligence
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav Label */}
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="px-5 pt-6 pb-2"
                            style={{ color: 'var(--muted)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}
                        >
                            Navigation
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Menu */}
                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative"
                                style={{
                                    background: isActive ? 'rgba(200,135,44,0.12)' : 'transparent',
                                    color: isActive ? 'var(--amber-light)' : 'rgba(247,242,232,0.4)',
                                    border: isActive ? '1px solid rgba(200,135,44,0.25)' : '1px solid transparent',
                                }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(247,242,232,0.8)'; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(247,242,232,0.4)'; }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                                        style={{ background: 'var(--amber)', marginLeft: '-12px' }}
                                    />
                                )}
                                <item.icon className="w-4 h-4 shrink-0" />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-between flex-1"
                                        >
                                            <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
                                                {item.label}
                                            </span>
                                            {item.tag && (
                                                <span className="px-1.5 py-0.5 rounded-md text-white"
                                                    style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--sage)', fontWeight: 600 }}>
                                                    {item.tag}
                                                </span>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--muted)' }}
                >
                    <ChevronLeft className="w-3 h-3 transition-transform duration-300" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Bottom */}
                <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {[{ icon: User, label: 'Profile' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                        <button key={label}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                            style={{ color: 'rgba(247,242,232,0.3)', fontSize: '0.82rem' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'rgba(247,242,232,0.7)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(247,242,232,0.3)'}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                        </button>
                    ))}
                </div>
            </motion.aside>

            {/* ── Main Content ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="flex items-center justify-between px-8 py-4 shrink-0"
                    style={{ borderBottom: '1px solid var(--border)', background: 'rgba(247,242,232,0.9)', backdropFilter: 'blur(8px)' }}>
                    <div className="flex items-center gap-3">
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
                                {activeItem?.label}
                            </div>
                            <div style={{ color: 'var(--muted)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>
                                LoanBot Financial Dashboard
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{ background: 'rgba(74,103,65,0.08)', border: '1px solid rgba(74,103,65,0.2)' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--sage)' }} />
                            <span style={{ color: 'var(--sage)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                                System Online
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="text-right">
                                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)' }}>Professional</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>ADMIN ACCOUNT</div>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--amber-pale)', border: '1.5px solid var(--border-strong)' }}>
                                <User className="w-4 h-4" style={{ color: 'var(--amber-dark)' }} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page */}
                <main className="flex-1 overflow-y-auto p-8" style={{ background: 'var(--cream)' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;