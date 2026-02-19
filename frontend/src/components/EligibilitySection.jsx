import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, ChevronRight, Briefcase, Wallet, Target, CreditCard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkEligibility, getLoans } from '../api';

const FieldLabel = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-2 mb-2" style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
        {Icon && <Icon className="w-3 h-3" style={{ color: 'var(--amber)' }} />}
        {children}
    </label>
);

const inputStyle = {
    width: '100%',
    background: 'var(--cream)',
    border: '1.5px solid var(--border)',
    borderRadius: '12px',
    padding: '10px 14px',
    color: 'var(--ink)',
    fontSize: '0.875rem',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.15s',
};

const EligibilitySection = () => {
    const [formData, setFormData] = useState({
        loan_type: 'Personal',
        age: 28,
        income: 45000,
        cibil_score: 750,
        employment_status: 'Salaried'
    });
    const [loanTypes, setLoanTypes] = useState([]);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const set = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

    return (
        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-7">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                    Eligibility Evaluation
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 6 }}>
                    Determine your loan eligibility in seconds based on your financial profile.
                </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 items-start">

                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 rounded-2xl p-6 space-y-5"
                    style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                    <div>
                        <FieldLabel icon={Target}>Loan Type</FieldLabel>
                        <select value={formData.loan_type} onChange={set('loan_type')} style={inputStyle}>
                            {loanTypes.map(l => <option key={l.type} value={l.type}>{l.type} Loan</option>)}
                        </select>
                    </div>

                    <div>
                        <FieldLabel icon={Briefcase}>Employment Status</FieldLabel>
                        <select value={formData.employment_status} onChange={set('employment_status')} style={inputStyle}>
                            {['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel icon={User}>Age</FieldLabel>
                            <input type="number" value={formData.age} onChange={set('age')}
                                style={inputStyle} min={18} max={70}
                                onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                        </div>
                        <div>
                            <FieldLabel icon={CreditCard}>CIBIL Score</FieldLabel>
                            <input type="number" value={formData.cibil_score} onChange={set('cibil_score')}
                                style={inputStyle} min={300} max={900}
                                onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                        </div>
                    </div>

                    <div>
                        <FieldLabel icon={Wallet}>Monthly Income (₹)</FieldLabel>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>₹</span>
                            <input type="number" value={formData.income} onChange={set('income')}
                                style={{ ...inputStyle, paddingLeft: '26px' }}
                                onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
                        style={{ background: isLoading ? 'var(--cream-mid)' : 'var(--ink)', color: isLoading ? 'var(--muted)' : 'var(--cream)', fontSize: '0.82rem', letterSpacing: '0.04em' }}
                        onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = 'var(--ink-soft)'; }}
                        onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = 'var(--ink)'; }}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--muted)', borderTopColor: 'transparent' }} />
                                Evaluating…
                            </>
                        ) : (
                            <>
                                Check Eligibility <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Results */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                <div className="rounded-2xl p-6 space-y-5"
                                    style={{
                                        background: result.is_eligible ? 'rgba(74,103,65,0.06)' : 'rgba(192,83,74,0.05)',
                                        border: `1.5px solid ${result.is_eligible ? 'rgba(74,103,65,0.25)' : 'rgba(192,83,74,0.25)'}`,
                                    }}>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: result.is_eligible ? 'rgba(74,103,65,0.12)' : 'rgba(192,83,74,0.1)' }}>
                                            {result.is_eligible
                                                ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--sage)' }} />
                                                : <XCircle className="w-5 h-5" style={{ color: 'var(--rose)' }} />
                                            }
                                        </div>
                                        <div>
                                            <div style={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: '1.05rem', fontWeight: 700,
                                                color: result.is_eligible ? 'var(--sage)' : 'var(--rose)'
                                            }}>
                                                {result.is_eligible ? 'Eligible for Loan' : 'Not Eligible'}
                                            </div>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.06em', marginTop: 1 }}>
                                                {formData.loan_type} Loan · {formData.employment_status}
                                            </div>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                                        {result.message}
                                    </p>

                                    {result.is_eligible && result.max_amount && (
                                        <div className="rounded-xl p-4"
                                            style={{ background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--amber-light)', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>
                                                Pre-Approved Limit
                                            </div>
                                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--cream)', lineHeight: 1 }}>
                                                ₹{result.max_amount.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.62rem', color: 'rgba(247,242,232,0.3)', marginTop: 4 }}>
                                                Valid 48 hrs · Instant disbursal available
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="rounded-2xl flex flex-col items-center justify-center gap-4 py-16"
                                style={{ background: 'white', border: '1.5px dashed var(--border)', minHeight: 260 }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)' }}>
                                    <ShieldCheck className="w-6 h-6" style={{ color: 'var(--muted)' }} />
                                </div>
                                <div className="text-center">
                                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 4 }}>
                                        Awaiting Input
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', maxWidth: 180, lineHeight: 1.5 }}>
                                        Fill in your details and click Check Eligibility
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tips */}
                    <div className="rounded-2xl p-5 space-y-3"
                        style={{ background: 'var(--amber-pale)', border: '1px solid rgba(200,135,44,0.2)' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--amber-dark)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                            Improvement Tips
                        </div>
                        {[
                            'A CIBIL score above 780 unlocks zero processing fees.',
                            'Adding secondary income sources can increase your approved limit by up to 30%.',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                                    style={{ background: 'rgba(200,135,44,0.15)', fontSize: '0.6rem', fontWeight: 700, color: 'var(--amber-dark)' }}>
                                    {i + 1}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilitySection;