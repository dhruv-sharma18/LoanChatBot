import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, ShieldCheck, Zap, Share2, Info, ChevronRight, Calculator, PieChart, Activity, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLoanDna } from '../api';

const FieldLabel = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
        {Icon && <Icon className="w-3 h-3" style={{ color: 'var(--amber)' }} />}
        {children}
    </label>
);

const inputStyle = {
    width: '100%',
    background: 'white',
    border: '1.5px solid var(--border)',
    borderRadius: '12px',
    padding: '10px 14px',
    color: 'var(--ink)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'all 0.2s',
};

// ── Radar Chart Component ──
const RadarChart = ({ scores }) => {
    const dimensions = [
        { key: 'spend', label: 'Spending' },
        { key: 'save', label: 'Savings' },
        { key: 'credit', label: 'Credit' },
        { key: 'stability', label: 'Stability' },
        { key: 'growth', label: 'Growth' },
    ];

    const size = 300;
    const center = size / 2;
    const radius = 100;

    const getPoint = (index, value) => {
        const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
        const dist = (value / 100) * radius;
        return {
            x: center + dist * Math.cos(angle),
            y: center + dist * Math.sin(angle)
        };
    };

    const pathData = dimensions.map((d, i) => {
        const p = getPoint(i, scores[d.key] || 50);
        return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    }).join(' ') + ' Z';

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Background Circles */}
                {[20, 100].map(r => (
                    <circle key={r} cx={center} cy={center} r={(r / 100) * radius}
                        fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {/* Axis lines */}
                {dimensions.map((d, i) => {
                    const p = getPoint(i, 100);
                    return (
                        <g key={d.key}>
                            <line x1={center} y1={center} x2={p.x} y2={p.y} stroke="var(--border)" strokeWidth="1" />
                            <text x={center + (radius + 25) * Math.cos((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)}
                                y={center + (radius + 25) * Math.sin((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)}
                                textAnchor="middle" style={{ fontSize: '10px', fontWeight: 600, fill: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {d.label}
                            </text>
                        </g>
                    );
                })}

                {/* Data Polygon */}
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={pathData}
                    fill="rgba(200,135,44,0.15)"
                    stroke="var(--amber)"
                    strokeWidth="2.5"
                />
            </svg>
        </div>
    );
};

// ── DNA Strand Component ──
const DnaStrand = ({ sequence }) => {
    const colors = {
        adenine: '#4A6741', // Sage
        thymine: '#C8872C', // Amber
        cytosine: '#C0534A', // Rose
        guanine: '#2E3A24', // deep ink
    };

    return (
        <div className="flex justify-center py-6 h-64 overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 relative">
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-slate-400" />
                <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Generated DNA Structure</span>
            </div>

            <div className="flex flex-col gap-4 relative mt-8">
                {sequence.map((node, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-8"
                    >
                        <motion.div
                            animate={{ x: [Math.sin(i) * 20, Math.sin(i + Math.PI) * 20, Math.sin(i) * 20] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{ background: colors[node.type] || 'var(--amber)', opacity: node.intensity }}
                        />
                        <div className="w-12 h-0.5 bg-slate-200" />
                        <motion.div
                            animate={{ x: [Math.sin(i + Math.PI) * 20, Math.sin(i) * 20, Math.sin(i + Math.PI) * 20] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 rounded-full shadow-lg"
                            style={{ background: colors[node.type] || 'var(--amber)', opacity: node.intensity }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const DnaSection = () => {
    const [formData, setFormData] = useState({
        income: 65000,
        expenses: 25000,
        existing_emi: 5000,
        cibil_score: 780,
        savings: 150000,
        employment_status: 'Salaried',
        goal: 'Buying a home within 2 years'
    });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await getLoanDna(formData);
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

    if (result) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                            Financial DNA Report
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: 4 }}>
                            AI-generated synthesis of your financial genome and strategy.
                        </p>
                    </div>
                    <button onClick={() => setResult(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors">
                        Run New Analysis
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Visualization */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
                            <RadarChart scores={result.scores} />
                        </div>

                        <DnaStrand sequence={result.dna_sequence} />
                    </div>

                    {/* Right: Insights & Strategy */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <Zap className="w-5 h-5 text-amber-400 opacity-50" />
                            </div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--amber-light)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>
                                Smart Strategy
                            </div>
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Personalized Financial Blueprint</h3>
                            <p className="text-slate-300 leading-relaxed text-sm italic">
                                "{result.strategy}"
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {result.insights.map((insight, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                                            <Info className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <h4 className="font-bold text-sm mb-2 text-slate-800">{insight.title}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{insight.description}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Impact</div>
                                        <div className="text-xs font-semibold text-amber-600">{insight.impact}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-4 py-8">
                            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-amber-600 transition-colors">
                                <Share2 className="w-4 h-4" /> Export DNA Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-4">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Advanced AI Simulation</span>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                    Sequence Your Loan DNA
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: 12, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
                    Enter your financial metrics to generate a personalized genetic map of your borrowing power and intelligence.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" />

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 relative">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                            <h3 className="font-bold text-slate-800 text-lg">Vital Stats</h3>
                        </div>

                        <div>
                            <FieldLabel icon={Activity}>Monthly Income</FieldLabel>
                            <input type="number" value={formData.income} onChange={set('income')} style={inputStyle} />
                        </div>

                        <div>
                            <FieldLabel icon={PieChart}>Monthly Expenses</FieldLabel>
                            <input type="number" value={formData.expenses} onChange={set('expenses')} style={inputStyle} />
                        </div>

                        <div>
                            <FieldLabel icon={Calculator}>Current Debt Obligations (EMI)</FieldLabel>
                            <input type="number" value={formData.existing_emi} onChange={set('existing_emi')} style={inputStyle} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-sage rounded-full" />
                            <h3 className="font-bold text-slate-800 text-lg">Financial Pillars</h3>
                        </div>

                        <div>
                            <FieldLabel icon={ShieldCheck}>CIBIL / Credit Score</FieldLabel>
                            <input type="number" value={formData.cibil_score} onChange={set('cibil_score')} style={inputStyle} />
                        </div>

                        <div>
                            <FieldLabel icon={Zap}>Total Liquidable Savings</FieldLabel>
                            <input type="number" value={formData.savings} onChange={set('savings')} style={inputStyle} />
                        </div>

                        <div>
                            <FieldLabel icon={TrendingUp}>Ultimate Financial Goal</FieldLabel>
                            <input type="text" value={formData.goal} onChange={set('goal')} style={inputStyle} placeholder="e.g. Buying a Tesla, Education in UK..." />
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center">
                    <button type="submit" disabled={isLoading}
                        className="group relative px-12 py-5 bg-slate-900 rounded-full text-white font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <div className="absolute inset-0 rounded-full bg-amber-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                        <span className="relative flex items-center gap-3 text-sm tracking-widest uppercase">
                            {isLoading ? 'Sequencing DNA...' : (
                                <>
                                    Analyze My DNA <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-6 uppercase tracking-tight">Requires Anthropic API Access • Claude 3.5 Sonnet Analysis</p>
                </div>
            </form>
        </div>
    );
};

export default DnaSection;
