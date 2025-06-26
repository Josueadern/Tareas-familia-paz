# ⚡ Guía de Inicio Rápido

## 🎯 Para Usuarios que Solo Quieren Deployar

Si solo quieres tener la aplicación funcionando en línea **en menos de 10 minutos**, sigue estos pasos:

### 📁 Paso 1: Crear Repositorio en GitHub (2 minutos)
1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **"New repository"**
3. Ponle nombre: `familia-tareas-app`
4. Hazlo **Public** (o Private si prefieres)
5. **NO** marques "Add a README file"
6. Haz clic en **"Create repository"**

### 💻 Paso 2: Subir el Código (3 minutos)
```bash
# En tu computadora, navega al directorio del proyecto
cd familia-tareas-app

# Ejecuta estos comandos uno por uno:
git init
git add .
git commit -m "🎉 Aplicación familia lista para deploy"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/familia-tareas-app.git
git push -u origin main
```
> ⚠️ Reemplaza `TU-USUARIO` con tu usuario de GitHub

### 🚀 Paso 3: Deploy en Vercel (5 minutos)
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** → **"Continue with GitHub"**
3. En el dashboard, haz clic en **"New Project"**
4. Busca `familia-tareas-app` y haz clic en **"Import"**
5. Vercel detectará automáticamente que es un proyecto Vite
6. Haz clic en **"Deploy"**
7. ¡Espera 2-3 minutos y tendrás tu URL!

### 🎉 ¡Listo!
Tu aplicación estará disponible en una URL como:
`https://familia-tareas-app-tu-usuario.vercel.app`

---

## 🔧 Para Desarrolladores

Si quieres modificar la aplicación o contribuir:

### Desarrollo Local
```bash
# Clonar y configurar
git clone https://github.com/TU-USUARIO/familia-tareas-app.git
cd familia-tareas-app
pnpm install
pnpm dev
```

### Hacer Cambios
```bash
# Crear nueva feature
git checkout -b feature/mi-mejora

# Hacer cambios...
# Probar localmente con: pnpm dev

# Subir cambios
git add .
git commit -m "✨ feat: descripción de mi mejora"
git push origin feature/mi-mejora

# Crear Pull Request en GitHub
# Merge a main → Deploy automático
```

---

## 📚 Documentación Completa

- **[📖 Guía de Deployment Completa](./vercel-deployment-guide.md)**
- **[🔄 Workflow de Desarrollo](./development-workflow.md)**
- **[📋 README Principal](../README.md)**

---

## 🆘 Problemas Comunes

### ❌ "Permission denied" al hacer git push
**Solución**: Verifica que la URL del repositorio sea correcta y que tengas permisos.

### ❌ Build falla en Vercel
**Solución**: Verifica que localmente `pnpm build` funcione sin errores.

### ❌ Página en blanco después del deploy
**Solución**: Ya incluimos el archivo `vercel.json` que soluciona esto.

### ❌ No aparecen los estilos
**Solución**: Vercel debería manejar esto automáticamente. Si persiste, intenta redeployar.

---

## 🎯 Configuración Inicial de la App

Una vez desplegada:

1. **Accede a tu URL de Vercel**
2. **Configura tu familia**:
   - Agrega miembros de la familia
   - Crea tareas personalizadas
   - Define recompensas
3. **Cambia el PIN de admin**:
   - Accede al panel de administración (PIN: `123Maria`)
   - Ve a Configuración → Cambiar PIN
   - Pon un PIN que recuerdes

¡Y eso es todo! 🎉 Tu familia ya puede empezar a organizarse mejor.

---

## 📱 Acceso desde Dispositivos

- **Computadora**: Accede directamente desde cualquier navegador
- **Móvil/Tablet**: Abre la URL en el navegador y "Agregar a Pantalla de Inicio"
- **Modo Kiosco**: Actívalo en Configuración para dispositivos familiares compartidos

---

> 💡 **Tip**: Guarda la URL de tu aplicación en favoritos y compártela con toda tu familia para que todos puedan acceder fácilmente.
