import React from 'react';
import { PencilIcon, TrashIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Miembro } from '../types';
import { useApp } from '../context/AppContext';

interface MiembroCardProps {
  miembro: Miembro;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MiembroCard: React.FC<MiembroCardProps> = ({ miembro, onEdit, onDelete }) => {
  const { state } = useApp();

  // Calcular progreso hacia la próxima recompensa
  const recompensasDisponibles = state.recompensas
    .filter(r => !r.esCooperativa)
    .sort((a, b) => a.umbralPuntos - b.umbralPuntos);
  
  const proximaRecompensa = recompensasDisponibles.find(r => r.umbralPuntos > miembro.puntos);
  const progreso = proximaRecompensa 
    ? (miembro.puntos / proximaRecompensa.umbralPuntos) * 100
    : 100;

  // Obtener recompensas disponibles para este miembro
  const recompensasAlcanzadas = recompensasDisponibles.filter(r => r.umbralPuntos <= miembro.puntos);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{ borderTop: `4px solid ${miembro.color}` }}
    >
      {/* Header con avatar y nombre */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${miembro.color}20` }}
            >
              {miembro.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{miembro.nombre}</h3>
              <p className="text-sm text-gray-500">
                {miembro.tareasCompletadas.length} tareas completadas esta semana
              </p>
            </div>
          </div>
          
          {/* Botones de admin */}
          {state.modoAdmin && (onEdit || onDelete) && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar miembro"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar miembro"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Puntos actuales */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Puntos actuales</span>
            <span className="text-2xl font-bold" style={{ color: miembro.color }}>
              {miembro.puntos}
            </span>
          </div>
          
          {/* Barra de progreso hacia próxima recompensa */}
          {proximaRecompensa && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Próxima recompensa: {proximaRecompensa.nombre}</span>
                <span>{proximaRecompensa.umbralPuntos} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(progreso, 100)}%`,
                    backgroundColor: miembro.color 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                Faltan {Math.max(0, proximaRecompensa.umbralPuntos - miembro.puntos)} puntos
              </div>
            </div>
          )}
        </div>

        {/* Recompensas disponibles */}
        {recompensasAlcanzadas.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Recompensas disponibles ({recompensasAlcanzadas.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {recompensasAlcanzadas.slice(0, 3).map(recompensa => (
                <span 
                  key={recompensa.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800"
                >
                  {recompensa.icono} {recompensa.nombre}
                </span>
              ))}
              {recompensasAlcanzadas.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{recompensasAlcanzadas.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {miembro.tareasCompletadas.length}
              </div>
              <div className="text-xs text-gray-500">Tareas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {miembro.recompensasGanadas.length}
              </div>
              <div className="text-xs text-gray-500">Premios</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {miembro.faltas.length}
              </div>
              <div className="text-xs text-gray-500">Faltas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
