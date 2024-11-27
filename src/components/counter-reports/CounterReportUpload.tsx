import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCompany } from '../../contexts/CompanyContext';
import { toast } from 'react-hot-toast';

interface CounterReport {
  id: string;
  equipmentId: string;
  reportDate: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  counterValues?: {
    black?: number;
    color?: number;
    copies?: number;
    scans?: number;
  };
  processedAt?: string;
  notes?: string;
}

export function CounterReportUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { currentCompany } = useCompany();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf' || file.type.startsWith('image/')
    );

    if (droppedFiles.length === 0) {
      toast.error('Por favor, envie apenas arquivos PDF ou imagens');
      return;
    }

    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type === 'application/pdf' || file.type.startsWith('image/')
      );

      if (selectedFiles.length === 0) {
        toast.error('Por favor, envie apenas arquivos PDF ou imagens');
        return;
      }

      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: Implementar upload para o Supabase
      // Simular upload por enquanto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Relatórios enviados com sucesso!');
      setFiles([]);
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar relatórios. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Envio de Relatórios de Contadores</h2>
      
      {/* Área de Upload */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        } transition-colors`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-lg">
            Arraste e solte seus arquivos aqui ou
          </p>
          <label className="cursor-pointer text-indigo-600 hover:text-indigo-800">
            <span>selecione do seu computador</span>
            <input
              type="file"
              className="hidden"
              multiple
              accept="application/pdf,image/*"
              onChange={handleFileSelect}
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            PDF ou imagens (máximo 10MB por arquivo)
          </p>
        </div>
      </motion.div>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold mb-3">Arquivos Selecionados</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
              >
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <motion.button
            className={`mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUpload}
            disabled={isUploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isUploading ? 'Enviando...' : 'Enviar Relatórios'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
