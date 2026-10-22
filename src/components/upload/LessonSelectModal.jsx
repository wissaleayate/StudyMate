// LessonSelectModal: Lesson selection & PDF upload flow with plain-language validation and loading states
import { useState, useRef } from 'react'
import {
  SAMPLE_LESSONS,
  validatePdfFile,
  MAX_FILE_SIZE_BYTES
} from '../../services/lessonService'
import { useStudy } from '../../context/useStudy'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Trash2,
  RefreshCw,
  Compass
} from 'lucide-react'

export function LessonSelectModal({ isOpen, onClose }) {
  const { setCurrentLesson, setCurrentView } = useStudy()

  const [activeTab, setActiveTab] = useState('samples') // 'samples' | 'upload'
  const [selectedSample, setSelectedSample] = useState(SAMPLE_LESSONS[0])
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileDetails, setFileDetails] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  const fileInputRef = useRef(null)

  if (!isOpen) return null

  // ── Drag & Drop Handlers ──
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      processSelectedFile(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target?.files
    if (files && files.length > 0) {
      processSelectedFile(files[0])
    }
  }

  // ── Validation and State Assignment ──
  const processSelectedFile = (file) => {
    setErrorMessage('')
    const validation = validatePdfFile(file, MAX_FILE_SIZE_BYTES)

    if (!validation.isValid) {
      setErrorMessage(validation.error)
      setUploadedFile(null)
      setFileDetails(null)
      return
    }

    setUploadedFile(file)
    setFileDetails(validation.fileDetails)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setFileDetails(null)
    setErrorMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Start Learning Journey Action with Animated Transition ──
  const handleStartLearning = () => {
    setIsLoading(true)
    setLoadingStep(1)

    const steps = [
      'Scanning learning curriculum...',
      'Mapping conceptual dependencies...',
      'Generating 3D isometric island terrain...',
      'Realm Ready! Entering World...'
    ]

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLoadingStep(idx + 1)
        if (idx === steps.length - 1) {
          setTimeout(() => {
            // Apply selected lesson or fallback sample with uploaded filename
            const lessonToLoad = activeTab === 'upload' && uploadedFile
              ? {
                  ...SAMPLE_LESSONS[0],
                  title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
                  subtitle: `Source: ${fileDetails?.name} (${fileDetails?.sizeFormatted})`
                }
              : selectedSample

            setCurrentLesson(lessonToLoad)
            setCurrentView('world')
            setIsLoading(false)
            onClose()
          }, 600)
        }
      }, (idx + 1) * 550)
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 flex flex-col gap-5 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-amber/20 text-amber border border-amber/30 uppercase tracking-wider">
                EXPLORATION PORTAL
              </span>
              <span className="text-xs text-slate-400 font-pixel">REALM SELECTOR</span>
            </div>
            <h2 id="lesson-modal-title" className="text-xl sm:text-2xl font-black text-white mt-1">
              Choose Lesson or Upload Material
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-colors"
            aria-label="Close lesson selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Mode Selection Tabs ── */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-pixel transition-all ${
              activeTab === 'samples'
                ? 'bg-amber text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>CURATED REALMS ({SAMPLE_LESSONS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-pixel transition-all ${
              activeTab === 'upload'
                ? 'bg-teal text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>UPLOAD PDF MATERIAL</span>
          </button>
        </div>

        {/* ── Tab 1: Curated Sample Lessons ── */}
        {activeTab === 'samples' && (
          <div className="flex flex-col gap-3.5 animate-in fade-in">
            <p className="text-xs text-slate-300">
              Select an educational realm to explore the interactive knowledge island and take on checkpoint trials:
            </p>

            <div className="grid gap-3">
              {SAMPLE_LESSONS.map((lesson) => {
                const isSelected = selectedSample.id === lesson.id
                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedSample(lesson)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber shadow-[0_0_15px_rgba(245,166,35,0.25)]'
                        : 'bg-slate-900/80 border-slate-750 hover:border-slate-600 hover:bg-slate-800/50'
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setSelectedSample(lesson)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-pixel text-[8.5px] px-2 py-0.5 rounded bg-slate-950 text-teal border border-teal/30 uppercase">
                          {lesson.realm} REALM
                        </span>
                        <span className="font-pixel text-[8.5px] text-amber">
                          ⚡ {lesson.totalXpAvailable} XP
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ⏱ {lesson.estimatedDuration}
                        </span>
                      </div>

                      <span className="text-xs font-pixel text-slate-400">
                        {lesson.nodesCount} Nodes
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-amber font-semibold font-pixel animate-in fade-in">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber" />
                        <span>SELECTED REALM</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Tab 2: Upload PDF Material ── */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            {/* Drag & Drop Dropzone */}
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-teal bg-teal/10 scale-[1.01] shadow-[0_0_20px_rgba(45,212,191,0.3)]'
                    : 'border-slate-700 hover:border-amber/60 bg-slate-950/60 hover:bg-slate-800/40'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && fileInputRef.current?.click()}
                aria-label="Upload PDF Area. Drag and drop file or click to select."
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-teal/15 border border-teal/40 flex items-center justify-center text-teal shadow-inner">
                  <UploadCloud className="w-6 h-6 text-teal" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Drag and drop your study PDF here, or <span className="text-amber underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts PDF files only • Maximum size 10 MB
                  </p>
                </div>
              </div>
            ) : (
              /* Selected File Preview Card */
              <div className="bg-slate-950/90 border border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-pixel text-[8px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> READY FOR ADVENTURE
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-sm mt-0.5">
                        {fileDetails?.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {fileDetails?.sizeFormatted} • Uploaded {fileDetails?.lastModified}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Replace with another PDF"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {/* Validation Error Banner */}
            {errorMessage && (
              <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honest Backend Disclaimer */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Prototype Mode Notice:</strong>
                Automatic AI PDF parsing requires an active backend server. In this frontend mode, selecting a PDF associates your study file with our verified Europe island realm map so you can test all quest mechanics without server latency.
              </div>
            </div>
          </div>
        )}

        {/* ── Animated Loading Sequence ── */}
        {isLoading && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber/20 border-2 border-amber flex items-center justify-center shadow-[0_0_30px_rgba(245,166,35,0.4)] animate-spin-slow">
              <Compass className="w-8 h-8 text-amber" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-pixel text-xs text-teal uppercase tracking-widest">
                GENERATING LEARNING REALM
              </span>
              <h3 className="text-xl font-black text-white">
                Preparing Knowledge Island...
              </h3>
              <p className="text-xs text-amber font-pixel mt-1 animate-pulse">
                {loadingStep === 1 && 'Scanning curriculum structure...'}
                {loadingStep === 2 && 'Mapping conceptual dependencies...'}
                {loadingStep === 3 && 'Generating 3D isometric island terrain...'}
                {loadingStep === 4 && 'Realm Ready! Entering World...'}
              </p>
            </div>

            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-2">
              <div
                className="h-full bg-gradient-to-r from-amber to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(loadingStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Footer Actions ── */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            id="btn-start-learning-journey"
            onClick={handleStartLearning}
            disabled={activeTab === 'upload' && !uploadedFile}
            className={`btn-amber px-6 py-3 text-xs flex items-center gap-2 shadow-xl ${
              activeTab === 'upload' && !uploadedFile ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>START LEARNING JOURNEY</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  )
}
