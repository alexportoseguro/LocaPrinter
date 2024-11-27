import { useState } from 'react'
import { documentService } from '../services/documentService'

export function useStorage() {
  const [uploadProgress, setUploadProgress] = useState({ progress: 0, error: null })

  const uploadFile = async (file: File) => {
    try {
      setUploadProgress({ progress: 0, error: null })

      // Simular progresso do upload
      const interval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }))
      }, 100)

      // Obter o usuário atual
      const { data: { user } } = await documentService['supabase'].auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Fazer o upload do arquivo
      const fileUrl = await documentService.uploadFile(file, user.id)

      // Upload completo
      clearInterval(interval)
      setUploadProgress({ progress: 100, error: null })

      return fileUrl
    } catch (error) {
      setUploadProgress({ progress: 0, error: error as Error })
      throw error
    }
  }

  return {
    uploadFile,
    uploadProgress,
  }
}
