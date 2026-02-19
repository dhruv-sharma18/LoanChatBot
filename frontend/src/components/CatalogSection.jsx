import React, { useState, useEffect } from 'react';
import { PieChart, Clock, Banknote, UserCheck, TrendingUp, ArrowUpRight, ShieldCheck, Zap, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLoans } from '../api';

const CatalogSection = () => {
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getLoans()
            .then(setLoans)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Syncing Asset Classes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            {/* Legend / Status */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-8 py-6 bg-slate-900 border border-white/5 rounded-3xl shadow-xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Market Rates</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Eligibility Enabled</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-400">
                    <Zap size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Instant Disbursal Ready</span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {loans.map((loan, index) => (
                    <motion.div
                        key={loan.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 rounded-3xl p-10 transition-all cursor-pointer relative overflow-hidden shadow-2xl"
                    >
                        {/* Background Branding */}
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform">
                            <PieChart size={120} className="text-white" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Institutional Grade</div>
                                    <h3 className="text-3xl font-black font-display text-white transition-colors group-hover:text-indigo-400">
                                        {loan.type}
                                    </h3>
                                </div>
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-500">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-[280px]">
                                {loan.description}
                            </p>

                            <div className="mt-auto grid grid-cols-2 gap-y-10 gap-x-6 border-t border-white/5 pt-10">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Banknote size={10} className="text-indigo-500" /> Capital Ceiling
                                    </div>
                                    <div className="text-xl font-bold text-white font-display">₹{(loan.max_amount / 100000).toFixed(1)}L</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <TrendingUp size={10} className="text-indigo-500" /> Annual Interest
                                    </div>
                                    <div className="text-xl font-bold text-white font-display">{loan.interest_rate}%</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Clock size={10} className="text-indigo-500" /> Max Tenure
                                    </div>
                                    <div className="text-xl font-bold text-white font-display">{loan.tenure_years} Years</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <UserCheck size={10} className="text-indigo-500" /> Entry Income
                                    </div>
                                    <div className="text-xl font-bold text-white font-display">₹{(loan.min_income / 1000).toFixed(0)}K</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Trust */}
            <div className="text-center py-10 opacity-30">
                <div className="flex items-center justify-center gap-8 filter grayscale invert">
                    <ShieldCheck className="w-12 h-12" />
                    <Landmark className="w-12 h-12" />
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-white">Institutional Grade Security Protocol</p>
            </div>
        </div>
    );
};

export default CatalogSection;
