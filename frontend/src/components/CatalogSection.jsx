import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, Banknote, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getLoans } from '../api';

const typeIcons = {
    Personal: '◈',
    Home: '⌂',
    Business: '◆',
    Education: '◉',
};

const typeColors = {
    Personal: { bg: '#FFF5E8', border: 'rgba(200,135,44,0.25)', dot: 'var(--amber)' },
    Home: { bg: '#EEF4EC', border: 'rgba(74,103,65,0.25)', dot: 'var(--sage)' },
    Business: { bg: '#F0EEF5', border: 'rgba(80,65,120,0.25)', dot: '#6B5FA0' },
    Education: { bg: '#EEF1F5', border: 'rgba(55,85,140,0.25)', dot: '#3755A0' },
};

const perks = {
    Personal: ['No collateral required', 'Instant disbursal', 'Flexible repayment'],
    Home: ['Tax benefits available', 'Lowest interest rates', 'Up to 30-year tenure'],
    Business: ['Working capital support', 'Growth financing', 'Overdraft facility'],
    Education: ['Moratorium period', 'No prepayment penalty', 'Abroad studies covered'],
};

const CatalogSection = () => {
    const [loans, setLoans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getLoans().then(data => {
            setLoans(data);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-8 h-8 border-2 rounded-full animate-spin"
                    style={{ borderColor: 'var(--cream-mid)', borderTopColor: 'var(--amber)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Loading products…</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-7">

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                        Loan Products
                    </div>
                    <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 5 }}>
                        {loans.length} financial instruments available — click any card to explore.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--cream-dark)', border: '1px solid var(--border)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sage)' }} />
                    Live market rates
                </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-5">
                {loans.map((loan, index) => {
                    const colors = typeColors[loan.type] || typeColors.Personal;
                    const isSelected = selected === loan.type;
                    return (
                        <motion.div
                            key={loan.type}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            onClick={() => setSelected(isSelected ? null : loan.type)}
                            className="rounded-2xl p-6 cursor-pointer transition-all"
                            style={{
                                background: isSelected ? colors.bg : 'white',
                                border: `1.5px solid ${isSelected ? colors.border : 'var(--border)'}`,
                                boxShadow: isSelected ? `0 4px 20px rgba(0,0,0,0.06)` : '0 1px 3px rgba(0,0,0,0.04)',
                                transform: isSelected ? 'translateY(-2px)' : 'none',
                            }}
                            onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.boxShadow = '0 3px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; } }}
                            onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                                        style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, color: colors.dot }}>
                                        {typeIcons[loan.type] || '◈'}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1 }}>
                                            {loan.type} Loan
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{loan.description}</div>
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                    style={{ background: isSelected ? colors.bg : 'var(--cream)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                                    <ArrowUpRight className="w-3.5 h-3.5" style={{ transform: isSelected ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {[
                                    { icon: Banknote, label: 'Max Amount', val: `₹${(loan.max_amount / 100000).toFixed(0)}L` },
                                    { icon: TrendingUp, label: 'Interest p.a', val: `${loan.interest_rate}%` },
                                    { icon: Clock, label: 'Tenure', val: `${loan.tenure_years} Yrs` },
                                ].map(({ icon: Icon, label, val }) => (
                                    <div key={label} className="text-center py-3 rounded-xl"
                                        style={{ background: 'var(--cream)', border: '1px solid var(--border)' }}>
                                        <div style={{ fontSize: '1rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{val}</div>
                                        <div style={{ fontSize: '0.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Eligibility bar */}
                            <div className="flex items-center justify-between"
                                style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Age {loan.min_age}–{loan.max_age}
                                    </span>
                                    <span>· CIBIL {loan.min_cibil}+</span>
                                    <span>· ₹{(loan.min_income / 1000).toFixed(0)}K/mo income</span>
                                </div>
                            </div>

                            {/* Expanded perks */}
                            {isSelected && perks[loan.type] && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-4 pt-4 space-y-2"
                                    style={{ borderTop: `1px solid ${colors.border}` }}>
                                    {perks[loan.type].map((perk) => (
                                        <div key={perk} className="flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: colors.dot }} />
                                            <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>{perk}</span>
                                        </div>
                                    ))}
                                    <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                                        style={{ background: 'var(--ink)', color: 'var(--cream)', fontSize: '0.78rem' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--ink-soft)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
                                        onClick={e => e.stopPropagation()}>
                                        Apply Now
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="text-center pt-4 pb-2" style={{ borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    All rates are indicative · Subject to RBI guidelines · T&C Apply
                </p>
            </div>
        </div>
    );
};

export default CatalogSection;