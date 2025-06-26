import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { TareasList } from './components/TareasList';
import { RecompensasList } from './components/RecompensasList';
import { Penalizaciones } from './components/Penalizaciones';
import { Historial } from './components/Historial';
import { AdminPanel } from './components/AdminPanel';
import { useApp } from './context/AppContext';

// Componente interno que usa el contexto
const AppContent: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Aplicar modo kiosco si está habilitado
  useEffect(() => {
    if (state.configuracion.modoKiosco) {
      document.documentElement.requestFullscreen?.();
    }
  }, [state.configuracion.modoKiosco]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tareas':
        return <TareasList />;
      case 'recompensas':
        return <RecompensasList />;
      case 'penalizaciones':
        return <Penalizaciones />;
      case 'historial':
        return <Historial />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        showAdmin={state.modoAdmin}
      />
      <main className="pb-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Componente principal con Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
