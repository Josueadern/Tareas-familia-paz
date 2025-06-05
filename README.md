# 👨‍👩‍👧‍👦 Familia Tareas App

## 🌟 Descripción

**Familia Tareas App** es una aplicación web moderna y completa diseñada para la gestión familiar inteligente. Permite organizar tareas, gestionar un sistema de recompensas y penalizaciones, y mantener un seguimiento detallado del progreso de cada miembro de la familia.

### ✨ Características Principales

- 📋 **Gestión de Tareas**: Crea, asigna y supervisa tareas familiares
- 🎁 **Sistema de Recompensas**: Configura recompensas por puntos acumulados
- ⚠️ **Sistema de Penalizaciones**: Gestiona faltas con opciones de compensación
- 📊 **Dashboard Interactivo**: Visualiza estadísticas y progreso en tiempo real
- 🔒 **Panel de Administración**: Control total con autenticación por PIN
- 📈 **Historial Completo**: Seguimiento de todas las actividades
- 💾 **Almacenamiento Local**: Datos guardados localmente sin necesidad de servidor
- 🎨 **Interfaz Moderna**: Diseño responsive y atractivo con Tailwind CSS
- 🔧 **Configuración Avanzada**: Modo kiosco, sonidos, recordatorios

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + useReducer
- **Base de Datos**: IndexedDB (almacenamiento local)
- **Routing**: React Router DOM
- **Icons**: Lucide React + Heroicons
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Fechas**: date-fns

## 📱 Funcionalidades Detalladas

### 🏠 Dashboard
- Vista general del estado de la familia
- Estadísticas de puntos por miembro
- Progreso de tareas semanales
- Ranking familiar

### 📋 Gestión de Tareas
- Crear tareas con puntos personalizados
- Asignar tareas a miembros específicos
- Marcar completadas/pendientes
- Tareas recurrentes y especiales

### 🎁 Sistema de Recompensas
- Catálogo de recompensas por puntos
- Reclamación automática cuando se alcanzan los puntos
- Historial de recompensas obtenidas

### ⚠️ Penalizaciones
- Tipos de faltas predefinidos y personalizables
- Sistema de puntos negativos
- Opciones de compensación para recuperar puntos

### 🔧 Panel de Administración
- Gestión completa de miembros de la familia
- Configuración de tareas y recompensas
- Ajustes del sistema (PIN, sonidos, modo kiosco)
- Exportación e importación de datos

### 📊 Historial y Estadísticas
- Seguimiento de actividades por fecha
- Gráficos de progreso
- Estadísticas semanales y mensuales

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd familia-tareas-app

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

### Scripts Disponibles
```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo
pnpm build        # Build para producción
pnpm preview      # Preview del build
pnpm lint         # Linting con ESLint
pnpm lint:fix     # Arreglar errores de linting automáticamente
pnpm type-check   # Verificar tipos TypeScript
pnpm clean        # Limpiar cache y build
```

## 🌐 Deployment en Vercel

Esta aplicación está optimizada para deployment en Vercel. Ver las guías detalladas en el directorio `docs/`:

- [📖 Guía de Deployment en Vercel](./docs/vercel-deployment-guide.md)
- [🔄 Workflow de Desarrollo Continuo](./docs/development-workflow.md)

### Deployment Rápido
1. Fork este repositorio
2. Conecta tu cuenta de Vercel con GitHub
3. Importa el proyecto en Vercel
4. ¡Deploy automático!

## 📁 Estructura del Proyecto

```
familia-tareas-app/
├── public/                 # Archivos públicos
├── src/
│   ├── components/        # Componentes React
│   │   ├── modals/       # Modales reutilizables
│   │   └── ui/           # Componentes UI (shadcn/ui)
│   ├── context/          # Context API
│   ├── hooks/            # Hooks personalizados
│   ├── lib/              # Utilidades
│   └── types/            # Definiciones TypeScript
├── docs/                 # Documentación
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuración

### Variables de Entorno
La aplicación funciona completamente en el frontend sin necesidad de variables de entorno.

### Personalización
- **PIN de Administrador**: Por defecto es `123Maria`
- **Configuración inicial**: Se puede modificar en `src/context/AppContext.tsx`

## 🔒 Seguridad

- Autenticación por PIN con hash SHA-256
- Datos almacenados localmente (IndexedDB)
- Modo kiosco para dispositivos compartidos
- Sin transmisión de datos externos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue incluyendo:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Lucide](https://lucide.dev/) por los iconos
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de estilos
- [Vite](https://vitejs.dev/) por la herramienta de build

---

## 📞 Soporte

¿Necesitas ayuda? 
- 📖 Revisa la [documentación completa](./docs/)
- 🐛 Reporta issues en GitHub
- 💬 Únete a las discusiones del proyecto

**¡Disfruta organizando a tu familia con esta aplicación! 👨‍👩‍👧‍👦✨**
