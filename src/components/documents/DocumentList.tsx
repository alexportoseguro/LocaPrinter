import { useState, useEffect } from 'react'
import { documentService } from '../../services/documentService'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Badge } from '../ui/badge'
import { Search, Filter, Tag, FileText, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { Database } from '../../types/database.types'

type Document = Database['public']['Tables']['documents']['Row']

interface DocumentListProps {
  userId: string
  onSelect?: (document: Document) => void
  onDelete?: () => void
}

interface DocumentFilters {
  search: string
  type: string
  status: string
  dateRange: string
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

export function DocumentList({ userId, onSelect, onDelete }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<DocumentFilters>({
    search: '',
    type: '',
    status: '',
    dateRange: '',
  })

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const data = await documentService.getDocuments(userId)
      setDocuments(data)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
      toast.error('Erro ao carregar documentos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await documentService.deleteDocument(id)
      toast.success('Documento excluído com sucesso')
      onDelete?.()
      loadDocuments()
    } catch (error) {
      console.error('Erro ao excluir documento:', error)
      toast.error('Erro ao excluir documento')
    }
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = filters.search
      ? doc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        doc.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        doc.tags?.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()))
      : true

    const matchesType = filters.type
      ? doc.file_type.includes(filters.type)
      : true

    const matchesStatus = filters.status
      ? doc.status === filters.status
      : true

    const matchesDate = filters.dateRange
      ? (() => {
          const date = new Date(doc.created_at)
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const lastWeek = new Date(today)
          lastWeek.setDate(lastWeek.getDate() - 7)
          const lastMonth = new Date(today)
          lastMonth.setMonth(lastMonth.getMonth() - 1)

          switch (filters.dateRange) {
            case 'today':
              return date.toDateString() === today.toDateString()
            case 'yesterday':
              return date.toDateString() === yesterday.toDateString()
            case 'last7days':
              return date >= lastWeek
            case 'last30days':
              return date >= lastMonth
            default:
              return true
          }
        })()
      : true

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  useEffect(() => {
    loadDocuments()
  }, [userId])

  if (isLoading) {
    return <div className="text-center py-4">Carregando documentos...</div>
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhum documento encontrado
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Pesquisar documentos..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full"
          icon={<Search size={18} />}
        />
        
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters({ ...filters, type: value })}
          options={[
            { value: '', label: 'Todos os tipos' },
            { value: 'pdf', label: 'PDF' },
            { value: 'image', label: 'Imagens' },
            { value: 'document', label: 'Documentos' },
          ]}
        />

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'pending', label: 'Pendente' },
            { value: 'validated', label: 'Validado' },
            { value: 'rejected', label: 'Rejeitado' },
          ]}
        />

        <Select
          value={filters.dateRange}
          onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
          options={[
            { value: '', label: 'Qualquer data' },
            { value: 'today', label: 'Hoje' },
            { value: 'yesterday', label: 'Ontem' },
            { value: 'last7days', label: 'Últimos 7 dias' },
            { value: 'last30days', label: 'Últimos 30 dias' },
          ]}
        />
      </div>

      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{doc.title}</h3>
                    <Badge className={STATUS_COLORS[doc.status]} variant="secondary">
                      <span className="flex items-center gap-1">
                        {STATUS_ICONS[doc.status]}
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{doc.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect?.(doc)}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>{doc.file_type || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{formatDate(doc.created_at)}</span>
                </div>
                {doc.metadata?.author && (
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{doc.metadata.author}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Tag size={16} />
                  <span>{formatFileSize(doc.file_size)}</span>
                </div>
              </div>

              {(doc.tags?.length > 0 || doc.metadata?.keywords?.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {doc.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {doc.metadata?.keywords?.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
