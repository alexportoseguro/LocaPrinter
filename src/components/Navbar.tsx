import { Menu, Printer, Scanner, Search, User } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Printer className="w-8 h-8" />
            <span className="font-bold text-xl">PrintTech</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-indigo-200">Equipamentos</a>
            <a href="#" className="hover:text-indigo-200">Como Funciona</a>
            <a href="#" className="hover:text-indigo-200">Suporte</a>
            <a href="#" className="hover:text-indigo-200">Contato</a>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
              Login
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-indigo-500">Equipamentos</a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-indigo-500">Como Funciona</a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-indigo-500">Suporte</a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-indigo-500">Contato</a>
          <a href="#" className="block px-3 py-2 rounded-md hover:bg-indigo-500">Login</a>
        </div>
      )}
    </nav>
  );
}