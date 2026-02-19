import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateEMI } from '../api';

const Stat = ({ label, value, accent }) => (
    <div className="px-5 py-4 rounded-xl" style={{ background: accent ? 'var(--ink)' : 'var(--cream-dark)', border: `1px solid ${accent ? 'transparent' : 'var(--border)'}` }}>
        <div style={{ fontSize: '0.62rem', color: accent ? 'var(--amber-light)' : 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: accent ? '1.6rem' : '1.1rem', fontWeight: 700, color: accent ? 'var(--cream)' : 'var(--ink)', lineHeight: 1 }}>{value}</div>
    </div>
);

const SliderField = ({ label, icon: Icon, value, min, max, step, onChange, display, hint }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <label className="flex items-center gap-2" style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                <Icon className="w-3.5 h-3.5" style={{ color: 'var(--amber)' }} />
                {label}
            </label>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
                {display}
            </span>
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between" style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
            {hint.map((h, i) => <span key={i}>{h}</span>)}
        </div>
    </div>
);

const EMISection = () => {
    const [principal, setPrincipal] = useState(500000);
    const [rate, setRate] = useState(10.5);
    const [tenure, setTenure] = useState(5);
    const [result, setResult] = useState(null);

    useEffect(() => {
        calculateEMI(principal, rate, tenure).then(setResult).catch(console.error);
    }, [principal, rate, tenure]);

    const principalPct = result ? Math.round((principal / result.total_payable) * 100) : 0;
    const interestPct = 100 - principalPct;

    return (
        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">

            {/* Left — Controls */}
            <div className="lg:col-span-3 space-y-5">
                <div className="rounded-2xl p-6 space-y-7"
                    style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--ink)' }}>
                            <Calculator className="w-4 h-4" style={{ color: 'var(--amber-light)' }} />
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>Loan Parameters</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>Adjust values for real-time results</div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <SliderField
                            label="Principal Amount" icon={IndianRupee}
                            value={principal} min={10000} max={10000000} step={50000}
                            onChange={setPrincipal}
                            display={`₹${principal.toLocaleString()}`}
                            hint={['₹10K', '₹50L', '₹1Cr']}
                        />
                        <div style={{ height: 1, background: 'var(--border)' }} />
                        <SliderField
                            label="Interest Rate (p.a)" icon={Percent}
                            value={rate} min={5} max={25} step={0.1}
                            onChange={setRate}
                            display={`${rate.toFixed(1)}%`}
                            hint={['5%', '15%', '25%']}
                        />
                        <div style={{ height: 1, background: 'var(--border)' }} />
                        <SliderField
                            label="Tenure" icon={Calendar}
                            value={tenure} min={1} max={30} step={1}
                            onChange={setTenure}
                            display={`${tenure} Years`}
                            hint={['1 Yr', '15 Yrs', '30 Yrs']}
                        />
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)' }}>
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--muted)' }} />
                    <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                        Calculations are based on standard reducing-balance amortization. Actual rates may vary based on your credit profile and lender policies.
                    </p>
                </div>
            </div>

            {/* Right — Results */}
            <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">

                            {/* Main EMI Card */}
                            <div className="rounded-2xl p-6 text-center"
                                style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: '0.62rem', color: 'var(--amber-light)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.7, marginBottom: 12 }}>
                                    Monthly Installment
                                </div>
                                <div className="flex items-start justify-center gap-1 mb-2">
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--amber)', marginTop: 8, fontWeight: 600 }}>₹</span>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.2rem', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>
                                        {result.emi.toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'rgba(247,242,232,0.3)', letterSpacing: '0.1em' }}>
                                    per month for {tenure} {tenure === 1 ? 'year' : 'years'}
                                </div>

                                {/* Simple bar */}
                                <div className="mt-5 rounded-full overflow-hidden h-1.5 flex" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${principalPct}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className="h-full rounded-l-full"
                                        style={{ background: 'var(--amber)' }}
                                    />
                                    <div className="flex-1 h-full rounded-r-full" style={{ background: 'var(--rose)', opacity: 0.7 }} />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--amber)' }} />
                                        <span style={{ fontSize: '0.6rem', color: 'rgba(247,242,232,0.4)' }}>Principal {principalPct}%</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--rose)', opacity: 0.7 }} />
                                        <span style={{ fontSize: '0.6rem', color: 'rgba(247,242,232,0.4)' }}>Interest {interestPct}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <Stat label="Total Interest" value={`₹${Math.round(result.total_interest).toLocaleString()}`} />
                                <Stat label="Total Payable" value={`₹${Math.round(result.total_payable).toLocaleString()}`} />
                            </div>

                            {/* CTA */}
                            <button className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                                style={{ background: 'var(--amber)', color: 'white', fontSize: '0.82rem', letterSpacing: '0.04em' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--amber-dark)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--amber)'}>
                                Apply for This Loan <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4"
                            style={{ background: 'white', border: '1px solid var(--border)', minHeight: 300 }}>
                            <div className="w-8 h-8 border-2 rounded-full animate-spin"
                                style={{ borderColor: 'var(--cream-mid)', borderTopColor: 'var(--amber)' }} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Computing…</span>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EMISection;