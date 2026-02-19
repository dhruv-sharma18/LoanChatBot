import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ChevronRight, User, Briefcase, Wallet, Target, CreditCard, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkEligibility, getLoans } from '../api';

const EligibilitySection = () => {
    const [formData, setFormData] = useState({
        loan_type: 'Personal',
        age: 25,
        income: 30000,
        cibil_score: 750,
        employment_status: 'Salaried'
    });
    const [loanTypes, setLoanTypes] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        getLoans().then(setLoanTypes).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        try {
            const data = await checkEligibility(formData);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
                <h2 className="text-3xl font-black text-white font-display tracking-tight">Eligibility Evaluation</h2>
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: result ? '100%' : '50%' }}
                            className="h-full bg-indigo-600"
                        />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        {result ? 'Evaluation Complete' : 'Data Entry In Progress'}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Form Module */}
                <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Target size={12} className="text-indigo-600" /> Loan Offering
                                </label>
                                <select
                                    value={formData.loan_type}
                                    onChange={e => setFormData({ ...formData, loan_type: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-semibold text-sm hover:bg-slate-800"
                                >
                                    {loanTypes.map(l => <option key={l.type} value={l.type} className="bg-slate-900">{l.type} Loan</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Briefcase size={12} className="text-indigo-600" /> Occupation State
                                </label>
                                <select
                                    value={formData.employment_status}
                                    onChange={e => setFormData({ ...formData, employment_status: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-semibold text-sm hover:bg-slate-800"
                                >
                                    <option className="bg-slate-900">Salaried Professional</option>
                                    <option className="bg-slate-900">Self-Employed Entrepreneur</option>
                                    <option className="bg-slate-900">Corporate Director</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Age Identity</label>
                                <input
                                    type="number" value={formData.age}
                                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                                    className="w-full bg-slate-800/50 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-semibold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Credit (CIBIL)</label>
                                <input
                                    type="number" value={formData.cibil_score}
                                    onChange={e => setFormData({ ...formData, cibil_score: Number(e.target.value) })}
                                    className="w-full bg-slate-800/50 border border-white/5 text-white p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-semibold text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Wallet size={12} className="text-indigo-600" /> Net Monthly Inflow
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                                <input
                                    type="number" value={formData.income}
                                    onChange={e => setFormData({ ...formData, income: Number(e.target.value) })}
                                    className="w-full bg-slate-800/50 border border-white/5 text-white pl-10 pr-4 py-4 rounded-2xl outline-none focus:border-indigo-500 group-hover:bg-slate-800 font-semibold transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-white text-slate-950 hover:bg-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>Initialize Verification <ChevronRight size={16} /></>
                        )}
                    </button>
                </form>

                {/* Result Module */}
                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${result.is_eligible
                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                        : 'bg-rose-500/5 border-rose-500/20'
                                    }`}
                            >
                                {/* Results Branding */}
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShieldCheck size={120} />
                                </div>

                                <div className="relative z-10 space-y-8">
                                    <div className={`p-4 inline-flex rounded-2xl ${result.is_eligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {result.is_eligible ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className={`text-2xl font-black font-display tracking-tight ${result.is_eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {result.is_eligible ? 'Qualified for Funding' : 'Evaluation Deferred'}
                                        </h3>
                                        <p className="text-slate-300 font-medium leading-relaxed">{result.message}</p>
                                    </div>

                                    {result.is_eligible && result.max_amount && (
                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                            <div className="flex justify-between items-end">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Max Pre-Approved Limit</span>
                                                    <div className="text-4xl font-extrabold text-white font-display tracking-tight">
                                                        ₹ {result.max_amount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <CreditCard size={20} className="text-white" />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Validity: 48 Hours • Instant Disbursal Available</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center">
                                    <Landmark className="text-slate-600 w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Evaluation Module</h4>
                                    <p className="text-sm text-slate-600 font-medium max-w-[200px]">Complete the secure data integration to see your status.</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Pro Tips Section */}
                    <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-2xl">
                        <h4 className="font-bold mb-4">Optimization Strategy</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black text-xs">01</div>
                                <p className="text-xs font-semibold opacity-90 leading-relaxed">Increasing your reported monthly income by adding secondary revenue sources improves pre-approval limits by 30%.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-black text-xs">02</div>
                                <p className="text-xs font-semibold opacity-90 leading-relaxed">A CIBIL score above 780 unlocks our "Elite tier" with Zero processing fees.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilitySection;
