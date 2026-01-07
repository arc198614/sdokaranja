'use client';

import React, { useState } from 'react';
import {
    Download,
    FileSpreadsheet,
    FileText,
    Calendar,
    Filter,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Reports() {
    const reportCategories = [
        {
            title: 'दप्तर तपासणी अहवाल',
            description: 'सर्व झालेल्या तपासण्यांची एकत्रित माहिती (Excel/PDF)',
            icon: FileSpreadsheet,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            action: () => alert('Excel अहवाल तयार होत आहे...')
        },
        {
            title: 'सजा निहाय आकडेवारी',
            description: 'प्रत्येक सजाची पूर्तता आणि प्रलंबित कामे',
            icon: BarChart3,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            action: () => alert('सजा अहवाल तयार होत आहे...')
        },
        {
            title: 'त्रुटी आणि पूर्तता चार्ट',
            description: 'सर्वाधिक आढळणाऱ्या त्रुटी आणि त्यांचे विश्लेषण',
            icon: FileText,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            action: () => alert('विश्लेषण अहवाल तयार होत आहे...')
        },
        {
            title: 'मासिक प्रगती अहवाल',
            description: 'महिन्याकाठी झालेल्या सुधारणांचा आढावा',
            icon: Calendar,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            action: () => alert('मासिक अहवाल तयार होत आहे...')
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">विविध अहवाल (Download Reports)</h1>
                    <p className="text-gray-500 mt-2 text-lg">प्रणाली मधील सर्व डेटा विविध फॉरमॅट मध्ये डाउनलोड करा.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold">
                        <Filter size={20} />
                        फिल्टर लावा
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold">
                        <Download size={20} />
                        सर्व अहवाल झिप करा
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportCategories.map((report, idx) => {
                    const Icon = report.icon;
                    return (
                        <div
                            key={idx}
                            onClick={report.action}
                            className="premium-card p-8 flex items-start gap-6 cursor-pointer group hover:scale-[1.02] transition-all"
                        >
                            <div className={cn("p-5 rounded-2xl shrink-0 group-hover:scale-110 transition-transform", report.bg)}>
                                <Icon className={report.color} size={32} />
                            </div>
                            <div className="space-y-2 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {report.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    {report.description}
                                </p>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold pt-2 invisible group-hover:visible translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                    डाउनलोड करा <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="premium-card p-10 bg-slate-900 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold italic opacity-90">टिप (Note):</h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                सर्व अहवाल गुगल शीटवरील ताज्या माहितीनुसार तयार केले जातात.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                जर माहिती जुनी दिसत असेल तर गुगल शीटमध्ये जाऊन रिफ्रेश करा.
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                PDF अहवालासाठी इंटरनेट कनेक्शन असणे अनिवार्य आहे.
                            </li>
                        </ul>
                    </div>
                    <div className="p-8 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10 flex flex-col items-center gap-4 text-center">
                        <div className="text-sm font-bold uppercase tracking-widest text-indigo-400">एकूण डाउनलोड्स</div>
                        <div className="text-5xl font-black">१,२४८</div>
                        <div className="text-xs text-slate-400">गेल्या ७ दिवसात</div>
                    </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
            </div>
        </div>
    );
}
