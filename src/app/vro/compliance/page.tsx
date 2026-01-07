'use client';

import React, { useState } from 'react';
import {
    Upload,
    CheckCircle,
    AlertCircle,
    FileText,
    Send,
    Link as LinkIcon,
    X,
    Image as ImageIcon,
    File,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const pendingTasks = [
    { id: 'Q1', text: 'सजा डायरी अद्ययावत आहे का?', dept: 'महसूल', mandatory: true },
    { id: 'Q2', text: 'सातबारा संगणकीकरण पूर्ण झाले आहे का?', dept: 'महसूल', mandatory: true },
    { id: 'Q3', text: 'गाव नमुना नंबर १ ते २१ दप्तरी नोंद आहे का?', dept: 'नोंदणी', mandatory: false },
];

export default function VROCompliance() {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [complianceText, setComplianceText] = useState('');
    const [taskFiles, setTaskFiles] = useState<Record<string, { name: string, type: string, url?: string, uploading: boolean }[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedTask) return;

        // Add to local state as uploading
        const fileId = Math.random().toString(36).substr(2, 9);
        const newFileData = { name: file.name, type: file.type, uploading: true };

        setTaskFiles(prev => ({
            ...prev,
            [selectedTask]: [...(prev[selectedTask] || []), newFileData]
        }));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('sajaName', 'Compliance_Docs');

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setTaskFiles(prev => ({
                    ...prev,
                    [selectedTask]: prev[selectedTask].map(f =>
                        f.name === file.name ? { ...f, uploading: false, url: data.webViewLink } : f
                    )
                }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('फाईल अपलोड करताना त्रुटी आली.');
        }
    };

    const removeFile = (taskId: string, fileName: string) => {
        setTaskFiles(prev => ({
            ...prev,
            [taskId]: prev[taskId].filter(f => f.name !== fileName)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Final submission logic
        setTimeout(() => {
            setIsSubmitting(false);
            alert('तुमची सर्व पूर्तता आणि कागदपत्रे यशस्वीरित्या सादर करण्यात आली आहेत!');
            setComplianceText('');
            setSelectedTask(null);
        }, 1500);
    };

    const currentTaskFiles = selectedTask ? taskFiles[selectedTask] || [] : [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">पूर्तता आणि अहवाल सादर करा</h1>
                    <p className="text-gray-500 mt-1 text-lg">त्रुटींचे स्पष्टीकरण आणि फोटो/कागदपत्रे येथे अपलोड करा.</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-bold flex items-center gap-2">
                    <CheckCircle size={20} />
                    VRO पोर्टल
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: Task List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <AlertCircle className="text-amber-500" size={24} />
                        प्रलंबित पूर्तता ({pendingTasks.length})
                    </h2>
                    <div className="space-y-3">
                        {pendingTasks.map((task) => {
                            const hasFiles = (taskFiles[task.id]?.length || 0) > 0;
                            return (
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    key={task.id}
                                    onClick={() => setSelectedTask(task.id)}
                                    className={cn(
                                        "premium-card p-5 cursor-pointer border-2 transition-all relative overflow-hidden",
                                        selectedTask === task.id ? "border-indigo-600 bg-indigo-50/30" : "border-transparent"
                                    )}
                                >
                                    {hasFiles && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white p-1 rounded-bl-lg">
                                            <CheckCircle size={14} />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                            {task.dept}
                                        </span>
                                        {task.mandatory && (
                                            <span className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1">
                                                * अनिवार्य
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-bold text-gray-900 leading-snug">{task.text}</p>
                                    {hasFiles && (
                                        <div className="mt-2 flex items-center gap-1 text-sm text-green-600 font-bold">
                                            <FileText size={14} />
                                            {taskFiles[task.id].length} फाईल जोडली
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content: Upload Section */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {selectedTask ? (
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="premium-card p-10 space-y-8"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">
                                        {pendingTasks.find(t => t.id === selectedTask)?.text}
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="block text-lg font-bold text-gray-800">आपले स्पष्टीकरण / पूर्तता अहवाल</label>
                                        <textarea
                                            className="w-full h-40 p-5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg shadow-inner bg-slate-50/50"
                                            placeholder="येथे महिती लिहा... (उदा: सर्व दप्तर अद्ययावत करून कपाटात ठेवण्यात आले आहे.)"
                                            value={complianceText}
                                            onChange={(e) => setComplianceText(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-lg font-bold text-gray-800">फोटो किंवा कागदपत्रे जोडा (Max 3)</label>

                                        {/* File List */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {currentTaskFiles.map((file, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm group">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                                            {file.type.includes('image') ? <ImageIcon size={20} /> : <File size={20} />}
                                                        </div>
                                                        <span className="font-bold text-gray-700 truncate text-sm">{file.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {file.uploading ? (
                                                            <Loader2 size={18} className="animate-spin text-indigo-500" />
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(selectedTask, file.name)}
                                                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {currentTaskFiles.length < 3 && (
                                                <label className="border-2 border-dashed border-indigo-200 rounded-2xl p-4 flex items-center justify-center gap-3 bg-indigo-50/20 hover:bg-indigo-50 transition-all cursor-pointer group h-[60px]">
                                                    <Upload className="text-indigo-400 group-hover:text-indigo-600 transition-colors" size={20} />
                                                    <span className="text-indigo-700 font-bold text-sm">दुसरी फाईल जोडा</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                        accept="image/*,application/pdf"
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {currentTaskFiles.length === 0 && (
                                            <label className="border-3 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group">
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload className="text-indigo-500" size={32} />
                                                </div>
                                                <p className="text-gray-700 font-bold text-lg">कागदपत्र निवडण्यासाठी इथे क्लिक करा</p>
                                                <p className="text-gray-400 text-sm mt-1">PDF किंवा इमेज फाईल (Max 5MB)</p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || (pendingTasks.find(t => t.id === selectedTask)?.mandatory && currentTaskFiles.length === 0)}
                                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin" size={24} />
                                            ) : (
                                                <Send size={24} />
                                            )}
                                            {isSubmitting ? 'सादर होत आहे...' : 'पूर्तता सादर करा'}
                                        </button>
                                        <p className="text-center text-gray-400 text-sm mt-4">नोंद: एकदा सबमिट केल्यावर बदल करता येणार नाहीत.</p>
                                    </div>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="premium-card p-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/50"
                            >
                                <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-200 border border-indigo-100">
                                    <FileText size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-800">पूर्तता करण्यासाठी काम निवडा</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto text-lg">
                                        डाव्या बाजूला असलेल्या प्रलंबित कामांपैकी एक निवडून त्याचे स्पष्टीकरण आणि कागदपत्रे जोडा.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
