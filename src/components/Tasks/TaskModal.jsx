import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  Award, 
  FileText, 
  Link as LinkIcon, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  File, 
  ExternalLink,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import { StatusBadge, FormatBadge } from '../UI/Badge';
import confetti from 'canvas-confetti';
import { dbService } from '../../services/dbService';

export function TaskModal({ task, isOpen, onClose, onSubmitTask }) {
  if (!isOpen || !task) return null;

  // Form states based on submissionType
  const [linkInput, setLinkInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // If already completed, populate existing submission data for viewing
  useEffect(() => {
    if (task.status === 'completed' && task.submissionData) {
      if (task.submissionData.link) setLinkInput(task.submissionData.link);
      if (task.submissionData.text) setTextInput(task.submissionData.text);
      if (task.submissionData.fileName) {
        setUploadedFile({
          name: task.submissionData.fileName,
          size: task.submissionData.fileSize || '2.4 MB'
        });
      }
    } else {
      setLinkInput('');
      setTextInput('');
      setUploadedFile(null);
      setFormError('');
      setIsSuccess(false);
    }
  }, [task]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file) => {
    setFormError('');
    // Format human readable size
    const sizeKB = Math.round(file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    setUploadedFile({
      name: file.name,
      size: sizeText,
      rawFile: file
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    let submissionData = {};

    if (task.submissionType === 'link') {
      if (!linkInput.trim()) {
        setFormError('Please enter a valid submission URL.');
        return;
      }
      if (!linkInput.startsWith('http://') && !linkInput.startsWith('https://')) {
        setFormError('URL must start with http:// or https://');
        return;
      }
      submissionData = { link: linkInput.trim() };
    } else if (task.submissionType === 'text') {
      if (!textInput.trim() || textInput.trim().length < 20) {
        setFormError('Please provide a substantive response (at least 20 characters).');
        return;
      }
      submissionData = { text: textInput.trim() };
    } else if (task.submissionType === 'file') {
      if (!uploadedFile) {
        setFormError('Please select or drop a file to upload before submitting.');
        return;
      }

      setIsSubmitting(true);
      try {
        if (uploadedFile.rawFile) {
          const uploadRes = await dbService.uploadFile(uploadedFile.rawFile);
          submissionData = {
            fileName: uploadRes.fileName || uploadedFile.name,
            fileSize: uploadRes.fileSize || uploadedFile.size,
            fileUrl: uploadRes.fileUrl || null
          };
        } else {
          submissionData = {
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size
          };
        }
      } catch (err) {
        submissionData = {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size
        };
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully
      }

      onSubmitTask(task.id, submissionData);

      // Close modal smoothly after brief celebration
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-modal overflow-hidden transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <FormatBadge type={task.submissionType} />
              <StatusBadge status={task.status} />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30">
                +{task.points} Points
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                Deadline: <strong className="text-white">{task.deadline}</strong>
              </span>
              <span>•</span>
              <span className="text-slate-400">Assigned: {task.assignedDate}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Close task details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Task successfully submitted!</p>
                <p className="text-xs text-emerald-700">Your points have been recorded and your leaderboard rank updated.</p>
              </div>
            </div>
          )}

          {/* 1. Detailed Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Task Overview & Objective
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {task.detailedDescription}
            </p>
          </div>

          {/* 2. Step-by-Step Instructions */}
          {task.instructions && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                2. Step-by-Step Instructions
              </h3>
              <div className="space-y-2">
                {task.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50/80 transition-colors text-xs text-slate-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Submission Requirements */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              3. Deliverable Requirements
            </h3>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-orange-950 text-xs leading-relaxed">
              <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Verification Criteria:</strong>
                <span>{task.submissionRequirements}</span>
              </div>
            </div>
          </div>

          {/* 4. Submission Interface (Dynamic) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {task.status === 'completed' ? 'Your Verified Submission' : 'Submit Your Work'}
              </h3>
              <span className="text-xs text-slate-500">
                Format: <strong className="text-slate-800 capitalize">{task.submissionType}</strong>
              </span>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dynamic Type A: FILE UPLOAD */}
              {task.submissionType === 'file' && (
                <div className="space-y-3">
                  {!uploadedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? 'border-orange-500 bg-orange-50/50'
                          : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-white'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={task.acceptedFormats || '.pdf,.png,.jpg,.jpeg,.xlsx,.csv'}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        Drag and drop your file here, or <span className="text-orange-600 underline">browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Accepted formats: {task.acceptedFormats || 'PDF, Image, Spreadsheet'} (Max 25MB)
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <File className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {uploadedFile.size} • Ready for verification
                          </p>
                        </div>
                      </div>

                      {task.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove and replace file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {uploadedFile && task.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer underline"
                    >
                      Choose a different file
                    </button>
                  )}
                </div>
              )}

              {/* Dynamic Type B: LINK SUBMISSION */}
              {task.submissionType === 'link' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Paste Direct External Link:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder={task.placeholderText || "https://drive.google.com/..."}
                      disabled={task.status === 'completed'}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-75 disabled:bg-slate-100"
                    />
                  </div>
                  {task.status === 'completed' && task.submissionData?.link && (
                    <a
                      href={task.submissionData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold mt-1"
                    >
                      <span>Open Submitted Proof Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Example: Google Drive folder, Instagram Story link, LinkedIn post URL, or Google Form response. Ensure permissions are set to "Anyone with link can view".
                  </p>
                </div>
              )}

              {/* Dynamic Type C: TEXT SUBMISSION */}
              {task.submissionType === 'text' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-slate-700">
                      Written Response:
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {textInput.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={task.placeholderText || "Type your detailed response, findings, or list here..."}
                    disabled={task.status === 'completed'}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 disabled:opacity-75 disabled:bg-slate-100 leading-relaxed font-sans"
                  />
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {task.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Submitted & Verified on {task.submittedDate}</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 group cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Submitting Deliverable...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Task for Verification</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
