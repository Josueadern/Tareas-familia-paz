import React, { useState } from 'react';
import { 
  Cog6ToothIcon, 
  ArrowPathIcon, 
  DocumentArrowDownIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  KeyIcon,
  ClockIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from './modals/ConfirmModal';
import { CambiarPinModal } from './modals/CambiarPinModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AdminPanel: React.FC = () => {
  const { state, actualizarConfiguracion, reiniciarSemana, exportarCSV } = useApp();
  const [mostrarConfirmReinicio, setMostrarConfirmReinicio] = useState(false);
  const [mostrarCambiarPin, setMostrarCambiarPin] = useState(false);

  const handleToggleSonidos = () => {
    actualizarConfiguracion({ 
      sonidosActivados: !state.configuracion.sonidosActivados 
    });
  };

  const handleToggleModoKiosco = () => {
    actualizarConfiguracion({ 
      modoKiosco: !state.configuracion.modoKiosco 
    });
  };

  const handleToggleRecordatorios = () => {
    actualizarConfiguracion({ 
      recordatoriosActivados: !state.configuracion.recordatoriosActivados 
    });
  };

  const handleCambiarHoraReinicio = (hora: string) => {
    actualizarConfiguracion({ horaReinicio: hora });
  };

  const handleCambiarDiaReinicio = (dia: number) => {
    actualizarConfiguracion({ diaReinicio: dia });
  };

  const confirmarReinicio = () => {
    reiniciarSemana(true);
    setMostrarConfirmReinicio(false);
  };

  const diasSemana = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
  ];

  const ultimoReinicio = new Date(state.ultimoReinicio);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
            <p className="text-gray-600">
              Configuración y herramientas de gestión
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración General */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-600" />
            Configuración General
          </h3>

          <div className="space-y-4">
            {/* Sonidos */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                {state.configuracion.sonidosActivados ? (
                  <SpeakerWaveIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Sonidos de feedback</p>
                  <p className="text-sm text-gray-500">
                    Reproducir sonidos al completar tareas y ganar recompensas
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleSonidos}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.configuracion.sonidosActivados ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    state.configuracion.sonidosActivados ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Modo Kiosco */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Modo Kiosco</p>
                  <p className="text-sm text-gray-500">
                    Optimizado para tablets en modo pantalla completa
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleModoKiosco}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.configuracion.modoKiosco ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    state.configuracion.modoKiosco ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Recordatorios */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Recordatorios visuales</p>
                  <p className="text-sm text-gray-500">
                    Mostrar recordatorios de tareas pendientes
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleRecordatorios}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.configuracion.recordatoriosActivados ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    state.configuracion.recordatoriosActivados ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Configuración de Reinicio Automático */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-purple-600" />
            Reinicio Automático
          </h3>

          <div className="space-y-4">
            {/* Día de la semana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Día de reinicio semanal
              </label>
              <select
                value={state.configuracion.diaReinicio}
                onChange={(e) => handleCambiarDiaReinicio(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {diasSemana.map(dia => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de reinicio
              </label>
              <input
                type="time"
                value={state.configuracion.horaReinicio}
                onChange={(e) => handleCambiarHoraReinicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Último reinicio */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-900">Último reinicio:</p>
              <p className="text-sm text-purple-700">
                {format(ultimoReinicio, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <KeyIcon className="h-5 w-5 mr-2 text-red-600" />
            Seguridad
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => setMostrarCambiarPin(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <KeyIcon className="h-5 w-5 text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Cambiar PIN de administrador</p>
                  <p className="text-sm text-gray-500">
                    Actualizar la contraseña de acceso al modo admin
                  </p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota de seguridad:</strong> Mantén tu PIN seguro y no lo compartas con los niños.
              </p>
            </div>
          </div>
        </div>

        {/* Herramientas de Gestión */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ArrowPathIcon className="h-5 w-5 mr-2 text-blue-600" />
            Herramientas de Gestión
          </h3>

          <div className="space-y-4">
            {/* Reinicio manual */}
            <button
              onClick={() => setMostrarConfirmReinicio(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <ArrowPathIcon className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Reiniciar semana manualmente</p>
                  <p className="text-sm text-red-600">
                    Finaliza la semana actual y guarda los datos en el historial
                  </p>
                </div>
              </div>
              <span className="text-red-400">→</span>
            </button>

            {/* Exportar datos */}
            <button
              onClick={exportarCSV}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-green-200 hover:bg-green-50 transition-colors text-left"
              disabled={state.historial.length === 0}
            >
              <div className="flex items-center space-x-3">
                <DocumentArrowDownIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Exportar historial a CSV</p>
                  <p className="text-sm text-green-600">
                    Descarga todos los datos históricos en formato CSV
                  </p>
                </div>
              </div>
              <span className="text-green-400">→</span>
            </button>

            {state.historial.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No hay datos históricos para exportar
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas del sistema */}
      <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Estadísticas del Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{state.miembros.length}</div>
            <div className="text-sm text-gray-600">Miembros</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{state.tareas.length}</div>
            <div className="text-sm text-gray-600">Tareas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{state.recompensas.length}</div>
            <div className="text-sm text-gray-600">Recompensas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{state.historial.length}</div>
            <div className="text-sm text-gray-600">Semanas Registradas</div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para reinicio */}
      <ConfirmModal
        isOpen={mostrarConfirmReinicio}
        onClose={() => setMostrarConfirmReinicio(false)}
        onConfirm={confirmarReinicio}
        title="Reiniciar Semana Manualmente"
        message="¿Estás seguro de que quieres reiniciar la semana? Esto guardará los datos actuales en el historial y reiniciará todas las tareas. Esta acción no se puede deshacer."
        confirmText="Reiniciar Semana"
        confirmVariant="danger"
      />

      {/* Modal para cambiar PIN */}
      <CambiarPinModal
        isOpen={mostrarCambiarPin}
        onClose={() => setMostrarCambiarPin(false)}
      />
    </div>
  );
};
