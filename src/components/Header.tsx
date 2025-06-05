import React, { useState } from 'react';
import { Cog6ToothIcon, HomeIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { LoginModal } from './modals/LoginModal';

export const Header: React.FC = () => {
  const { state, cambiarModoAdmin } = useApp();
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const totalPuntosFamilia = state.miembros.reduce((total, miembro) => total + miembro.puntos, 0);

  const handleToggleAdmin = () => {
    if (state.modoAdmin) {
      // Si ya está en modo admin, salir
      cambiarModoAdmin(false);
    } else {
      // Si no está en modo admin, mostrar login
      setMostrarLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    cambiarModoAdmin(true);
    setMostrarLogin(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo y título */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <HomeIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Familia Tareas</h1>
                <p className="text-blue-100 text-sm">¡Juntos somos más fuertes!</p>
              </div>
            </div>

            {/* Puntos totales de la familia */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-6 w-6 text-yellow-300" />
                  <span className="text-2xl font-bold">{totalPuntosFamilia}</span>
                </div>
                <p className="text-blue-100 text-sm">Puntos Familia</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-6 w-6 text-green-300" />
                  <span className="text-lg font-semibold">
                    {state.tareas.filter(t => t.completadaHoy).length}
                  </span>
                </div>
                <p className="text-blue-100 text-sm">Tareas Hechas</p>
              </div>
            </div>

            {/* Toggle modo admin */}
            <div className="flex items-center space-x-4">
              {state.modoAdmin && (
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Modo Administrador
                </span>
              )}
              
              <button
                onClick={handleToggleAdmin}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  state.modoAdmin 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title={state.modoAdmin ? 'Salir del modo admin' : 'Entrar como administrador'}
              >
                <Cog6ToothIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Barra de progreso móvil */}
          <div className="md:hidden pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-100">Puntos: {totalPuntosFamilia}</span>
              <span className="text-sm text-blue-100">
                Tareas: {state.tareas.filter(t => t.completadaHoy).length}/{state.tareas.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de login */}
      <LoginModal
        isOpen={mostrarLogin}
        onClose={() => setMostrarLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};
