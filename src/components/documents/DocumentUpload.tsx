import { useState } from 'react'
import { useStorage } from '../../hooks/useStorage'
import { documentService } from '../../services/documentService'
import { FileUpload } from '../shared/FileUpload'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { Textarea } from '../ui/textarea'

interface DocumentUploadProps {
  onSuccess?: () => void
  userId: string
}

export function DocumentUpload({ onSuccess, userId }: DocumentUploadProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [author, setAuthor] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const { uploadFile, uploadProgress } = useStorage()

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()])
      setCurrentKeyword('')
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleUpload = async (file: File) => {
    if (!title.trim()) {
      toast.error('Por favor, insira um título para o documento')
      return
    }

    try {
      setIsUploading(true)

      // Upload do arquivo para o Storage
      const fileUrl = await uploadFile(file)
      
      if (!fileUrl) {
        throw new Error('Erro ao fazer upload do arquivo')
      }

      // Criar registro do documento no banco
      await documentService.createDocument({
        title,
        description: description || null,
        file_url: fileUrl,
        file_type: file.type,
        file_size: file.size,
        user_id: userId,
        tags,
        status: 'pending',
        metadata: {
          author: author || undefined,
          keywords: keywords.length > 0 ? keywords : undefined,
          pageCount: 0, // Será atualizado após processamento
        },
      })

      toast.success('Documento enviado com sucesso!')
      setTitle('')
      setDescription('')
      setTags([])
      setAuthor('')
      setKeywords([])
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao enviar documento:', error)
      toast.error('Erro ao enviar documento')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <h2 className="text-xl font-semibold">Upload de Documento</h2>
      
      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Título do documento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
          />
        </div>
        
        <div>
          <Textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            rows={3}
          />
        </div>

        <div>
          <Input
            type="text"
            placeholder="Autor do documento"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isUploading}
          />
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Adicionar tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              disabled={isUploading}
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              disabled={isUploading || !currentTag.trim()}
            >
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                  disabled={isUploading}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Adicionar palavra-chave"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              disabled={isUploading}
            />
            <Button 
              type="button" 
              onClick={handleAddKeyword}
              disabled={isUploading || !currentKeyword.trim()}
            >
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-red-500"
                  disabled={isUploading}
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <FileUpload onFileUpload={handleUpload} />

      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-500">
            Enviando arquivo... {uploadProgress.progress}%
          </p>
        </div>
      )}
    </div>
  )
}
