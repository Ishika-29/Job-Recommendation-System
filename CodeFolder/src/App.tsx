import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { LoadingSpinner } from './components/LoadingSpinner';
import { JobResults } from './components/JobResults';
import { GeminiService, ResumeKeywords } from './services/geminiService';
import { JobService, Job } from './services/jobService';
import { convertFileToBase64, validatePdfFile } from './utils/pdfUtils';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

type AppState = 'upload' | 'analyzing' | 'searching' | 'results' | 'error';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<ResumeKeywords | null>(null);

  const geminiService = new GeminiService();
  const jobService = new JobService();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validatePdfFile(file)) {
      setError('Please upload a valid PDF file (max 10MB)');
      setState('error');
      return;
    }

    setUploadedFile(file);
    setState('analyzing');
    setError('');

    try {
      // Convert PDF to base64
      const base64Pdf = await convertFileToBase64(file);

      // Analyze resume with Gemini AI
      const keywords = await geminiService.analyzeResume(base64Pdf);
      setExtractedKeywords((keywords as any).keywords);

      // Search for jobs
      setState('searching');
      const matchingJobs = await jobService.searchJobs((keywords as any).keywords);

      setJobs(matchingJobs);
      setState('results');
    } catch (err) {
      console.error('Error processing resume:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setState('upload');
    setJobs([]);
    setError('');
    setExtractedKeywords(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (uploadedFile) {
      handleFileUpload(uploadedFile);
    } else {
      setState('upload');
      setError('');
    }
  }, [uploadedFile, handleFileUpload]);

  const renderContent = () => {
    switch (state) {
      case 'upload':
        return (
          <FileUpload
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            onRemoveFile={handleRemoveFile}
            isAnalyzing={false}
          />
        );

      case 'analyzing':
        return (
          <div className="max-w-md mx-auto">
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
              isAnalyzing={true}
            />
            <div className="mt-8">
              <LoadingSpinner type="analyzing" />
            </div>
          </div>
        );

      case 'searching':
        return (
          <div className="max-w-md mx-auto">
            <FileUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
              isAnalyzing={true}
            />
            <div className="mt-8">
              <LoadingSpinner type="searching" />
            </div>
          </div>
        );

      case 'results':
        return (
          <div>
            <div className="max-w-md mx-auto mb-8">
              <FileUpload
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                onRemoveFile={handleRemoveFile}
                isAnalyzing={false}
              />
            </div>

            {extractedKeywords && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Extracted Keywords</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {extractedKeywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <JobResults jobs={jobs} />
          </div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;