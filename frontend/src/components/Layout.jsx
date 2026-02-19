import React, { useState } from 'react';
import {
    Rocket,
    MessageSquare,
    Calculator,
    ShieldCheck,
    PieChart,
    Menu,
    ChevronLeft,
    User,
    Settings,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
        { id: 'emi', label: 'EMI Calculator', icon: Calculator },
        { id: 'eligibility', label: 'Eligibility', icon: ShieldCheck },
        { id: 'catalog', label: 'Loan Products', icon: PieChart },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="relative bg-slate-900/40 border-r border-white/5 flex flex-col z-20"
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Rocket className="text-white w-6 h-6" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-xl tracking-tight text-white whitespace-nowrap"
                            >
                                LoanBot <span className="text-indigo-500">Pro</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${activeTab === item.id
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                            {!isCollapsed && (
                                <span className="font-semibold text-sm whitespace-nowrap">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-slate-800 border border-white/10 rounded-full p-1 text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>

                {/* Bottom Section */}
                <div className="px-4 py-8 border-t border-white/5 space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <User className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Profile</span>}
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Settings className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

                {/* Top Header Bar */}
                <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dashboard</h2>
                        <div className="font-bold text-2xl text-white mt-1">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white leading-tight">Professional User</div>
                            <div className="text-xs text-slate-500">Admin Account</div>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-300" />
                        </div>
                    </div>
                </header>

                {/* Main Section */}
                <main className="flex-1 overflow-y-auto px-8 py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
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
