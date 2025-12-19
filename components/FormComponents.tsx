
import React, { useRef } from 'react';
import { CONFIG } from '../constants';

// --- Types ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

// --- Components ---

export const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
    <h3 className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-5">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

export const InputField: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className={`flex flex-col ${className || ''}`}>
    <label className="text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`
        px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
        ${props.disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
      `}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

export const SelectField: React.FC<SelectProps> = ({ label, options, error, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <select
      className={`
        px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
        ${props.disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
      `}
      {...props}
    >
      <option value="">Seleccione una opción</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

export const TextAreaField: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => (
  <div className={`flex flex-col ${className || ''}`}>
    <label className="text-sm font-medium text-slate-700 mb-1">
      {label} {props.required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      className={`
        px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[100px]
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300'}
        ${props.disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
      `}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

interface FileUploadProps {
  label?: string;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  error?: string;
  readOnly?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, files, onFilesSelected, onRemoveFile, error, readOnly = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: File[] = Array.from(e.target.files);
      const validFiles: File[] = [];

      for (const file of newFiles) {
        // Validate Extension
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
          alert(`El archivo ${file.name} no tiene una extensión permitida (${CONFIG.ALLOWED_EXTENSIONS.join(', ')}).`);
          continue;
        }

        // Validate Size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > CONFIG.MAX_FILE_SIZE_MB) {
          alert(`El archivo ${file.name} excede el tamaño máximo de ${CONFIG.MAX_FILE_SIZE_MB}MB.`);
          continue;
        }

        validFiles.push(file);
      }

      onFilesSelected(validFiles);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
       <label className="text-sm font-medium text-slate-700 mb-1 block">
          {label || "Documentos de Soporte (Múltiples)"} { !readOnly && <span className="text-red-500">*</span>}
       </label>
       
       {!readOnly && (
         <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors mb-4">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.doc,.jpg,.jpeg"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Seleccionar Archivos
            </button>
            <p className="text-slate-500 text-sm mt-2">
              Formatos permitidos: {CONFIG.ALLOWED_EXTENSIONS.join(', ')}. Max: {CONFIG.MAX_FILE_SIZE_MB}MB.
            </p>
         </div>
       )}
       
       {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

       {/* File List / Audit View */}
       {files.length > 0 ? (
         <div className="mt-2 space-y-2">
           <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Archivos Cargados (Clic para auditar):</p>
           {files.map((file, index) => {
             // Determine URL: Use mockUrl if it exists (for historical data), otherwise createObjectURL (for new uploads)
             let fileUrl = '#';
             try {
                if ((file as any).mockUrl) {
                    fileUrl = (file as any).mockUrl;
                } else {
                    fileUrl = URL.createObjectURL(file);
                }
             } catch (e) {
                console.error("Error creating object URL", e);
             }
             
             return (
               <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-3 rounded border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  <a 
                    href={fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 overflow-hidden flex-1 group cursor-pointer"
                    title="Clic para visualizar documento"
                  >
                     <div className="bg-blue-50 p-2 rounded text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-700 underline decoration-dotted">{file.name}</span>
                        <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                     </div>
                     <div className={`ml-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full transition-all group-hover:bg-blue-100 ${readOnly ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        Visualizar
                     </div>
                  </a>
                  
                  {!readOnly && (
                    <button 
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors ml-2"
                      title="Eliminar archivo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  )}
               </div>
             );
           })}
         </div>
       ) : (
         readOnly && <p className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border border-dashed border-slate-200 text-center">No hay documentos adjuntos para auditar.</p>
       )}
    </div>
  );
};
