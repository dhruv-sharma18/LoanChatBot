import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, Info, ArrowRight, Download, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateEMI } from '../api';

const EMISection = () => {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(10.5);
    const [tenure, setTenure] = useState(5);
    const [result, setResult] = useState(null);

    const fetchData = async () => {
        try {
            const data = await calculateEMI(principal, rate, tenure);
            setResult(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
    }, [principal, rate, tenure]);

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full">
            {/* Input Card */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-600/10 rounded-2xl">
                            <BarChart3 className="text-indigo-400 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Loan Parameters</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Adjust values to see real-time impact</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Principal */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <IndianRupee size={14} className="text-indigo-500" /> Principal Amount
                                </label>
                                <span className="text-lg font-black text-white font-display">₹ {principal.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="10000" max="10000000" step="50000"
                                value={principal} onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                <span>10K</span>
                                <span>5M</span>
                                <span>10M</span>
                            </div>
                        </div>

                        {/* Rate */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <Percent size={14} className="text-indigo-500" /> Interest Rate (p.a)
                                </label>
                                <span className="text-lg font-black text-white font-display">{rate}%</span>
                            </div>
                            <input
                                type="range" min="5" max="25" step="0.1"
                                value={rate} onChange={(e) => setRate(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                <span>5%</span>
                                <span>15%</span>
                                <span>25%</span>
                            </div>
                        </div>

                        {/* Tenure */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} className="text-indigo-500" /> Tenure Groups
                                </label>
                                <span className="text-lg font-black text-white font-display">{tenure} Years</span>
                            </div>
                            <input
                                type="range" min="1" max="30" step="1"
                                value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                <span>1 Yr</span>
                                <span>15 Yrs</span>
                                <span>30 Yrs</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/20 border border-white/5 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-slate-800 rounded-lg">
                        <Info className="text-slate-400 w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Values are based on standard amortization formulas. Actual interest rates may vary based on your CIBIL profile and bank policies.
                    </p>
                </div>
            </div>

            {/* Result Card */}
            <div className="lg:col-span-5 relative space-y-6">
                <div className="sticky top-0 space-y-6">
                    <div className="overflow-hidden bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full -mr-16 -mt-16" />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
                            <div className="p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/40">
                                <Calculator className="text-white w-8 h-8" />
                            </div>

                            <AnimatePresence mode="wait">
                                {result ? (
                                    <motion.div
                                        key={result.emi}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-12 w-full"
                                    >
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Monthly Installment</div>
                                            <div className="text-6xl font-black text-white tracking-tighter font-display">
                                                <span className="text-indigo-500 text-3xl align-top mt-2 mr-1">₹</span>
                                                {result.emi.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Interest</div>
                                                <div className="text-lg font-bold text-white font-display">₹{result.total_interest.toLocaleString()}</div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-right">
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Payable</div>
                                                <div className="text-lg font-bold text-white font-display">₹{result.total_payable.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-xl">
                                                Proceed with Application <ArrowRight size={16} />
                                            </button>
                                            <button className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                                                <Download size={16} /> Export Amortization Table
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Processing Parameters...</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <h4 className="font-bold text-lg">Preferential Rates?</h4>
                            <p className="text-sm text-indigo-100 opacity-80 leading-relaxed font-medium">
                                Premium users with CIBIL scores above 800 are eligible for an additional 0.5% interest reduction.
                            </p>
                            <button className="text-xs font-black uppercase tracking-widest underline underline-offset-4">Learn More</button>
                        </div>
                        <ShieldCheck className="absolute bottom-0 right-0 w-32 h-32 text-white/10 -mb-8 -mr-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMISection;
