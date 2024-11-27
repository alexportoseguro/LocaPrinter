import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon, LayoutDashboard, Printer, Users, FileText, BarChart } from 'lucide-react'
import { Button } from './ui/button'

interface NavigationProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/equipment',
    label: 'Equipamentos',
    icon: Printer,
  },
  {
    path: '/clients',
    label: 'Clientes',
    icon: Users,
  },
  {
    path: '/reports',
    label: 'Relatórios',
    icon: BarChart,
  },
  {
    path: '/documents',
    label: 'Documentos',
    icon: FileText,
  },
]

export function Navigation({ isDarkMode, onToggleDarkMode }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo e Menu Desktop */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                LocaPrinter
              </span>
            </div>

            {/* Links Desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${
                      location.pathname === item.path
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-1.5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Botões da direita */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="ml-4"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Botão do Menu Mobile */}
            <div className="flex md:hidden ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium
                  ${
                    location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-700 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
