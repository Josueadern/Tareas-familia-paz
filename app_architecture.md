# Arquitectura de la Aplicación de Gestión Familiar

## Estructura de Datos

### Miembro
```javascript
{
  id: string,
  nombre: string,
  color: string,
  avatar: string,
  puntos: number,
  tareasCompletadas: array,
  recompensasGanadas: array,
  faltas: array
}
```

### Tarea
```javascript
{
  id: string,
  nombre: string,
  puntos: number,
  frecuencia: 'diaria' | 'semanal',
  miembrosAsignados: array,
  esColaborativa: boolean,
  completadaHoy: boolean,
  completadaPorMiembro: object
}
```

### Recompensa
```javascript
{
  id: string,
  nombre: string,
  icono: string,
  umbralPuntos: number,
  vecesMaximas: number,
  esCooperativa: boolean,
  reclamadaPor: array
}
```

### Falta/Penalización
```javascript
{
  id: string,
  tipo: string,
  puntosNegativos: number,
  fecha: date,
  miembroId: string,
  compensacionDisponible: boolean
}
```

## Componentes Principales

1. **Dashboard Principal**
   - Vista de miembros con puntos
   - Lista de tareas del día
   - Progreso hacia recompensas

2. **Gestión de Miembros**
   - CRUD completo de miembros
   - Selector de colores y avatares

3. **Gestión de Tareas**
   - CRUD de tareas
   - Asignación múltiple
   - Marcado/desmarcado

4. **Sistema de Recompensas**
   - CRUD de recompensas
   - Vista de progreso
   - Reclamación de premios

5. **Panel de Admin**
   - Autenticación con PIN
   - Controles de edición
   - Reinicio semanal

6. **Historial**
   - Vista de semanas anteriores
   - Exportación de datos

## Tecnologías
- **Frontend**: React + TypeScript + Tailwind CSS
- **Estado**: Context API + localStorage
- **Persistencia**: IndexedDB para offline
- **Deploy**: Vite build + servidor web

## Flujo de Usuario

### Modo Child
1. Ver miembros y puntos
2. Marcar tareas completadas
3. Ver progreso hacia recompensas
4. Reclamar recompensas disponibles

### Modo Admin
1. Login con PIN
2. Gestionar miembros, tareas, recompensas
3. Ver historial
4. Configurar penalizaciones
5. Reinicio manual

## Características Especiales
- Reinicio automático domingos 23:59
- PIN protegido (hash)
- Responsive design
- Sonidos de feedback
- Modo kiosco para tablets
