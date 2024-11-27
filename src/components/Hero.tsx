import { Printer, Scanner, Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Soluções de Impressão para seu Negócio
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Locação de impressoras, copiadoras e scanners de alta qualidade
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar equipamentos..."
                className="w-full px-4 py-3 rounded-lg pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
              Buscar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}