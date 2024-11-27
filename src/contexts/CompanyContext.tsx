import React, { createContext, useContext, useState, useEffect } from 'react';

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

interface CompanyContextType {
  companies: Company[];
  currentCompany: Company | null;
  addCompany: (company: Company) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  setCurrentCompany: (company: Company | null) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCompany, setCurrentCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('currentCompany');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('currentCompany', JSON.stringify(currentCompany));
  }, [currentCompany]);

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    // Automatically set as current company if it's the first one
    if (companies.length === 0) {
      setCurrentCompany(company);
    }
  };

  const updateCompany = (company: Company) => {
    setCompanies(prev =>
      prev.map(comp => (comp.id === company.id ? company : comp))
    );
    // Update current company if it's the one being updated
    if (currentCompany?.id === company.id) {
      setCurrentCompany(company);
    }
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
    // Clear current company if it's the one being deleted
    if (currentCompany?.id === id) {
      setCurrentCompany(null);
    }
  };

  const value = {
    companies,
    currentCompany,
    addCompany,
    updateCompany,
    deleteCompany,
    setCurrentCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
