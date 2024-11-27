import { supabase } from '../lib/supabaseClient'
import { Database } from '../types/supabase'

interface Document {
  id: string
  title: string
  description?: string
  file_url: string
  file_type: string
  file_size: number
  user_id: string
  created_at: string
  updated_at: string
  tags?: string[]
  version?: number
  status: 'pending' | 'validated' | 'rejected'
  parent_id?: string
  metadata?: {
    author?: string
    lastModifiedBy?: string
    pageCount?: number
    keywords?: string[]
  }
}

interface DocumentStats {
  totalPrints: number
  totalScans: number
  paperUsage: number
  costEstimate: number
}

interface DocumentFilters {
  type?: string[]
  dateRange?: { start: Date; end: Date }
  tags?: string[]
  status?: ('pending' | 'validated' | 'rejected')[]
  author?: string
  keywords?: string[]
}

class DocumentService {
  // Listar documentos do usuário
  async getDocuments(userId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      return []
    }
  }

  // Criar um novo documento
  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          version: 1,
          status: document.status || 'pending',
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar documento:', error)
      throw error
    }
  }

  // Excluir um documento
  async deleteDocument(id: string) {
    try {
      // Primeiro, buscar o documento para obter a URL do arquivo
      const { data: document } = await supabase
        .from('documents')
        .select('file_url')
        .eq('id', id)
        .single()

      if (document) {
        // Extrair o caminho do arquivo da URL
        const filePath = document.file_url.split('/').pop()
        if (filePath) {
          // Excluir o arquivo do storage
          const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([filePath])

          if (storageError) {
            console.error('Erro ao excluir arquivo:', storageError)
          }
        }
      }

      // Excluir o registro do documento
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao excluir documento:', error)
      throw error
    }
  }

  // Upload de arquivo
  async uploadFile(file: File): Promise<string> {
    try {
      // Criar um nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Fazer o upload do arquivo
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

      if (error) throw error

      // Gerar URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error)
      throw error
    }
  }

  // Atualizar status do documento
  async updateDocumentStatus(id: string, status: 'validated' | 'rejected') {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      throw error
    }
  }

  // Buscar versões anteriores do documento
  async getDocumentVersions(id: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('parent_id', id)
        .order('version', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar versões:', error)
      return []
    }
  }

  // Criar nova versão do documento
  async createDocumentVersion(document: Document, file: File) {
    try {
      // Upload do novo arquivo
      const fileUrl = await this.uploadFile(file)

      // Criar nova versão
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          id: undefined,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.type,
          version: (document.version || 1) + 1,
          parent_id: document.id,
          status: 'pending',
          created_at: undefined,
          updated_at: undefined,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar versão:', error)
      throw error
    }
  }

  // Buscar documentos com filtros
  async searchDocuments(userId: string, query: string, filters?: DocumentFilters): Promise<Document[]> {
    try {
      let queryBuilder = supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)

      // Aplicar filtro de texto
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      }

      // Aplicar filtros adicionais
      if (filters) {
        if (filters.type?.length) {
          queryBuilder = queryBuilder.in('file_type', filters.type)
        }

        if (filters.status?.length) {
          queryBuilder = queryBuilder.in('status', filters.status)
        }

        if (filters.dateRange) {
          queryBuilder = queryBuilder
            .gte('created_at', filters.dateRange.start.toISOString())
            .lte('created_at', filters.dateRange.end.toISOString())
        }

        if (filters.tags?.length) {
          queryBuilder = queryBuilder.contains('tags', filters.tags)
        }

        if (filters.author) {
          queryBuilder = queryBuilder.eq('metadata->author', filters.author)
        }

        if (filters.keywords?.length) {
          queryBuilder = queryBuilder.contains('metadata->keywords', filters.keywords)
        }
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar documentos:', error)
      return []
    }
  }

  // Atualizar metadados do documento
  async updateDocumentMetadata(id: string, metadata: Document['metadata']) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ metadata })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar metadados:', error)
      throw error
    }
  }

  // Atualizar tags do documento
  async updateDocumentTags(id: string, tags: string[]) {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ tags })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar tags:', error)
      throw error
    }
  }

  // Obter estatísticas de documentos
  async getDocumentStats(userId: string, startDate?: Date, endDate?: Date): Promise<DocumentStats> {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
      }

      if (endDate) {
        query = query.lte('created_at', endDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      // Calcular estatísticas
      const stats: DocumentStats = {
        totalPrints: 0,
        totalScans: 0,
        paperUsage: 0,
        costEstimate: 0,
      }

      if (data) {
        // Implementar cálculos de estatísticas aqui
      }

      return stats
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        totalPrints: 0,
        totalScans: 0,
        paperUsage: 0,
        costEstimate: 0,
      }
    }
  }
}

export const documentService = new DocumentService()
