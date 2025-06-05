import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';
import { COLORES_MIEMBRO, AVATARES_MIEMBRO } from '../../types';

interface MiembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  miembroId?: string | null;
}

export const MiembroModal: React.FC<MiembroModalProps> = ({ isOpen, onClose, miembroId }) => {
  const { state, agregarMiembro, editarMiembro } = useApp();
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(COLORES_MIEMBRO[0]);
  const [avatar, setAvatar] = useState(AVATARES_MIEMBRO[0]);
  const [errors, setErrors] = useState<{ nombre?: string }>({});

  const esEdicion = !!miembroId;
  const miembro = esEdicion ? state.miembros.find(m => m.id === miembroId) : null;

  // Cargar datos del miembro si es edición
  useEffect(() => {
    if (isOpen) {
      if (esEdicion && miembro) {
        setNombre(miembro.nombre);
        setColor(miembro.color);
        setAvatar(miembro.avatar);
      } else {
        // Reset para nuevo miembro
        setNombre('');
        setColor(COLORES_MIEMBRO[0]);
        setAvatar(AVATARES_MIEMBRO[0]);
      }
      setErrors({});
    }
  }, [isOpen, esEdicion, miembro]);

  const validarFormulario = () => {
    const newErrors: { nombre?: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
    } else {
      // Verificar que no exista otro miembro con el mismo nombre
      const nombreExiste = state.miembros.some(m => 
        m.nombre.toLowerCase() === nombre.trim().toLowerCase() && 
        m.id !== miembroId
      );
      if (nombreExiste) {
        newErrors.nombre = 'Ya existe un miembro con este nombre';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const nombreFormateado = nombre.trim();

    if (esEdicion && miembroId) {
      editarMiembro(miembroId, {
        nombre: nombreFormateado,
        color,
        avatar
      });
    } else {
      agregarMiembro({
        nombre: nombreFormateado,
        color,
        avatar
      });
    }

    onClose();
  };

  const handleClose = () => {
    setNombre('');
    setColor(COLORES_MIEMBRO[0]);
    setAvatar(AVATARES_MIEMBRO[0]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Miembro' : 'Agregar Miembro'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Modifica los datos del miembro' : 'Agrega un nuevo miembro a la familia'}
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
              Nombre *
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: María, Juan, Ana..."
              maxLength={50}
              autoFocus
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Selector de color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color del miembro
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLORES_MIEMBRO.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-full h-12 rounded-lg border-2 transition-all ${
                    color === colorOption 
                      ? 'border-gray-900 scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={`Color ${colorOption}`}
                >
                  {color === colorOption && (
                    <span className="text-white text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Avatar del miembro
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATARES_MIEMBRO.map((avatarOption) => (
                <button
                  key={avatarOption}
                  type="button"
                  onClick={() => setAvatar(avatarOption)}
                  className={`w-full h-12 rounded-lg border-2 transition-all flex items-center justify-center text-2xl ${
                    avatar === avatarOption 
                      ? 'border-blue-500 bg-blue-50 scale-105' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  title={`Avatar ${avatarOption}`}
                >
                  {avatarOption}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: `${color}20` }}
              >
                {avatar}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {nombre.trim() || 'Nombre del miembro'}
                </p>
                <p className="text-sm text-gray-500">0 puntos</p>
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {esEdicion ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
