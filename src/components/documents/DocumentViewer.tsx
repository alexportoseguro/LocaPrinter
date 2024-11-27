import { Database } from '../../types/database.types'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { FileText, Download, Clock, User, Tag, Info, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { documentService } from '../../services/documentService'
import { toast } from 'sonner'

type Document = Database['public']['Tables']['documents']['Row']

interface DocumentViewerProps {
  document: Document
  onClose: () => void
  onStatusChange?: () => void
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  validated: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const STATUS_ICONS = {
  pending: <AlertCircle size={16} />,
  validated: <CheckCircle size={16} />,
  rejected: <XCircle size={16} />,
}

export function DocumentViewer({ document, onClose, onStatusChange }: DocumentViewerProps) {
  const isImage = document.file_type.startsWith('image/')
  const isPDF = document.file_type === 'application/pdf'

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const handleStatusChange = async (newStatus: 'validated' | 'rejected') => {
    try {
      await documentService.updateDocumentStatus(document.id, newStatus)
      toast.success(`Documento ${newStatus === 'validated' ? 'validado' : 'rejeitado'} com sucesso`)
      onStatusChange?.()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do documento')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{document.title}</h2>
            <Badge className={STATUS_COLORS[document.status]} variant="secondary">
              <span className="flex items-center gap-1">
                {STATUS_ICONS[document.status]}
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {document.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleStatusChange('validated')}
                >
                  Validar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleStatusChange('rejected')}
                >
                  Rejeitar
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                {isImage && (
                  <img
                    src={document.file_url}
                    alt={document.title}
                    className="max-w-full h-auto mx-auto rounded-lg"
                  />
                )}

                {isPDF && (
                  <iframe
                    src={document.file_url}
                    className="w-full h-[600px] rounded-lg"
                    title={document.title}
                  />
                )}

                {!isImage && !isPDF && (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Visualização não disponível para este tipo de arquivo
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.open(document.file_url, '_blank')}
                    >
                      <Download size={16} className="mr-2" />
                      Baixar arquivo
                    </Button>
                  </div>
                )}
              </div>

              {document.description && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Info size={16} />
                    Descrição
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{document.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-medium mb-4">Informações do Arquivo</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText size={16} />
                    <span>Tipo: {document.file_type || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Tag size={16} />
                    <span>Tamanho: {formatFileSize(document.file_size)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} />
                    <span>Criado em: {formatDate(document.created_at)}</span>
                  </div>
                  {document.metadata?.author && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User size={16} />
                      <span>Autor: {document.metadata.author}</span>
                    </div>
                  )}
                </div>
              </div>

              {(document.tags?.length > 0 || document.metadata?.keywords?.length > 0) && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Tags e Palavras-chave</h3>
                  <div className="space-y-3">
                    {document.tags?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {document.metadata?.keywords?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Palavras-chave</h4>
                        <div className="flex flex-wrap gap-2">
                          {document.metadata.keywords.map((keyword) => (
                            <Badge key={keyword} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {document.version && document.version > 1 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Histórico de Versões</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Versão atual: {document.version}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2 p-0"
                    onClick={() => {/* Implementar visualização de versões anteriores */}}
                  >
                    Ver versões anteriores
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
