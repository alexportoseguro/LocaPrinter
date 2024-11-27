import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navigation } from './components/Navigation'
import { ClientsPage } from './pages/ClientsPage'
import { EquipmentPage } from './pages/EquipmentPage'
import { DocumentsPage } from './pages/DocumentsPage'

// Componente temporário para o Dashboard
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Total de Clientes</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Equipamentos Ativos</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Documentos</h2>
        <p className="text-3xl font-bold">0</p>
      </div>
    </div>
  </div>
)

const queryClient = new QueryClient()

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={isDarkMode ? 'dark' : ''}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navigation
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/equipment" element={<EquipmentPage />} />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App