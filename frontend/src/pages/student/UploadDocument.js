import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
    FaCloudUploadAlt, FaIdCard, FaUser, FaPhone, FaEnvelope,
    FaBuilding, FaFileSignature, FaFileAlt, FaCheckCircle,
    FaExclamationCircle, FaArrowRight, FaArrowLeft, FaTrash, FaFingerprint
} from 'react-icons/fa';

const ProgressBar = ({ currentStep }) => {
    const steps = ['Identity', 'Validation', 'Submission'];
    return (
        <div className="flex justify-center items-center mb-12 space-x-4 lg:space-x-8">
            {steps.map((text, index) => (
                <div key={text} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${index + 1 < currentStep ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                            index + 1 === currentStep ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' :
                                'bg-white border-slate-100 text-slate-300'
                            }`}>
                            {index + 1 < currentStep ? <FaCheckCircle /> : index + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-3 transition-opacity duration-300 ${index + 1 === currentStep ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-60'
                            }`}>
                            {text}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 lg:w-16 h-0.5 mt-[-18px] ml-4 transition-colors duration-500 ${index + 1 < currentStep ? 'bg-emerald-500' : 'bg-slate-100'
                            }`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

const InputField = ({ label, icon: Icon, name, type = "text", placeholder, required = true, value, onChange, error }) => (
    <div className="space-y-1">
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Icon className={`text-lg transition-colors duration-200 ${error ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                autoComplete="off"
                placeholder=" "
                required={required}
                className={`block w-full pl-12 pr-4 pt-6 pb-2 bg-slate-50 border rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 transition-all duration-200 peer ${error
                        ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500'
                        : 'border-slate-100 focus:ring-blue-500/10 focus:border-blue-500'
                    }`}
            />
            <label className={`absolute left-12 top-4 text-xs font-black uppercase tracking-widest transition-all duration-200 pointer-events-none
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-blue-500 peer-active:top-1.5
                ${value ? 'top-1.5 text-[10px] text-slate-400' : ''}`}>
                {label}
            </label>
        </div>
        {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
);

const UploadDocument = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        regNo: '',
        department: '',
        documentId: '',
        documentType: 'Marksheet'
    });
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.firstName) newErrors.firstName = 'Institutional First Name is required';
            if (!formData.lastName) newErrors.lastName = 'Institutional Last Name is required';
            if (!formData.email) newErrors.email = 'Academic Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid institutional email format';
            if (!formData.phoneNumber) newErrors.phoneNumber = 'Contact number is required';
        } else if (currentStep === 2) {
            if (!formData.regNo) newErrors.regNo = 'Registration ID is required';
            if (!formData.department) newErrors.department = 'Department selection is mandatory';
            if (!formData.documentId) newErrors.documentId = 'Document Unique ID is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;

        // Basic file validation
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size exceeds the 5MB institutional limit.');
            return;
        }

        setFile(selectedFile);
        setError('');

        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setFilePreview(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setFilePreview(null);
        }
    };

    const handleFileChange = (e) => handleFile(e.target.files[0]);

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const nextStep = () => {
        if (validateStep(step)) {
            if (step < 3) setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload the source file before finalizing submission.');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('file', file);

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/docs/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Electronic submission confirmed. Relaying to institutional validators.');
            setTimeout(() => navigate('/student/my-documents'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Database integrity error or network interruption.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 mt-4 px-4 sm:px-0">
            {/* Header Section */}
            <div className="mb-12 text-center animate-in fade-in slide-in-from-top-6 duration-700">
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 border border-blue-100">
                    Institutional Protocol v4.2
                </span>
                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">Verification Entry</h1>
                <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Digitize and secure your academic records with institutional-grade verification and SHA-256 fingerprinting.</p>
            </div>

            <ProgressBar currentStep={step} />

            <div className="glass-card border-none overflow-hidden relative shadow-2xl shadow-blue-900/10">
                {/* Header Badge */}
                <div className="px-10 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <FaFingerprint className="mr-2 text-blue-600 animate-pulse" /> Secure Submission Active
                    </span>
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">AES-256 Ready</span>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            Step {step} / 3
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-12" autoComplete="off">
                    {message && (
                        <div className="mb-10 p-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-[1.5rem] flex items-center space-x-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                                <FaCheckCircle className="text-xl" />
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-[0.15em] mb-0.5">Submission Transmitted</p>
                                <p className="text-emerald-600/70 text-[11px] font-bold">{message}</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="mb-10 p-6 bg-rose-50 border border-rose-100 text-rose-700 rounded-[1.5rem] flex items-center space-x-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                                <FaExclamationCircle className="text-xl" />
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-[0.15em] mb-0.5">Protocol Interrupted</p>
                                <p className="text-rose-600/70 text-[11px] font-bold">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: Personal Details */}
                    {step === 1 && (
                        <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                            <div className="flex items-center space-x-4 pb-2 border-b border-slate-50">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Institutional Identity</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="Institutional First Name" icon={FaUser} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name as per records" error={errors.firstName} />
                                <InputField label="Institutional Last Name" icon={FaUser} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name as per records" error={errors.lastName} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="Academic Email Address" icon={FaEnvelope} name="email" value={formData.email} onChange={handleChange} type="email" placeholder="e.g. name@university.edu" error={errors.email} />
                                <InputField label="Institutional Contact" icon={FaPhone} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Active mobile number" error={errors.phoneNumber} />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Academic Details */}
                    {step === 2 && (
                        <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                            <div className="flex items-center space-x-4 pb-2 border-b border-slate-50">
                                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Academic Context</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="Registration / Roll ID" icon={FaIdCard} name="regNo" value={formData.regNo} onChange={handleChange} placeholder="Institutional ID number" error={errors.regNo} />
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                            <FaBuilding className={`text-lg ${errors.department ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} />
                                        </div>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className={`block w-full pl-12 pr-4 pt-6 pb-2 bg-slate-50 border rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${errors.department ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500' : 'border-slate-100 focus:ring-blue-500/10 focus:border-blue-500'
                                                }`}
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="CSE">Computer Science & Engineering</option>
                                            <option value="ECE">Electronics & Communication</option>
                                            <option value="EEE">Electrical & Electronics</option>
                                            <option value="MECH">Mechanical Engineering</option>
                                            <option value="CIVIL">Civil Engineering</option>
                                            <option value="IT">Information Technology</option>
                                        </select>
                                        <label className={`absolute left-12 top-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400`}>
                                            Academic Department
                                        </label>
                                    </div>
                                    {errors.department && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-4">{errors.department}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="Certificate Serial Number" icon={FaFileSignature} name="documentId" value={formData.documentId} onChange={handleChange} placeholder="Unique document ID" error={errors.documentId} />
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                            <FaFileAlt className="text-lg text-slate-300 group-focus-within:text-blue-500" />
                                        </div>
                                        <select
                                            name="documentType"
                                            value={formData.documentType}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 pt-6 pb-2 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                                        >
                                            <option value="Marksheet">Marksheet (Academic Record)</option>
                                            <option value="Bonafide">Bonafide Certificate</option>
                                            <option value="Degree Certificate">Degree Certification</option>
                                            <option value="Transfer Certificate">Transfer Certificate</option>
                                            <option value="Other">Other Institutional Document</option>
                                        </select>
                                        <label className={`absolute left-12 top-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400`}>
                                            Document Classification
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: File Upload */}
                    {step === 3 && (
                        <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
                            <div className="flex items-center space-x-4 pb-2 border-b border-slate-50">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Source File Transmission</h2>
                            </div>
                            <div
                                className={`relative group border-4 border-dashed rounded-[3rem] p-12 lg:p-20 text-center transition-all duration-500 ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02] shadow-2xl shadow-blue-500/10' :
                                    file ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50/50'
                                    }`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf, .jpg, .jpeg, .png" />

                                {file ? (
                                    <div className="flex flex-col items-center space-y-8 animate-in zoom-in duration-300">
                                        {filePreview ? (
                                            <div className="relative w-48 h-48 group/preview">
                                                <img src={filePreview} alt="Preview" className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-4 border-white" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/preview:opacity-100 transition-opacity rounded-[2.5rem] flex items-center justify-center backdrop-blur-sm">
                                                    <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="p-5 bg-rose-500 text-white rounded-2xl shadow-xl hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all">
                                                        <FaTrash className="text-xl" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-40 h-40 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-center relative group/preview">
                                                <FaFileAlt className="text-5xl text-blue-500" />
                                                <div className="absolute inset-0 bg-slate-900/5 rotate-6 rounded-[2.5rem] -z-10"></div>
                                                <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="absolute -top-3 -right-3 p-3.5 bg-rose-500 text-white rounded-2xl shadow-xl opacity-0 group-hover/preview:opacity-100 transition-all hover:bg-rose-600">
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="text-center space-y-2">
                                            <p className="text-xl font-black text-slate-900 tracking-tight">{file.name}</p>
                                            <div className="flex items-center justify-center space-x-3">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Awaiting SHA-256 Hashing</span>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => fileInputRef.current.click()} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">Change Document Source</button>
                                    </div>
                                ) : (
                                    <div className="cursor-pointer flex flex-col items-center group/uploader" onClick={() => fileInputRef.current.click()}>
                                        <div className="w-28 h-28 bg-white rounded-[3rem] shadow-xl border border-slate-50 flex items-center justify-center mb-8 group-hover/uploader:scale-110 group-hover/uploader:shadow-blue-500/10 transition-all duration-500 ring-[12px] ring-slate-50/50">
                                            <FaCloudUploadAlt className="text-5xl text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Initialize Digital Scan</h3>
                                        <p className="text-slate-500 font-medium text-lg max-w-xs">Drag files here or click to browse institutional storage</p>
                                        <div className="mt-10 flex items-center space-x-4">
                                            {['PDF', 'JPG', 'PNG'].map(fmt => (
                                                <span key={fmt} className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 group-hover/uploader:border-blue-200 group-hover/uploader:bg-blue-50 transition-colors">{fmt}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-16 flex flex-col-reverse sm:flex-row items-center gap-6">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-full sm:w-auto px-12 py-5 bg-white text-slate-400 font-black uppercase tracking-widest border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 text-xs flex items-center justify-center"
                            >
                                <FaArrowLeft className="mr-3" /> Previous Step
                            </button>
                        )}
                        <div className="flex-1"></div>
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full sm:w-80 px-12 py-5 bg-blue-600 text-white font-black uppercase tracking-widest border border-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:translate-y-[-2px] transition-all active:scale-95 text-xs flex items-center justify-center group"
                            >
                                Validate & Continue <FaArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading || !file}
                                className={`w-full sm:w-80 px-12 py-5 bg-slate-950 text-white font-black uppercase tracking-widest border border-slate-950 rounded-2xl shadow-2xl transition-all active:scale-95 text-xs flex items-center justify-center ${(loading || !file) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-600 hover:translate-y-[-2px]'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                                        Processing Protocol...
                                    </>
                                ) : (
                                    <>
                                        Finalize Submission <FaCheckCircle className="ml-3" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="mt-12 flex flex-col items-center space-y-6">
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black opacity-40">
                    Institutional Documentation Protocol v4.2 • Secure Node Active
                </p>
                <div className="flex items-center space-x-8 opacity-20 grayscale hover:grayscale-0 transition-all">
                    <div className="h-6 w-px bg-slate-300"></div>
                </div>
            </div>
        </div>
    );
};

export default UploadDocument;
