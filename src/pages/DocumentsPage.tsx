import { useState } from 'react'
import { DocumentUpload } from '../components/documents/DocumentUpload'
import { DocumentList } from '../components/documents/DocumentList'
import { DocumentViewer } from '../components/documents/DocumentViewer'
import { Database } from '../types/database.types'
import { supabase } from '../lib/supabase'

type Document = Database['public']['Tables']['documents']['Row']

export function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Verificar usuário atual
  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      setUserId(user.id)
    }
  })

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">
          Por favor, faça login para acessar os documentos
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Seção de Upload */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Upload de Documentos</h1>
          <DocumentUpload
            userId={userId}
            onSuccess={() => {
              // Força atualização da lista
              setSelectedDocument(null)
            }}
          />
        </div>

        {/* Seção de Lista */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Seus Documentos</h1>
          <DocumentList
            userId={userId}
            onSelect={setSelectedDocument}
            onDelete={() => setSelectedDocument(null)}
          />
        </div>
      </div>

      {/* Visualizador de Documentos */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}
