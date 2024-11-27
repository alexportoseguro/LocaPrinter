import { X, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Sector {
  id: string;
  name: string;
  subsectors: Array<{
    id: string;
    name: string;
  }>;
}

export default function SectorManager({ onClose }: { onClose: () => void }) {
  const [sectors, setSectors] = useState<Sector[]>([
    {
      id: '1',
      name: 'Sec. Municipal de ADM',
      subsectors: [
        { id: '1-1', name: 'Sala do Secretário' },
        { id: '1-2', name: 'RH ADM' },
      ]
    }
  ]);
  
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [newSectorName, setNewSectorName] = useState('');
  const [newSubsectorName, setNewSubsectorName] = useState('');

  const handleAddSector = () => {
    if (newSectorName.trim()) {
      setSectors([
        ...sectors,
        {
          id: Date.now().toString(),
          name: newSectorName,
          subsectors: []
        }
      ]);
      setNewSectorName('');
    }
  };

  const handleAddSubsector = (sectorId: string) => {
    if (newSubsectorName.trim()) {
      setSectors(sectors.map(sector => {
        if (sector.id === sectorId) {
          return {
            ...sector,
            subsectors: [
              ...sector.subsectors,
              {
                id: Date.now().toString(),
                name: newSubsectorName
              }
            ]
          };
        }
        return sector;
      }));
      setNewSubsectorName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gerenciar Setores</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Sectors List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Nome do novo setor"
                className="input-primary flex-1"
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
              />
              <button 
                onClick={handleAddSector}
                className="btn-primary"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {sectors.map(sector => (
                <div
                  key={sector.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedSector === sector.id
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  } border`}
                  onClick={() => setSelectedSector(sector.id)}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{sector.name}</span>
                    <ChevronRight size={20} className="text-gray-400 ml-2" />
                  </div>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subsectors List */}
          <div>
            {selectedSector && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nome do novo subsetor"
                    className="input-primary flex-1"
                    value={newSubsectorName}
                    onChange={(e) => setNewSubsectorName(e.target.value)}
                  />
                  <button 
                    onClick={() => handleAddSubsector(selectedSector)}
                    className="btn-primary"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  {sectors
                    .find(s => s.id === selectedSector)
                    ?.subsectors.map(subsector => (
                      <div
                        key={subsector.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <span>{subsector.name}</span>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}