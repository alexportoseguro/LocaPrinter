import { Printer, Clock, Shield, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Printer className="w-12 h-12 text-indigo-600" />,
      title: "Equipamentos Premium",
      description: "Oferecemos as melhores marcas e modelos do mercado"
    },
    {
      icon: <Clock className="w-12 h-12 text-indigo-600" />,
      title: "Suporte 24/7",
      description: "Assistência técnica disponível a qualquer momento"
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-600" />,
      title: "Garantia Total",
      description: "Cobertura completa para qualquer problema"
    },
    {
      icon: <Headphones className="w-12 h-12 text-indigo-600" />,
      title: "Atendimento Premium",
      description: "Equipe especializada para melhor atendê-lo"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossa locação?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}