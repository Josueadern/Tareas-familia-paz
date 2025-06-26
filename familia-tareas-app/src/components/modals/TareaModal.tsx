import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarDaysIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface TareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tareaId?: string | null;
}

export const TareaModal: React.FC<TareaModalProps> = ({ isOpen, onClose, tareaId }) => {
  const { state, agregarTarea, editarTarea } = useApp();
  const [nombre, setNombre] = useState('');
  const [puntos, setPuntos] = useState(5);
  const [frecuencia, setFrecuencia] = useState<'diaria' | 'semanal'>('diaria');
  const [miembrosAsignados, setMiembrosAsignados] = useState<string[]>([]);
  const [esColaborativa, setEsColaborativa] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; miembros?: string }>({});

  const esEdicion = !!tareaId;
  const tarea = esEdicion ? state.tareas.find(t => t.id === tareaId) : null;

  // Cargar datos de la tarea si es edición
  useEffect(() => {
    if (isOpen) {
      if (esEdicion && tarea) {
        setNombre(tarea.nombre);
        setPuntos(tarea.puntos);
        setFrecuencia(tarea.frecuencia);
        setMiembrosAsignados(tarea.miembrosAsignados);
        setEsColaborativa(tarea.esColaborativa);
      } else {
        // Reset para nueva tarea
        setNombre('');
        setPuntos(5);
        setFrecuencia('diaria');
        setMiembrosAsignados([]);
        setEsColaborativa(false);
      }
      setErrors({});
    }
  }, [isOpen, esEdicion, tarea]);

  const validarFormulario = () => {
    const newErrors: { nombre?: string; miembros?: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre de la tarea es obligatorio';
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    if (miembrosAsignados.length === 0) {
      newErrors.miembros = 'Debe asignar al menos un miembro a la tarea';
    }

    // Si es colaborativa, debe tener al menos 2 miembros
    if (esColaborativa && miembrosAsignados.length < 2) {
      newErrors.miembros = 'Las tareas colaborativas requieren al menos 2 miembros';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const nombreFormateado = nombre.trim();

    if (esEdicion && tareaId) {
      editarTarea(tareaId, {
        nombre: nombreFormateado,
        puntos,
        frecuencia,
        miembrosAsignados,
        esColaborativa
      });
    } else {
      agregarTarea({
        nombre: nombreFormateado,
        puntos,
        frecuencia,
        miembrosAsignados,
        esColaborativa
      });
    }

    onClose();
  };

  const handleClose = () => {
    setNombre('');
    setPuntos(5);
    setFrecuencia('diaria');
    setMiembrosAsignados([]);
    setEsColaborativa(false);
    setErrors({});
    onClose();
  };

  const toggleMiembro = (miembroId: string) => {
    setMiembrosAsignados(prev => {
      const nuevos = prev.includes(miembroId)
        ? prev.filter(id => id !== miembroId)
        : [...prev, miembroId];
      
      // Si es colaborativa y quedan menos de 2 miembros, desactivar colaborativa
      if (esColaborativa && nuevos.length < 2) {
        setEsColaborativa(false);
      }
      
      return nuevos;
    });
    
    if (errors.miembros) {
      setErrors({ ...errors, miembros: undefined });
    }
  };

  const handleColaborativaChange = (colaborativa: boolean) => {
    if (colaborativa && miembrosAsignados.length < 2) {
      setErrors({ ...errors, miembros: 'Selecciona al menos 2 miembros para hacer la tarea colaborativa' });
      return;
    }
    setEsColaborativa(colaborativa);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Tarea' : 'Agregar Tarea'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Modifica los datos de la tarea' : 'Crea una nueva tarea para la familia'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la tarea *
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombre) {
                  setErrors({ ...errors, nombre: undefined });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Hacer la cama, Lavar platos, Estudiar..."
              maxLength={100}
              autoFocus
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Puntos */}
          <div>
            <label htmlFor="puntos" className="block text-sm font-medium text-gray-700 mb-2">
              Puntos que otorga (1-10)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="puntos"
                min="1"
                max="10"
                value={puntos}
                onChange={(e) => setPuntos(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-green-600 min-w-[2rem]">
                {puntos}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Fácil (1)</span>
              <span>Moderada (5)</span>
              <span>Difícil (10)</span>
            </div>
          </div>

          {/* Frecuencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Frecuencia de la tarea
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrecuencia('diaria')}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  frecuencia === 'diaria'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Diaria</div>
                <div className="text-sm text-gray-500">Cada día</div>
              </button>
              <button
                type="button"
                onClick={() => setFrecuencia('semanal')}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  frecuencia === 'semanal'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">Semanal</div>
                <div className="text-sm text-gray-500">Una vez por semana</div>
              </button>
            </div>
          </div>

          {/* Miembros asignados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Asignar a miembros *
            </label>
            {state.miembros.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                No hay miembros registrados. Agrega miembros primero.
              </p>
            ) : (
              <div className="space-y-2">
                {state.miembros.map(miembro => (
                  <label
                    key={miembro.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={miembrosAsignados.includes(miembro.id)}
                      onChange={() => toggleMiembro(miembro.id)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${miembro.color}20` }}
                    >
                      {miembro.avatar}
                    </div>
                    <span className="font-medium text-gray-900">{miembro.nombre}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.miembros && (
              <p className="mt-1 text-sm text-red-600">{errors.miembros}</p>
            )}
          </div>

          {/* Tarea colaborativa */}
          {miembrosAsignados.length >= 2 && (
            <div>
              <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esColaborativa}
                  onChange={(e) => handleColaborativaChange(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Tarea colaborativa</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Todos los miembros asignados deben completarla para que cuente
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{nombre || 'Nombre de la tarea'}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {puntos} pts
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Frecuencia: {frecuencia} • {miembrosAsignados.length} miembro(s)
                {esColaborativa && ' • Colaborativa'}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {esEdicion ? 'Actualizar' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
